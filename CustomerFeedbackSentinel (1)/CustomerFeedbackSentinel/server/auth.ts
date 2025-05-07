import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";
import { initializeResourcesIfNeeded } from "./storage";

declare global {
  namespace Express {
    // Extend the user interface from Express
    interface User {
      id: number;
      username: string;
      email: string;
      points: number;
      themePreference: string;
      currentSkills: string[] | null;
      learningGoals: string[] | null;
      role: string | null;
      fullName: string | null;
      bio: string | null;
      profileImage: string | null;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function setupAuth(app: Express) {
  // Make sure resources are initialized
  await initializeResourcesIfNeeded();

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "learnroute-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password, email, fullName, bio } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        fullName,
        bio,
        currentSkills: [],
        learningGoals: [],
        profileImage: null,
        themePreference: "dark",
      });
      
      // Log in the user
      req.login(newUser, (err) => {
        if (err) return next(err);
        return res.status(201).json(newUser);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      return res.status(200).json({ message: "Successfully logged out" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // User profile update
  app.patch("/api/user", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { fullName, bio, profileImage } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, {
        fullName,
        bio,
        profileImage,
      });
      
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Theme preference update
  app.post("/api/user/theme", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { theme } = req.body;
      if (theme !== "dark" && theme !== "light") {
        return res.status(400).json({ message: "Invalid theme value" });
      }
      
      const updatedUser = await storage.updateUserTheme(req.user.id, theme);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const users = await storage.getTopUsers(limit);
      
      // Return only safe user data (no passwords, emails, etc.)
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profileImage: user.profileImage,
        points: user.points,
      }));
      
      res.json(safeUsers);
    } catch (error) {
      next(error);
    }
  });

  // Complete a roadmap
  app.post("/api/roadmaps/:id/complete", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const roadmapId = parseInt(req.params.id, 10);
      const userId = req.user.id;
      
      const updatedRoadmap = await storage.completeRoadmap(roadmapId, userId);
      if (!updatedRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      
      res.json(updatedRoadmap);
    } catch (error) {
      next(error);
    }
  });

  // Get user's completed courses
  app.get("/api/user/completions", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const completions = await storage.getCourseCompletions(req.user.id);
      res.json(completions);
    } catch (error) {
      next(error);
    }
  });
}