import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/users.route.js";
import authRouter from './routes/auth.route.js';
import cors from "cors";
import { protectRoute } from "../middleware/auth.middleware.js";
import cookieParser from "cookie-parser";
import { app, server } from "./config/socket.js";

dotenv.config();


app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/Users",protectRoute,userRouter);
app.use('/api/auth/token',authRouter);

connectDb()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });