import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
} from "../controllers/courses.controllers.js";

const router = express.Router();

router.get("/", getCourse);
router.post("/", addCourse);
router.delete("/:id", deleteCourse);

export default router;
