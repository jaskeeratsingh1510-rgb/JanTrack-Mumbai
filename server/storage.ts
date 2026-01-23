import { type User, type InsertUser } from "@shared/schema"; // Keep this for user auth if needed, but we focus on Candidates
import { CandidateModel, UserModel, FeedbackModel } from "./models";

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

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Candidate methods
  getCandidates(): Promise<any[]>;
  getCandidate(id: string): Promise<any | undefined>;
  createCandidate(candidate: any): Promise<any>;
  updateCandidate(id: string, candidate: any): Promise<any>;
  deleteCandidate(id: string): Promise<void>;

  // Feedback methods
  createFeedback(feedback: any): Promise<any>;
  getFeedbacksForCandidate(candidateId: string): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  // Removing in-memory user storage, implementing real Mongo storage for users

  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    return { id: user._id.toString(), username: user.username, password: user.password };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    if (!user) return undefined;
    return { id: user._id.toString(), username: user.username, password: user.password };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    return { id: user._id.toString(), username: user.username, password: user.password };
  }

  async getCandidates() {
    return await CandidateModel.find({});
  }

  async getCandidate(id: string) {
    return await CandidateModel.findOne({ id });
  }

  async createCandidate(candidateData: any) {
    const candidate = new CandidateModel(candidateData);
    return await candidate.save();
  }

  async updateCandidate(id: string, candidateData: any) {
    return await CandidateModel.findOneAndUpdate({ id }, candidateData, { new: true });
  }

  async deleteCandidate(id: string) {
    await CandidateModel.findOneAndDelete({ id });
  }

  async createFeedback(feedbackData: any) {
    const feedback = new FeedbackModel(feedbackData);
    return await feedback.save();
  }

  async getFeedbacksForCandidate(candidateId: string) {
    return await FeedbackModel.find({ candidateId }).sort({ createdAt: -1 });
  }
}

export const storage = new MongoStorage();
