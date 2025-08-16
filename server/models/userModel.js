import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{type: String, required: true, unique: true},
  email:{type: String, required: true, unique: true},
  password:{type: String, required: true},
  name:{type: String, required: true},
  coins:{type: Number, default: 0},
  vipExpiry:{type: Date},
  lastLogin:{type: Date, default: Date.now()},
  isVerified:{type: Boolean, default: false},
  resetPasswordToken: String,
  resetPasswordTokenExpireAt: Date,
  verificationToken: String,
  verificationTokenExpireAt: String,
},{timestamps: true})

export const User = mongoose.model('user', userSchema);