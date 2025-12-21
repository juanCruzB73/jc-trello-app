const jwt = require("jsonwebtoken");

const generateJWT = (uid,username)=>{
    return new Promise((resolve,reject)=>{
        const payload={uid,username}
        
        jwt.sign(payload,process.env.SECRET_JWT_SEED,{
            expiresIn: '24h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject("cant generate token");
            }
            resolve(token)
            
        }
    )
    })
}

module.exports={
    generateJWT
}