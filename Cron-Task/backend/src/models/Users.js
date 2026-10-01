import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  status:{
    type: String,
    required: true
  },
  lastlogin:{
    type: Date,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },

});

const User = mongoose.model("User", UserSchema);
export default User;