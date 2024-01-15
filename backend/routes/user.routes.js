const express = require("express");
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../models/blacklist.model");
require('dotenv').config();
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await UserModel.find({ email: email });

    if (user.length > 0) {
      res.status(200).json({ Message: "User already exists,please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        req.body.password = hash;
        let new_user = new UserModel(req.body);
        await new_user.save();
        res
          .status(200)
          .json({
            Message: "User registered successfully",
            UserDetails: new_user,
          });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ Error: error });
  }
});

userRouter.post("/login",async(req,res)=>{
    try {
        let{email,password} = req.body
       
        let user = await UserModel.findOne({email:email});
        
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let payload = {userID:user._id,username:user.name};
                    let signature = process.env.secret_key;
                    let token = jwt.sign(payload,signature,{expiresIn:"7d"});
                    res.status(200).json({Message:"Login success",access_token:token})
                }
                else{
                    console.log(err);
                    res.status(400).json({Message:"Invalid credentials"});
                }
            })
        }
        else{
            res.status(400).json({Message:"User does not exist. Please register"});
        }
    } catch (error) {
        res.status(400).json({Error:error});
    }
})

userRouter.get("/logout",async(req,res)=>{
    try {
        let token = req.headers.authorization?.split(" ")[1];
        let blacklisttoken = new BlackListModel({token:token});
        await blacklisttoken.save();
        res.status(200).json({Message:"Logged out"});
    } catch (error) {
        console.log(error);
        res.status(400).json({Error:error});
    }
})

module.exports = {
  userRouter,
};
