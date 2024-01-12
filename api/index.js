const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

require("dotenv").config();

app.use(cors({credentials:true, origin:'https://litelines.onrender.com'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + "/uploads"));

mongoose.connect(process.env.mongodbURL)
.then((result) => console.log("DB connected."))
.catch((err) => console.log(err))


const salt = bcrypt.genSaltSync(10);

app.post("/register", async (req, res) => {
    const {userName, password} = req.body;

    try{
        const existedDoc = await User.findOne({userName});
        if (existedDoc !== null){
            console.log("user already exists.")
            res.status(400).json({success:false, message:"User already exists."});
        }else{
            const UserDoc = await User.create({
                'userName' : userName,
                'password' : bcrypt.hashSync(password, salt)
            })
            jwt.sign({userName, id:UserDoc._id}, process.env.secret, {expiresIn : 24 * 60 * 60}, (err, token) => {
                if (err) throw err;
                res.cookie('token ', token, {maxAge : 24 * 60 * 60 * 1000, secure:true, sameSite:'none'}).status(200).json({success:true, message:{
                    id : UserDoc._id,
                    userName
                }});
            })
        } 
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:err});
    }
})

app.post("/login", async (req, res) => {
    const {userName, password} = req.body;
    try{
        const userDoc = await User.findOne({userName})
        if (userDoc === null){
            console.log('user does not exist');
            res.status(400).json({success:false, message:"User does not exist"});
        }else{
            const passOK = bcrypt.compareSync(password, userDoc.password);
            if (passOK){
                jwt.sign({userName, id:userDoc._id}, process.env.secret, {expiresIn : 24 * 60 * 60}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token ', token, {maxAge : 24 * 60 * 60 * 1000, secure:true, sameSite:'none'}).status(200).json({success:true, message:{
                        id : userDoc._id,
                        userName
                    }});
                })
            }else{
                console.log('password does not match');
                res.status(400).json({success:false, message:"Wrong credentials."});
            }
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"Some error occured."});
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    try{
        if (token){
            jwt.verify(token, process.env.secret, {}, (err, decodedToken) => {
                if (err) throw err;
                else{
                    res.status(200).json({success:true, message:decodedToken});
                }
            })
        }
        else{
            res.status(400).json({success:false, message:"some error occured while checking user profile."})
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"some error occured while checking user profile."})
    }
    
})

app.post('/logout', (req, res) => {
    try{
        res.cookie('token', '').status(200).json({success:true, message:"user logged out successfully"});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:'some error occured while logging out.'});
    }
   
})


app.post('/post', uploadMiddleware.single('file'), (req, res) => {
    if (!req.file){
        res.status(400).json({success:false, message:"Please upload an image"});
    }
    console.log(req.file);
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    try{
        if (token){
            jwt.verify(token, process.env.secret, {}, async (err, decodedToken) => {
                if (err) throw err;
                const {title, summary, content} = req.body;
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author : decodedToken.id
                })
                res.status(200).json({success:true, message:postDoc});
            })
        }else{
            res.status(400).json({success:false, message:"Log in to create a post"});
        }
       
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"Some error occured while creating the post."});
    }
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {

    let newPath = null;
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    try{
        if (token){
            jwt.verify(token, process.env.secret, {}, async (err, info) => {
                if (err) throw err;
                const {id, title, summary, content} = req.body;
                const postDoc = await Post.findById(id);
                
                const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
                if (!isAuthor){
                    res.status(400).json({success:false, message:"Log in to update the post."});
                }else{
                    await postDoc.updateOne({title, 
                        summary, 
                        content,
                        cover: newPath ? newPath : postDoc.cover,
                    })
                    res.status(200).json({success:true, message:postDoc});
                }
            })
        }else{
            res.status(400).json({success:false, message:"Log in to update the post."});
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message: "some error occured while updating the post."});
    }
})


app.get('/post', async (req, res) => {
    try{
        const posts = await Post.find()
        .populate('author', ['userName'])
        .sort({createdAt: -1});
        res.status(200).json({success:true, message: posts});
    }
    catch (err) {
        res.status(400).json({success:false, message:"Error occured while fetching the posts."});
    } 
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const postDoc = await Post.findById(id).populate('author', ['userName']);
        res.status(200).json({success:true, message:postDoc});
    }
    catch (err) {
        console.log(err);
        res.status(400).json({success:false, message:"some error occured while fetching the single post."});
    }
    
})


if (process.env.API_PORT){
    app.listen(process.env.API_PORT)
}

module.exports = app;

