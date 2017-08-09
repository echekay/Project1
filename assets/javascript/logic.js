// Open Weather API
// ----------------
// Still have to utilize firebase to store and then retrieve the user's city input and then dynamically generate a div in which it says "7 Day forecast for (user input city)."

 // Initialize Firebase
var config = {
  apiKey: "AIzaSyDSe1Yr6EF9cTjLUKTEW420pNN75tUc9hk",
  authDomain: "project1-1d843.firebaseapp.com",
  databaseURL: "https://project1-1d843.firebaseio.com",
  projectId: "project1-1d843",
  storageBucket: "",
  messagingSenderId: "223740616436"
};

firebase.initializeApp(config);

var database = firebase.database();

var clickCounter = 0;


$( document ).ready(function() {

  $("#add-city").on("click", function() {

    event.preventDefault();
    $("#weatherWidget").empty();
    var userCity = $("#userInput").val().trim();
    console.log(userCity);

    clickCounter++;

    database.ref().set({
      clickCount: clickCounter
    })


      $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast/daily?",
      method: "GET",
      data: {
        q: userCity + ", US",
        cnt: 7,
        units: "imperial",
        appid: "166a433c57516f51dfab1f7edaed8413"
      }
      }).done(function(response) {

        console.log(response);
        var results = response.list;

        for (var i = 0; i < results.length; i++) {
          var unixDate = moment.unix(results[i].dt).format("dd D MMM");
          var dayDiv = $("<div>");
          dayDiv.attr("class", "dayDiv");
          var weatherDate = $("<p>" + unixDate + "</p>");
          var weatherImage = $("<img src='http://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png'>");
          var weatherDescription = $("<p>" + results[i].weather[0].description + "</p>");
          var weatherHigh = $("<p>" + results[i].temp.max + " &degF</p>");
          var weatherLow = $("<p>" + results[i].temp.min + " &degF</p>");
          var weatherHumidity = $("<p>" + results[i].humidity + " &#37</p>");
          dayDiv.append(weatherDate, weatherImage, weatherDescription, weatherHigh, weatherLow, weatherHumidity);
          $("#weatherWidget").append(dayDiv);
        }
      });


      $("#flickrGallery").empty();
      $.ajax({
        url: "https://api.flickr.com/services/rest/?",
        method: "GET",
        data: {
          method: "flickr.photos.search",
          tags: userCity,
          tag_mode: "any",
          api_key: "a63e0fedab4cffb4ac44817e1dad25bc",
          format: "json",
          nojsoncallback: "1",
          per_page: "9"
        }
      }).done(function(response) {
          // console.log(response);
          // var results = response.photos.photo;
          // console.log(results.length)
          // // Having trouble with this for loop. Trying to create a url by adding properties from the objects in the array. Keeps coming up as undefined values for each url component.
          // for (var i = 0; i < results.length; i++) {
          //   var flickrDiv = $("<div><p>Hi</p></div>");
          //   // var url = "https://farm" + [i].farm + ".staticflickr.com/" + [i].server + "/" + [i].id + "_" + [i].secret + ".jpg";
          //   // flickrDiv.append("<img src='" + url + "'/>");
          //   $("#flickrGallery").append(flickrDiv);
          // }
          $.each(response.photos.photo, function(i, gp) {
            var farmId = gp.farm;
            var serverId = gp.server;
            var id = gp.id;
            var secret = gp.secret;

            console.log(farmId + ',' + serverId + ',' + id + ',' + secret);
            $("#flickrGallery").append('<img src=https://farm' + farmId + '.staticflickr.com/' + serverId + '/' + id + '_' + secret + '.jpg"/>');
          })
        })

  });
});


