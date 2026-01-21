import { type User, type InsertUser } from "@shared/schema"; // Keep this for user auth if needed, but we focus on Candidates
import { CandidateModel } from "./models";

// Use the same interface style if there was one, or adapt
// Looking at original storage.ts, it had IStorage for User.
// We should extended it or create a new one for Candidates if the app needs both.
// Accessing the previous file content from memory/history.
// Original file had getUser, getUserByUsername, createUser

// We need to support Candidates now too.
// Let's check if there is a shared schema for Candidate? 
// The user provided the interface in client/src/lib/mock-data.ts, so maybe no shared schema for it yet.
// We will define the interface here or import if possible (but cross-importing form client is bad).
// So we will just trust the Mongoose model returns the right shape.

export interface IStorage {
  // User methods (keeping existing ones)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Candidate methods
  getCandidates(): Promise<any[]>;
  getCandidate(id: string): Promise<any | undefined>;
}

export class MongoStorage implements IStorage {
  // We can treat User as dummy for now if we don't have a structured DB for it yet or migrate it too.
  // The user only asked for Candidate data in MongoDB.
  // But if existing app relies on MemStorage for users, we might break auth if we don't handle it.
  // For now, let's keep Users in memory (mixed mode) or just implement dummy/partial if not asked.
  // actually, let's assume we want to move fully to Mongo eventually, but for this task, the user emphasized Candidate data.
  // However, I must implement the interface.
  // Let's implement an in-memory user storage inside this class for now to avoid breaking auth,
  // OR just throw not implemented if auth isn't used yet (likely is).
  // Safest: Hybrid or User Model.
  // Given time constraints, I'll use in-memory map for users just like MemStorage, but Mongo for Candidates.

  private users: Map<string, User>; // Keep legacy user handling for safety

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.users.size + 1).toString(); // simple ID gen
    const user: User = { ...insertUser, id }; // Add missing fields if any
    this.users.set(id, user);
    return user;
  }

  async getCandidates() {
    return await CandidateModel.find({});
  }

  async getCandidate(id: string) {
    return await CandidateModel.findOne({ id });
  }
}

export const storage = new MongoStorage();
