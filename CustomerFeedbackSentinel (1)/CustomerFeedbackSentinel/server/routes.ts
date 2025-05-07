import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertUserSchema,
  insertRoadmapSchema,
  insertResourceSchema,
  insertCourseCompletionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  await setupAuth(app);
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });

  // Roadmap routes
  app.post("/api/roadmaps", async (req, res) => {
    try {
      const roadmapData = insertRoadmapSchema.parse(req.body);
      const roadmap = await storage.createRoadmap(roadmapData);
      res.status(201).json(roadmap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid roadmap data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create roadmap" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const roadmap = await storage.getRoadmap(id);
      
      if (!roadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      
      res.json(roadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve roadmap" });
    }
  });

  app.get("/api/users/:userId/roadmaps", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const roadmaps = await storage.getRoadmapsByUserId(userId);
      res.json(roadmaps);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve roadmaps" });
    }
  });

  app.patch("/api/roadmaps/:id/progress", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Invalid progress value" });
      }
      
      const updatedRoadmap = await storage.updateRoadmapProgress(id, progress);
      
      if (!updatedRoadmap) {
        return res.status(404).json({ message: "Roadmap not found" });
      }
      
      res.json(updatedRoadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to update roadmap progress" });
    }
  });

  app.patch("/api/roadmaps/:id/steps/:stepId", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { stepId } = req.params;
      const { completed } = req.body;
      
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: "Invalid completed value" });
      }
      
      const updatedRoadmap = await storage.updateRoadmapStep(id, stepId, completed);
      
      if (!updatedRoadmap) {
        return res.status(404).json({ message: "Roadmap or step not found" });
      }
      
      res.json(updatedRoadmap);
    } catch (error) {
      res.status(500).json({ message: "Failed to update roadmap step" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      
      if (category && typeof category === 'string') {
        const resources = await storage.getResourcesByCategory(category);
        return res.json(resources);
      }
      
      // Return all resources if no category filter
      const allResources = await storage.getResourcesByCategory("");
      res.json(allResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve resource" });
    }
  });

  app.post("/api/resources/multiple", async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || !ids.every(id => typeof id === 'number')) {
        return res.status(400).json({ message: "Invalid resource IDs" });
      }
      
      const resources = await storage.getResourcesByIds(ids);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
