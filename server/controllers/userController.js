import userModel from "../models/userModel.js";

export const getUserData = async (req, res) =>{
    try{
        const userId = req.userId;
        
        const user = await userModel.findById(userId);
         
        if(!user){
            return res.status(404).json({success: false, message: "User Not Found!"});
        }

        return res.json({success: true, 
            userData: {
                fname: user.fname,
                isAccountVerified: user.isAccountVerified,
            }
        })
    }catch(er){
        return res.status(500).json({success: false, message: er.message});
    }
}