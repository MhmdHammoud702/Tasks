import Student from "../models/Students.js";
import mongoose from "mongoose";

export const getStudents = async (req, res) => {
  const students = await Student.find({});
  res.json(students);
};

export const addStudent = async (req, res) => {
  const { name } = req.body;
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "Student name is required" });
  }

  const student = await Student.create({ name: name.trim() });
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const student = await Student.findByIdAndDelete(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json({ message: "Student deleted successfully" });
};