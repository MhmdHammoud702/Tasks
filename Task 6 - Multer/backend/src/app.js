import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import studentRouter from "./routes/students.route.js";
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/students",studentRouter);

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });