const Otp = require('../models/Otp');

const otpService = {
  /**
   * Generates an OTP and saves it to the database.
   * In a real-world application, this service would be integrated with a third-party
   * provider like Twilio (for SMS) or SendGrid (for email) to actually send the OTP.
   * For this initial version, we simulate sending by logging the OTP to the console.
   */
  async sendOtp(identifier) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Simulate sending the OTP. In a real application, this would be an API call.
    console.log(`[SIMULATION] Sending OTP ${otpCode} to ${identifier}`);

    await Otp.create(identifier, otpCode);

    return true;
  }
};

module.exports = otpService;