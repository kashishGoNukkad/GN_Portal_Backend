const RegisterModel = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../Utils/Mailer')

const createVendor = async (req, res) => {
    const { username, email, mobile, password } = req.body;
      try {
          const missingField = !username ? 'username' : !email ? 'email' : !mobile ? 'mobile' : !password ? 'password' : null;
          if (missingField) return res.status(400).json({ msg: `${missingField} not provided` });
  
          const existingUser = await RegisterModel.findOne({email:email});
  
          if (existingUser) {
              return res.status(400).json({ error: "User already exists with this email" });
          }
  
          const hashpassword = await bcrypt.hash(password, 10);
  
          const newUser = await RegisterModel.create({
              username,
              email,
              mobile,
              password: hashpassword,
              userInfo: {} 
          });
        //   const response  = {
        //       fullname: newUser.username,
        //       useremail: newUser.email
        //   }
  
          const verifyToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '30d' });
          
  
          
          res.cookie('verifyToken', verifyToken, { maxAge: 300000, httpOnly: true });
  
          
         
  
          
          await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });
  
          res.status(201).json({ message: "User created successfully"});
      } catch (error) {
          console.error("Error creating user:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  };

module.exports = {
    createVendor
};