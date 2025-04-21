import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import path from "path"
import userModel from "./models/user.model.js"
import postsModel from "./models/posts.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// import authMiddleware from "./middlewares/restrictuser.js"





const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.render('index')
})


app.post("/register",async(req,res)=>{

    let{username,email,password,age,name}=req.body

    let user=await userModel.findOne({email})
    if(user){
        res.status(400).send("user already registered")
    }

    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) throw err;
        console.log("Hashed Password:", hash);

        let user =await userModel.create({
            username,
            email,
            password:hash,
            age,
            name
        })
    
        
    });
})













app.listen(3000,()=>{msg:"listening on port 8000"})