const User = require("../models/User")
const jwt = require("jsonwebtoken");

const userFromJwt=async(token)=>{
    const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const id = decoded.uid;    
    const user=await User.findById(id);
    return user;
}
module.exports = userFromJwt;