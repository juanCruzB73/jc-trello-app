const Backlog = require("../models/Backlog");
const Task = require("../models/Task");
const getAuthorizedBacklog=require("../helpers/getAuthorizedBacklog")

const getBacklogTask=async(req,res)=>{
    try{
         const data = await getAuthorizedBacklog(req, res);
        if (!data) return;

        let { backlog, user } = data;

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

const addTaskBacklog = async (req, res) => {
  try {
    const data = await getAuthorizedBacklog(req, res);
    if (!data) return;

    let { backlog, user } = data;

    // Create backlog if it doesn't exist
    if (!backlog) {
      backlog = new Backlog({
        user: user.id,
        tasks: []
      });
      await backlog.save();
    }

    // Add embedded task
    const nextIndex =
      req.body.index ? req.body.index :  (backlog.tasks.length > 0
        ? Math.max(...backlog.tasks.map(t => t.index)) + 1
        : 1);

    backlog.tasks.push({
      ...req.body,
      index:  nextIndex
    });
    await backlog.save();

    res.json({
      ok: true,
      msg: "Task saved on Backlog",
      newTask: backlog.tasks.at(-1)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Internal error"
    });
  }
};


const editTaskBacklog=async(req,res)=>{

    try{
        const { taskId } = req.params;
        const updatedData = req.body;

        const data = await getAuthorizedBacklog(req, res);
        if (!data) return;

        let { backlog } = data;

        const task = backlog.tasks.id(taskId);
        if(!task)return res.status(404).json({message:"task not found"});

        Object.assign(task, updatedData);

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

    try{
        const { taskId } = req.params;
        const data = await getAuthorizedBacklog(req, res);
        if (!data) return;

        let { backlog } = data;

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