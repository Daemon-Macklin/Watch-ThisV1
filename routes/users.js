let express = require('express');
let User = require('../models/users');
let mongodbUri = "mongodb://DMacklin:@ds149855.mlab.com:49855/movies";
let router = express.Router();
let mongoose = require('mongoose');

mongoose.connect(mongodbUri);
let db = mongoose.connection;
db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

//----------------------------------------------//
//---------------Router Functions---------------//
//----------------------------------------------//

//Method to add user
router.addUser = (req, res) => {
    user = new User();
    let newUserName;
    if(req.body.username.length > 20){
        newUserName = req.params.userName.slice(20);
    }else
        newUserName = req.body.userName;
    user.userName = newUserName;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(user));
    })
};

//Method to delete a user
router.deleteUser = (req, res) =>{
    User.findById(req.params.userId, function (err, user) {
        if(err)
            res.send(err);
        else{
            if(user.email === req.body.email && user.validatePassword(req.body.password)){
                User.findByIdAndRemove(req.params.userId , function (err) {
                    if(err)
                        res.send(err);
                    else
                        res.send("User removed")
                });
            }else{
                res.send("Email or password incorrect")
            }
        }
    });
};


//Method to sign in a user
router.signIn = (req, res) =>{
    let found;
    User.find(function(err, users) {
        if (err)
            res.send(err);
        else {
            found = false;
            for (let i = 0; i < users.length; i += 1) {
                if (users[i].email === req.body.email) {
                    if (users[i].validatePassword(req.body.password)) {
                        res.send(JSON.stringify(users[i]));
                        found = true;
                    }
                    else
                        res.send("Invalid Password");
                }
            }
            if (!found) {
                res.send("Can't find user")
            }
        }
    });
};

//Method to update user name
router.updateUserName = (req, res) =>{
    User.findById(req.params.userId, function (err, user) {
        if(err)
            res.send(err);
        else{
            if(user.email === req.body.email && user.validatePassword(req.body.password)){
                User.findByIdAndUpdate(req.params.userId, {userName : req.body.newUserName}, function (err, user) {
                    if(err)
                        res.send(err);
                    else
                        res.send(user);
                });
            }else{
                res.send("Email or password incorrect");
            }
        }
    });
};


//----------------------------------------------//
//---------------Helper Functions---------------//
//----------------------------------------------//

module.exports = router;
