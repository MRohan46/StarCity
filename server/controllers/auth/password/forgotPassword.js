import { User } from "../../../models/userModel.js";
import transporter from "../../../config/nodemailer.js"
import crypto from 'crypto';
import {  FORGOT_PASSWORD_EMAIL_TEMPLATE } from "../../../email_templates/emailTemplates.js";

export const forgotPassword = async (req,res) => {
    const email = req.body.email?.trim().toLowerCase();

    try{
        if(!email){
            return res.status(400).json({success: false, message: "Please Enter an Email!"});
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({success: false, message: "User not found!"});
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpireAt = Date.now() + 30 * 60 * 1000; // 1800s or 30 Minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpireAt = resetTokenExpireAt;
        
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const resetPasswordHTML = FORGOT_PASSWORD_EMAIL_TEMPLATE
                                  .replace("username", user.username)
                                  .replace("resetURL", resetLink);
        const mailOptions ={
            from: `"NoReply" <noreply@starcityrp.com>`,
            to: email, 
            subject: 'Reset Your Password!',
            text: 'You have received a Password Reset Request if you did not requested it Ignore!',
            html: resetPasswordHTML,
        };
        
        await transporter.sendMail(mailOptions);
        
        return res.json({success: true, message: "Password Reset Link Sent To Your Email!"})
        
    }catch(er){
        return res.json({success: false, message: er.message})
    }
}
