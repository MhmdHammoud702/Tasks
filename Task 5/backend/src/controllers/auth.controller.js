
import jwt from "jsonwebtoken";
import { generateTokens } from "../config/jwt.js";

export const CreateToken = (req, res) => {
    console.log("CREATE TOKEN CALLED");

    try {
        const token = req.cookies?.jwt;
        console.log("COOKIE:", token);

        if (token) {
            try {
                jwt.verify(token, process.env.JWT_SECRET);

                return res.json({
                    message: "Token is valid"
                });

            } catch {
                console.log("TOKEN INVALID OR EXPIRED");
            }
        }

        console.log("CREATING NEW TOKEN");
        generateTokens(res);
        console.log("TOKEN CREATED");
        return res.json({
            message: "New token created"
        });

    } catch (error) {
        console.error("CREATE TOKEN ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};
