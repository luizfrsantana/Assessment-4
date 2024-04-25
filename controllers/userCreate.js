import User from '../models/User.js';

export const createUser = async (userData) => {
    try {
        const newUser = new User(userData);
        await newUser.save();
        console.log("User created successfully:", newUser);
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

export default createUser;


