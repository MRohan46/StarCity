export const logout = async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ensures it's only secure in production
      sameSite: "strict", // prevents CSRF
    });
    return res.status(200).json({ success: true, message: "Logged out successfully!" });
};
