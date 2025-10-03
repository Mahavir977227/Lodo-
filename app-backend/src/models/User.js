const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(identifier, isEmail = false) {
    const column = isEmail ? 'email' : 'phone_number';
    const query = `
      INSERT INTO users(${column})
      VALUES($1)
      RETURNING *
    `;
    const values = [identifier];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findByIdentifier(identifier) {
    const query = `
      SELECT * FROM users
      WHERE email = $1 OR phone_number = $1
    `;
    const values = [identifier];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async setVipStatus(id, is_vip) {
    const query = 'UPDATE users SET is_vip = $1 WHERE id = $2 RETURNING *';
    const values = [is_vip, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async getAll() {
    const query = 'SELECT id, phone_number, email, is_vip, is_admin, created_at FROM users';
    const { rows } = await db.query(query);
    return rows;
  }
};

module.exports = User;