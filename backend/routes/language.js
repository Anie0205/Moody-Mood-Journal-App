const express = require('express');
const router = express.Router();
const { 
    detectLanguage, 
    translateToHindi, 
    translateToEnglish, 
    getBilingualPrompts 
} = require('../controllers/languageController');

// Language detection and translation routes
router.post('/detect', detectLanguage);
router.post('/translate/hindi', translateToHindi);
router.post('/translate/english', translateToEnglish);
router.get('/prompts', getBilingualPrompts);

module.exports = router;
