const Task = require("../models/Task")

const getTasks=async(req,res)=>{
    try{
        const tasks=await Task.find();
        res.json({
            ok:true,
            tasks:tasks,
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
        if(!task)return res.status(404).json({message:"error finding the task"});
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
