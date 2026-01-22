const User =require("../models/User.js")
const jwt=require('jsonwebtoken');


// Sign-up controller
exports.signup=async(req,res)=>{
    try {
        const {name,email,password,role}=req.body;
        const exits=await User.findOne({email});
        if(exits){
            return res.status(400).json({message:"User already exists"});
        }
    
    const user=await User.create({
        name,
        email,
        password,
        role:role || 'user'
    });
    res.status(201).json({message:"User created successfully", user});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

// Login

exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user || user.password!==password){
            return res.status(401).json({message:"Invalid email or password"});
        }

        // here we will generate JWT token
        const token=jwt.sign(
            {userId:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'3d'}
        );
        res.status(200).json({message:"Login successful", token});

        
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

exports.getAllUsers=async(req,res)=>{
    try {
        const users=await User.find();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        
    }
}
