import { User } from "../../../models/userModel.js";
import transporter from "../../../config/nodemailer.js"
import { WELCOME_EMAIL__TEMPLATE } from "../../../email_templates/emailTemplates.js";

export const verifyEmail = async (req, res) => {
    try {
      const { code } = req.body;
  
      // Validate input
      if (!code) {
        return res.status(400).json({
          success: false,
          message: "Verification code is required and must be a string.",
        });
      }
  
      if (!/^[a-zA-Z0-9]{6}$/.test(code)) {
        return res.status(400).json({
          success: false,
          message: "Verification code must be exactly 6 alphanumeric characters.",
        });
      }
  
  
      // Search for a matching token and non-expired
      const user = await User.findOne({
        verificationToken: code,
        verificationTokenExpireAt: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code.",
        });
      }
  
      // Mark verified
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpireAt = undefined;
      await user.save();
  
      // Send welcome email
      const mailOptions = {
        from: `"NoReply" <noreply@starcityrp.com>`,
        to: user.email,
        subject: 'Welcome to Star City RP!',
        text: `Welcome aboard, ${user.name}!`,
        html: WELCOME_EMAIL__TEMPLATE.replace("username", user.name),
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr.name);
      }
  
      return res.status(200).json({
        success: true,
        message: "Email verified successfully!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          verified: user.isVerified,
        },
      });
  
    } catch (err) {
      console.error("Email verification error:", err.name);
      return res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
};
  