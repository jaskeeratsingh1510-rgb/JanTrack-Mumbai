import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../server/db';
import { UserModel } from '../server/models/User'; // explicit import to ensure it works
import fs from 'fs/promises';
import path from 'path';

async function dumpData() {
    await connectDB();

    console.log("Fetching users...");
    const users = await UserModel.find({});

    const outputPath = path.resolve('users_dump.json');
    await fs.writeFile(outputPath, JSON.stringify(users, null, 2));

    console.log(`Dumped ${users.length} users to ${outputPath}`);
    process.exit(0);
}

dumpData().catch(console.error);
