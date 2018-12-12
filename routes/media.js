let media = require('../models/media');
let express = require('express');
let Media = require('../models/media');
let mongodbUri = "mongodb://DMacklin:watchthis1@ds149855.mlab.com:49855/movies";
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

    //Mongoose function that returns an arry of all media
    media.find(function(err, media) {

        //If there is an error return the error other wise return the list of media
        if (err)
            return res.send(err);
        else
            return res.send(JSON.stringify(media,null,5));
    });
};

router.findAllGames = (req,res) =>{
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function that returns an arry of all Games
    media.find({"type":"Game"},function(err, media) {

        //If there is an error return the error other wise return the list of media
        if (err)
            return res.send(err);
        else
            return res.send(JSON.stringify(media,null,5));
    });
};

router.findAllMovies = (req,res) =>{
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function that returns an arry of all Movies
    media.find({"type":"Movie"},function(err, media) {

        //If there is an error return the error other wise return the list of media
        if (err)
            return res.send(err);
        else
            return res.send(JSON.stringify(media,null,5));
    });
};

//Method to find one movie or game
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    //Mongoose find function but a parameter _id is given so it will return all media with that id
    Media.find({ "_id" : req.params.id },function(err, media) {
        if (err)
            return res.send(JSON.stringify(err));
        else
            return res.send(JSON.stringify(media,null,5))
    });
};

// Method to add a movie or game to the database
router.addMedia = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    //Making new media and taking in data from body
    let media = new Media();
     media.type = req.body.type;
     media.title = req.body.title;
     media.genre = req.body.genre;
     media.userId = req.body.userId;
     media.youtubeLink = req.body.youtubeLink;


     //Mongoose funtion to save a media to the database
    media.save(function(err) {
        if (err)
            return res.send(JSON.stringify(err));
        else
            return res.send(JSON.stringify(media,null,5));
    });
};

//Method to add an upvote to a review
router.incrementUpvotes = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function to find a media given an id
    Media.findById(req.params.id, function(err,media) {
        if (err)
            return res.send(JSON.stringify(err));
        else {

            //Looping through the reviews on a media and checking for the review with the correct id
            for(let i =0; i < media.reviews.length; i+=1){
                if(media.reviews[i]._id.equals(req.params.reviewId)){

                    //If the media has the correct id add 1 to the upvote counter
                    media.reviews[i].upvotes +=1;
                    break;
                }
            }

            //Saving after incrementing upvote
            media.save(function (err) {
                if (err)
                    return res.send(JSON.stringify(err));
                else
                    return res.send(JSON.stringify(media,null,5));
            });
        }
    });
};

//Method to delete a movie or game
router.deleteMedia = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    //Mongoose funtion that will find a media and remove it given an id
    Media.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return res.send(JSON.stringify(err));
        else
            return res.send(req.params.id + " Removed")
    });
};

//Method to get the number of upvotes on all media
router.getAllVotes = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let totalvotes;
    Media.find(function(err, medias) {
        if (err)
            return res.send(JSON.stringify(err));
        else
            totalvotes = getTotalVotes(medias);
            return res.send("Total Votes: " + totalvotes);
    });
};

//Method that will randomly recommend a movie or game for the user
router.pickRandomMedia = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let foundMedia =[];

    //Finding all media
    Media.find(function(err, media) {
        if (err)
            return res.send(JSON.stringify(err));
        else{

            //Seeing which type of media the user wants based on the parameters and calling the correct helper function
            if(req.params.type === "Movie"){
                foundMedia = findMovies(media);
            }else if(req.params.type === "Game"){
                foundMedia = findGames(media);
            }

            //If there is media display the result of the randomMovie function otherwise display the type is empty
            if(foundMedia.length > 0){
                return res.send(JSON.stringify(randomMovie(foundMedia)));
            }else{
                return res.send("No " + req.params.type + " found")
            }
        }
    });
};

//Method to find all Movie OR Games depending on user input
router.findAllType = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let foundMedia =[];
    Media.find(function(err, media) {
        if (err)
            return res.send(JSON.stringify(err));
        else{
            if(req.params.type === "Movie"){
                foundMedia = findMovies(media);
            }else if(req.params.type === "Game"){
                foundMedia = findGames(media);
            }
            if(foundMedia.length > 0){
                return res.send(JSON.stringify(foundMedia));
            }else{
                return res.send("No " + req.params.type + " found")
            }
        }
    });
};

//Method to add review to movie
router.addReview = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    //Mongoose function to find a media and update a part or parts of it given and id
    //IN this we find the media and then push a new review to it's list of reviews
    Media.findByIdAndUpdate(req.params.id,
        {$push: {reviews: {review : req.body.reviewText, score : req.body.score, userId : req.body.userId}}},
        function(err,media) {
        if (err)
            return res.send(JSON.stringify(err));
        else {

            //After adding a review update the review score and save it to the database
            media.rating = updateScore(media.reviews, req.body.score);
            media.save(function (err) {
                if (err)
                    return res.send(JSON.stringify(err));
                else
                    return res.send(JSON.stringify(media));
            })
        }
    });
};

//Method to delete review
router.deleteReview = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    Media.findById(req.params.id, function (err, media) {
        if(err)
            return res.send(JSON.stringify(err));
        else{
            let isDeleted = false;

            //Looping though the medias list of reviews checking for the correct id
            for(let i =0; i < media.reviews.length; i +=1){
                //console.log(movie.reviews[i]._id + " : " + req.params.reviewId);
                if(media.reviews[i]._id.equals(req.params.reviewId)){

                    //if the review has the correct id remove it from the list and save
                    media.reviews.splice(i, 1);
                    media.save(function (err) {
                        if(err)
                            return res.send(JSON.stringify(err));
                        else
                            return res.send(JSON.stringify(media,null,5))
                    });
                    isDeleted = true;
                    break;
                }
            }
            if(!isDeleted)
                return res.send("Review not found");
        }
    });
};

//Method to update a media Title
router.updateTitle = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    Media.findByIdAndUpdate(req.params.id, {title : req.body.newTitle}, function (err, media) {
        if (err)
            return res.send(err);
        else
            return res.send(JSON.stringify(media,null,5))
    });
};

//Method to search media based on genre
router.searchByGenre = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let found = [];
    media.find(function(err, medias) {
        if (err)
            return res.send(err);
        else

            //Loop through the media list and checking the genre
            for(let i =0; i < medias.length; i+=1){
                if(medias[i].genre === req.params.genre){

                    //If the genre is what the user is looking for add it to the found list
                    found.push(medias[i]);
                }
            }

            //If the list isn't empty return it
            if(found.length >= 1){
                return res.send(JSON.stringify(found,null,5));
            }else {
                return res.send("No media found");
            }
    });
};

//Mehod to find all media submited by user
router.searchMediaByUser = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let found =[];
    media.find(function(err, medias) {
        if (err)
            return res.send(err);
        else

            //Loop though list of media checking id
            for(let i =0; i < medias.length; i+=1){
                if(medias[i].userId === req.params.userId){

                    //If the id match add it to the list of media that the user has uploaded
                    found.push(medias[i]);
                }
            }
            //If the list is empty inform the user, otherwise send the list
        if(found.length >= 1){
            return res.send(JSON.stringify(found,null,5));
        }else {
            return res.send("No media found for user");
        }
    });
};

//Method to find all reviews submitted by a user
router.searchReviewByUser = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let found =[];
    media.find(function(err, medias) {
        if (err)
            return res.send(err);
        else

            //Loop though each media and loop though the medias reviews checking the id
            for(let i =0; i < medias.length; i+=1){
                for(let j=0; j < medias[i].reviews.length; j+=1){

                    //If the id match add it to the list of the reviews uploaded by the user
                    if(medias[i].reviews[j].userId===req.params.userId){
                        found.push(medias[i].reviews[j]);
                    }
                }
            }

            //If the list is empty tell the user, if not display the list
        if(found.length >= 1){
            return res.send(JSON.stringify(found,null,5));
        }else {
            return res.send("No reviews found for user");
        }
    });
};


//Method to search media based on rating
router.searchByRating = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let found = [];
    media.find(function(err, medias) {
        if (err)
            return res.send(err);
        else

            //Loop though the medias and checking the ratings
            for(let i =0; i < medias.length; i+=1){
                //console.log(medias[i].rating + " : " + req.params.rating);

                //If the rating of the media is greater then the rating the user is looking for add it to the array
                if(Number(medias[i].rating) >= Number(req.params.rating)){
                    found.push(medias[i]);
                }
            }

            //If the array is empty tell the user, otherwise display the list
        if(found.length >= 1){
            return res.send(JSON.stringify(found,null,5));
        }else {
            return res.send("No media found");
        }
    });
};

router.searchByTitle = (req,res) =>{
    res.setHeader('Content-Type', 'application/json');
    let found = [];
    media.find(function(err, medias) {
        if (err)
            return res.send(err);
        else {

            //Loop though the list of medias checking the title
            for (let i = 0; i < medias.length; i += 1) {

                //if the title is what the user is looking for add it to the list
                if (medias[i].title.toLowerCase() === req.params.title.toLowerCase()) {
                    found.push(medias[i]);
                }
            }

            //Loop through the first 3 letters of the title to user is searching for
            for (let i = 4; i > 0; i -= 1) {
                let title = req.params.title.slice(0, i);
                title = title.toLowerCase();

                //Loop through the medias and take the first i letters and check against the first i letters of the title
                //the user is looking for
                for (let j = 0; j < medias.length; j += 1) {
                    let foundTitle = medias[j].title.slice(0, i);
                    foundTitle = foundTitle.toLowerCase();
                    //If the strings match check to see if the media has already been found
                    if (title === foundTitle) {
                        let alreadyFound = false;
                        for (let k = 0; k < found.length; k += 1) {

                            //if the media is already in the list set the bool to true
                            if (medias[j].equals(found[k])) {
                                alreadyFound = true;
                            }
                        }

                        //If the media hasn't been found (I.E the alreadyfound bool is false) add it to the found list
                        if (!alreadyFound) {
                            found.push(medias[j])
                        }
                    }
                }
            }
            if (found.length >= 1) {
                return res.send(JSON.stringify(found, null, 5));
            } else {
                return res.send("No media found");
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

    //Loop through the list of media checking type
    //Takes in a list of media
    for(let i =0; i < media.length; i+=1){

        //If type is movie add it to the list
        if(media[i].type === "Movie"){
            movies.push(media[i]);
        }
    }
    return movies;
}

//Helper function to return all Games
//Takes in a list of media
function findGames(media){
    let games = [];

    //Loop though the list of media checking type
    for(let i =0; i < media.length; i+=1){
        if(media[i].type === "Game"){

            //If type is game add it to the list
            games.push(media[i]);
        }
    }
    return games;
}

//Helper function to update movie score
//Takes in the array of reviews and the score that was just added
function updateScore(array, newScore) {
    let totalScore = 0;

    //Loop though the array of reviews and add up the scores
    for(let i = 0; i < array.length; i+=1 ){
        totalScore += array[i].score;
    }

    //Get the data needed the calculate the average
    let size = array.length +=1;
    let total = totalScore + parseFloat(newScore);

    //Calculate the average of all the scores
    let final = Math.round(((total/size) * 100) / 100);
    return total;
}

//Helper function for random media picker
//Takes in array of media, will either be games or movie
function randomMovie(array) {

    //Pick random number between 0 and length of array
    let i = Math.floor((Math.random() * array.length));

    //Return the object at the random index
    return array[i];
}

//Helper function for getting total upvotes
function getTotalVotes(array){
    let totalVotes = 0;

    //Loop through the array and loop through the reviews of that media
    for(let i =0; i < array.length; i+=1){
        for(let j =0; j < array[j].reviews.length; j+=1){

            //Add number of upvotes to total
            totalVotes += array[i].reviews[j].upvotes
        }
    }
    return totalVotes
}


/*
function getByValue(array, id) {
    let result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
};
*/


module.exports = router;
