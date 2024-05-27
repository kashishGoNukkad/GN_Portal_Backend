const express = require('express');
const userRoutes = express.Router();
const userController = require('../Controller/UserController');
// const Verify = require('../Middleware/verify')
// const upload = require('../Middelware/fileUpload')

// userRoutes.post("/register",upload.single('image'),userController.Registration);
userRoutes.post("/register", userController.userSignup);
userRoutes.post("/login", userController.Login);
userRoutes.put("/forgetpass",userController.forgotPassword);
userRoutes.post("/verifymail",userController.verifyMail);
userRoutes.post("/logout",userController.Logout);
userRoutes.post("/forgetmail",userController.forgetMail);
userRoutes.post("/forgetmailcheck",userController.forgetMailCkeck);

module.exports= userRoutes
