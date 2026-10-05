import express from "express";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import courseRouter from "./routes/courses.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/courses", courseRouter);

connectDb()
  .then(() => {
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`Courses service running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  });