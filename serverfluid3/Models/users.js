const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isverified: {
    type: String,
    default: 'false'
  },
  isAdmin: {
    type: String,
    default: 'false'
  },
  isForgot:{
    type:String,
    default:'false'
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpiry: {
    type: Date
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date
  }
}, {
  collection: 'users', 
  timestamps: true 
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
