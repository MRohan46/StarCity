import { User } from "../../../models/userModel.js";
export const isAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user)
            return res.status(404).json({ success: false, message: "User not Found!" });

        return res.status(200).json({ success: true, user });
    } catch (er) {
        console.log("Error in Authentication", er);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
