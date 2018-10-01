let movies = require('../models/movies');
let express = require('express');
let router = express.Router();

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(movies,null,5));
    res.json(movies);
};

router.findOne = (req, res) => {
const movie = getByValue(movies, req.params.id);
// Create a donation variable and use the helper function
// to find
// req.params.id
// in our donations array
if(movie!=null){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(movie,null,5));
    res.json(movie);
}else{
    res.json('Movie not found');
}
// Then either return the found donation
// or a suitable error message
};

router.addMovie = (req, res) => {
    //Add a new donation to our list
    var id = Math.floor((Math.random() * 1000000) + 1); //Randomly generate an id
    // parameters to store
    // id (for id)
    // req.body.paymenttype (for paymenttype)
    // req.body.amount (for amount)
    // 0 (for upvotes)
    const movie = {id : id, type : req.body.type, title: req.body.title, genre: req.body.genre,  upvotes: 0};
    var currentSize = movies.length;

    movies.push(movie);

    if((currentSize + 1) == movies.length)
        res.json({ message: 'Movie Added!'});
    else
        res.json({ message: 'Movie NOT Added!'});
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
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
};


module.exports = router;
