let movies = require('../models/movies');
let express = require('express');
let Movie = require('../models/movies');
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
        res.send(JSON.stringify(movie,null,5));
    });
};

//Method to add an upvote to a movie
router.incrementUpvotes = (req, res) => {

    Movie.findById(req.params.id, function(err,movie) {
        if (err)
         res.send(JSON.stringify(err));
        else {
            for(let i =0; i < movie.reviews.length; i+=1){
                if(movie.reviews[i]._id.equals(req.params.reviewId)){
                    movie.reviews[i].upvotes +=1;
                    break;
                }
            }
            movie.save(function (err) {
                if (err)
                 res.send(JSON.stringify(err));
                else
                 res.send(JSON.stringify(movie,null,5));
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
            res.send(JSON.stringify(movie,null,5));
    });
};

//Method to add review to movie
router.addReview = (req, res) =>{

    Movie.findByIdAndUpdate(req.params.id,
        {$push: {reviews: {review : req.body.reviewText, score : req.body.score}}},
        function(err,movie) {
        if (err)
            res.send(JSON.stringify(err));
        else {
            movie.rating = updateScore(movie.reviews, req.body.score);
            movie.save(function (err) {
                if (err)
                    res.send(JSON.stringify(err));
                else
                    res.send(JSON.stringify(movie));
            })
        }
    });
};

//Method to delete review
router.deleteReview = (req,res) =>{
    Movie.findById(req.params.id, function (err, movie) {
        if(err)
            res.send(JSON.stringify(err));
        else{
            let isDeleted = false;
            for(let i =0; i < movie.reviews.length; i +=1){
                //console.log(movie.reviews[i]._id + " : " + req.params.reviewId);
                if(movie.reviews[i]._id.equals(req.params.reviewId)){
                    movie.reviews.splice(i, 1);
                    movie.save(function (err) {
                        if(err)
                            res.send(JSON.stringify(err));
                        else
                            res.send(JSON.stringify(movie,null,5))
                    });
                    isDeleted = true;
                    break;
                }
            }
            if(!isDeleted)
                res.send("Review not found");
        }
    });
};

//----------------------------------------------//
//---------------Helper Functions---------------//
//----------------------------------------------//

//Helper function to update movie score
function updateScore(array, newScore) {
    let totalScore = 0;
    for(let i = 0; i < array.length; i+=1 ){
        totalScore += array[i].score;
    }
    let size = array.length +=1;
    let total = totalScore + newScore;
    let final = Math.round((total/size) * 100) / 100;
    return final;
}

//Helper function for random movie picker
function randomMovie(array) {
    let i = Math.floor((Math.random() * array.length));
    return array[i];
}

//Helper function for getting total upvotes
function getTotalVotes(array){
    let totalVotes = 0;
    array.forEach(function (obj){totalVotes += obj.upvotes;});
    return totalVotes
}


/*
function getByValue(array, id) {
    let result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
};
*/


module.exports = router;
