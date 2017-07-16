//reads and writes files
var fs = require("fs"); 
// Grabs the keys file and store it in a variable
var liri = require("./keys.js");
//Store the operand
var userInput = process.argv[2];

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

  default: 
    // console.log("\r\n" +"Try typing one of the following commands after 'node liri.js' : " +"\r\n"+
    //   "1. my-tweets 'any twitter name' " +"\r\n"+
    //   "2. spotify-this-song 'any song name' "+"\r\n"+
    //   "3. movie-this 'any movie name' "+"\r\n"+
    //   "4. do-what-it-says."+"\r\n"+
    //   "Be sure to put the movie or song name in quotation marks if it's more than one word.");
    break;
}

//**********************************************************TWITTER*************************************************************//
//Function to display frist 20 tweets
function myTweets(){
  //Grab the twitter Keys
  var twitterKeyList = liri.twitterKeys;
  var Twitter = require('twitter');
  var client = new Twitter(twitterKeyList);
  var params = {screen_name: 'MenelikFalc'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
          'tweet #: ' : i+1,
          'created at: ' : tweets[i].created_at,
          'Tweets: ' : tweets[i].text,
          '------------------------------------------------------------------------------------------------------------------':''
        });
      }
      console.log(data);
    }
    else {
      console.log(error);
    }
  });
};


//**********************************************************SPOTIFY************************************************************//
function spotifyThisSong() {
  //Grab the spotify keys
  var spotifyKeysList = liri.spotifyKeys;

  var Spotify = require('node-spotify-api');
  var songName = process.argv[3];
  var spotify = new Spotify(spotifyKeysList);
  if(!songName){
    songName = "The Sign, Ace of Base";
  }
  params = songName;
  spotify.search({ type: "track", query: params }, function(err, data) {
    if(!err){
      var songInfo = data.tracks.items;
          var spotifyResults =
          "-----------------------------------------------------------------------------------------------------------------------" + "\r\n" +
          "Artist: " + songInfo[0].artists[0].name + "\r\n" +
          "Song: " + songInfo[0].name + "\r\n" +
          "Preview Url: " + songInfo[0].preview_url + "\r\n" +
          "Album the song is from: " + songInfo[0].album.name + "\r\n" +
          "-----------------------------------------------------------------------------------------------------------------------"
          console.log(spotifyResults);
    } else {
      return console.log("Error :"+ err);
    }
  });
};


//************************************************************OMDB**************************************************************//
function movieThis(){
  //Grab the OMDB API key
  var omdbKeysList = liri.omdbKeys;
  var request = require('request');
  var movie = process.argv[3];
  if(!movie){
    movie = "Mr. Nobody";
  }
  params = movie
  request("http://www.omdbapi.com/?apikey=40e9cece&t=" + params, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieObject = JSON.parse(body);
      var movieResults =
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
      console.log(movieResults);
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
      spotifyThisSong(output[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
};


function log(logResults) {
  fs.appendFile("log.txt", logResults, (error) => {
    if(error) {
      throw error;
    }
  });
}


