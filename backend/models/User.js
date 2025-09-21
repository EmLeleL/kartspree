import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, default: "" },
  password: { type: String, required: true },
  profilePic: { type: String, default: "/uploads/profilepic/glep.jpg" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
