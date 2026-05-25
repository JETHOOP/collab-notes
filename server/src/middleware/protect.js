const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "No token provided"
            });

            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({
                message: "User not found"
            });

            return;
        }


        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = protect;
