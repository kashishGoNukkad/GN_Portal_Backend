const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, default: '' },
  email: { type: String, required: true, unique: true },
  city: { type: String, },
  state: { type: String,  },
  pincode: { type: String, },
  otp: { type: String },
  otpExpires: { type: Date },
}, {
  collection: 'Auth',
  timestamps: true
});

const newauth = mongoose.model('userAuth', AuthSchema);

module.exports = newauth;