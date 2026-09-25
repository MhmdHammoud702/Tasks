import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import userRouter from "./routes/users.route.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/Users",userRouter);

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });