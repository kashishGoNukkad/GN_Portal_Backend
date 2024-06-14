const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({

  Buisness_Name: {
    type: String,
    default:""
  },
  
  Buisness_Phone: {
    type: String,
    default:""
  },
  address: {
    type: String,
    default:""
  },
  
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
  mobile:{
    type: String,
    default:""
  },
  password: {
    type: String,
    required: true
  },
  isverified: {
    type: String,
    default: 'false'
  },
  status:{
    type:String,
    default:'true'
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
    default:"user"
  },
  userInfo: {
    type: userInfoSchema,
    default: {}
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  collection: 'users',
  timestamps: true
});

const User = mongoose.model('Users', userSchema);

module.exports = User;