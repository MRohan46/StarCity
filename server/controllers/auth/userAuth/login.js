import { User } from "../../../models/userModel.js";
import bcryptjs from "bcryptjs";
import {generateTokenAndSetCookie} from "../../../utils/generateTokenAndSetCookie.js"

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Basic field validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }
  
      // Lookup user by email
      const user = await User.findOne({
        $or: [
          { email: email },
          { username: email }
        ]
      });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }
  
      // Compare hashed passwords
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }
  
      // Generate JWT & cookie
      generateTokenAndSetCookie(res, user._id);
  
      // Track login activity
      user.lastLogin = new Date();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          verified: user.isVerified,
          isProfileCompleted: user.isProfileCompleted,
        },
      });
  
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
};
