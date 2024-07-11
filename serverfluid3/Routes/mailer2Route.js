const express = require('express');
const { requestOTP, verifyOTP , logout ,checksession, ProfileData, getUserProfile } = require('../Utils/Mailer2');
const authMiddleware = require('../Middleware/AuthUser1');
const Mailer2router = express.Router();

Mailer2router.post('/request-otp', requestOTP);
Mailer2router.post('/verify-otp', verifyOTP);
Mailer2router.post('/api2/logout', logout);
Mailer2router.put('/profile', ProfileData);
Mailer2router.get('/userprofile', getUserProfile);
Mailer2router.get('/protected', authMiddleware);
// Mailer2router.get('/findbyuser',User);
Mailer2router.get('/checksession',checksession);

module.exports = Mailer2router;
