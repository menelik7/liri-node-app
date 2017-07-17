//Require the "fs" node package to be able to read, and write files
var fs = require("fs"); 

//Require the keys file and store it in a variable
var keys = require("./keys.js");

//Store all the necessary requirements
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

//Grab the twitter Key values and set them into their method
var twitterKeyList = keys.twitterKeys;
var client = new Twitter(twitterKeyList);

//Grab the key values for Spotify and set them into their method
var spotifyKeysList = keys.spotifyKeys;
var spotify = new Spotify(spotifyKeysList);

//Grab the API key for OMDB
var omdbKeysList = keys.omdbKeys;

//Store the third argument (index #2) inputed by the user
var userInput = process.argv[2];

//Grab the user input to establish the specific search parameter for Spotify or OMDB (4th argument in terminal window - index #3)
var searchParameter = process.argv[3];

//Create an empty array to push search results into (this will be eventually appended to the log.txt file)
var results = [];

//This switch-case will determine which function gets run based on the user's input (third parameter - index #2).
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
//Function to display first 20 tweets
function myTweets(){
  var params = {screen_name: 'MenelikFalc'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for (var i = 0; i < tweets.length; i++) {
        console.log(
          results[i] = 
            "------------------------------------------------" + "\r\n" +
            "tweet #: " + (i+1) + "\r\n" +
            "created by: " + tweets[i].user.name + "\r\n" +
            "created at: " + tweets[i].created_at + "\r\n" +
            "Tweets: " + tweets[i].text + "\r\n" +
            "------------------------------------------------" + "\r\n");
      }
      writeToFile();
    }
    else {
      console.log(error);
    }
  });
};


//**********************************************************SPOTIFY************************************************************//
//Function to search for a particular song and display certain properties of that song, or choose "The sign by Ace of Base" if no search parameters have been entered.
function spotifyThisSong() {
  if(!searchParameter){
    searchParameter = "The Sign, Ace of Base";
  }
  // params = searchParameter;
  spotify.search({ type: "track", query: searchParameter }, function(err, data) {
    if(!err){
      var songInfo = data.tracks.items;
          results =
          "-------------------------------------------------------------------------------------------------------------------------" + "\r\n" +
          "Artist: " + songInfo[0].artists[0].name + "\r\n" +
          "Song: " + songInfo[0].name + "\r\n" +
          "Preview Url: " + songInfo[0].preview_url + "\r\n" +
          "Album the song is from: " + songInfo[0].album.name + "\r\n" +
          "-------------------------------------------------------------------------------------------------------------------------" + "\r\n";
          console.log(results);
          writeToFile();
    } else {
      return console.log("Error :"+ err);
    }
  });
};


//************************************************************OMDB**************************************************************//
//Function to search for a particular movie and display certain properties of that movie, or choose "Mr. Nobody" if no search parameters have been entered.
function movieThis(){
  if(!searchParameter){
    searchParameter = "Mr. Nobody";
  }
  // params = searchParameter;
  request("http://www.omdbapi.com/?&tomatoes=true&r=json&apikey="+ omdbKeysList.API_key + "&t=" + searchParameter, function (error, response, body) {
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
      writeToFile();
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
      writeToFile();
    } else {
      console.log("Error occurred" + error);
    }
  });
};


//***********************************************WRITE RESULTS TO log.txt******************************************************//
// This function grabs the "results" value from each search performed, and writes it to our log.txt file 
function writeToFile() {
  fs.appendFile("log.txt", results + "\r\n", function(err) {
    if (err) {
      return console.log(err);
    }
  });
}



