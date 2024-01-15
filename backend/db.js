const mongoose = require("mongoose");
require('dotenv').config();
const url = process.env.mongoDB;

const connection = mongoose.connect(url);


module.exports={
    connection
}