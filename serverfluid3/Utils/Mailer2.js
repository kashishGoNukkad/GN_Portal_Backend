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

    // const connect = jwt.sign({ email: email2 }, "jwt-connect-token-secret-key", { expiresIn: '1hr' });

    // res.cookie('connect', connect, { maxAge: 300000, httpOnly: true });
    
    res.status(200).json({ msg: "OTP verified" });
  } catch (error) {
    res.status(500).json({ error: "from verifyOTP Server error" });
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

module.exports = {
  requestOTP,
  verifyOTP,
  logout,
};
