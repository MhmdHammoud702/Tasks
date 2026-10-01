import User from "../models/Users.js";


export const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AddUser = async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            image: req.file ? req.file.filename : "",
            status: "inactive",
            lastlogin: new Date(),
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const SetInactive = async () => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const result = await User.updateMany(
            {
                lastlogin: { $lt: fiveMinutesAgo },
                status: "active"
            },
            {
                $set: { status: "inactive" }
            }
        );
        console.log(`${result.modifiedCount} users set to inactive`);
    } catch (error) {
        console.error("Error setting users inactive:", error);
    }
};



export const DeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const DeleteAllUser = async (req, res) => {
    try {
        await User.deleteMany({});

        res.json({
            message: "All users deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};