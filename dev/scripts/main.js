var appSong = {};

//returns list of cities that match query name
appSong.getMatchingCities = function (city) {
  $.ajax ({
    // console.log('appSong.getMetro', arguments);

    url: 'http://api.songkick.com/api/3.0/search/locations.json',
    method: 'GET',
    dataType: 'json',
    data: {
      query: city,
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(metroLocation) {
    metroLocation = metroLocation.resultsPage.results.location
    appSong.getLocations(metroLocation);
    console.log(metroLocation);
  });
}

// returns the metro ID of the user selected city
appSong.getMetroId = function (metroID) {
  $.ajax ({
    url: `http://api.songkick.com/api/3.0/metro_areas/${metroID}/calendar.json`,
    method: 'get',
    dataType: 'json',
    data: {
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(selectedLocation) {
    appSong.displayLocation(selectedLocation);
  });
}


//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function() {

  $('#searchLocation').on('submit', function(e) {
    e.preventDefault();
    var usersLocation = $("input[type=search]").val()
    appSong.getMatchingCities(usersLocation);
  });

} //appSong.usersLocation



//display matching cities and have user select the correct one 
appSong.getLocations = function(locationResults){

  locationResults = locationResults.filter(function(locationLoop) {
      console.log(locationLoop);
      return locationLoop
  });
  appSong.displayLocation(locationResults)

} //appSong.getLocations

appSong.displayLocation = function (selectedLocation){
  $('.citySelection').empty();

  var $dropDownCity = $('') 

}



//take the matching metro id and enter into getMetroID

//then display the concerts in that metro id
appSong.init = function() {
  appSong.usersLocation();
}

$(function() {
  appSong.init();
});