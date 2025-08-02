    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const connectDB = require("./config/db");
    require("dotenv").config();

    const authRoutes = require("./routes/auth");
    const moodRoutes = require("./routes/mood");

    const app = express();
    app.use(cors());
    app.use(express.json());

    connectDB();

    app.use("/api", authRoutes);
    app.use("/api/moods", moodRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
