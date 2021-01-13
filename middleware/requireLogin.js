const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model("User")


//Creating Middleware to verify token 
module.exports=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization){
        res.status(401).json({error:"You must be logged In"})
    }
const token= authorization.replace("Bearer ","")
jwt.verify(token,JWT_SECRET,(err,payload)=>{
    if(err){
        return res.status(401).json({error:"You must be logged In"})
    }
    const{_id} = payload
    User.findById(_id).then(userdata=>{
        req.user =userdata
        next()
    })
})
}
