import createUser from '../controllers/authRoutes.js';
import bcrypt from 'bcrypt';
import express from 'express';

const userSignup = express();

// Check hashed PASSWORD
const checkPassword = await bcrypt.compare("123456",'$2b$10$Px2hVCMRshy2GVBgegXKz.inoR6HwL8O1wq2fUzR/eC6jtwhvC1nO');

userSignup.post("/signup",async (req,res) => {
    let {username, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // HASH PASSWORD
    
    const userData = {
        username: username,
        email: email,
        password: hashedPassword,
    };
    createUser(userData);
    res.send(userData);
});

export default userSignup;