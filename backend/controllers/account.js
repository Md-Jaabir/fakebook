const { create,
  getAccount,
  getAccountByEmailAndPassword,
  update
} = require('../crud/account.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
jwt
const createAccount = async (req, res) => {
  try {
    const prevAccount = await getAccount(req.body.email);
    if (prevAccount.success === true) {
      res.json({ success: false, message: "You already have an account with that email" })
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const result = await create({ name: req.body.name, email: req.body.email, phone: req.body.phone, password: hashedPassword, dateofbirth: req.body.dateofbirth, gender: req.body.gender, profileUrl: req.body.profileUrl, followings: "[]", followers: "[]", tags: "[]" });
      if (result.success) {
        res.json({ success: true, message: "You are successfully signed up.", account: result.account });
      } else {
        res.json({ success: false, message: "Something was wrong during your signup." })
      }
    }


  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err.message);
  }
};

const signin = async (req, res) => {
  try {
    const result = await getAccountByEmailAndPassword(req.body.email, req.body.password);
    if (result.success) {
      const token = jwt.sign({ email: result.account.email, name: result.account.name, dateofbirth: result.account.dateofbirth, phone: result.account.phone, profileUrl: result.account.profileUrl, gender: result.account.gender,tags:result.account.tags,followers:result.account.followers,followings:result.account.followings }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Something was wrong during your log in" })
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err.message);
  }
}

const updateAccount = async (req, res) => {
  try {
    const email = req.account.email;
    let hashedPassword;
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    const result = await update(email, { ...req.body, password: hashedPassword });
    if (result.success) {
      let account = await getAccount(email);
      const token = jwt.sign({ email: account.account.email, name: account.account.name, dateofbirth: account.account.dateofbirth, phone: account.account.phone, profileUrl: account.account.profileUrl, gender: account.account.gender,tags:result.account.tags,followers:result.account.followers,followings:result.account.followings  }, process.env.JWT_SECRET);
      if (token) {
        res.json({ success: true, message: "Updated account successfully", updateAccount: result.updatedAccount, token });
      }

    } else {
      res.json({ success: false, message: "You are sending unwanted requests" });
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }

}

const follow = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await getAccount(email);
    const targetAccount = result.account;
    const source = await getAccount(req.account.email);
    const sourceAccount = source.account;
    if (result.success) {
      const followers = JSON.parse(targetAccount.followers);
      const followings = JSON.parse(sourceAccount.followings);
      if (followers.includes(sourceAccount.email) || followings.includes(targetAccount.email)) {
        res.json({ success: false, message: "You are already following that account " });
      } else {
        followers.push(sourceAccount.email);
        followings.push(targetAccount.email);
        if (targetAccount.email !== sourceAccount.email) {
          let res1 = await update(email, { followers: JSON.stringify(followers) });
          let res2 = await update(sourceAccount.email, { followings: JSON.stringify(followings) });
          if (res1.success && res2.success) {
            res.json({ success: true, message: "Successfully followed" });
          } else {
            res.json({ success: false, message: "Something went wrong during following process" });
          }
        } else {
          res.json({ success: false, message: "You can't follow yourselfe" });
        }
      }
    } else {
      res.json({ success: false, message: "Something went wrong during following process" });
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const unFollow = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await getAccount(email);
    const targetAccount = result.account;
    const source = await getAccount(req.account.email);
    const sourceAccount = source.account;
    if (result.success) {
      const followers = JSON.parse(targetAccount.followers);
      const followings = JSON.parse(sourceAccount.followings);
      if (!followers.includes(sourceAccount.email) || !followings.includes(targetAccount.email)) {
        res.json({ success: false, message: "You aren't yet following that account " });
      } else {
        let followerIndex = followers.indexOf(sourceAccount.email);
        let followingIndex = followers.indexOf(targetAccount.email);
        followers.splice(followerIndex, 1);
        followings.splice(followingIndex, 1);
        if (targetAccount.email !== sourceAccount.email) {
          let res1 = await update(email, { followers: JSON.stringify(followers) });
          let res2 = await update(sourceAccount.email, { followings: JSON.stringify(followings) });
          if (res1.success && res2.success) {
            res.json({ success: true, message: "Successfully unfollowed" });
          } else {
            res.json({ success: false, message: "Something went wrong during following process" });
          }
        } else {
          res.json({ success: false, message: "You can't unfollow yourselfe" });
        }
      }
    } else {
      res.json({ success: false, message: "Something went wrong during following process" });
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
}

const addTag = async (req, res) => {
  try {
    const { email } = req.account;
    const { tag } = req.body;
    const result = await getAccount(email);
    if (result.success) {
      let tags = JSON.parse(result.account.tags);
      if (tags.includes(tag)) {
        res.json({ success: false, message: "This tag already exists in your account" });
      } else {
        tags.unshift(tag);
        const res1 = await update(email, { tags: JSON.stringify(tags) });
        if (res1.success) {
          res.json({ success: true, message: "Successfully added the tag" })
        } else {
          res.json({ success: false, message: "Something went wrong during adding the tag" })
        }
      }

    } else {
      res.json({ success: false, message: "Something went wrong during adding the tag" })
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }


}

const removeTag = async (req, res) => {
  try {
    const { email } = req.account;
    const { tag } = req.body;
    const result = await getAccount(email);
    if (result.success) {
      let tags = JSON.parse(result.account.tags);
      if (!tags.includes(tag)) {
        res.json({ success: false, message: "This tag doesn't exits in your account" });
      } else {
        let tagIndex = tags.findIndex((t, index) => t === tag);
        tags.splice(tagIndex, 1);
        const res1 = await update(email, { tags: JSON.stringify(tags) });
        if (res1.success) {
          res.json({ success: true, message: "Successfully removed the tag" })
        } else {
          res.json({ success: false, message: "Something went wrong during removing the tag" })
        }
      }

    } else {
      res.json({ success: false, message: "Something went wrong during removing the tag" })
    }
  } catch (err) {
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }


}

const addTags = async (req, res) => {
  try{
    const { email } = req.account;
    const result = await getAccount(email);
    let tags = Object.values(req.body);
    if (result.success) {
      account = result.account;
      const accountTags = JSON.parse(account.tags);
      tags.forEach(tag => {
        if (accountTags.includes(tag)) {
  
        } else {
          accountTags.unshift(tag);
        }
      });
      const updatedResult=await update(email,{tags:JSON.stringify(accountTags)});
      if(updatedResult.success){
        res.json({success:true,message:"Added tags successfully"});
      }else{
        res.json({success:false,message:"Something went wrong during adding tags"});
      }
    }else{
      res.json({success:false,message:"Your email is invalid"});
    }
  
  }catch(err){
    res.json({success:false,message:"Something went wrong"});
    console.log(err);
  }
  

}

module.exports = { createAccount, signin, updateAccount, follow, unFollow, addTag, removeTag,addTags}