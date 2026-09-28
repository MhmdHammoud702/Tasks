import jwt from "jsonwebtoken"

export const generateTokens = (res) => {
    const token = jwt.sign({},process.env.JWT_SECRET,{
        expiresIn: "7d"
    })
    res.cookie("jwt",token,{
        maxAge : 7*24*60*60*1000,
        httpOnly: true, 
        secure:false,
    })
    console.log("TOKEN GENERATED");
    console.log("JWT:", token);
    return token;
}