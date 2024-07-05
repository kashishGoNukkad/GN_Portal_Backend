const authMiddleware = (req, res, next) => {
    try {
        if (req.session && req.session.userId) {
            res.status(200).json({ msg: 'You are authenticated' });
            // console.log("C:",req.cookies);
            next();
          } else {
            res.status(401).json({ error: 'Unauthorized' });
          }
    } catch (error) {
        console.log("internal server error from authmiddleware" , error)
    }
  };
  
  // Example protected route
//   app.get('/protected', authMiddleware, (req, res) => {
//     res.status(200).json({ msg: 'You are authenticated' });
//   });
  module.exports = authMiddleware
    
  