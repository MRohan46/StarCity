import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import "dotenv/config"
import transporter from "../config/nodemailer.js"

export const register = async (req, res) =>{
    const {fname, username, email, password} = req.body;

    if(!fname || !username || !email || !password){
        return res.status(400).json({success: false, message: "Missing Details!"});
    }

    try{
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
          });
          
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(401).json({ success: false, message: "Email already exists!" });
            } else {
                return res.status(401).json({ success: false, message: "Username already exists!" });
            }
        }
          
        
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new userModel({fname, username, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: 'Welcome to River Waves Solutions',
          text: `Your Account has been created with email ${email}`
        }
        
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "User registered successfully!" });

    }catch(er){
        return res.status(500).json({success: false, message: er.message});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email/username and password!" });
    }
  
    try {
      // Search for user by either email or username
      const user = await userModel.findOne({
        $or: [{ email: email }, { username: email }]
      });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "Email/Username not found!" });
      }
  
      // Check password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Password is incorrect!" });
      }
  
      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
  
      return res.json({ success: true, message: "User logged in successfully!" });
  
    } catch (er) {
      return res.status(500).json({ success: false, message: er.message });
    }
};

export const logout = async (req, res) => {
    try{
        // Remove cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });

      return res.json({success: true, message: "Logged Out Successfully!"})
    }catch(er){
        return res.status(500).json({ success: false, message: er.message });
    }
}

export const sendVerifyOTP = async (req, res) => {
  try{
    const userId = req.userId;
    const user = await userModel.findById(userId);
    
    if(user.isAccountVerified){
      return res.json({success: false, message: "User Already Verified!"})
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Verify your account by using this OTP ${otp}`
    }
    
    await transporter.sendMail(mailOptions);
    return res.json({success: true, message: "Account Verified!"});

  }catch(er){
    return res.status(500).json({ success: false, message: er.message });
  }
}

export const verifyEmail = async (req, res)=>{
  const { otp } = req.body;
  const userId = req.userId;

  
  if(!userId){
    return res.json({success: false, message: "UserId missing!"});
  }
  if(!otp){
    return res.json({success: false, message: "Please Enter an OTP!"});
  }

  try{
    const user = await userModel.findById(userId);
    if(!user){
      return res.status(404).json({success: false, message: "User not Found!"});
    }

    if(user.verifyOTP === '' || user.verifyOTP !== otp){
      return res.json({success: false, message: "Invalid OTP!"});
    }

    if(user.verifyOTPExpireAt < Date.now()){
      return res.json({success: false, message: "Your OTP has Expired!"});      
    }

    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOTPExpireAt = 0;

    await user.save()

    return res.json({success: true, message: "Your Account has been verified!"});
  }catch(er){
    return res.status(500).json({ success: false, message: er.message });
  }
}

export const isAuthenticated = async ( req, res) => {
  const userId = req.userId;

  
  if(!userId){
    return res.status(404).json({success: false, message: "UserId missing!"});
  }

  try{
    const user = await userModel.findById(userId);
    
    return res.status(200).json({ success: true, isVerified: user.isAccountVerified });
  }catch(er){
    return res.status(500).json({ success: false, message: er.message });

  }
}

export const sendResetOTP = async (req, res) => {
  const {email} = req.body;

  if(!email){
    return res.status(401).json({ success: false, message: "Email is Required!" });
  }

  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({ success: false, message: "User Not Found!" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Reset your Account's Password by using this OTP ${otp} \n for this Email ${email}`
    }
    
    await transporter.sendMail(mailOptions);
    return res.json({success: true, message: "OTP has been sent to your email and will be expire in 10 minutes!"});
  }catch(er){
    return res.status(500).json({ success: false, message: er.message });

  }
}

export const resetPassword = async (req, res)=>{
  const { email, otp, newPassword } = req.body;

  if(!email || !otp || !newPassword){
    return res.json({success: false, message: "email, OTP and New Password are required!"});
  }
  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(404).json({success: false, message: "User not Found!"});
    }

    if(user.resetOTP === '' || user.resetOTP !== otp){
      return res.json({success: false, message: "Invalid OTP!"});
    }

    if(user.resetOTPExpireAt < Date.now()){
      return res.json({success: false, message: "Your OTP has Expired!"});      
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = hashedPassword;
    user.isAccountVerified = true;
    user.resetOTP = '';
    user.resetOTPExpireAt = 0;

    await user.save();

    return res.json({success: true, message: "Your Password has been reset successfully!"});
  }catch(er){
    return res.status(500).json({ success: false, message: er.message });
  }
}
