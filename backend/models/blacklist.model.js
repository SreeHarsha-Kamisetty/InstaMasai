
const mongoose = require("mongoose");



const blacklistSchema = mongoose.Schema({
    token:String
})

const BlackListModel = mongoose.model("blacklisttoken",blacklistSchema);


module.exports={
    BlackListModel
}