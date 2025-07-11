const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
    email: {type: String, unique: true},
    name: String,
    password: String
})

const passwords = new Schema({
    email: String,
    password: [
        {
            username: String,
            title: String,        
            value: String         
        }
    ]
});

const UserModel = mongoose.model('user', user);
const PasswordsModel = mongoose.model('passwords', passwords);

module.exports = {
    UserModel, PasswordsModel
}