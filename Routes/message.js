const express = require('express');
const router = express.Router();
const messageController = require('../Controller/message.controller');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/send', authMiddleware, messageController.sendMessage);
router.get('/:partnerId', authMiddleware, messageController.getMessages);

module.exports = router;
