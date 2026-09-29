import express from "express";
import { AddStudent,DeleteStudent,DeleteAllStudents,GetAllStudents,GetStudent,UpdateStudent} from "../controllers/students.controllers.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", upload.single("profilePic"), AddStudent);
router.put("/:id", upload.single("profilePic"), UpdateStudent);
router.get("/", GetAllStudents);
router.get("/:id", GetStudent);
router.delete("/:id", DeleteStudent);
router.delete("/", DeleteAllStudents);

export default router;