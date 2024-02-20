import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
    },
},{
    timestamps:true,
}
);

export default mongoose.model("faq",faqSchema);
