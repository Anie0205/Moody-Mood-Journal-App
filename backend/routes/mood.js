const express = require("express");
const router = express.Router();
const { createMood, getMoods, deleteMood } = require("../controllers/moodController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createMood);
router.get("/", authMiddleware, getMoods);
router.delete("/:id",authMiddleware, deleteMood);

module.exports = router;