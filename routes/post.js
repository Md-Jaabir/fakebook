const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getFilteredPosts,updatePost,deletePost,getSortedPosts } = require('../controllers/post.js');
const checkLogin = require('../auth.js');

router.post('/create', checkLogin, createPost);
router.get('/', getAllPosts);
router.get('/filter', getFilteredPosts);
router.get('/sort',checkLogin, getSortedPosts);
router.post('/update', checkLogin, updatePost);
router.post('/delete', checkLogin, deletePost);

module.exports = router;
