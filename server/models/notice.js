const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    pdf:{
        filename:String,
        path:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
module.exports =  mongoose.model("Notice",noticeSchema);
