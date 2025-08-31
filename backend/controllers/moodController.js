const MoodEntry = require("../models/MoodEntry");

exports.createMood = async(req, res) => {
    const {mood, note} = req.body;
    try {
        const entry = await MoodEntry.create({
            user: req.user._id,
            mood,
            note,
        });
        res.status(201).json(entry);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
};
exports.getMoods = async(req, res) => {
    try 
    {
        const moods = await MoodEntry.find({user: req.user._id}).sort({ createdAt: -1});
        res.status(200).json(moods);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
};
exports.deleteMood = async(req, res) => {
    try {
        const deleted = await MoodEntry.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if(!deleted) return res.status(400).json({message: "Mood entry not found"});
        res.status(200).json({message:"Mood deleted"})
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
};