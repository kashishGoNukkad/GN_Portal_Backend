const RegisterModel = require('../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../Utils/Mailer')

const userSignup = async (req, res) => {
  const { username, email, password } = req.body;
    try {
        const missingField = !username ? 'username' : !email ? 'email' : !password ? 'password' : null;
        if (missingField) return res.status(400).json({ msg: `${missingField} not provided` });

        const existingUser = await RegisterModel.findOne({email:email});

        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await RegisterModel.create({
            username,
            email,
            password: hashpassword,
            userInfo: {} 
        });
        const response  = {
            fullname: newUser.username,
            useremail: newUser.email
        }

        const verifyToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '30d' });
        

        
        res.cookie('verifyToken', verifyToken, { maxAge: 300000, httpOnly: true });

        
       

        
        await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });

        res.status(201).json({ message: "User created successfully", user: response });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


  const verifyMail = async(req, res)=>{
    const {token} = req.body;
    console.log(token);
    try {   
        const user = await RegisterModel.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() }
          });
          
          
      if (!user) {
        return res.status(400).json({error: "Invalid token"})
    }

      // const credentials = {
      //   email:user.email,
      //   password: user.password
      // }
      console.log(user.isverified === 'false')
          if (user.isverified === 'true'){
            return res.status(200).json({msg: "Already Verified!", success:false})
          }
          else{
            user.isverified = 'true';
            await user.save();
            return res.json({
              message: "Email verified successfully",
              success: true,
              // credentials: credentials
            })
          }

      // res.cookie('verifyToken', "", { maxAge: 1000, httpOnly: true });
  
  } catch (error) {
      return res.status(500).json({error: error.message})
  }
  }

  const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await RegisterModel.findOne({ email:email } );

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password!' });
        }

        if (user.isverified === 'false')
        {
          return res.json({
            message: "Verify your email first!",
            login: false
          })
        }
        else
        {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
              return res.status(400).json({ error: "Invalid password" });
          }
  
          const accessToken = jwt.sign({ email: email }, "jwt-access-token-secret-key", { expiresIn: '30s' });
          const refreshToken = jwt.sign({ email: email }, "jwt-refresh-token-secret-key", { expiresIn: '2m' });
  
          
          res.cookie('accessToken', accessToken, { maxAge: 30000, httpOnly: true });
  
          
          res.cookie('refreshToken', refreshToken, {
              maxAge: 120000,
              httpOnly: true,
              secure: false, 
              sameSite: 'strict'
          });
  
          return res.json({ login: true });
        }
        
    } catch (error) {
        return res.status(400).json({ error: "Invalid username or password!"});
    }
};

const forgetMail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email does not exist" });
    }
    const user = await RegisterModel.findOne({ email:email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if(user.isForgot==='false')
    {
      await sendEmail({ email, emailType: "RESET", userId: user._id });
      user.isForgot='true';
      user.save();
      return res.status(200).json({ msg: "Mail sent successfully!" });
    }
      
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const forgetMailCkeck = async (req, res)=>{
  const {email}= req.body;
  try {
    if(!email) return res.status(400).json({error:"Email does not exist"})
    const user = await RegisterModel.findOne({email:email})

    if(user.isForgot==='true')
      {
        user.isForgot='false';
        await user.save();
        return res.status(201).json({msg:"Password Change Email!", success:true})
      }
      else{
        return res.status(201).json({msg:"Email expired!", success:false})
      }
  } catch (error) {
    return res.status(400).json({error:"invalid credential"})
  }

}

const forgotPassword = async (req,res)=>{
  const {email,newpassword } = req.body;
  try {
  if(!email) return res.status(400).json({error:"Email does not exist"})
  const user = await RegisterModel.findOne({email:email})

  const hashpassword = await bcrypt.hash(newpassword, 10);
  user.password = hashpassword;
  await user.save();
  return res.status(201).json({msg:"password changed successfully", success:true})

  } catch (error) {
    return res.status(400).json({error:"invalid credential"})
  }
}

const Logout = (req, res) => {
  res.cookie('accessToken', "", { maxAge: 1000, httpOnly: true });

        
        res.cookie('refreshToken', "", {
            maxAge: 1000,
            httpOnly: true,
            secure: false, 
            sameSite: 'strict'
        });

        


  return res.json({ msg: 'Logout successful' });
};
// const Logout = (req, res) => {
//   res.clearCookie('accessToken', {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'strict',
//   });
//   res.clearCookie('refreshToken', {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'strict',
//   });

//   return res.json({ msg: 'Logout successful' });
// };



module.exports = {
    userSignup,
    Login,
    forgotPassword,
    verifyMail,
    Logout,
    forgetMail,
    forgetMailCkeck
};