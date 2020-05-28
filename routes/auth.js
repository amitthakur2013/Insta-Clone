const express=require('express')
const mongoose=require('mongoose')
const router=express.Router()
const User = mongoose.model("User")
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin=require('../middleware/requireLogin')

router.get('/',(req,res) => {
	res.send("hello")
})

router.post('/signup',(req,res) => {
	const {name,email,password,pic}=req.body
	if (!email || !password || !name){
		return res.status(422).json({
			error:"Please add all the fields!!"
		})
	}
	User.findOne({email}).then((savedUser) => {
		if(savedUser){
			return res.status(422).json({error:"User already exists with that email!"})
		}
		bcrypt.hash(password,12).then((hashedPassword) => {
			const user = new User({
			email,
			password:hashedPassword,
			name,
			pic
			})
			user.save().then((user) => {
				res.json({"message":"Saved Successfully!!"})	
			}).catch((error) => {
				console.log(error)
			})
			}).catch((error) => {
				console.log(error)
			})
		})
		
})

router.post('/signin', (req,res) => {
	const {email,password}=req.body
	if(!email || !password){
		return res.status(422).json({error:"Please add email or password!!"})
	}
	User.findOne({email}).then((savedUser) => {
		if(!savedUser){
			return res.status(422).json({error:"Invalid email or password"})
		}
		bcrypt.compare(password,savedUser.password).then((doMatch) => {
			if (doMatch){
				//res.json({message:"Successfully signed in!!"})
				const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
				const {_id,name,email,followers,following,pic}=savedUser
				res.json({token,user:{_id,name,email,followers,following,pic}})
			}
			else {
				return res.status(422).json({error:"Invalid email or password!!"})
			}
		}).catch((error) =>{
			console.log(error)
		})
	}).catch((error) => {
		console.log(error)
	})

})

module.exports=router