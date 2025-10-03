const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes in this file are protected and for admins only
router.use(protect, adminOnly);

// GET /api/admin/users - Get a list of all users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:id/toggle-vip - Toggle a user's VIP status
router.put('/users/:id/toggle-vip', adminController.toggleVipStatus);

module.exports = router;