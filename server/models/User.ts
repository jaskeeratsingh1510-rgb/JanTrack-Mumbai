import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: false }, // Optional for compatibility
    password: { type: String, required: true },
    name: { type: String, required: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);
