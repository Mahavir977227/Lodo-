const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to send OTP to a user's phone number or email
router.post('/send-otp', authController.sendOtp);

// Route to verify the OTP and log in or sign up the user
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;