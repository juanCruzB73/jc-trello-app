const Sprint = require("../models/Sprint");
const Task = require("../models/Task");

const getSprints=async(req,res)=>{
    try{
        const sprints=await Sprint.find();
        res.json({
            ok:true,
            sprints:sprints,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const getSprintsById=async(req,res)=>{
    const {sprintId} = req.params;
    try{
        const sprint=await Sprint.findById(sprintId);
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});
        res.json({
            ok:true,
            sprint:sprint,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const addSprint=async(req,res)=>{
    try{
        const sprint=new Sprint(req.body);
        await sprint.save()
        res.json({
            ok:true,
            sprint:sprint,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const updateSprint=async(req,res)=>{

    const { sprintId } = req.params;
    
    try{
        const sprint=await Sprint.findByIdAndUpdate(sprintId,req.body);
        
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});
        
        res.json({
            ok:true,
            sprint:req.body,
            msg:"sprint edited with success"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const deleteSprint=async(req,res)=>{

    const { sprintId } = req.params;
    
    try{
        const sprint=await Sprint.findByIdAndDelete(sprintId);
        
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});
        
        res.json({
            ok:true,
            sprint:req.body,
            msg:"sprint edited with success"
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

//get sprint tasks
const getSprintTasks=async(req,res)=>{

    const { sprintId } = req.params;
    
    try{
        const sprint=await Sprint.findById(sprintId);
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});
        res.json({
            ok:true,
            sprintTasks:sprint.tasks,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const addSprintTasks=async(req,res)=>{
    const { sprintId } = req.params;
    try{
        const sprint=await Sprint.findById(sprintId);
        
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});

        const task = new Task(req.body);

        if(!task)return res.status(404).json({message:"error creating the task"});

        sprint.tasks.push(task);

        sprint.save(),

        res.json({
            ok:true,
            newTask:task,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const updateSprintTasks=async(req,res)=>{
    const { sprintId,taskId } = req.params;
    const updatedData = req.body;
    try{
        const sprint=await Sprint.findById(sprintId);
        
        if(!sprint)return res.status(404).json({message:"error finding the sprint"});

        const task = sprint.tasks.id(taskId);

        if(!task)return res.status(404).json({message:"error updating the task"});

        if (updatedData.title !== undefined) task.title = updatedData.title;
        if (updatedData.description !== undefined) task.description = updatedData.description;
        if (updatedData.state !== undefined) task.state = updatedData.state;
        if (updatedData.deadLine !== undefined) task.deadLine = updatedData.deadLine;

        sprint.save(),

        res.json({
            ok:true,
            newTask:task,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

const deleteSprintTasks=async(req,res)=>{
    const { sprintId,taskId } = req.params;
    try{
        const sprint=await Sprint.findById(sprintId);
        
        if(!sprint)return res.status(404).json({message:"error removing the sprint"});

        const task = sprint.tasks.id(taskId);

        if(!task)return res.status(404).json({message:"error removing the task"});

        sprint.tasks.pull(taskId);

        sprint.save(),

        res.json({
            ok:true,
            newTask:task,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"internal error"
        });
    }
};

module.exports={getSprints,addSprint,updateSprint,deleteSprint,getSprintTasks,addSprintTasks,updateSprintTasks,deleteSprintTasks,getSprintsById}