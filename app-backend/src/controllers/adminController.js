const User = require('../models/User');

const adminController = {
  // Get a list of all users
  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users.', error: error.message });
    }
  },

  // Toggle the VIP status of a user
  async toggleVipStatus(req, res) {
    const { id } = req.params;
    const { is_vip } = req.body;

    if (typeof is_vip !== 'boolean') {
      return res.status(400).json({ message: 'is_vip must be a boolean.' });
    }

    try {
      const updatedUser = await User.setVipStatus(id, is_vip);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating VIP status.', error: error.message });
    }
  }
};

module.exports = adminController;