const {Router}=require('express');
const { getTasks, getTaskById } = require('../controllers/taskController');

const router = Router();

router.get("/",getTasks)
router.get("/:taskId",getTaskById)

module.exports=router;

