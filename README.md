# Watch-ThisV1
*By: Daemon Macklin*

*Student Number: 20075689*
#### Read me best veiwed on [Git Hub](https://github.com/Daemon-Macklin/Watch-ThisV1) or other markdown viewer

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
* Hash: This is basically a big goobldygoop number innit

##### Searches:
There a number of ways to search though the media. It can be done by type, this 
will return the list of either movies or games depending on which is requested.
By rating, this will return a list or movies or games that have ratings over
what the user has requested. By genre, this will return a list of movies or 
games with the same genre the user has requested. Finally by Name, this will 
return a list of media with the same name as what the user requested. The search
by name function also uses a fuzzy search which will return media with the same
first few letters.



### Persistence
Media, Reviews and Users and all stored in a Mongo noSQL database hosted on mlab.
There are two collections, media and users. Reviews are stored in media as a 
list with it's associated media object.

### Git Hub
Full project code with comprehensible commit history: 
https://github.com/Daemon-Macklin/Watch-ThisV1 
