const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../models/blacklist.model");
const secret_key=process.env.secret_key


const auth = async(req,res,next)=>{
    
   
    let token = req.headers.authorization?.split(" ")[1];
    let blacklisttoken = await BlackListModel.findOne({token:token});

    if(token && !blacklisttoken){
        let payload = jwt.verify(token,secret_key);
        req.body.userID = payload.userID
        req.body.username = payload.username
        
        next();
    }
    else{
        res.status(400).json({Message:"Please login to continue"});
    }
}


module.exports={
    auth
}