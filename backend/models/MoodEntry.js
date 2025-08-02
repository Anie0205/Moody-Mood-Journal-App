const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:"User", requires: true},
    mood: {type: String, enum: ["happy", "sad", "angry", "anxious", "stressed", "excited","neutral","tired"], required: true},
    note: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MoodEntry", moodSchema);