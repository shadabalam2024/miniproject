import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/miniproject")
.then("DB connected")

const userschema=new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    age:Number,
    password:String,

})

export default mongoose.model("user",userschema)