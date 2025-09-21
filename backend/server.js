    const express = require("express");
    const mongoose = require("mongoose");
    const cors = require("cors");
    const helmet = require("helmet");
    const rateLimit = require("express-rate-limit");
    const connectDB = require("./config/db");
    const { sanitizeInput, detectSensitiveData, sanitizeData, privacyCompliance } = require("./middleware/dataSanitization");
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
    const languageRoutes = require("./routes/language");
    const analyticsRoutes = require("./routes/analytics");
    const privacyRoutes = require("./routes/privacy");

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
    
    // Security middleware
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
    
    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(limiter);
    
    // Stricter rate limiting for AI endpoints
    const aiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 20, // limit each IP to 20 AI requests per windowMs
        message: 'AI rate limit exceeded, please try again later.',
    });
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Privacy compliance
    app.use(privacyCompliance);
    
    // Data sanitization
    app.use(sanitizeData);

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
    app.use("/api/language", languageRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/privacy", privacyRoutes);

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
