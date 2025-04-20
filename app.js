import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import path from "path"
// import user from "./models/user.model.js"
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
    res.send({msg:"listening"})
})













app.listen(3000,()=>{msg:"listening on port 8000"})