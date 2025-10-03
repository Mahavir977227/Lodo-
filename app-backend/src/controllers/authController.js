const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const otpService = require('../services/otpService');

const authController = {
  async sendOtp(req, res) {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: 'Identifier (phone number or email) is required.' });
    }

    try {
      await otpService.sendOtp(identifier);
      res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending OTP.', error: error.message });
    }
  },

  async verifyOtp(req, res) {
    const { identifier, otpCode } = req.body;
    if (!identifier || !otpCode) {
      return res.status(400).json({ message: 'Identifier and OTP code are required.' });
    }

    try {
      const validOtp = await Otp.find(identifier, otpCode);
      if (!validOtp) {
        return res.status(401).json({ message: 'Invalid or expired OTP.' });
      }

      // Clean up the used OTP
      await Otp.delete(validOtp.id);

      let user = await User.findByIdentifier(identifier);
      if (!user) {
        const isEmail = identifier.includes('@');
        user = await User.create(identifier, isEmail);
      }

      // Sign a JWT token
      const token = jwt.sign(
        { id: user.id, is_vip: user.is_vip, is_admin: user.is_admin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
    }
  }
};

module.exports = authController;