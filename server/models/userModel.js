import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    username: { type: String,required: true,unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    verifyOTP: { type: String, default: '' },
    verifyOTPExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOTP: { type: String, default: '' },
    resetOTPExpireAt: { type: Number, default: 0 },
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;