exports.isAdmin=(req,res,next)=>{
    // req.role comes from JWT payload
    if(req.role!== 'admin'){
        return res.status(403).json({message:"Access denied. Admins only"});
    }
    next();
}