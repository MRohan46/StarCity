import { User } from "../models/userModel.js";

export const getUserData = async (req, res) =>{
    try{
        const userId = req.userId;
        
        const user = await User.findById(userId).select('-password -__v -resetPasswordToken -resetPasswordTokenExpireAt -verificationToken -verificationTokenExpireAt');
         
        if(!user){
            return res.status(404).json({success: false, message: "User Not Found!"});
        }

        return res.json({success: true, 
            user
        })
    }catch(er){
        return res.status(500).json({success: false, message: er.message});
    }
}