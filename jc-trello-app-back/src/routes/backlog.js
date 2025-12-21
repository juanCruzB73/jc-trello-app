const { Router } = require("express");
const { getBacklogTask, addTaskBacklog, editTaskBacklog, deleteTaskBacklog } = require("../controllers/backlogController");
const {tokenValidator}=require("../middlewares/tokenValidator");

const router=Router();

router.use(tokenValidator);

router.get("/",getBacklogTask);
router.post("/",addTaskBacklog);
router.put('/:backlogId/tasks/:taskId', editTaskBacklog);
router.delete('/:backlogId/tasks/:taskId',deleteTaskBacklog);


module.exports=router;