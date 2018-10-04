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
     movie.type = req.params.type;
     movie.title = req.params.title;
     movie.genre = req.params.genre;

    movie.save(function(err) {
        if (err)
        res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(movie));
    });
};

router.incrementUpvotes = (req, res) => {
    // Find the relevant donation based on params id passed in
    // Add 1 to upvotes property of the selected donation based on its id
    var movie = getByValue(movies,req.params.id);
    const currentupvotes = movie.upvotes;
    movie.upvotes += 1;

    if(movie.upvotes > currentupvotes){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(movie,null,5));
        res.json(movie);
    }
};

router.deleteMovie = (req, res) => {
    //Delete the selected donation based on its id
    movie = getByValue(movies, req.params.id)
    // First, find the relevant donation to delete
    // Next, find it's position in the list of donations
    let isDelete = false;
    for(let i =0; i < movies.length; i += 1){
        if(movie === movies[i]){
            movies.splice(i,1);
            isDelete = true;
            break
        }
    }
    // Then use donations.splice(index, 1) to remove it from the list
    if(!isDelete){
        res.json("Item not removed")
    }else{
        res.json("Item removed")
    }
    // Return a message to reflect success or failure of delete operation
};

router.getAllVotes = (req, res) =>{
    let votes = getTotalVotes(movies);
    res.json(votes);
};

router.pickRandomMovie = (req, res) =>{
    let movie = randomMovie(movies);
    res.json(movie)
};

function randomMovie(array) {
    let i = Math.floor((Math.random() * movies.length));
    return movies[i];
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
