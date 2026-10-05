import express from "express";
import {
  addStudent,
  deleteStudent,
  getStudents,
} from "../controllers/students.controllers.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);

export default router;