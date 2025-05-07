import { 
  User, InsertUser, 
  Roadmap, InsertRoadmap, 
  Resource, InsertResource,
  RoadmapStep,
  CourseCompletion, InsertCourseCompletion,
  users, roadmaps, resources, courseCompletions
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, inArray } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

// Interface for storage operations
export interface IStorage {
  // Session store for auth
  sessionStore: any; // Express session store
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  updateUserPoints(id: number, pointsToAdd: number): Promise<User | undefined>;
  updateUserTheme(id: number, theme: string): Promise<User | undefined>;
  getTopUsers(limit?: number): Promise<User[]>;
  
  // Roadmap operations
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  getRoadmapsByUserId(userId: number): Promise<Roadmap[]>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmapProgress(id: number, progress: number): Promise<Roadmap | undefined>;
  updateRoadmapStep(id: number, stepId: string, completed: boolean): Promise<Roadmap | undefined>;
  completeRoadmap(id: number, userId: number): Promise<Roadmap | undefined>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResourcesByIds(ids: number[]): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Course completion operations
  getCourseCompletions(userId: number): Promise<CourseCompletion[]>;
  createCourseCompletion(completion: InsertCourseCompletion): Promise<CourseCompletion>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Express session store

  constructor() {
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      conObject: { connectionString: process.env.DATABASE_URL },
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      points: 0,
      themePreference: "dark",
    }).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserPoints(id: number, pointsToAdd: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const [updatedUser] = await db
      .update(users)
      .set({ points: user.points + pointsToAdd })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateUserTheme(id: number, theme: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ themePreference: theme })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getTopUsers(limit: number = 10): Promise<User[]> {
    const topUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(limit);
    return topUsers;
  }

  // Roadmap operations
  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    const [roadmap] = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
    return roadmap;
  }

  async getRoadmapsByUserId(userId: number): Promise<Roadmap[]> {
    const userRoadmaps = await db
      .select()
      .from(roadmaps)
      .where(eq(roadmaps.userId, userId));
    return userRoadmaps;
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const [roadmap] = await db
      .insert(roadmaps)
      .values({
        ...insertRoadmap,
        completed: false,
      })
      .returning();
    return roadmap;
  }

  async updateRoadmapProgress(id: number, progress: number): Promise<Roadmap | undefined> {
    const [updatedRoadmap] = await db
      .update(roadmaps)
      .set({ progress })
      .where(eq(roadmaps.id, id))
      .returning();
    return updatedRoadmap;
  }

  async updateRoadmapStep(id: number, stepId: string, completed: boolean): Promise<Roadmap | undefined> {
    const roadmap = await this.getRoadmap(id);
    if (!roadmap) return undefined;

    const steps = roadmap.steps as unknown as RoadmapStep[];
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex === -1) return undefined;
    
    steps[stepIndex].completed = completed;
    
    // Calculate overall progress
    const completedSteps = steps.filter(step => step.completed).length;
    const progress = Math.round((completedSteps / steps.length) * 100);
    
    // Check if all steps are completed
    const allCompleted = completedSteps === steps.length;
    
    const [updatedRoadmap] = await db
      .update(roadmaps)
      .set({ 
        steps: steps as any, 
        progress,
        completed: allCompleted,
        completedAt: allCompleted ? new Date() : null
      })
      .where(eq(roadmaps.id, id))
      .returning();
    
    return updatedRoadmap;
  }

  async completeRoadmap(id: number, userId: number): Promise<Roadmap | undefined> {
    const roadmap = await this.getRoadmap(id);
    if (!roadmap) return undefined;
    
    // Calculate points based on roadmap category and complexity
    let pointsEarned = 100; // Base points
    
    // Apply difficulty multiplier
    const resourceIds = (roadmap.steps as unknown as RoadmapStep[])
      .flatMap(step => step.resourceIds);
    
    if (resourceIds.length > 0) {
      const resources = await this.getResourcesByIds(resourceIds);
      const averageDifficulty = resources.reduce((sum, resource) => {
        switch(resource.difficulty) {
          case 'intermediate': return sum + 1.5;
          case 'advanced': return sum + 2;
          default: return sum + 1; // beginner
        }
      }, 0) / resources.length;
      
      pointsEarned = Math.round(pointsEarned * averageDifficulty);
    }
    
    // Update the roadmap as completed
    const [updatedRoadmap] = await db
      .update(roadmaps)
      .set({ 
        completed: true, 
        completedAt: new Date(),
        progress: 100
      })
      .where(eq(roadmaps.id, id))
      .returning();
    
    // Record completion and award points
    await this.createCourseCompletion({
      userId,
      roadmapId: id,
      pointsEarned,
    });
    
    // Update user points
    await this.updateUserPoints(userId, pointsEarned);
    
    return updatedRoadmap;
  }

  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    if (category) {
      return db.select().from(resources).where(eq(resources.category, category));
    } else {
      return db.select().from(resources);
    }
  }

  async getResourcesByIds(ids: number[]): Promise<Resource[]> {
    return db.select().from(resources).where(inArray(resources.id, ids));
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  // Course completion operations
  async getCourseCompletions(userId: number): Promise<CourseCompletion[]> {
    return db.select().from(courseCompletions).where(eq(courseCompletions.userId, userId));
  }

  async createCourseCompletion(completion: InsertCourseCompletion): Promise<CourseCompletion> {
    const [result] = await db.insert(courseCompletions).values(completion).returning();
    return result;
  }
}

// Initialize resources if needed
export async function initializeResourcesIfNeeded() {
  const result = await db.select().from(resources);
  const count = result.length;
  
  if (count === 0) {
    const sampleResources = [
      {
        title: "Introduction to Web Development",
        type: "video",
        url: "https://www.youtube.com/watch?v=example1",
        category: "web-development",
        description: "Learn the basics of HTML, CSS, and JavaScript",
        thumbnail: "https://via.placeholder.com/300x200?text=Web+Development",
        duration: "15:30",
        difficulty: "beginner",
        pointsValue: 10,
      },
      {
        title: "Advanced React Patterns",
        type: "video",
        url: "https://www.youtube.com/watch?v=example2",
        category: "web-development",
        description: "Master advanced React patterns and techniques",
        thumbnail: "https://via.placeholder.com/300x200?text=React+Patterns",
        duration: "22:15",
        difficulty: "intermediate",
        pointsValue: 20,
      },
      {
        title: "Getting Started with Machine Learning",
        type: "article",
        url: "https://example.com/machine-learning-intro",
        category: "machine-learning",
        description: "A comprehensive guide to get started with ML concepts",
        thumbnail: "https://via.placeholder.com/300x200?text=Machine+Learning",
        duration: "10 min read",
        difficulty: "beginner",
        pointsValue: 10,
      },
      {
        title: "Python for Data Science",
        type: "video",
        url: "https://www.youtube.com/watch?v=example3",
        category: "data-science",
        description: "Learn Python basics for data analysis and visualization",
        thumbnail: "https://via.placeholder.com/300x200?text=Python+Data+Science",
        duration: "30:45",
        difficulty: "beginner",
        pointsValue: 15,
      },
      {
        title: "Understanding Blockchain Technology",
        type: "article",
        url: "https://example.com/blockchain-explained",
        category: "blockchain",
        description: "Detailed explanation of blockchain technology and applications",
        thumbnail: "https://via.placeholder.com/300x200?text=Blockchain",
        duration: "15 min read",
        difficulty: "intermediate",
        pointsValue: 20,
      },
      {
        title: "Mobile App Development with Flutter",
        type: "video",
        url: "https://www.youtube.com/watch?v=example4",
        category: "mobile-development",
        description: "Build cross-platform mobile apps with Flutter framework",
        thumbnail: "https://via.placeholder.com/300x200?text=Flutter+Dev",
        duration: "45:20",
        difficulty: "intermediate",
        pointsValue: 25,
      },
      {
        title: "Introduction to Cloud Computing",
        type: "article",
        url: "https://example.com/cloud-computing-basics",
        category: "cloud-computing",
        description: "Learn the fundamentals of cloud services and deployment models",
        thumbnail: "https://via.placeholder.com/300x200?text=Cloud+Computing",
        duration: "12 min read",
        difficulty: "beginner",
        pointsValue: 15,
      },
      {
        title: "DevOps Pipeline Automation",
        type: "video",
        url: "https://www.youtube.com/watch?v=example5",
        category: "devops",
        description: "Automate your development workflow with CI/CD pipelines",
        thumbnail: "https://via.placeholder.com/300x200?text=DevOps",
        duration: "38:10",
        difficulty: "advanced",
        pointsValue: 30,
      }
    ];

    for (const resource of sampleResources) {
      await db.insert(resources).values(resource);
    }
  }
}

export const storage = new DatabaseStorage();
