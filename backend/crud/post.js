const postModel = require('../models/post.js');

const create = async (postData) => {
  try {
    const post = new postModel(postData);
    const createdPost = await post.save();
    if (createdPost) {
      return { success: true, post: createdPost }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.log(err);
    return { success: false }
  }
}

const getAll = async () => {
  try {
    const posts = await postModel.find({});
    if (posts) {
      return { success: true, posts }
    } else {
      return { success: false }
    }
  } catch (err) {
    return { success: false }
  }
}

const getSingle = async (filterObj) => {
  try {
    const post = await postModel.findOne(filterObj);
    if (post) {
      return { success: true, post }
    } else {
      return { success: false }
    }
  } catch (err) {
    return { success: false }
  }
}

const getFiltered = async (filterObj) => {
  try {
    const filterdPosts = await postModel.find(filterObj);
    if (filterdPosts) {
      return { success: true, posts: filterdPosts }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.log(err);
    return { success: false }
  }
}

const update = async (id, updates) => {
  try {
    let result = await getSingle({ _id: id });
    if (result.success) {
      const targetPost = result.post;
      const finalPost = { ...targetPost._doc, ...updates }
      const updatedPost = await postModel.findOneAndUpdate({ _id: id }, finalPost);
      if (updatedPost) {
        return { success: true };
      } else {
        return { success: false }
      }
    } else {
      return { success: false }
    }
  } catch (err) {
    console.log(err);
    return { success: false }

  }
}

const Delete=async (id)=>{
  try{
    const res1=await getSingle({_id:id});
    if(res1.success){
      const deletedPost = await postModel.findOneAndDelete({_id:id});
      if(deletedPost){
        return {success:true}
      }else{
        return {success:false};
      }
    }else{
      return {success:false}
    }
  }catch(err){
    console.log(err);
  }
}

module.exports = {
  create,
  getAll,
  getSingle,
  getFiltered,
  update,
  Delete
}
