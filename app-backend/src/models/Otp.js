const db = require('../config/db');

const Otp = {
  async create(identifier, otpCode) {
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration
    const query = `
      INSERT INTO otps(identifier, otp_code, expires_at)
      VALUES($1, $2, $3)
      RETURNING *
    `;
    const values = [identifier, otpCode, expires_at];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async find(identifier, otpCode) {
    const query = `
      SELECT * FROM otps
      WHERE identifier = $1 AND otp_code = $2 AND expires_at > NOW()
    `;
    const values = [identifier, otpCode];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM otps WHERE id = $1';
    const values = [id];
    await db.query(query, values);
  }
};

module.exports = Otp;