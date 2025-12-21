const { response } = require("express");
const jwt = require("jsonwebtoken");

const tokenValidator=(req,res=response,next)=>{
    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            ok:false,
            msg:"no token in petition",

        })
    }

    try{
        const {uid,name} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED,
        );
        
        req.uid=uid;
        req.name=name;
        
    }catch(error){
        return ResizeObserver.status(401).json({
            OK:false,
            msg:"Token is not valid",

        })
    }
    
    next();
}

module.exports = {
    tokenValidator
}