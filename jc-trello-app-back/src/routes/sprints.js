const { Router } = require("express");
const { getSprints, addSprint, updateSprint, deleteSprint, getSprintTasks, addSprintTasks, updateSprintTasks, deleteSprintTasks, getSprintsById } = require("../controllers/sprintController");
const {tokenValidator}=require("../middlewares/tokenValidator");

const router=Router();

router.use(tokenValidator);


//main sprint routes
router.get("/",getSprints);
router.get("/:sprintId",getSprintsById);
router.post("/",addSprint);
router.put("/:sprintId",updateSprint);
router.delete("/:sprintId",deleteSprint);
//task sprint routes
router.get("/:sprintId/tasks",getSprintTasks);
router.post("/:sprintId/tasks",addSprintTasks);
router.put("/:sprintId/tasks/:taskId",updateSprintTasks);
router.delete("/:sprintId/tasks/:taskId",deleteSprintTasks);

module.exports=router;