const express = require('express');
const router = express.Router();
const { anonymousChat } = require('../controllers/chatController');
const safety = require('../middleware/safety');

// Anonymous, judgment-free conversation (text only)
router.post('/anonymous', safety, anonymousChat);

module.exports = router;


