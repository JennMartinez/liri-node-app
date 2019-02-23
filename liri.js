// Environment Variable //
var dotenv = require("dotenv").config();

// Load NPM Packages //
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var inquirer = require("inquirer");
console.log(Spotify);

// Variables and Keys //
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var user = process.argv[2];
var input = process.argv.slice(3).join(" ");
var defaultSong = "Ice Ice Baby";
var defaultMovie = "Hackers";


function random() {
switch (user) {
    case "BandsInTown":
        concerts(input);
        break;
    case "Spotify":
        songs(input);
        break;
    case "OMDB":
        movies(input);
        break;
    case "DoWhatItSays":
        itSays();
        break;
    default:
        console.log("Try Again!");
        break;
}
}

// Bands in town //
function concerts(input) {
    var queryURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"
    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var concertData = JSON.parse(body)[0];
            console.log(concertData);
            console.log("Venue: " + concertData.venue.name);
            console.log("Location: " + concertData.venue.city);
            var datetime = moment(concertData.venue.datetime);
            console.log("Date: " + datetime.format("L")); 
            };
        })
    } 

// Spotify //
function songs(input) {
    if (defaultSong == "") {
        defaultSong = "Ice Ice Baby";
    }
    spotify.search({ 
        type: "track", 
        query: input,
        limit: 3,
    },
    function(error, data) { 
        if (error) {
            console.log("Error: " + error);
            return;
        } else {
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("URL: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    });
}

// OMDB //
function movies(input) {
    if (defaultMovie == "") {
        defaultMovie = "Hackers";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);
            console.log(movieData);
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Released);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Rotten Tomatoes: " + movieData.Ratings[1].Value);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
        }
    });
}

// Do What It Says //
function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        } else {
            console.log(data);
        var dataArray = data.split(",");
        random(dataArray[0], dataArray[1]);
        }
    });
};


// Inquirer NPM //
inquirer.prompt([
    {
type: "list",
name: "answer",
message: "What would you like to do?",
choices: ["BandsInTown", "Spotify", "OMDB", "DoWhatItSays"],
    }  
]).then(function(response) {
switch(response.answer) {
    case "BandsInTown":
        concerts(input);
    break;
    case "Spotify":
        songs(input);
    break;
    case "OMDB":
        movies(input);
    break;
    case "DoWhatItSays":
        itSays();
    break;
    }  
});
