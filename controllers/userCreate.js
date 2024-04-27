import User from '../models/User.js';

export const createUser = async (userData) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { username: userData.username },
                { email: userData.email }
            ]
        });
        if (existingUser) {
            console.error("Error creating user: Username and/or password already exists");
            return { success: false, message: "Username and/or password already exists" };
        }
        const newUser = new User(userData);
        await newUser.save();
        console.log("User created successfully:", newUser);
        return { success: true, user: newUser };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: error.message };
    }
};

export default createUser;


