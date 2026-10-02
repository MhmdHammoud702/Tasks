import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import studentRouter from "./routes/students.route.js";
import cors from 'cors';
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
dotenv.config();

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(loggerMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/students", studentRouter);
app.use(errorMiddleware);

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
  });