import mongoose from "mongoose";



const postschema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default:Date.now()
    },
    content:String,
    
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]


})

export default mongoose.model("post",postschema)