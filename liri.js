//reads and writes files
var fs = require("fs"); 
// Grabs the keys file and store it in a variable
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

//Grab the keys and requirements for Spotify
var spotifyKeysList = keys.spotifyKeys;
var spotify = new Spotify(spotifyKeysList);
//Grab the API key and requirements for OMDB
var omdbKeysList = keys.omdbKeys;
//Grab the twitter Keys
var twitterKeyList = keys.twitterKeys;
var client = new Twitter(twitterKeyList);

//Store the operand
var userInput = process.argv[2];
//Grab the user input to establish the specific search parameter for Spotify or OMDB (4th argument in terminal window)
var searchParameter = process.argv[3];

//Create an empty array to push search results into
var results = [];

// This switch-case will determine which function gets run.
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
//Function to display frist 20 tweets
function myTweets(){
  var params = {screen_name: 'MenelikFalc'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        results[i] = 
          "tweet #: " + (i+1) + "\r\n" +
          "created at: " + tweets[i].created_at + "\r\n" +
          "Tweets: " + tweets[i].text + "\r\n" +
          "------------------------------------------------------------------------------------------------------------------" + "\r\n";
      }
      // console.log("\r\n");
      console.log(results);
      writeToFile();
    }
    else {
      console.log(error);
    }
  });
};


//**********************************************************SPOTIFY************************************************************//
function spotifyThisSong() {
  if(!searchParameter){
    searchParameter = "The Sign, Ace of Base";
  }
  // params = searchParameter;
  spotify.search({ type: "track", query: searchParameter }, function(err, data) {
    if(!err){
      var songInfo = data.tracks.items;
          results =
          "-----------------------------------------------------------------------------------------------------------------------" + "\r\n" +
          "Artist: " + songInfo[0].artists[0].name + "\r\n" +
          "Song: " + songInfo[0].name + "\r\n" +
          "Preview Url: " + songInfo[0].preview_url + "\r\n" +
          "Album the song is from: " + songInfo[0].album.name + "\r\n" +
          "-----------------------------------------------------------------------------------------------------------------------" + "\r\n";
          console.log(results);
          writeToFile();
    } else {
      return console.log("Error :"+ err);
    }
  });
};


//************************************************************OMDB**************************************************************//
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


//******************************************************NO USER INPUT***********************************************************//
// Create a function that grabs value from random.txt, format it, and plug it in spotifyThisSong function 
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data){
    if (!error) {
      var output = data.split(",");
      console.log(output);
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



