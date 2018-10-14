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
const media = require('./routes/media');
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
app.post('/user', usersRouter.addUser);
app.post('/media', media.addMedia);
app.get('/media', media.findAll);
app.post('/user/signin', usersRouter.signIn);
app.get('/media/getTotalVotes', media.getAllVotes);
app.get('/media/searchByType/:type', media.findAllType);
app.get('/media/:type/pickRandomMedia', media.pickRandomMedia);
app.get('/media/searchByGenre/:genre', media.searchByGenre);
app.get('/media/searchByTitle/:title', media.searchByTitle);
app.get('/media/:id', media.findOne);
app.get('/media/searchByRating/:rating', media.searchByRating);
app.delete('/media/:id/removeMedia', media.deleteMedia);
app.post('/media/:id/addReview', media.addReview);
app.delete('/media/:id/removeReview/:reviewId', media.deleteReview);
app.put('/media/:id/upvoteReview/:reviewId', media.incrementUpvotes);


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
