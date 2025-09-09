const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

module.exports = mongoose.model('OTP', otpSchema);
