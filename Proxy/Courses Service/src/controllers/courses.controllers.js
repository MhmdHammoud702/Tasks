import Course from "../models/Course.js";
import mongoose from "mongoose";

export const getCourse = async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
};

export const addCourse = async (req, res) => {
  const { courseName } = req.body;
  if (typeof courseName !== "string" || !courseName.trim()) {
    return res.status(400).json({ message: "Course name is required" });
  }

  const course = await Course.create({ courseName: courseName.trim() });
  res.status(201).json(course);
};

export const deleteCourse = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ message: "Course deleted successfully" });
};
