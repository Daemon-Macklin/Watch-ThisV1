let media = require('../models/media');
let express = require('express');
let Media = require('../models/media');
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


//Method to find all Movies and Games
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    media.find(function(err, media) {
        if (err)
            res.send(err);
        else
        res.send(JSON.stringify(media,null,5));
    });
};

//Method to find one movie or game
router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Media.find({ "_id" : req.params.id },function(err, media) {
        if (err)
         res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(media,null,5))
    });
};

// Method to add a movie or game to the database
router.addMedia = (req, res) => {

    let media = new Media();
     media.type = req.body.type;
     media.title = req.body.title;
     media.genre = req.body.genre;
     media.userId = req.body.userId;

    media.save(function(err) {
        if (err)
        res.send(JSON.stringify(err));
        else
        res.send(JSON.stringify(media,null,5));
    });
};

//Method to add an upvote to a review
router.incrementUpvotes = (req, res) => {

    Media.findById(req.params.id, function(err,media) {
        if (err)
         res.send(JSON.stringify(err));
        else {
            for(let i =0; i < media.reviews.length; i+=1){
                if(media.reviews[i]._id.equals(req.params.reviewId)){
                    media.reviews[i].upvotes +=1;
                    break;
                }
            }
            media.save(function (err) {
                if (err)
                 res.send(JSON.stringify(err));
                else
                 res.send(JSON.stringify(media,null,5));
            });
        }
    });
};

//Method to delete a movie or game
router.deleteMedia = (req, res) => {
    Media.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(JSON.stringify(err));
        else
            res.send(req.params.id + " Removed")
    });
};

//Method to get the number of upvotes on all media
router.getAllVotes = (req, res) =>{
    let totalvotes;
    Media.find(function(err, medias) {
        if (err)
            res.send(JSON.stringify(err));
        else
            totalvotes = getTotalVotes(medias);
            res.send("Total Votes: " + totalvotes);
    });
};

//Method that will randomly recommend a movie or game for the user
router.pickRandomMedia = (req, res) =>{
    let foundMedia =[];
    Media.find(function(err, media) {
        if (err)
            res.send(JSON.stringify(err));
        else{
            if(req.params.type === "Movie"){
                foundMedia = findMovies(media);
            }else if(req.params.type === "Game"){
                foundMedia = findGames(media);
            }
            if(foundMedia.length > 0){
                res.send(JSON.stringify(randomMovie(foundMedia)));
            }else{
                res.send("No " + req.params.type + " found")
            }
        }
    });
};

//Method to find all Movie OR Games depending on user input
router.findAllType = (req, res) =>{
    let foundMedia =[];
    Media.find(function(err, media) {
        if (err)
            res.send(JSON.stringify(err));
        else{
            if(req.params.type === "Movie"){
                foundMedia = findMovies(media);
            }else if(req.params.type === "Game"){
                foundMedia = findGames(media);
            }
            if(foundMedia.length > 0){
                res.send(JSON.stringify(foundMedia));
            }else{
                res.send("No " + req.params.type + " found")
            }
        }
    });
};

//Method to add review to movie
router.addReview = (req, res) =>{

    Media.findByIdAndUpdate(req.params.id,
        {$push: {reviews: {review : req.body.reviewText, score : req.body.score, userId : req.body.userId}}},
        function(err,media) {
        if (err)
            res.send(JSON.stringify(err));
        else {
            media.rating = updateScore(media.reviews, req.body.score);
            media.save(function (err) {
                if (err)
                    res.send(JSON.stringify(err));
                else
                    res.send(JSON.stringify(media));
            })
        }
    });
};

//Method to delete review
router.deleteReview = (req,res) =>{
    Media.findById(req.params.id, function (err, media) {
        if(err)
            res.send(JSON.stringify(err));
        else{
            let isDeleted = false;
            for(let i =0; i < media.reviews.length; i +=1){
                //console.log(movie.reviews[i]._id + " : " + req.params.reviewId);
                if(media.reviews[i]._id.equals(req.params.reviewId)){
                    media.reviews.splice(i, 1);
                    media.save(function (err) {
                        if(err)
                            res.send(JSON.stringify(err));
                        else
                            res.send(JSON.stringify(media,null,5))
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

//Method to search media based on genre
router.searchByGenre = (req, res) => {
    let found = [];
    media.find(function(err, medias) {
        if (err)
            res.send(err);
        else
            for(let i =0; i < medias.length; i+=1){
                if(medias[i].genre === req.params.genre){
                    found.push(medias[i]);
                }
            }
            if(found.length >= 1){
                res.send(JSON.stringify(found,null,5));
            }else {
                res.send("No media found");
            }
    });
};

//Mehod to find all media submited by user
router.searchMediaByUser = (req, res) =>{
    let found =[];
    media.find(function(err, medias) {
        if (err)
            res.send(err);
        else
            for(let i =0; i < medias.length; i+=1){
                if(medias[i].userId === req.params.userId){
                    found.push(medias[i]);
                }
            }
        if(found.length >= 1){
            res.send(JSON.stringify(found,null,5));
        }else {
            res.send("No media found for user");
        }
    });
};

//Method to find all reviews submitted by a user
router.searchReviewByUser = (req, res) =>{
    let found =[];
    media.find(function(err, medias) {
        if (err)
            res.send(err);
        else
            for(let i =0; i < medias.length; i+=1){
                for(let j=0; j < medias[i].reviews.length; j+=1){
                    if(medias[i].reviews[j].userId===req.params.userId){
                        found.push(medias[i].reviews[j]);
                    }
                }
            }
        if(found.length >= 1){
            res.send(JSON.stringify(found,null,5));
        }else {
            res.send("No reviews found for user");
        }
    });
};


//Method to search media based on rating
router.searchByRating = (req, res) => {
    let found = [];
    media.find(function(err, medias) {
        if (err)
            res.send(err);
        else
            for(let i =0; i < medias.length; i+=1){
                console.log(medias[i].rating + " : " + req.params.rating);
                if(Number(medias[i].rating) >= Number(req.params.rating)){
                    found.push(medias[i]);
                }
            }
        if(found.length >= 1){
            res.send(JSON.stringify(found,null,5));
        }else {
            res.send("No media found");
        }
    });
};

router.searchByTitle = (req,res) =>{
    let found = [];
    media.find(function(err, medias) {
        if (err)
            res.send(err);
        else {
            for (let i = 0; i < medias.length; i += 1) {
                if (medias[i].title === req.params.title) {
                    found.push(medias[i]);
                }
            }
            for (let i = 1; i < 4; i += 1) {
                let title = req.params.title.slice(0, i);
                for (let j = 0; j < medias.length; j += 1) {
                    let foundTitle = medias[j].title.slice(0, i);
                    if (title === foundTitle) {
                        let alreadyFound = false;
                        for (let k = 0; k < found.length; k += 1) {
                            if (medias[j].equals(found[k])) {
                                alreadyFound = true;
                            }
                        }
                        if (!alreadyFound) {
                            found.push(medias[j])
                        }
                    }
                }
            }
            if (found.length >= 1) {
                res.send(JSON.stringify(found, null, 5));
            } else {
                res.send("No media found");
            }
        }
    });
};

//----------------------------------------------//
//---------------Helper Functions---------------//
//----------------------------------------------//


//Helper function to return all Movies
function findMovies(media) {
    let movies = [];
    for(let i =0; i < media.length; i+=1){
        if(media[i].type === "Movie"){
            movies.push(media[i]);
        }
    }
    return movies;
}

//Helper function to return all Games
function findGames(media){
    let games = [];
    for(let i =0; i < media.length; i+=1){
        if(media[i].type === "Game"){
            games.push(media[i]);
        }
    }
    return games;
}

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
