// Require and store the "fs" node package to be able to read, and write files
var fs = require("fs"); 

// Require and store the keys file
var keys = require("./keys.js");

// Require and store all the necessary node packages
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

// Grab the Twitter Key values and set them into their method
var myTwitterKeys = keys.twitterKeys;
var client = new Twitter(myTwitterKeys);

// Grab the Spotify key values and set them into their method
var mySpotifyKeys = keys.spotifyKeys;
var spotify = new Spotify(mySpotifyKeys);

// Grab the API key for OMDB
var myOmdbKey = keys.omdbKeys;

// Store the third argument (command at index #2) from the user's input
var userInput = process.argv[2];

// Grab the fourth argument to establish the specific search parameter for Spotify or OMDB (4th argument in terminal window - index #3)
var searchParameter = process.argv[3];

// Create an empty array to push search results into (this will eventually be appended to the log.txt file)
var results = [];

// This switch-case will determine which function gets run based on the user's input (third parameter - index #2).
switch (userInput) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
}


//**********************************************************TWITTER*************************************************************//
// Function to display first 20 tweets from a specific account
function myTweets() {
  var params = {screen_name: 'MenelikFalc'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for (var i = 0; i < tweets.length; i++) {
        console.log(
          results[i] = 
            "----------------------------------------------------------------------------------------------------------------------------------------------" + "\r\n" +
            "tweet #: " + (i+1) + "\r\n" +
            "created by: " + tweets[i].user.name + "\r\n" +
            "created at: " + tweets[i].created_at + "\r\n" +
            "Tweets: " + tweets[i].text + "\r\n" +
            "----------------------------------------------------------------------------------------------------------------------------------------------" + "\r\n");
      }
      appendToFile();
    } else {
      console.log(error);
    }
  });
};


//**********************************************************SPOTIFY************************************************************//
// Function to search for a particular song and display certain properties of that song, or "The sign by Ace of Base" will be the default parameter if no search parameters have been entered.
function spotifyThisSong() {
  if(!searchParameter) {
    searchParameter = "The Sign, Ace of Base";
  }
  // params = searchParameter;
  spotify.search({ type: "track", query: searchParameter }, function(err, data) {
    if(!err) {
      var songObject = data.tracks.items[0];
          results =
          "-------------------------------------------------------------------------------------------------------------------------" + "\r\n" +
          "Artist: " + songObject.artists[0].name + "\r\n" +
          "Song: " + songObject.name + "\r\n" +
          "Preview Url: " + songObject.preview_url + "\r\n" +
          "Album that the song is from: " + songObject.album.name + "\r\n" +
          "-------------------------------------------------------------------------------------------------------------------------" + "\r\n";
          console.log(results);
          appendToFile();
    } else {
      console.log("Error occurred :"+ err);
      return; 
    }
  });
};


//************************************************************OMDB**************************************************************//
//Function to search for a particular movie and display certain properties of that movie, or "Mr. Nobody" will be the default parameter if no search parameters have been entered.
function movieThis() {
  if(!searchParameter) {
    searchParameter = "Mr. Nobody";
  }
  // params = searchParameter;
  request("http://www.omdbapi.com/?&apikey="+ myOmdbKey.API_key + "&t=" + searchParameter + "&tomatoes=true&r=json", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieObject = JSON.parse(body);
      // console.log(movieObject);
      results =
      "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------" + "\r\n" +
      "Title: " + movieObject.Title + "\r\n" +
      "Year: " + movieObject.Year + "\r\n" +
      "Imdb Rating: " + movieObject.imdbRating + "\r\n" +
      "Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
      "Country: " + movieObject.Country + "\r\n" +
      "Language: " + movieObject.Language + "\r\n" +
      "Plot: " + movieObject.Plot + "\r\n" +
      "Actors: " + movieObject.Actors + "\r\n" +
      "-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------" + "\r\n";
      console.log(results);
      appendToFile();
    } else {
      return console.log("Error :"+ error);
    }
  });
};


//******************************************************DO WHAT IT SAYS***********************************************************//
// Create a function that grabs value from random.txt, format it, and plug it in spotifyThisSong function 
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data){
    if (!error) {
      var output = data.split(",");
      searchParameter = output[1];
      spotifyThisSong();
      appendToFile();
    } else {
      console.log("Error occurred" + error);
    }
  });
};


//***********************************************APPEND RESULTS TO log.txt******************************************************//
// This function grabs the "results" value from each search performed, and appends it to our log.txt file 
function appendToFile() {
  fs.appendFile("log.txt", results + "\r\n", function(err) {
    if (err) {
      return console.log(err);
    }
  });
}



