
import 'dotenv/config';
import { storage } from "../server/storage";
import mongoose from "mongoose";

async function main() {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jantrack");
    }

    const candidates = await storage.getCandidates();
    console.log("Found " + candidates.length + " candidates.");

    for (const c of candidates) {
        console.log(`Name: ${c.name}, Gender: ${c.gender}, Image: ${c.image}`);
    }

    process.exit(0);
}

main().catch(console.error);
