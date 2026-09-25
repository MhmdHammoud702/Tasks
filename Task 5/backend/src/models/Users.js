import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  DOB:{
    type: String,
    required: true,
  }

});

const User = mongoose.model("User", userSchema);
export default User;