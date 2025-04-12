const jwt = require("jsonwebtoken");

const authMiddleware = (roles=[]) => {
    return (req,res,next)=>{
        try{
            const token = req.headers("Authorization")?.replace("Bearer ","");
        if(!token){
             res.status(401).json({success:false, message:"No token , Authentication Failed"});
             
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded){
            req.user = decoded;
            if(roles.length > 0 && !roles.includes(req.user.role)){
                return res.status(403).json({success:false, message:"Access Denied"});
            }
            next();
        }
        }catch(error){
            
        }
    }
}

module.exports = authMiddleware;