const {Router}=require("express");
const {createUser,loginUser,renewUser}=require("../controllers/authController");
const { tokenValidator } = require("../middlewares/tokenValidator");


const router=Router();

//route,middleware,controller

router.post("/new",createUser);
router.post("/",loginUser); 
router.get("/renew",tokenValidator,renewUser)

module.exports=router