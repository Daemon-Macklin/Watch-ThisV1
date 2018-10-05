let movies = require('../models/movies');
let express = require('express');
let Movie = require('../models/movies');
let router = express.Router();
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    movies.find(function(err, movies) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(movies,null,5));
    });
};

router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Movie.find({ "_id" : req.params.id },function(err, movie) {
        if (err)
         res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(movie,null,5))
    });
};

let mongoose = require('mongoose');



mongoose.connect('mongodb://localhost:27017/movies');

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

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

router.deleteMovie = (req, res) => {
    Movie.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(JSON.stringify(err));
        else
            res.send(req.params.id + " Removed")
    });
};

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

function randomMovie(array) {
    let i = Math.floor((Math.random() * array.length));
    return array[i];
};

function getTotalVotes(array){
    let totalVotes = 0;
    array.forEach(function (obj){totalVotes += obj.upvotes;});
    return totalVotes

};

function getByValue(array, id) {
    let result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
};


module.exports = router;
