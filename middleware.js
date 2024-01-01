const jwt = require("jsonwebtoken");

const AuthGuard = (role)=>{
    
    return (req,res,next)=>{
        const token = req.headers["authorization"];
        if(!token){
            return res.status(401).json({
                message: "No token found"
            })
        }
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken,process.env.JWT_SECRET,(err,user)=>{
            if(err){
                return res.status(401).json({
                    message: "Invalid token"
                })
            }
            if(role !== user.role){
                return res.status(401).json({
                    message: "You are not authorized"
                })
            }
            req.user = user;
            next();
        })

        
        
    }
    
   

}
