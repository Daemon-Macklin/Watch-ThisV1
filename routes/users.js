let express = require('express');
let User = require('../models/users');
let mongodbUri = "mongodb://:@ds149855.mlab.com:49855/movies";
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

router.addUser = (req, res) => {
    user = new User();
    user.userName = req.body.userName;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.save(function (err) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(user));
    })
};

router.deleteUser = (req, res) =>{
    User.findById(req.params.id, function (err, user) {
        if(err)
            res.send(JSON.stringify(err));
        else{
            for(let i =0; i < user.length; i +=1){
                if(user._id.equals(req.params.userId)) {
                    if (user.email.equals(req.body.user)) {
                        if (user.validatePassword(req.body.password)) {
                            user.reviews.splice(i, 1);
                            user.save(function (err) {
                                if (err)
                                    res.send(JSON.stringify(err));
                                else
                                    res.send(JSON.stringify(user, null, 5))
                            });
                        }else{
                            res.send("Password incorrect")
                        }
                    }else{
                     res.send("Email not valid")
                    }
                }else{
                    res.send("Id not found");
                }
            }
        }
    });
};

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


//----------------------------------------------//
//---------------Helper Functions---------------//
//----------------------------------------------//

module.exports = router;
