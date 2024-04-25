import { createUser } from './controllers/authRoutes.js';
import express from 'express';
import mongoose from 'mongoose';

const uri = 'mongodb://127.0.0.1:27017/assessment4';
const PORT = 3000;

const app = express();

async function startServer() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
            const userData = {
                username: "example_user",
                email: "example@example.com",
                password: "example_password"
            };
            createUser(userData);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

startServer();