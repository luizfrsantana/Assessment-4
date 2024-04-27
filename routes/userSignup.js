import createUser from '../controllers/userCreate.js';
import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = "PLAIN_TEXT_SECRET_KEY_123_*"; //just for development purposes

router.post("/signup", async (req, res) => {
    let { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        username: username,
        email: email,
        password: hashedPassword,
    };

    try {
        const result = await createUser(userData);
        if (result.success) {
            res.status(201).json({ message: "User created successfully", user: { username: result.user.username, email: result.user.email } });
        } else {
            res.status(409).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.post("/login", async (req, res) => {
    let { username, password } = req.body;
    let user = await User.findOne({ username: username });

    if (!user) {
        return res.status(400).send("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    res.send({ message: "Login successful", token: token });
});

export default router;