const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,message:"Name is required"},
    email:{type:String,required:true,unique:true,message:"Email is required"},
    password:{type:String,required:true,message:"Password is required"},
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
})

module.exports=mongoose.model('User',userSchema);