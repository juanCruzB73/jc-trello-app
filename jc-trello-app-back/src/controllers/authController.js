const {response}=require("express");
const bcrypt = require("bcryptjs")
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser=async(req,res=response)=>{

    const {username,password}=req.body;

    try{

        let user = await User.findOne({username});
        
        if(user){
            return res.status(400).json({
                ok:false,
                msg:"Usear already exist with that username"
            })
        }

        user = new User(req.body)

        //encrypt password
        const salt = bcrypt.genSaltSync();
        user.password=bcrypt.hashSync(password,salt);

        await user.save();

        //generate token
        const token= await generateJWT(user.id,user.username);
        
        return res.status(201).json({
            ok:true,
            msg:"register",
            uid:user.id,
            username:user.username,
            token:token,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"noup"
        })
    }


}

const  loginUser = async(req,res=response)=>{

    const {username,password}=req.body;

    try{

        let user = await User.findOne({username});
        
        if(!user){
            return res.status(400).json({
                ok:false,
                msg:"Username doesnt exist"
            })
        }
        //validate passwords
        const validPassword=bcrypt.compareSync(password,user.password)

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:"Incorrect password"
            })
        }

        //generate token
        const token=await generateJWT(user.id,user.username);
        
        res.json({
            ok:true,
            uid:user.id,
            token,
            name:user.username,
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"noup"
        })

    }

}

const renewUser=async(req,res=response)=>{
    
    const uid = req.uid;
    const username = req.username;

    //generate token
    const token=await generateJWT(uid,username);

    res.json({
        "ok":true,
        msg:"renwe",
        uid,username,
        token,
        
    })

}

module.exports={createUser,loginUser,renewUser}