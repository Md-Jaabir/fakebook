const { create, getAll, getFiltered, update, getSingle, Delete } = require('../crud/post.js');

const createPost = async (req, res) => {
  try {
    const postObj = { caption: req.body.caption, author: req.body.author, date: req.body.date, tags: req.body.tags, image: req.body.image, likes: 0, dislikes: 0 }
    const result = await create(postObj);
    if (result.success) {
      const post = result.post;
      res.json({ success: true, post })
    } else {
      res.json({ success: false })
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err)
  }
}

const getAllPosts = async (req, res) => {
  try {
    const result = await getAll();
    if (result.success) {
      const posts = result.posts;
      if (posts) {
        res.json({ success: true, posts })
      } else {
        res.json({ success: false, message: "Something went wrong during getting the posts" });
      }
    }

  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const getFilteredPosts = async (req, res) => {
  try {
    const filterObj = req.query;
    const result = await getFiltered(filterObj);
    if (result.success) {
      const posts = result.posts;
      if (posts) {
        res.json({ success: true, posts })
      } else {
        res.json({ success: false, message: "Something went wrong during getting the posts" });
      }
    }

  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const updatePost = async (req, res) => {
  try {
    const { id, updates } = req.body;
    const res1 = await getSingle({ _id: id });
    if (res1.success) {
      if (res1.post.author === req.account.email) {
        const res2 = await update(id, updates);
        if (res2.success) {
          res.json({ success: true, message: "Post updated successfully" });
        } else {
          res.json({ success: false, message: "Something went wrong" });
        }
      } else {
        res.json({ success: false, message: "You aren't the author of the post" });
      }
    } else {
      res.json({ success: false, message: "Something went wrong" });
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    const res1 = await getSingle({ _id: id });
    if (res1.success) {
      if (res1.post.author === req.account.email) {
        const res2 = await Delete(id);
        if (res2.success) {
          res.json({ success: true, message: "Post deleted successfully" });
        } else {
          res.json({ success: false, message: "Something went wrong" });
        }
      } else {
        res.json({ success: false, message: "You aren't the author of the post" });
      }
    } else {
      res.json({ success: false, message: "Something went wrong" });
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const getSortedPosts = async (req, res) => {
  try {
    const result = await getAll();
    if (result.success) {
      const posts = result.posts;
      const tags = JSON.parse(req.account.tags);
      const followings = JSON.parse(req.account.followings);
      let preferedPosts = [];
      let unPreferedPosts = [];
      posts.forEach(post => {
        let prefered = false;
        const postTags = post.tags.split(",");
        followings.forEach(following => {
          if (following === post.author) {
            prefered = true;
          }
        })
        postTags.forEach(postTag => {
          console.log(postTag,tags);
          if (tags.includes(postTag) || tags.includes(postTag.trim()) || tags.includes(postTag.replace("#", "")) || tags.includes(postTag.toLowerCase())) {
            prefered = true;
          }
        });
        console.log(prefered);
        if (prefered) {
          preferedPosts.push(post);
        } else {
          unPreferedPosts.push(post);
        }
      })
      res.json({ success: true, posts: [...preferedPosts, ...unPreferedPosts] })
    } else {
      res.json({ success: false, message: "Something went wrong" })
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err)
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getFilteredPosts,
  updatePost,
  deletePost,
  getSortedPosts
}