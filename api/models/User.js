const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        unique : true,
        required : true,
        min : 4
    },
    password : {
        type : String,
        required : true
    }
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;