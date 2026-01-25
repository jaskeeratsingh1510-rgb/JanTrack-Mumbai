
import 'dotenv/config';
import { connectDB } from "../server/db";
import { CandidateModel } from "../server/models/Candidate";
import mongoose from "mongoose";

async function main() {
    await connectDB();

    const missingCount = await CandidateModel.countDocuments({
        $or: [
            { image: { $exists: false } },
            { image: "" },
            { image: null }
        ]
    });

    const totalCount = await CandidateModel.countDocuments({});

    console.log(`Total candidates: ${totalCount}`);
    console.log(`Candidates with missing images: ${missingCount}`);

    if (missingCount === 0) {
        console.log("Verification SUCCESS: All candidates have images.");
    } else {
        console.log("Verification FAILED: Some candidates still missing images.");
    }

    process.exit(0);
}

main().catch(console.error);
