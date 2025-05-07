import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  currentSkills: text("current_skills").array(),
  learningGoals: text("learning_goals").array(),
  // New fields for user profiles and points system
  fullName: text("full_name"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  points: integer("points").default(0).notNull(),
  themePreference: text("theme_preference").default("dark"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  role: text("role").default("user"),
});

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  progress: integer("progress").default(0),
  steps: jsonb("steps").notNull(),
  createdAt: text("created_at").notNull(),
  // New field for completed status
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),  // video, article, etc.
  url: text("url").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  duration: text("duration"),
  // New field for resource difficulty and points
  difficulty: text("difficulty").default("beginner"),
  pointsValue: integer("points_value").default(10),
});

// New table for course completions and points tracking
export const courseCompletions = pgTable("course_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  roadmapId: integer("roadmap_id").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  feedback: text("feedback"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  points: true,
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).omit({
  id: true,
  completed: true,
  completedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export const insertCourseCompletionSchema = createInsertSchema(courseCompletions).omit({
  id: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertCourseCompletion = z.infer<typeof insertCourseCompletionSchema>;
export type CourseCompletion = typeof courseCompletions.$inferSelect;

// Step interface for roadmap steps
export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  resourceIds: number[];
  completed: boolean;
}
