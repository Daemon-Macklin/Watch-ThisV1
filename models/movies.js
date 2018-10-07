//{type : "Movie", title : "Finding Nemo", genre: "Animation", upvotes : 0 },
let mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
        type: {type: String, default: ""},
        title: {type: String, default: ""},
        genre: {type: String, default: ""},
        rating : {type: Number, default: 0},
        reviews : [{
            review : {type: String, default: ""},
            //userId : {type: String, default: ""},
            score : {type: Number, default: -1},
            upvotes : {type: Number, default: 0}
        }]
    },
    { collection: 'movies' });

module.exports = mongoose.model('Movie', MovieSchema);
