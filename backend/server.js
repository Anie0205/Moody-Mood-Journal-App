    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const connectDB = require("./config/db");
    require("dotenv").config();
    
    // Debug: Check if .env is loaded
    console.log('Environment check:');
    console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
    console.log('GOOGLE_GEMINI_API_KEY:', process.env.GOOGLE_GEMINI_API_KEY ? 'SET' : 'NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
    console.log('PORT:', process.env.PORT || 'DEFAULT 5000');

    const authRoutes = require("./routes/auth");
    const moodRoutes = require("./routes/mood");
    const chatRoutes = require("./routes/chat");
    const ventRoutes = require("./routes/vent");
    const translatorRoutes = require("./routes/translator");

    const app = express();
    
    // CORS configuration for production
    const corsOptions = {
        origin: [
            'https://moody-mood-journal-app.vercel.app',
            'http://localhost:5173', // For local development
            'http://localhost:3000'   // Alternative local dev port
        ],
        credentials: true,
        optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    app.use(express.json());
    
    // Security headers
    app.use((req, res, next) => {
        res.header('X-Content-Type-Options', 'nosniff');
        res.header('X-Frame-Options', 'DENY');
        res.header('X-XSS-Protection', '1; mode=block');
        next();
    });

    connectDB();
    
    // Run migration for existing users
    const migrateUsers = require("./config/migration");
    migrateUsers();

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'OK', 
            message: 'Moody API is running',
            timestamp: new Date().toISOString()
        });
    });
    
    app.use("/api", authRoutes);
    app.use("/api/moods", moodRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/vent", ventRoutes);
    app.use("/api/translate", translatorRoutes);

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ 
            message: 'Something went wrong!',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    });
    
    // 404 handler
    app.use('*', (req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
