import express from 'express';
import mongoose from 'mongoose';
import userSignupRouter from './routes/userSignup.js';
import recipeRouter from './routes/recipeController.js';

const uri = 'mongodb://127.0.0.1:27017/assessment4';
const PORT = 3000;
const app = express();

// Middleware
app.use(express.json());
app.use('/auth', userSignupRouter);
app.use('/recipes', recipeRouter);

// Start server
startServer();

async function startServer() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

