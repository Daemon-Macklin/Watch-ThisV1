# Watch-ThisV1
*By: Daemon Macklin*

*Student Number: 20075689*
#### Read me best veiwed on [Git Hub](https://github.com/Daemon-Macklin/Watch-ThisV1) or other markdown viewer

### Introduction
Watch-This is a web application that allows users to review 
movies and games.

### Functionality
##### Media:
Using Watch-This it is possible to add Movies and Games. They both use the same
schema as there isn't much of a difference in the data needed. What tells them
apart is the type field which will either be Movie or Game. This allows for
other types of media to potentially be added later on, but for now we will 
stick to adding movies and games. As well as adding games and movies it is also possible to remove them from
the site. 

##### Reviews:
Reviews can be added to both types of media. The review schema is embedded
into the media schema. I decided to use this design as an embedded approach
allows for easier access to a media's list of reviews as they are stored 
together. Like media it is possible to add and delete reviews but it is also
possible to upvote reviews. A review contains a written review as well as a score.
When a review is posted the score is taken and the average of all the user reviews
is calculated and stored in the medias rating field.

##### Searches:
There a number of ways to search though the media. It can be done by type, this 
will return the list of either movies or games depending on which is requested.
By rating, this will return a list or movies or games that have ratings over
what the user has requested. By genre, this will return a list of movies or 
games with the same genre the user has requested. Finally by Name, this will 
return a list of media with the same name as what the user requested. The search
by name function also uses a fuzzy search which will return media with the same
first few letters.

##### User support and Authentication
Watch this has multi user support. Allowing reviews and media to have a 
user associated with it. Users register by supplying a username, email and
password. The password is used to generate a hash, and a salt is randomly 
generated. The hash and salt are stored along with the username and 
email so that it is secure and no passwords are stored in plain text.
Users sign in with their email and password. If the email matches an email
stored in the mlab database the password is hashed with the users salt and if the 
new hash matches the hash which is stored in the database the users is allowed
to sign in.

### Persistence
Media, Reviews and Users and all stored in a Mongo noSQL database hosted on mlab.
There are two collections, media and users. Reviews are stored in media as a 
list with it's associated media object.

### Git Hub
Full project code with comprehensible commit history: 
https://github.com/Daemon-Macklin/Watch-ThisV1 
