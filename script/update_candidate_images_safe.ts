
import 'dotenv/config';
import { connectDB } from "../server/db";
import { CandidateModel } from "../server/models/Candidate";
import mongoose from "mongoose";

async function main() {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Finding candidates with missing images...");

    // Find candidates with missing or empty images
    // Also checking for standard placeholders if we wanted to replace them, but let's stick to missing first.
    const candidates = await CandidateModel.find({
        $or: [
            { image: { $exists: false } },
            { image: "" },
            { image: null }
        ]
    });

    console.log(`Found ${candidates.length} candidates needing image updates.`);

    let updatedCount = 0;

    for (const candidate of candidates) {
        let newImage = "";

        // Normalize gender string (handle "Male", "male", "Female", "female", etc.)
        const gender = (candidate.gender || "").toLowerCase().trim();

        if (gender === 'male' || gender === 'm') {
            newImage = "/assets/candidate_male.png";
        } else if (gender === 'female' || gender === 'f') {
            newImage = "/assets/candidate_female.png";
        } else {
            console.log(`Skipping candidate ${candidate.name} (ID: ${candidate.id}) - Unknown gender: ${candidate.gender}`);
            continue;
        }

        console.log(`Updating ${candidate.name} (${candidate.gender}) -> ${newImage}`);

        // Use updateOne with pure MongoDB driver style or Mongoose model updateOne for safety
        await CandidateModel.updateOne(
            { _id: candidate._id },
            { $set: { image: newImage } }
        );
        updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} candidates.`);
    process.exit(0);
}

main().catch(error => {
    console.error("Error executing script:", error);
    process.exit(1);
});
