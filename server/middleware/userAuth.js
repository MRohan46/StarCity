import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success: false, message: "user not logged in!"});
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode){
            req.userId = tokenDecode.id;
        }else{
            return res.status(401).json({success: false, message: "user not logged in!"});

        }

        next();
    }catch(er){
        return res.status(500).json({success: false, message: er.message});
    }
}

export default userAuth;