import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email"), // Optional for now to avoid breaking existing users immediately, but usually unique
  password: text("password").notNull(),
  role: text("role").notNull().default('user'),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface PromiseItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'broken';
  category: string;
  completionPercentage: number;
}

export interface Project {
  name: string;
  cost: number;
  status: string;
}

export interface Candidate {
  id: string; // Custom ID or MongoDB _id
  _id?: string;
  name: string;
  party: string;
  constituency: string;
  ward: string;
  gender: string;
  age: number;
  education: string;
  image: string;
  criminalCases: number;
  assets: string;
  attendance: number;
  promises: PromiseItem[];
  funds: {
    allocated: number;
    utilized: number;
    projects: Project[];
  };
  bio: string;
}


// Zod schema for client-side validation of report creation
export const insertReportSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  description: z.string().optional(),
});

export const insertIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
});

export const insertFeedbackSchema = z.object({
  message: z.string().min(1, "Message is required"),
  rating: z.coerce.number().min(1).max(5).optional(),
});
