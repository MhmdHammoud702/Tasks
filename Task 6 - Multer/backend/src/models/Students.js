import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    required: false,
  },

});

const Student = mongoose.model("Student", studentSchema);
export default Student;