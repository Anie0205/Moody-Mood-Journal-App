const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, resizeBy,next) => {
    const token = req.headers.authorizatin?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Unauthorized access"});

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByID(decoded.id).select("-password");
        next();
    }
    catch(err) {
        res.status(401).json({message: "Invalid Token"});
    }
};