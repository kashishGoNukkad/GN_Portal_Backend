const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const accesstoken = req.cookies.accessToken;
    if(!accesstoken) {
        if(renewToken(req, res)) {
            next()
        }
    } else {
        jwt.verify(accesstoken, 'jwt-access-token-secret-key', (err ,decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Token"})
            } else {
                req.email = decoded.email
                next()
            }
        })
    }
}

const renewToken = (req, res) => {
    const refreshtoken = req.cookies.refreshToken;
    let exist = false;
    if(!refreshtoken) {
        return res.json({valid: false, message: "No Refresh token"})
    } else {
        jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err ,decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Refresh Token"})
            } else {
                const accessToken = jwt.sign({email: decoded.email}, 
                    "jwt-access-token-secret-key", {expiresIn: '30s'})
                res.cookie('accessToken', accessToken, {maxAge: 30000})
                exist = true;
            }
        })
    }
    return exist;
}

module.exports = verifyUser 
