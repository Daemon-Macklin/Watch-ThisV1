let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    userName : {type: String, default: "Anonymous"},
    password : {type : String, default: ""},
    email : {type : String, default: ""}
    },
    { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);