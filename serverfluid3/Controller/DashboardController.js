const Dashboard = ((req,res)=>{
    return res.json({valid: true, message: "authorized"})
})

module.exports = {Dashboard }