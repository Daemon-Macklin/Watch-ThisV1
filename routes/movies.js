let movies = require('../models/movies');
let express = require('express');
let Movie = require('../models/movies');
let mongodbUri = "//mongodb://<>:<>@ds149855.mlab.com:49855/movies";
//mongodb://<DMacklin>:<DMacklin123>@ds149855.mlab.com:49855/movies
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


//Method to find all Movies
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    movies.find(function(err, movies) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(movies,null,5));
    });
};

//Method to find one movie
router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Movie.find({ "_id" : req.params.id },function(err, movie) {
        if (err)
         res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(movie,null,5))
    });
};

// Method to add a movie to the database
router.addMovie = (req, res) => {

    let movie = new Movie();
     movie.type = req.body.type;
     movie.title = req.body.title;
     movie.genre = req.body.genre;

    movie.save(function(err) {
        if (err)
        res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(movie));
    });
};

//Method to add an upvote to a movie
router.incrementUpvotes = (req, res) => {

    Movie.findById(req.params.id, function(err,donation) {
        if (err)
         res.send(JSON.stringify(err));
        else {
            donation.upvotes += 1;
            donation.save(function (err) {
                if (err)
                 res.send(JSON.stringify(err));
                else
                 res.send(JSON.stringify(donation));
            });
        }
    });
};

//Method to delete a movie
router.deleteMovie = (req, res) => {
    Movie.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(JSON.stringify(err));
        else
            res.send(req.params.id + " Removed")
    });
};

//Method to get the number of upvotes on all movies
router.getAllVotes = (req, res) =>{
    let totalvotes;
    Movie.find(function(err, movies) {
        if (err)
            res.send(JSON.stringify(err));
        else
            totalvotes = getTotalVotes(movies);
            res.send("Total Votes: " + totalvotes);
    });
};

//Method that will randomly recomend a movie for the user
router.pickRandomMovie = (req, res) =>{
    let movie;
    Movie.find(function (err,movies) {
        if(err)
            res.send(JSON.stringify(err));
        else
            movie = randomMovie(movies);
            res.json(movie)
    });
};

//----------------------------------------------//
//---------------Helper Functions---------------//
//----------------------------------------------//


//Helper function for random movie picker
function randomMovie(array) {
    let i = Math.floor((Math.random() * array.length));
    return array[i];
};

//Helper function for getting total upvotes
function getTotalVotes(array){
    let totalVotes = 0;
    array.forEach(function (obj){totalVotes += obj.upvotes;});
    return totalVotes

};


/*
function getByValue(array, id) {
    let result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
};
*/


module.exports = router;
