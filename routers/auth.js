const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = new express.Router();
const User = require("../model/user");
router.use(express.json({}));

var mailer = require('../routers/mail');



// Register a User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, password1 } = req.body
        if (!name || !email || !password || !password1) {
            res.status(400).json({ error: "Fill all Fields" })
        }
        if (password == password1) {
            const user = new User(req.body);
            // const token = await user.generateAuthToken();
            // res.cookie("jwt", token, {
            //         expires:new Date(Date.now()+25892000000),
            //         httpOnly:true
            //     });
            const createuser = await user.save();
            mailer({
                from: process.env.EMAIL,
                to:req.body.email,
                subject: 'Successfully Registration',
	             text: 'Your Registration is Successfully Complete',
                html: "<b>Your Registration is Successfully Complete</b><img src='cid:img'>",
                attachments: [{
                    filename: 'img4.jpg',
                    path: __dirname +'/image/img4.jpg',
                    cid: 'img' //same cid value as in the html img src
                }]
            });
            res.status(201).json({success:"user registration successfully"})
        } else {
            res.send("password and confirm password do not match")
        }
    } catch (error) {
        res.status(400).send(error)
    }
}) 


// Login a user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            res.status(400).json({ error: "Fill all Fields" })
        }
        const emailuser = await User.findOne({ "email": email });
        if (emailuser) {
            const isValid = await bcrypt.compare(password, emailuser.password);
            const token = await emailuser.generateAuthToken();
            // res.cookie("jetoken", token, {
            //     expires:new Date(Date.now()+25892000000),
            //     httpOnly:true
            // });
            if (isValid) {
                res.status(200).json({ success: "Login Successfully", token:token })
            } else {
                res.status(400).json({ error: "Invalid Credientials" })
            }
        } else {
            res.json({ error: "User not exist" })
        }
    } catch (error) {
        res.json({ error: "Invalid Email" })
    }
})


module.exports = router