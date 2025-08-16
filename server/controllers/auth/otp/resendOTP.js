import { User } from "../../../models/userModel.js";
import transporter from "../../../config/nodemailer.js"
import { VERIFICATION_EMAIL_TEMPLATE } from "../../../email_templates/emailTemplates.js";

export const resendVerifyOTP = async (req, res) => {
    const userId = req.userId;
  
    try {
      if (!userId) {
        return res.status(400).json({ success: false, message: "Missing Info." });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found." });
  
      // ✅ Generate and update OTP
      const generatedToken = Math.random().toString(36).substring(2, 8).toUpperCase();
      user.verificationToken = generatedToken;
      user.verificationTokenExpireAt = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
  
      // 📧 Email
      const mailOptions = {
        from: `"NoReply" <noreply@starcityrp.com>`,
        to: user.email,
        subject: `Your New Verification Code is ${generatedToken}`,
        text: 'Verify Your Account to access!',
        html: VERIFICATION_EMAIL_TEMPLATE.replace("123456", generatedToken),
      };
  
      try {
        await transporter.sendMail(mailOptions);
      } catch (emailErr) {
        console.error("Email send failed:", emailErr.name);
        return res.status(500).json({ success: false, message: "Failed to send email." });
      }
      return res.status(201).json({
        success: true,
        message: "OTP sent successfully!",
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          verified: user.isVerified,
        },
      });
    } catch (err) {
      console.error("OTP error:", err.name);
      return res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  