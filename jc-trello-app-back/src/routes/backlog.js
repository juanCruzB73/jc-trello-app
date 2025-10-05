const { Router } = require("express");
const { getBacklogTask, addTaskBacklog, editTaskBacklog, deleteTaskBacklog } = require("../controllers/backlogController");

const router=Router();

router.get("/",getBacklogTask);
router.post("/",addTaskBacklog);
router.put('/:backlogId/tasks/:taskId', editTaskBacklog);
router.delete('/:backlogId/tasks/:taskId',deleteTaskBacklog);


module.exports=router;