const mongoose=require("mongoose");

const accountSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phone:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  dateofbirth:{
    type:String,
    required:true
  },
  tags:{
    type:String,
    required:true
  },
  followers:{
    type:String,
    required:true
  },
  followings:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    required:true
  },
  profileUrl:{
    type:String,
    required:true
  },
});

module.exports=mongoose.model("accounts",accountSchema);