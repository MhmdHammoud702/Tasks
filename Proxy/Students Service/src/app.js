import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import studentRouter from "./routes/students.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/students", studentRouter);

connectDb()
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Students service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  });