import User from "../models/Users.js";


export const Login = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOne({username,email});
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.lastlogin = new Date();
        user.status = "active";
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};