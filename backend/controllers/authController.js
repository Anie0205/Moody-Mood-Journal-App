const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d"});
};

exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "User already Exists"});

        const user = await User.create({email, password});

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id), 
        });
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({message: "Invalid Credentials"});

        res.status(200).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
};

exports.getMe = async(req,res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
};