const Sprint = require("../models/Sprint");
const Task = require("../models/Task");
const userFromJwt = require("../helpers/userFromJwt");
const getAuthorizedSprint = require("../helpers/getAuthorizedSprint");


const getSprints = async (req, res) => {
  try {
    const token = req.header("x-token");
    const user = await userFromJwt(token);

    const sprints = await Sprint.find({ user: user.id });

    res.json({
      ok: true,
      sprints
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const getSprintsById = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    res.json({
      ok: true,
      sprint: data.sprint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const addSprint = async (req, res) => {
  try {
    const token = req.header("x-token");
    const user = await userFromJwt(token);
    
    const sprints = await Sprint.find({ user: user.id });
    
    const nextIndex =
      req.body.index ? req.body.index :  (sprints.length > 0
        ? Math.max(...sprints.map(t => t.index)) + 1
        : 1);

    const sprint = new Sprint({
      ...req.body,
      user: user.id,
      index:nextIndex
    });

    await sprint.save();

    res.json({
      ok: true,
      sprint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};

const updateSprint = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    const updatedSprint = await Sprint.findByIdAndUpdate(
      data.sprint._id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      ok: true,
      sprint: updatedSprint,
      msg: "Sprint edited with success"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};



const deleteSprint = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    await Sprint.findByIdAndDelete(data.sprint._id);

    data.user.sprints.pull(data.sprint._id);
    await data.user.save();

    res.json({
      ok: true,
      msg: "Sprint deleted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const getSprintTasks = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    res.json({
      ok: true,
      sprintTasks: data.sprint.tasks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const addSprintTasks = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    const task = new Task(req.body);

    const nextIndex =
      req.body.index ? req.body.index :  (data.sprint.tasks.length > 0
        ? Math.max(...data.sprint.tasks.map(t => t.index)) + 1
        : 1);
    
        console.log(nextIndex)
    data.sprint.tasks.push({
      ...req.body,
      index:  nextIndex
    });

    await data.sprint.save();

    res.json({
      ok: true,
      newTask: task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const updateSprintTasks = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    const { taskId } = req.params;
    const task = data.sprint.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ ok: false, msg: "Task not found" });
    }

    Object.assign(task, req.body);
    await data.sprint.save();

    res.json({
      ok: true,
      task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


const deleteSprintTasks = async (req, res) => {
  try {
    const data = await getAuthorizedSprint(req, res);
    if (!data) return;

    const { taskId } = req.params;
    const task = data.sprint.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({ ok: false, msg: "Task not found" });
    }

    data.sprint.tasks.pull(taskId);
    await data.sprint.save();

    res.json({
      ok: true,
      msg: "Task deleted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
  }
};


module.exports={getSprints,addSprint,updateSprint,deleteSprint,getSprintTasks,addSprintTasks,updateSprintTasks,deleteSprintTasks,getSprintsById}