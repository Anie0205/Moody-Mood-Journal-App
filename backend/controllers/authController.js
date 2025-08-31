const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d"});
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Signup request body:", req.body);
    
    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }
    
    try {
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "User already Exists"});

        const user = await User.create({
            name: name || "User", 
            email, 
            password
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), 
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({message: err.message});
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("LOGIN REQUEST", { email, password });

        const user = await User.findOne({ email });
        console.log("USER FOUND IN DB:", user);

        if (!user) {
            console.log("No user found with this email");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        console.log("PASSWORD MATCH:", match);

        if (!match) {
            console.log("Password does not match");
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = generateToken(user._id);
        console.log("TOKEN GENERATED:", token);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};


exports.getMe = async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("getMe error:", err);
        res.status(500).json({message: "Error fetching user data"});
    }
};
