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
    appSong.displayLocation(metroLocation);
    console.log('appSong.getMatchingCities', metroLocation);
  });
}

appSong.getMetroId = function (metroID) {
  $.ajax ({
    url: 'http://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json',
    method: 'get',
    dataType: 'json',
    data: {
      q: metroID,
      apikey: 'hHSjLHKTmsfByvxU'
    }
  });
}


//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function() {
    $('.cities').hide();

  $('form').on('submit', function(e) {
    $('.cities').show();

    e.preventDefault();
    var usersLocation = $("input[type=radio]").val()
    appSong.getMatchingCities(usersLocation);
  });

} //appSong.usersLocation



//display matching cities and have user select the correct one 


//------ apparently line 20, the api call, returns a list of cities so we might not need this filtered loop

appSong.getLocations = function(locationResults){

  locationResults = locationResults.filter(function(locationLoop) {
      console.log('filters locations', locationLoop);
      return locationLoop
  });
  appSong.displayLocation(locationResults)

} //appSong.getLocations


//displays the dropdown with the cities that match what the user inputting
appSong.displayLocation = function (displayLocation){
  $('.citySelection').empty();

  displayLocation.forEach(function(locationChoice) {
    var $dropDownCity = $('<option>').text(locationChoice.city.displayName + ', ' + locationChoice.city.country.displayName).attr({value: locationChoice.metroAreaid})
    $('.cities').append($dropDownCity);

  });

  console.log('drop down cities', displayLocation)

}



//take the matching metro id and enter into getMetroID

//then display the concerts in that metro id
appSong.init = function() {
  appSong.usersLocation();
}

$(function() {
  appSong.init();
});