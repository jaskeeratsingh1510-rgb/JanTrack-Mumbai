import mongoose from 'mongoose';

export async function connectDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI must be provided');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', JSON.stringify(error, null, 2));
        // Also log the message property if available
        if (error instanceof Error) {
            console.error('Error message:', error.message);
        }
        // process.exit(1); 
        // Keep server running for client assets even if DB fails
    }
}
