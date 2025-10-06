const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  /**
   * Registers a new user.
   * Expects email/phone and password in the request body.
   */
  async register(req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier (email/phone) and password are required.' });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findByEmailOrPhone(identifier);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email or phone number already exists.' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      // Note: Assumes User.create is adapted to handle password.
      // We will need to update the User model to store the hashed password.
      const newUser = await User.create(identifier, hashedPassword);

      res.status(201).json({
        message: 'User registered successfully.',
        user: {
          id: newUser.id,
          identifier: newUser.email || newUser.phone_number,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error during registration.' });
    }
  },

  /**
   * Logs in a user.
   * Expects identifier (email/phone) and password.
   */
  async login(req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier (email/phone) and password are required.' });
    }

    try {
      // Find user by email or phone
      const user = await User.findByEmailOrPhone(identifier);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Create and sign JWT
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Logged in successfully.',
        token: token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error during login.' });
    }
  },
};

module.exports = authController;