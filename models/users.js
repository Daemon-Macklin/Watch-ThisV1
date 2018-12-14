/*
Daemon-Macklin
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
/*
Schema for users
 */
let UsersSchema = new mongoose.Schema({
        userName: {type: String},
        email: {type: String, default: ""},
        hash: {type: String},
        salt: {type: String}
    },
    { collection: 'users' });

//Method to encrypt a password and save the hash and salt
UsersSchema.methods.setPassword = function(password) {

    //Randomly generating a salt to be used to randomise the hash and saving it
    this.salt = crypto.randomBytes(16).toString('hex');

    //Generating a 128-bit hash using sha512 hash function with the salt and password and saving it
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

//Method to hash the password and checks the new hash against the stored hash
UsersSchema.methods.validatePassword = function(password) {

    //Generating a hash using the password input, the salt stored for this user
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');

    //Retuning the result of checking the generated hash against the stored hash
    return this.hash === hash;
};

//Unused token generation code, planning to use this in the second part of the assignment

//Method that generates a JsonWebToken
UsersSchema.methods.generateJWT = function() {
    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(Math.floor(Date.now() / 1000) + (60 * 60), 10),
    }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model('User', UsersSchema);
