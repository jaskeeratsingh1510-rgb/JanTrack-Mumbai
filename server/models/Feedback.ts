import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    candidateId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true }, // Denormalized for easier display
    message: { type: String, required: true },
    rating: { type: Number, required: false, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
});

export const FeedbackModel = mongoose.model('Feedback', feedbackSchema);
