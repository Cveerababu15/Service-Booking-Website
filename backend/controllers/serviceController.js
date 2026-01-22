const Service=require("../models/Service.js")

// CREATE A NEW SERVICE (ADMIN ONLY)
exports.createService=async(req,res)=>{
    try {
        const {name,description,price,duration}=req.body;
        if(!name || !price || !duration){
            return res.status(400).json({message:"Name, price and duration are required"});
        }
        const service=await Service.create({
            name,
            description,
            price,
            duration,
            adminId: req.userId
        })
        res.status(201).json({message:"Service created successfully", service});
        
    } catch (error) {
        res.status(500).json({message:"Failed to create service"});
        
    }
}

// GET ALL SERVICES
exports.getAllServices=async(req,res)=>{
    try {
        const services=await Service.find({isActive:true});
        res.status(200).json({services});
        
    } catch (error) {
        res.status(500).json({message:"Failed to fetch services"});
        
    }
}


// ADMIN: UPDATE A SERVICE
exports.updateService=async(req,res)=>{
    try {
        const {id}=req.params;

        const service=await Service.findByIdAndUpdate(
            id,
            req.body,
            {new:true}
        )
    if(!service)
    {
        return res.status(404).json({message:"Service not found"});
    }        

    return res.status(200).json({message:"Service updated successfully",service});
    } catch (error) {
        res.status(500).json({message:"Failed to update service"});
        
    }
}



// ADMIN-DISABLE A SERVICE
exports.disableService=async(req,res)=>{
    try {const service=await Service.findByIdAndUpdate(
        req.params.id,
        {isActive:false},
        {new:true}
    );
    res.json({message:"Service disabled successfully",service});
    }
     catch (error) {
        res.status(500).json({message:"Failed to disable service"});
        
    }
}