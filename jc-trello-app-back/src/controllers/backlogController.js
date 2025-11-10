const Backlog = require("../models/Backlog");
const Task = require("../models/Task");

const getBacklogTask=async(req,res)=>{
    try{
        const backlog = await Backlog.find();
        res.json({
        ok:true,
        backlog:backlog,
    });
    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    };
}

const addTaskBacklog=async(req,res)=>{
    let backlog = await Backlog.findOne().populate("tasks");
    if (!backlog) {
        backlog = new Backlog({ tasks: [] });
        await backlog.save();
    }
    
    try{
        const task = new Task(req.body);
        await task.save();
        backlog.tasks.push(task);
        await backlog.save();
        res.json({
            ok:true,
            msg:"Task saved on Backlog",
            newTask:task,
        });
    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:"Internal error"
        });
    }
}

const editTaskBacklog=async(req,res)=>{

    const { backlogId, taskId } = req.params;
    const updatedData = req.body;

    try{
        const backlog=await Backlog.findById(backlogId);
        if(!backlog)return res.status(404).json({message:"backlog not found"});

        const task = backlog.tasks.id(taskId);
        if(!task)return res.status(404).json({message:"task not found"});

        if (updatedData.title !== undefined) task.title = updatedData.title;
        if (updatedData.description !== undefined) task.description = updatedData.description;
        if (updatedData.state !== undefined) task.state = updatedData.state;
        //if (updatedData.deadLine !== undefined) task.deadLine = updatedData.deadLine;

        await backlog.save();

    res.json({
        ok:true,
        msg:"Task saved on Backlog",
        newTask:task,
    })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Internal error"
        });
    }
}

const deleteTaskBacklog=async(req,res)=>{

    const { backlogId, taskId } = req.params;

    try{
        const backlog=await Backlog.findById(backlogId);
        if(!backlog)return res.status(404).json({message:"backlog not found"});

        const task = backlog.tasks.id(taskId);
        if(!task)return res.status(404).json({message:"task not found"});

        backlog.tasks.pull(taskId);

        await backlog.save();

    res.json({
        ok:true,
        msg:"Task deleted from Backlog",
    })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Internal error"
        });
    }
}

module.exports={getBacklogTask,addTaskBacklog,editTaskBacklog,deleteTaskBacklog}