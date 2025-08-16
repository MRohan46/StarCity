import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // enforce algorithm
    });

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.name); // Don't leak full error
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
};

export default userAuth;