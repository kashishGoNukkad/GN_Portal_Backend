const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
  company_name: {
    type: String,
    default:""
  },
  address: {
    type: String,
    default:""
  }
}, { _id: false });


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
  phone:{
    type: Number,
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
  isForgot: {
    type: String,
    default: 'false'
  },
  forgotPasswordToken: {
    type: String
  },
  forgotPasswordTokenExpiry: {
    type: Date
  },
  verifyToken: {
    type: String
  },
  verifyTokenExpiry: {
    type: Date
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'user'],
    default: 'user'
  },
  userInfo: {
    type: userInfoSchema,
    default: {}
  }
}, {
  collection: 'users',
  timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
