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
    required: true,
  },

});

const Student = mongoose.model("User", studentSchema);
export default Student;