const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisismyproject";
const { UserModel } = require('../models/db');


async function userAuth(req, res, next){
    try{
        const token = req.headers.token;
        const decode = jwt.verify(token, JWT_SECRET);
        req.email = decode.email;
        const user = await UserModel.findOne({email: req.email});
        next();
    }catch(err){
        return res.status(401).json({ message: "Unauthorized" });
    }
}


module.exports = userAuth;