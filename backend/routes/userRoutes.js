const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const { UserModel, PasswordsModel } = require('../models/db');
const userAuth = require('../middleware/userAuth');
const JWT_SECRET = 'thisismyproject'
// app.use(express.json());

//signup route created
router.post('/signup', async (req, res) => {
    const { email, name, password, confirmedPassword } = req.body;    
    if(password === confirmedPassword){
        const hashPassword = await bcrypt.hash(password, 5);
        try{
            await UserModel.create({email, name, password: hashPassword});
            await PasswordsModel.create({
            email,
            password: []
        });
            res.json({message: "user created"});
        }catch(err){
            return res.status(400).json({ message: "User already exists!" });
        }
    }else{
        return res.status(400).json({message: "password and confimed password didnt match"});
    }
});

//signin route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await UserModel.findOne({email});
        if(bcrypt.compare(password, user.password)){
            const token = jwt.sign({email: user.email}, JWT_SECRET);
            res.json({token, message: "you are logged in"});
            
        }else{
            res.json({message: "user doesnt exist"});
        }

    }catch(err){
        return res.json({message: "Wrong credentials!"})
    }
    

});




module.exports = router;