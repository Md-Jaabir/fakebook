const jwt=require('jsonwebtoken');

const checkLogin=(req,res,next)=>{
  try{
    const authToken=req.headers.authorization;
    if(!authToken){
      res.json({success:false,message:"You aren't authenticated"});
    }
    const account=jwt.verify(authToken,process.env.JWT_SECRET);
    if(account){
      req.account=account;
      next();
    }else{
      res.json({success:false,message:"Invalid token"})
    }
  }catch(error){
    console.log(error);
  }
}

module.exports=checkLogin;