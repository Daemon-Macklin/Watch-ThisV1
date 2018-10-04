//{type : "Movie", title : "Finding Nemo", genre: "Animation", upvotes : 0 },
let mongoose = require('mongoose');

let MovieSchema = new mongoose.Schema({
        type: {type: String, default: ""},
        title: {type: String, default: ""},
        genre: {type: String, default: ""},
        upvotes: {type: Number, default: 0}
    },
    { collection: 'movies' });

module.exports = mongoose.model('Movie', MovieSchema);
