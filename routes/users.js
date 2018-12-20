let express = require('express');
let User = require('../models/users');
let mongodbUri = "mongodb://DMacklin:watchthis1@ds149855.mlab.com:49855/movies";
let router = express.Router();
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');

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

//Method to get all users
router.findAll = (req, res) => {

    //Setting header for formatting of response
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function that returns an array of users
    User.find(function (err, users) {

        //If an err is returned display the err, other wise respond with the array
        if(err) {
            return res.send(err);
        }
        else {
            return res.send(JSON.stringify(users, null, 5));
        }
    })
};

//Method to add user
router.addUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    //Generating new User and setting data gotten from body of request
    user = new User();
    let newUserName;
    if(req.body.userName.length > 20){
        newUserName = req.body.userName.slice(20);
    }else
        newUserName = req.body.userName;
    user.userName = newUserName;
    user.email = req.body.email;
    user.setPassword(req.body.password);

    //Using mongoose funtion to save the new user to the db
    user.save(function (err) {
        if(err) {
            return res.send(err);
        }
        else {
            return res.send(JSON.stringify(user));
        }
    })
};

//Method to delete a user
router.deleteUser = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function to find a user given an id from the params of the request
    User.findById(req.params.userId, function (err, user) {
        if(err) {
            return res.send(err);
        }
        else{

            //Preforming authentication before deleting the user
            if(user.email === req.body.email && user.validatePassword(req.body.password)){

                //Mongoose function to find an user and remove them given an id from the params of the request
                User.findByIdAndRemove(req.params.userId , function (err) {
                    if(err) {
                        return res.send(err);
                    }
                    else {
                        return res.send("User removed");
                    }
                });
            }else{
                return res.send("Email or password incorrect");
            }
        }
    });
};


//Method to sign in a user
router.signIn = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let found;
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }
        else {

            //Searching through users list to see if the email input is valid
            found = false;
            for (let i = 0; i < users.length; i += 1) {
                if (users[i].email === req.body.email) {

                    //If the email is valid check the hashed password stored against the hashed password the user input
                    if (users[i].validatePassword(req.body.password)) {
                        found = true;
                        //If the password check returns true display the user
                        //This is where token generation will take place when implmented
                        token = users[i].generateJWT();
                        return res.send(JSON.stringify({userData: users[i], token: token}), null, 5);
                    }
                    else {
                        found = true;
                        return res.send("Invalid Password");
                    }
                }
            }
            if (!found) {
                return res.send("Can't find user");
            }
        }
    });
};

// Method to auth token
router.authToken = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    // Use Json Web Token verify method to verify if token is valid
    jwt.verify(req.body.token, 'secret', function (err, decoded) {
        if(err){

            // If it is invalid return invalid
            return res.send("Invalid Token");
        } else {

            // else return the decoded token
            return res.send(decoded)
        }
    })
};

//Method to update user name
router.updateUserName = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    User.findById(req.params.userId, function (err, user) {
        if(err) {
            return res.send(err);
        }
        else{

                //Mongoose function to find a user and update a part or parts of it given an id
                User.findByIdAndUpdate(req.params.userId, {userName : req.body.newUserName}, function (err, user) {
                    if(err) {
                        return res.send(err);
                    }
                    else{
                        return res.send(JSON.stringify(user,null,5))
                    }
                });
        }
    });
};

router.getUserName = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    User.findById(req.params.userId, function (err, user) {
        if(err) {
            return res.send(err);
        }
        else {
            return res.send(user.userName)
        }
    });
};

router.findOne = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    User.findById(req.params.id, function (err, user) {
        if(err) {
            return res.send(err);
        }
        else {
            return res.send(JSON.stringify(user,null,5))
        }
    });
}

module.exports = router;
