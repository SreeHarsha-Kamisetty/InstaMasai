const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { PostModel } = require("../models/post.model");


const postRouter = express.Router();

postRouter.use(auth);


postRouter.post("/add",async(req,res)=>{
    try {
        let new_post = new PostModel(req.body);
        await new_post.save();
        res.status(200).json({Message:"New post created",details:new_post})
    } catch (error) {
        res.status(400).json({Error:error});
    }
})



postRouter.get("/",async(req,res)=>{
    try {
        let userID = req.body.userID;
        console.log(userID);
        let min = Number(req.query.min)
        let max = Number(req.query.max)
        let device = req.query.device
        let posts;
        let device1 = req.query.device1;
        let device2 = req.query.device2;
        console.log(device1,device2)
        if(min && max){
            posts = await PostModel.find({userID:userID,no_of_comments:{"$gte":min,"$lte":max}}).limit(3);
        }
        else if(device){
            posts = await PostModel.find({userID:userID,device:device}).limit(3);
        }
        else if(device1 && device2){
            posts = posts = await PostModel.find({userID:userID,device:{"$or":[device1,device2]}}).limit(3);
        }
        else{
            
            posts = await PostModel.find({userID:userID});
        }
        
        res.status(200).json({Allposts:posts});
    } catch (error) {
        console.log(error);
        res.status(400).json({Error:error});
    }
})



postRouter.patch("/update/:updateid",async(req,res)=>{
    try {
        let updateid = req.params.updateid;
        let post = await PostModel.findOne({_id:updateid});
        console.log(post);
        if(post==null){
            res.status(200).json({Message:"Post does not exist"});
        }
        else{
            console.log(req.body);
           let updated_post = await PostModel.findByIdAndUpdate({_id:updateid},req.body);

            res.status(200).json({Message:"Post updated",Details:updated_post});
        }
        
    } catch (error) {
        res.status(400).json({Error:error});
    }
})

postRouter.delete("/delete/:deleteid",async(req,res)=>{
    try {
        let deleteid = req.params.deleteid;
        let post = await PostModel.findOne({_id:deleteid});
        
        if(post==null){
            res.status(200).json({Message:"Post does not exist"});
        }
        else{
            console.log(req.body);
           let updated_post = await PostModel.findByIdAndDelete({_id:deleteid});

            res.status(200).json({Message:"Post deleted"});
        }
        
    } catch (error) {
        res.status(400).json({Error:error});
    }
})

module.exports={
    postRouter
}