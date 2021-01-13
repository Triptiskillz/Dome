const mongoose= require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type : String,
        default:"https://res.cloudinary.com/tripti/image/upload/v1608498126/download_x421fm.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

 mongoose.model("User",userSchema)