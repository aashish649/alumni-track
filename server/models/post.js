const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            default: "", 
        },
        filename: {
            type: String,
            default: "no-img",
        },
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { timestamps: true });


module.exports =  mongoose.model("Post",postSchema);