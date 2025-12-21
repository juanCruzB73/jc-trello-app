const Task = require("../models/Task")
const userFromJwt = require("../helpers/userFromJwt");
 
const getTasks=async(req,res)=>{
    try{
        //const tasks=await Task.find();
        const token = req.header("x-token");
        const user=await userFromJwt(token);
        res.json({
            ok:true,
            tasks:user.task,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const getTaskById=async(req,res)=>{
    const { taskId } = req.params;
    
    try{
        const task=await Task.findById(taskId);
        const token = req.header("x-token");
        const user=await userFromJwt(token);
        if(!task)return res.status(404).json({message:"error finding the task"});
        if(task.user.uid !== user.uid){
            res.status(401).json({
            ok:false,
            msg:"not authorized"
        });
        }
        res.json({
            ok:true,
            task:task,
            msg:"task found"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};



module.exports={getTasks,getTaskById,}
