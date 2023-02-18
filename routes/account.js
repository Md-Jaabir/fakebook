const express=require("express");
const  router = express.Router();
const {createAccount,signin, updateAccount,follow,unFollow,addTag,removeTag,addTags} = require('../controllers/account.js');
const checkLogin=require('../auth.js');

router.post("/signup",createAccount);
router.post("/signin",signin);
router.post("/update",checkLogin,updateAccount);
router.post("/follow",checkLogin,follow);
router.post("/unfollow",checkLogin,unFollow);
router.post("/addtag",checkLogin,addTag);
router.post("/removetag",checkLogin,removeTag);
router.post("/addtags",checkLogin,addTags);

module.exports=router;
