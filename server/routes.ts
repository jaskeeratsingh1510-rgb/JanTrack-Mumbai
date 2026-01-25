import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, uploadToCloudinary } from "./lib/cloudinary";
import { insertFeedbackSchema, insertIssueSchema, insertReportSchema } from "@shared/schema";
import { emailService } from "./lib/email";
import { randomInt } from "crypto";

import { getChatResponse } from "./lib/gemini";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const reply = await getChatResponse(message);
      res.json({ reply });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // OTP Endpoint
  app.post("/api/auth/send-otp", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).send("Username is required");

    const user = await storage.getUserByUsername(username);

    if (!user || user.role !== 'admin') {
      return res.status(403).send("Access denied or user not found");
    }

    if (!user.email) {
      return res.status(400).send("No email registered for this admin user");
    }

    const otp = randomInt(100000, 999999).toString();
    await storage.saveOtp(user.username, otp);

    const emailSent = await emailService.sendEmail(
      user.email,
      "JanTrack Admin Login OTP",
      `<p>Your OTP for Admin Login is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`
    );

    if (emailSent) {
      res.json({ message: "OTP sent successfully" });
    } else {
      res.status(500).send("Failed to send OTP email");
    }
  });

  // Candidate routes
  app.get("/api/candidates", async (req, res) => {
    try {
      const candidates = await storage.getCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.getCandidate(req.params.id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch candidate" });
    }
  });

  app.post("/api/candidates", async (req, res) => {
    try {
      if (!req.body) {
        console.log("POST /api/candidates: Missing body");
        return res.status(400).json({ message: "Missing body" });
      }
      console.log("POST /api/candidates payload:", JSON.stringify(req.body, null, 2));
      const candidate = await storage.createCandidate(req.body);
      res.status(201).json(candidate);
    } catch (error: any) {
      console.error("Error in POST /api/candidates:", error);
      res.status(500).json({ message: "Failed to create candidate", error: error.message });
    }
  });

  app.put("/api/candidates/:id", async (req, res) => {
    try {
      const candidate = await storage.updateCandidate(req.params.id, req.body);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update candidate" });
    }
  });

  app.delete("/api/candidates/:id", async (req, res) => {
    try {
      await storage.deleteCandidate(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete candidate" });
    }
  });

  // Feedback routes
  app.post("/api/candidates/:id/feedback", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const feedback = await storage.createFeedback({
        ...req.body,
        candidateId: req.params.id,
        userId: (req.user as any).id,
        username: (req.user as any).username,
        createdAt: new Date()
      });
      res.status(201).json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });

  app.get("/api/candidates/:id/feedback", async (req, res) => {
    try {
      const feedbacks = await storage.getFeedbacksForCandidate(req.params.id);
      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedbacks" });
    }
  });

  // Issue routes
  app.post("/api/issues", upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { title, description, location } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const imageUrl = await uploadToCloudinary(req.file);

      const issue = await storage.createIssue({
        title,
        description,
        location,
        imageUrl,
        userId: (req.user as any).id,
        status: 'open'
      });
      res.status(201).json(issue);
    } catch (error: any) {
      console.error("Error creating issue:", error);
      res.status(500).json({ message: "Failed to create issue" });
    }
  });

  app.get("/api/issues", async (req, res) => {
    try {
      const issues = await storage.getIssues();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.patch("/api/issues/:id/verify", async (req, res) => {
    if (!req.isAuthenticated()) { // Ideally should check for admin role, but basic auth for now
      // In a real app, check req.user.role === 'admin'
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const issue = await storage.verifyIssue(req.params.id);
      if (!issue) return res.status(404).json({ message: "Issue not found" });
      res.json(issue);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify issue" });
    }
  });

  app.delete("/api/issues/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      await storage.deleteIssue(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete issue" });
    }
  });


  // Report routes
  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const parsed = insertReportSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error });
      }

      const { candidateId, candidateName } = req.body;
      if (!candidateId || !candidateName) {
        return res.status(400).json({ message: "Candidate ID and Name are required" });
      }

      const report = await storage.createReport({
        ...parsed.data,
        candidateId,
        candidateName,
        reporterId: (req.user as any).id,
        reporterName: (req.user as any).username,
        status: 'pending',
        createdAt: new Date()
      });
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Ideally verify admin role here
    const userRole = (req.user as any).role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.patch("/api/reports/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRole = (req.user as any).role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const { status } = req.body;
      const report = await storage.updateReportStatus(req.params.id, status);
      if (!report) return res.status(404).json({ message: "Report not found" });
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Generic Upload Route
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = await uploadToCloudinary(req.file);
      res.json({ url: imageUrl });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  return httpServer;
}
