import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import "dotenv/config"
import transporter from "../config/nodemailer.js"
import { body, validationResult } from "express-validator";


export const register = async (req, res) => {
  // Validation rules
  await Promise.all([
    body("fname")
      .trim()
      .notEmpty().withMessage("Full name is required")
      .isLength({ min: 2 }).withMessage("Full name must be at least 2 characters")
      .run(req),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isAlphanumeric().withMessage("Username must contain only letters and numbers")
      .isLength({ min: 3, max: 20 }).withMessage("Username must be 3-20 characters")
      .run(req),

    body("email")
      .normalizeEmail()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .run(req),

    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[\W_]/).withMessage("Password must contain at least one special character")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  const { fname, username, email, password } = req.body;

  try {
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
    const user = new userModel({ fname, username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const mailOptions = {
      from: `"StarCity RP noreply" <noreply@starcityrp.com>`,
      to: email,
      subject: '👋 Welcome to StarCityRP!',
      text: `Hello,\n\nYour StarCityRP account has been successfully created using this email: ${email}.\n\nWe're excited to have you on board. Let the adventures begin!\n\n- The StarCityRP Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fefefe; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <img src="https://starcityrp.com/images/rplogo.png" alt="StarCityRP Logo" style="width: 100px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Welcome to StarCityRP!</h2>
            <p style="color: #666; font-size: 16px;">We're thrilled to have you as part of our RP community.</p>
          </div>
    
          <div style="margin-top: 30px;">
            <p style="font-size: 15px; color: #444;">
              Your account has been successfully created with the following email:
            </p>
            <p style="font-size: 16px; font-weight: bold; color: #222;">
              ${email}
            </p>
    
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              You can now log in, create your character, and dive into the world of StarCity. If you have any questions or run into issues, our support team is here to help.
            </p>
          </div>
    
          <div style="margin-top: 40px; text-align: center;">
            <a href="https://starcityrp.com/login" style="background-color: #222; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
              Log In to Your Account
            </a>
          </div>
    
          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
    
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            Need help? Email us at <a href="mailto:support@starcityrp.com" style="color: #888;">support@starcityrp.com</a><br>
            &copy; ${new Date().getFullYear()} StarCityRP. All rights reserved.
          </p>
        </div>
      `
    };
    

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User registered successfully!" });

  } catch (er) {
    return res.status(500).json({ success: false, message: er.message });
  }
};

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
    if (user.verifyOTPExpireAt && user.verifyOTPExpireAt > Date.now() - 2 * 60 * 1000) {
      return res.status(429).json({ success: false, message: "Please wait before requesting a new OTP." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 10 * 60 * 1000;
    
    await user.save();

    const mailOptions = {
      from: '"StarCity RP noreply" <noreply@starcityrp.com>',
      to: "rohanmuhammad222k@gmail.com",
      subject: "🔐 Verify Your StarCityRP Account - OTP Inside",
      text: `Hello Rohan, your OTP for verifying your StarCityRP account is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
          <div style="text-align: center;">
            <img src="https://www.starcityrp.com/images/rplogo.png" alt="StarCityRP Logo" style="width: 100px; margin-bottom: 20px;" />
            <h2 style="color: #333;">Verify Your Account</h2>
          </div>
          <p style="font-size: 16px; color: #555;">
            Hey Rohan,<br><br>
            Thanks for signing up with <strong>StarCityRP</strong>! To complete your registration, please use the following One-Time Password (OTP):
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; background: #222; color: #fff; padding: 12px 24px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP is valid for the next 10 minutes. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            Need help? Contact our support team at <a href="mailto:support@starcityrp.com" style="color: #888;">support@starcityrp.com</a><br>
            &copy; ${new Date().getFullYear()} StarCityRP. All rights reserved.
          </p>
        </div>
      `,
    };
    
    
    await transporter.sendMail(mailOptions);
    return res.json({success: true, message: "OTP sent successfully!"});

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
      from: '"StarCity RP noreply" <noreply@starcityrp.com>',
      to: user.email,
      subject: '🔐 Password Reset OTP - StarCityRP',
      text: `Hello,\n\nWe received a request to reset the password for your StarCityRP account.\n\nYour One-Time Password (OTP) is: ${otp}\n\nEmail: ${email}\n\nThis code is valid for the next 10 minutes. If you didn’t request this, you can ignore this message.\n\nThanks,\nThe StarCityRP Support Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p style="color: #666; font-size: 16px;">You requested to reset your password. Use the OTP below:</p>
          </div>
    
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; background: #222; color: #fff; padding: 12px 24px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
    
          <p style="font-size: 14px; color: #555;">
            Email: <strong>${email}</strong><br>
            This OTP will expire in 10 minutes. Please don’t share it with anyone.
          </p>
    
          <p style="font-size: 13px; color: #888;">
            If you didn’t request this password reset, just ignore this email—your password will stay the same.
          </p>
    
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
    
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            Need help? Reach us at <a href="mailto:support@starcityrp.com" style="color: #888;">support@starcityrp.com</a><br>
            &copy; ${new Date().getFullYear()} StarCityRP. All rights reserved.
          </p>
        </div>
      `
    };
    
    
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
