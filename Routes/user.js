const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.post('/connect', authMiddleware, userController.connectPartner);

module.exports = router;
