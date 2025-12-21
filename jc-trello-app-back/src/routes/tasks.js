const {Router}=require('express');
const { getTasks, getTaskById } = require('../controllers/taskController');
const {tokenValidator}=require("../middlewares/tokenValidator");

const router = Router();

router.use(tokenValidator);


router.get("/",getTasks)
router.get("/:taskId",getTaskById)

module.exports=router;

