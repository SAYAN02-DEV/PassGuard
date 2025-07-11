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

//to delete password
router.delete('/delete', userAuth, async (req, res) => {
    const email = req.email;
    const { title, username } = req.body;
    
    try {
        const user = await PasswordsModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const initialLength = user.password.length;
        user.password = user.password.filter(pwd => 
            !(pwd.title === title && pwd.username === username)
        );
        
        if (user.password.length === initialLength) {
            return res.status(404).json({ message: "Password entry not found" });
        }
        
        await user.save();
        res.json({ message: "Password deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong in the delete endpoint" });
    }
});

//to update password
router.put('/update', userAuth, async (req, res) => {
    const email = req.email;
    const { title, username, newValue } = req.body;
    
    try {
        const user = await PasswordsModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordEntry = user.password.find(pwd => 
            pwd.title === title && pwd.username === username
        );
        
        if (!passwordEntry) {
            return res.status(404).json({ message: "Password entry not found" });
        }
        passwordEntry.value = newValue;
        await user.save();
        
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong in the update endpoint" });
    }
});

//to get all passwords for a user
router.get('/mypasswords', userAuth, async (req, res) => {
    const email = req.email;
    
    try {
        const user = await PasswordsModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({ passwords: user.password });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong in the mypasswords endpoint" });
    }
});

module.exports = router;