const express = require("express");
require('dotenv').config
const PORT = process.env.PORT || 8080;
const {connection} = require("./db");
const cors = require("cors");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");



const app = express();
app.use(cors());
app.use(express.json());
app.use("/users",userRouter);
app.use("/posts",postRouter);
app.get("/",(req,res)=>{
    res.status(200).json({Message:"This is home page"});
})

app.listen(PORT,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.log(error);
    }
    
})