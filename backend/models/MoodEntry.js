const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    mood: {type: String, enum: ["happy", "sad", "angry", "anxious", "tired", "calm", "excited", "neutral"], required: true},
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MoodEntry", moodSchema);