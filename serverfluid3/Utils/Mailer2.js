const nodemailer = require("nodemailer");
const crypto = require("crypto");
const newauth = require("../Models/newmodel");
const jwt = require('jsonwebtoken');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ankit.kumar@gonukkad.com",
    pass: "xkpapjdamtlltdcy",
  },
  tls: {
    rejectUnauthorized: false
  }
});

const generateOtp = () => {
  const otp = crypto.randomBytes(2).toString("hex");
  const otpNumber = parseInt(otp, 16) % 10000;
  return otpNumber.toString().padStart(4, "0");
};

const sendOTPMail = (email, otp) => {
  const mailOption = {
    from: "ankit.kumar@gonukkad.com",
    to: email,
    subject: "OTP",
    text: `your otp code is ${otp}`,
  };
  return transporter.sendMail(mailOption);
};

const requestOTP = async (req, res) => {
  const { name, mobile, email } = req.body;
  try {
    let user = await newauth.findOne({ email: email });
    
    if (!user) {
      user = await newauth.create({ name, mobile, email });
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000;
    await user.save();
    await sendOTPMail(email, otp);
    res.status(200).json({ msg: "OTP sent to email" });
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ error: error });
  }
};
const verifyOTP = async (req, res) => {
  const { email2, otp } = req.body;

  try {
    const user = await newauth.findOne({ email: email2 });
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    req.session.userId = user._id;
    req.session.email = user.email;
const sessionid = req.cookies['connect.sid']

const session = req.session.id;
    const connect = jwt.sign({ email: email2 }, "jwt-connect-token-secret-key", { expiresIn: '1hr' });

    res.cookie('connect', connect, { maxAge: 300000, httpOnly: true });
    
    res.status(200).json({ msg: "OTP verified" , sessionid , session , user});
  } catch (error) {
    res.status(500).json({ error: "from verifyOTP Server error" });
  }
};


const  checksession = async (req, res) => {
  try {
    const sessionId = req.cookies['connect.sid'];
    const session = req.session;

    if (!session) {
      return res.status(404).json({ msg: "No active session" });
    }

    res.status(200).json({ msg: "Session active", sessionId, session });
  } catch (error) {
    res.status(500).json({ error: "Error getting session" });
  }
};


// const User = async (req,res)=>{
//   const {id , name,} = req.body
//   try {
//     const user = await newauth.findById({_id:id})
//    if(!user) return res.json({msg:"user is not found"})
//   user.name = user.name ? name : name;
  
//   user.city = user.city ? city : '';
//   user.pincode = user.pincode ? Pincode : '';
//   user.state = user.state ? State : '';
//   user.save
//    return res.json({msg:"user found",user})
//   } catch (error) {
//     res.status(500).json({ error: "internalr server error",error});
//   }
//  }
const getUserProfile = async (req, res) => {
  // const { email } = req.body;
  const { email } = req.query;
console.log("email",email)
  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required" });
  }
  console.log("email",email)
  try {
    const user = await newauth.findOne({ email:email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      city: user.city,
      state: user.state,
      pincode: user.pincode
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
22
    return res.status(200).json({ msg: "logged out" });
  });
};

const ProfileData = async (req, res) => {
  const { name, mobile, email, city, state, pincode } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required", success: false });
    }

    const user = await newauth.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    // Update user fields only if they are provided in the request
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;

    // Email update is typically a more sensitive operation and might require additional verification
    // If you want to allow email updates, you might want to add a separate process for that

    await user.save();

    return res.status(200).json({ msg: "Profile Updated Successfully!", success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal Server Error", success: false });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  logout,
  // User,
  checksession,
  ProfileData,
  getUserProfile
  
};
