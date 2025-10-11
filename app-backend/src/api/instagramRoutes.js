const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

// Route to get Instagram profile data
// POST /api/instagram/profile
router.post('/profile', instagramController.getProfile);

module.exports = router;