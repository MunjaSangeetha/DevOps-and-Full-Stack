//server.js
const express=require("express");		const app=express();
require("./config/db");		const User=require("./models/User");	
const jwt=require("jsonwebtoken");	const bcrypt=require("bcryptjs");
app.use(express.json());	const SECRET_KEY="mysecretkey";
app.post("/register",async(req,res)=>
{
const {username,password } =req.body;
const hashedPassword=await bcrypt.hash(password,10);
const user=new User({	username, 	password:hashedPassword	});
await user.save();
res.send("User Registered Successfully");
});

app.post("/login",async(req,res)=>
{
    const {username,password } =req.body;
    const user=await User.findOne({username});

if(!user)	{	return res.send("User not found");	}	
const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch)	{	return res.send("Invalid password");		}	
const token=jwt.sign(	{	userId:user._id	}, SECRET_KEY, { expiresIn:"1h"}
);
res.json(token);
});

app.listen(3000,()=>{console.log("Server is running on http://localhost:3000");});