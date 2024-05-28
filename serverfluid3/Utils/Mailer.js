const nodemailer = require('nodemailer')
const RegisterModel = require('../Models/users');
const bcrypt = require('bcrypt');


const sendEmail = async({res,email, emailType, userId})=>{

    try {
        console.log(emailType)
        const user = await RegisterModel.findOne({email:email})

        const hashedToken = await bcrypt.hash(userId.toString(), 10)
        console.log("hashtoken",hashedToken)
        const hashedForgetToken = await bcrypt.hash(userId.toString(), 10)
        
        // const currentTime = new Date();

    if (emailType === "VERIFY") {
        
        user.verifyToken = hashedToken
        user.verifyTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        await user.save()
        // params = [hashedToken, new Date(currentTime + 3600000), userId];
    } else if (emailType === "RESET") {
        user.forgotPasswordToken = hashedForgetToken
        user.forgotPasswordTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await user.save();
    }


    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "557bf21ef81fc5",
          pass: "d7846399284ea4"
        }
      });

        const mailOptions ={
            from: 'ankit@ankit.ai', 
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify Your Email":"Reset Your password", 
            html: emailType === 'VERIFY' ? `<p>Click <a href="http://localhost:3000/verifyemail?verify=${hashedToken}">here</a> to verify your email}
            or copy and paste the link below in your browser. <br> http://localhost:3000/verifyemail?verify=${hashedToken}
            </p>` : `<p>Click <a href="http://localhost:3000/verifyforgetemail?verify=${email}">here</a> to verify your email}
            or copy and paste the link below in your browser. <br> http://localhost:3000/verifyforgetemail ?verify=${email}
            </p>`
        }

        const mailResponse =await transporter.sendMail(mailOptions)
        return mailResponse

    } catch (error) {
        // return res.json({"Message":error})
        console.log(error)
    }
}

module.exports= {sendEmail}