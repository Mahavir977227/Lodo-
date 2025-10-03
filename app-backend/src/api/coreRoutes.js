const express = require('express');
const router = express.Router();
const { protect, vipOnly } = require('../middleware/authMiddleware');

// This is an example of a protected route that requires a user to be a VIP
router.get('/core-feature', protect, vipOnly, (req, res) => {
  res.status(200).json({
    message: `Welcome, VIP user ${req.user.email || req.user.phone_number}! You have accessed the core feature.`,
  });
});

module.exports = router;