const express = require('express')
const router = express.Router()
const mongoose =require('mongoose')
const User =mongoose.model("User")
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } =require('../config/key')
const requireLogin =require('../middleware/requireLogin')




router.post('/signup',(req,res)=>{
    const{name,email,password,pic}= req.body
    if(!email|| !password || !name){
       return res.status(422).json({error:"Please Add All The Fields"})
    }
  User.findOne({email:email})
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"User Already Exists With That Email"})
      }
       bcrypt.hash(password,15)
       .then(hashedpassword=>{
 
            const user= new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"Saved Successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
  })
  .catch (err=>{
    console.log(err);
  })
})


router.post('/login',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        res.status(422).json ({error:"Please Add Email or Password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
             return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"successfully signed In"})
                 //token
                 const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}= savedUser
                 res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports=router