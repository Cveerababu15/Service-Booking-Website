const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    try {
        // Get Authorization header
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message:"No token provided"});
        }

        // Format : Bearer tokenstring
        const token=authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message:"No token provided"});
        }

            // Verify token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            // Attach user info to request object
            req.userId=decoded.userId;
            req.role=decoded.role;

            next(); // Proceed to next middleware or route handler
    } catch (error) {
        res.status(401).json({message:"Authentication failed"});
        
    }
}

module.exports=authMiddleware;