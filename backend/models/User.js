import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: { type: String, unique: true },
  passwordHash: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
