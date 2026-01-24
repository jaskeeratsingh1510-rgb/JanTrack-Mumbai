import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('user'),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
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
