const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const { UserModel, PasswordsModel } = require('../models/db');
const userAuth = require('../middleware/userAuth');
const JWT_SECRET = 'thisismyproject';



//to add password
router.post('/add', userAuth, async (req,res) => {
    const email = req.email;
    const user  = await PasswordsModel.findOne({email});
    if(user){
        try{
            const {username, title, value} = req.body;
            const newEntry = {
                username: username,
                title: title,
                value: value
            }
            user.password.push(newEntry);
            await user.save();
            res.json({message: "password added sucessfully"});
        }catch{
            res.json({message: "Something went wrong in the add endpoint"});
        }
    }else{
        res.json({message: "user not found"})
    }
});


module.exports = router;