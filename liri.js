require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var keys = require('./keys.js');
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

var input = process.argv[2];

switch(input){

    case "spotify-this-song":
    spotifyThis();
    break;

    case "concert-this":
    concertThis();
    break;


    case "movie-this":
    movieThis();
    break;

    case "do-what-it-says":
    doSays();
    break;
}

function spotifyThis(){
            var input2 = process.argv.slice(3).join(" "); 
            if (input2 === "") {
              input2 = "The Sign";

            }
            spotify.search({ type: 'track', query: input2 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
              for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Song: " + data.tracks.items[i].name);
                console.log("Album: " + data.tracks.items[i].album.name );
                console.log("Spotify Link: " + data.tracks.items[i].external_urls.spotify+ "\n");
              }
          });
}

function concertThis(){
    var input2 = process.argv.slice(3).join(" ");
    axios.get("https://rest.bandsintown.com/artists/" + input2 + "/events?app_id=codingbootcamp").then(
      function(response) {
            console.log("Upcoming Concerts For: " + input2 + "\n");
            for (var i = 0; i < response.data.length; i++) {
              console.log("Venue Name: " + response.data[i].venue.name + "\n" + "Location: " + response.data[i].venue.city + "," + response.data[i].venue.country);
              console.log("Date: " + moment(response.data[i].datetime).format("MM-DD-YYYY") + "\n"); //moment.js

            }
      }
    )
}

function movieThis(){
    var input2 = process.argv.slice(3).join(" ");
    if (input2 === "") {
      input2 = "Mr. Nobody";

      axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + input2).then(

        function(response) {

                console.log('If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/' + "\n" + "It's on Netflix!");
        }
      )
    }

    else{
            axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + input2).then(
                  function(response) {
                        console.log("Title: " + response.data.Title);
                        console.log("Year of Release: " + response.data.Year);
                        for(var i =0; i <response.data.Ratings.length;i++){
                            if(response.data.Ratings[i].Source === 'Rotten Tomatoes'){
                              console.log("Rotten Tomatoes: " + response.data.Ratings[i].Value); // to get Rotten Tomatoes Rating
                            }
                        }
                        console.log("IMDB Rating: " + response.data.imdbRating);
                        console.log("Country of Production: " + response.data.imdbRating);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors in Movie: " + response.data.Actors);
                  }
            )
  }
}

function doSays(){
          var arrayThis = [];
          var temp;
  fs.readFile('./random.txt', 'utf8', function(err, contents) {
            var temp = contents.split(",");
            temp.forEach(function(element){
            arrayThis.push(element);
            });
            process.argv[2] = arrayThis[0];
            process.argv[3] = encodeURIComponent(arrayThis[1]);
            if(process.argv[2] === "spotify-this-song"){   
                process.argv[3] = encodeURIComponent(arrayThis[1]);
                  spotifyThis();
            }
             if(process.argv[2] === "movie-this"){
                  movieThis();

            }
           if(process.argv[2] === "concert-this"){
             process.argv[3] = arrayThis[1];

                  concertThis();
            }


      });
}
