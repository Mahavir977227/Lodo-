const db = require('../config/db');

const User = {
  /**
   * Creates a new user with an identifier (email or phone) and a hashed password.
   * @param {string} identifier - The user's email or phone number.
   * @param {string} passwordHash - The user's bcrypt-hashed password.
   * @returns {Promise<object>} The newly created user object (without password hash).
   */
  async create(identifier, passwordHash) {
    // Determine if the identifier is an email or a phone number
    const isEmail = identifier.includes('@');
    const email = isEmail ? identifier : null;
    const phoneNumber = isEmail ? null : identifier;

    const query = `
      INSERT INTO users (email, phone_number, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, phone_number, email, created_at;
    `;
    const values = [email, phoneNumber, passwordHash];
    try {
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Finds a user by their email or phone number.
   * Returns the full user object, including the password hash for authentication purposes.
   * @param {string} identifier - The user's email or phone number.
   * @returns {Promise<object|undefined>} The user object or undefined if not found.
   */
  async findByEmailOrPhone(identifier) {
    const query = `
      SELECT * FROM users WHERE email = $1 OR phone_number = $1;
    `;
    const values = [identifier];
    try {
      const { rows } = await db.query(query, values);
      return rows[0]; // Includes password_hash, which is needed for login comparison
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  },

  /**
   * Finds a user by their ID.
   * Excludes sensitive information like the password hash.
   * @param {number} id - The user's ID.
   * @returns {Promise<object|undefined>} The user object or undefined if not found.
   */
  async findById(id) {
    const query = 'SELECT id, email, phone_number, is_vip, is_admin, created_at FROM users WHERE id = $1;';
    const values = [id];
    try {
        const { rows } = await db.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
  }
};

module.exports = User;