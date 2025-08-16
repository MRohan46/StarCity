import { User } from "../../../models/userModel.js";
import bcryptjs from "bcryptjs";
import validator from "validator";
import transporter from "../../../config/nodemailer.js"
import { FORGOT_PASSWORD_SUCCESS_EMAIL_TEMPLATE } from "../../../email_templates/emailTemplates.js";

export const resetPassword = async (req, res) => {
    const {token} = req.params;
    const { password } = req.body;
    try{
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpireAt: { $gt: Date.now() },
        });
        
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or Expired Reset Token!" });
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
            return res.status(400).send({
                success: false,
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const isOldPassword = await bcryptjs.compare(password, user.password);
        if(isOldPassword){
            return res.status(400).json({ success: false, message: "New password cannot be the same as the old one." });
        }
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpireAt = undefined;

        await user.save();

        const mailOptions ={
            from: `"NoReply" <noreply@starcityrp.com>`,
            to: user.email, 
            subject: 'Your Password has been Changed!',
            text: 'Your Password has been changed successfully if this is not changed by you contact our Support Team!',
            html: FORGOT_PASSWORD_SUCCESS_EMAIL_TEMPLATE.replace("username", user.name),
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Failed to send email:", mailErr.message);
        }          

        return res.json({ success: true, message: "Your password has been reset successfully."});
    }catch(er){
        return res.json({success: false, message: er.message})
    }
}
