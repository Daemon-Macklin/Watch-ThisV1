# Watch-ThisV1
*By: Daemon Macklin*

*Student Number: 20075689*
#### Read me best veiwed on [Git Hub](https://github.com/Daemon-Macklin/Watch-ThisV1) or other markdown viewer
#### Server hosted [here](https://watch-thisv1.herokuapp.com/)

### Introduction
Watch-This is a web application that allows users to review 
movies and games.

### Functionality and DX 
##### Media:
Using Watch-This it is possible to add Movies and Games. They both use the same
schema as there isn't much of a difference in the data needed. What tells them
apart is the type field which will either be Movie or Game. This allows for
other types of media to potentially be added later on, but for now we will 
stick to adding movies and games. As well as adding games and movies it is
also possible to remove them from the site. In media there is:

* Type: Defines if a Media is a Movie or a Game.
* Title: The title of the Media.   
* Genre: What genre the Media is in.
* User Id: This refers to the unique ID of the user that uploaded the Media.
* Youtube Link: A link to the trailer of the Media to be embedded into the front end.
* Rating: Rating is the average of all the user scores in the reviews.
* Review: Review is a list of user submitted reviews. Reviews is it's own object embedded into the Media schema

##### Reviews:
Reviews can be added to both types of media. The review schema is embedded
into the media schema. I decided to use this design as an embedded approach
allows for easier access to a media's list of reviews as they are stored 
together. Like media it is possible to add and delete reviews but it is also
possible to upvote reviews. A review contains:

* Review: This is the written review.
* Score: This is a score between 0-5.
* User Id: This refers to the unique ID of the user that uploaded the Review.
* Upvotes: This is the number of upvotes that 

##### User support and Authentication
Watch this has multi user support. Allowing reviews and media to have a 
user associated with it. Users register by supplying a username, email and
password. The password is used to generate a hash, and a salt is randomly 
generated. The hash and salt are stored along with the username and 
email so that it is secure and no passwords are stored in plain text.
Users sign in with their email and password. If the email matches an email
stored in the mlab database the password is hashed with the users salt and if the 
new hash matches the hash which is stored in the database the users is allowed
to sign in. The User model contains:

* Email: This is the email of the user.
* UserName: This is the UserName of the password.
* Salt: This is a randomly generated 16 bit salt used to randomize the password. 
* Hash: This is the result of sending the user supplied password and the salt though
a sha512 cryptographic hash function the result is a 128-digit hexadecimal number.

##### Searches:
There a number of ways to search though the media. It can be done by type, this 
will return the list of either movies or games depending on which is requested.
By rating, this will return a list or movies or games that have ratings over
what the user has requested. By genre, this will return a list of movies or 
games with the same genre the user has requested. Finally by Name, this will 
return a list of media with the same name as what the user requested. The search
by name function also uses a fuzzy search which will return media with the same
first few letters.

### Routes

##### Get
```app.get('/media', media.findAll);```
This returns all of the media stored in the mongo database.


```app.get('/user', usersRouter.findAll);```
This returns all of the users stored in the mongo database.


```app.get('/media/findUserMedia/:userId', media.searchMediaByUser);```
This returns all of the media stored in the database uploaded by a specific user.



```app.get('/media/findUserReview/:userId', media.searchReviewByUser);```
This returns all of the reviews stored in the database uploaded by a specific user.


```app.get('/media/getTotalVotes', media.getAllVotes);```
This returns the total number of upvotes given to all reviews.


```app.get('/media/searchByType/:type', media.findAllType);```
This returns all the Media of a specific type. i.e Movie or Game.


```app.get('/media/:type/pickRandomMedia', media.pickRandomMedia);```
This will return a randomly picked media. Either a movie or game based on the 
type field.
 

```app.get('/media/searchByGenre/:genre', media.searchByGenre);```
This returns all the Media of a specific genre. i.e Action, Comedy.


```app.get('/media/searchByTitle/:title', media.searchByTitle);```
This returns all the Media of a specific title. or with a similar title.


```app.get('/media/:id', media.findOne);```
This returns a Media with the specific id.


```app.get('/media/searchByRating/:rating', media.searchByRating);```
This returns all media over a specific rating.


##### Put
```app.put('/media/:id/upvoteReview/:reviewId', media.incrementUpvotes);```
This adds one to the upvote field in a review.


```app.put('/user/:userId/updateUserName', usersRouter.updateUserName);```
This will update a users userName.


```app.put('/media/:id/updateTitle', media.updateTitle);```
This will update th title of a media


##### Post 
```app.post('/user', usersRouter.addUser);```
This adds a user to the database.

```app.post('/media', media.addMedia);```
This adds a media to the database.

```app.post('/media/:id/addReview', media.addReview);```
This adds a review to a media in the database.

```app.post('/user/signin', usersRouter.signIn);```
This will sign in a user if the correct credentials are supplied.


##### Delete
```app.delete('/media/:id/removeMedia', media.deleteMedia);```
This will remove a Media from the database.


```app.delete('/user/removeUser/:userId', usersRouter.deleteUser);```
This will remove a user from the database.


```app.delete('/media/:id/removeReview/:reviewId', media.deleteReview);```
This will remove a review from a media in the database.


### Persistence
Media, Reviews and Users and all stored in a Mongo noSQL database hosted on mlab.
There are two collections, media and users.

### Git Hub
Full project code with comprehensible commit history: 
https://github.com/Daemon-Macklin/Watch-ThisV1 

### References

##### Project Scaffolding
 Used node.js and webpack for project scaffolding.
 Followed [David Drohan's labs](https://ddrohan.github.io/wit-wad-2-2018/index.html) for basic RESTful functionality
 and setting up Mongo and Mlab support and deployment. 
 
 ##### Authentication Users
 Used [Json Web Token](https://jwt.io/) and [Crypto](https://www.npmjs.com/package/crypto-js) modules to encrypt passwords and generate tokens.
 Planning to use passport.js for token management. Followed [this tutorial](https://medium.freecodecamp.org/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e)
 for user authentication and user schema.  
 
 ##### Deployment
 Using [heroku](https://www.heroku.com/) to host server
 Server hosted [here](https://watch-thisv1.herokuapp.com/)
  
 
 