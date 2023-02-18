const accountModel = require('../models/account.js');
const bcrypt=require('bcrypt');

const create = async (accountObj) => {
  try {
    let account = new accountModel(accountObj);
    await account.save();
    return { success: true, account };
  } catch (err) {
    console.log(err.message);
    return { success: false };
  }
}

const getAccount = async (email) => {
  try {
    const accounts = await accountModel.find({ email });
    if (accounts.length === 1) {
      return { success: true, account: accounts[0] }
    } else {
      return { success: false }
    }
  } catch (error) {
    return {success:false}
    console.log(error);
  }

}

const getAccountByEmailAndPassword = async (email, password) => {
  try{
    const accounts=await accountModel.find({email});
    if(accounts.length===1){
      let account=accounts[0];
      const isPasswordCorrect=await bcrypt.compare(password,account.password);
      if(isPasswordCorrect){
        return {success:true,account}
      }else{
        return {success:false}
      }
    }else{
      return {success:false}
    }
  }catch(error){
    return {success:false}
    console.log(error)
  }
                               
}

const update=async(email,newAccount)=>{
  try{
    const result=await getAccount(email);
    const account=result.account._doc;
    if(result.success){
      const updatedAccount=await accountModel.findOneAndUpdate({email},{...account,...newAccount});
      return {success:true,updatedAccount};
    }else{
      return {success:false}
    }
  }catch(err){
    console.log(err);
    return {success:false}
  }
}
   
module.exports={create,getAccount,getAccountByEmailAndPassword,update}      