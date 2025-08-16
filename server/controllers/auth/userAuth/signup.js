import { User } from "../../../models/userModel.js";
import bcryptjs from "bcryptjs";
import {generateTokenAndSetCookie} from "../../../utils/generateTokenAndSetCookie.js"
import validator from "validator";
import transporter from "../../../config/nodemailer.js"
import {  VERIFICATION_EMAIL_TEMPLATE } from "../../../email_templates/emailTemplates.js";

export const signup = async (req, res) => {
    try {
      let { email, password, fname, username } = req.body;
  
      // Sanitize and validate
      email = email?.trim().toLowerCase();
      fname = validator.escape(fname?.trim());
      username = validator.escape(username?.trim());
  
      if (!email || !password || !fname || !username) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
      }
  
      if (!validator.isLength(fname, { min: 2, max: 60 })) {
        return res.status(400).json({ success: false, message: "Name must be 2-60 characters." });
      }

      if (!validator.isLength(username, { min: 2, max: 18 })) {
        return res.status(400).json({ success: false, message: "Username must be 2-18 characters." });
      }
  
      if (
        !validator.isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
      ) {
        return res.status(400).json({
          success: false,
          message: "Password must be strong (8+ chars, upper/lower/num/symbol).",
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email already in use." });
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ success: false, message: "Username already in use." });
      }
  
      // Secure hash
      const hashedPassword = await bcryptjs.hash(password, 12);
  
      // More complex verification code
      const verificationToken = Math.random().toString(36).substring(2, 8).toUpperCase();
      const user = new User({
        email,
        username,
        password: hashedPassword,
        name: fname,
        verificationToken,
        verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
      });
  
      await user.save();
  
      // Set secure cookie
      generateTokenAndSetCookie(res, user._id);
  
      // Email setup
      const mailOptions = {
        from: `"NoReply" <noreply@starcityrp.com>`,
        to: email,
        subject: `Your Verification Code is ${verificationToken}`,
        text: 'Verify Your Account to access!',
        html: VERIFICATION_EMAIL_TEMPLATE.replace("123456", verificationToken),
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);

        await User.deleteOne({ _id: user._id });

        return res.status(500).json({
            success: false,
            message: "Account creation failed. Could not send verification email.",
        });
      }
  
      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          verified: user.isVerified,
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
