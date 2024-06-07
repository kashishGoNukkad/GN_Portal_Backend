const RegisterModel = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../Utils/Mailer')

const createEndUser = async (req, res) => {
    const { username, email, mobile, password } = req.body;
      try {
          const missingField = !username ? 'username' : !email ? 'email' : !mobile ? 'mobile' : !password ? 'password' : null;
          if (missingField) return res.status(400).json(`{ msg: ${missingField} not provided }`);
  
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
              role:"user",
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
          res.status(500).json({ error: "Internal Server Error" ,error });
      }
  };

  const EndUser = async (req, res)=>{
    try {
        const vendors = await RegisterModel.find();
        if (vendors.length==0){
            return res.status(200).json({msg:"No Vendors are available!"})
        }
        return res.status(200).json({
            total:vendors.length,
            vendors:vendors
        })
    } catch (error) {
        return res.status(400).json({"error":error})
    }

  }

  const editEndUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, password } = req.body;
  
    try {

      const user = await RegisterModel.findById({_id:id});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (username)
         user.username = username;
      if (email)
         user.email = email;
      if (phone) 
        user.phone = phone;
      if (password) 
        user.password = await bcrypt.hash(password, 10);
  

      const updatedUser = await user.save();
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteEndUser = async (req, res) => {
    const { id } = req.params;
  
    try {

      const user = await RegisterModel.findById({_id:id});
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.status="false"

      await user.save();

      res.status(200).json({ message: 'User deleted successfully!'});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    createEndUser,
    EndUser,
    editEndUser,
    deleteEndUser
};