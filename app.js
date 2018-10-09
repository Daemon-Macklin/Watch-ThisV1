/**
 * Daemon Macklin
 *
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const movies = require('./routes/movies');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/movies', movies.addMovie);
app.get('/movies', movies.findAll);
app.get('/movies/getTotalVotes', movies.getAllVotes);
app.get('/movies/pickRandomMovie', movies.pickRandomMovie);
app.get('/movies/searchByGenre/:genre', movies.searchByGenre);
app.get('/movies/:id', movies.findOne);
app.get('/movies/searchByRating/:rating', movies.searchByRating);
app.delete('/movies/:id/removeMovie', movies.deleteMovie);
app.post('/movies/:id/addReview', movies.addReview);
app.delete('/movies/:id/removeReview/:reviewId', movies.deleteReview);
app.put('/movies/:id/upvoteReview/:reviewId', movies.incrementUpvotes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
