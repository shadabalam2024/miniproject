import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import path from "path"
import userModel from "./models/user.model.js"
import postsModel from "./models/posts.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"







const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.render('index')
})
app.get("/login",(req,res)=>{
    res.render('login')
})
app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.render('login')
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

        const token = jwt.sign({email: email, userid: user._id},"shh");
        
        res.cookie("token",token)
        res.send("user regosterd successfuly")

    
        
    })
})


app.post("/login",async(req,res)=>{

    let{email,password}=req.body

    let user=await userModel.findOne({email}).populate("posts")
    if(!user){
        res.status(400).send("Incorrect Credentials")
    }

    bcrypt.compare(password,user.password, (err, result) => {
        if(result){
            
            const token = jwt.sign({email: email, userid: user._id},"shh");
            res.cookie("token",token)
            res.status(200).render("profile",{user})
        }else res.status(400).send("Incorrect Credentials")
        
    });
    
})


//middleware
function isloggenin(req,res,next){
    if(req.cookies.token=="" || req.cookies.token===undefined){
        res.redirect("login")
    }else{
        let data = jwt.verify(req.cookies.token,'shh')
        req.user=data
        next()
    }
    

}

app.get("/profile",isloggenin,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email}).populate("posts")
    // user.populate("posts")
    res.render("profile",{user})
})


app.get("/like/:id", isloggenin, async (req, res) => {
    let post = await postsModel.findOne({ _id: req.params.id }).populate("user");

    if (!post) {
        return res.status(404).send("Post not found");
    }

    if(post.likes.indexOf(req.user.userid)===-1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1)
    }

    
    await post.save();
    
    res.redirect("/profile");
});


app.get("/edit/:id", isloggenin, async (req, res) => {
    let post = await postsModel.findOne({ _id: req.params.id }).populate("user");

    res.render("edit",{post})
});
app.post("/update/:id", isloggenin, async (req, res) => {
    let post = await postsModel.findOneAndUpdate({ _id: req.params.id },{content:req.body.content});

    res.redirect("/profile")
});




app.post("/post",isloggenin,async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    let {content}=req.body

    let post= await postsModel.create({
        user:user._id,
        content,

    })

    user.posts.push(post._id)
    
    await user.save()
    res.redirect("/profile")


})

app.listen(3000)