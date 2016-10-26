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
    //gives appSong.displayLocation the results
    appSong.displayLocation(metroLocation);
    console.log('appSong.getMatchingCities', metroLocation);
  });
}


appSong.getMetroId = function (metroID) {
  $.ajax ({
    url: `http://api.songkick.com/api/3.0/metro_areas/${metroID}/calendar.json`,
    method: 'get',
    dataType: 'json',
    data: {
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(bandReturn) {
    bandReturn = bandReturn
    console.log(bandReturn)
  });
}


//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function() {
    $('.cities').hide();

  $('.locationInput').on('submit', function(e) {
    $('.cities').show();

    e.preventDefault();
    var usersLocation = $("input[type=search]").val()
    appSong.getMatchingCities(usersLocation);
  });

} //appSong.usersLocation


//------ apparently line 20, the api call, returns a list of cities so we might not need this filtered loop

// appSong.getLocations = function(locationResults){

//   locationResults = locationResults.filter(function(locationLoop) {
//       console.log('filters locations', locationLoop);
//       return locationLoop
//   });
//   appSong.displayLocation(locationResults)

// } //appSong.getLocations


//display matching cities and have user select the correct one 
//displays the cities that match what the user inputting
appSong.displayLocation = function(displayLocation) {
  //$('.cities').empty();

//creates the radio buttons
//take the results of what they've inputted and use it to find the metroID
//creates a radio button for each possible result based on the name of the location

  displayLocation.forEach(function(locationChoice) {
    var $radioButtonsCity = $('<input>').attr({
      value: locationChoice.metroArea.id, 
      name: "locationChoice", 
      type: "radio",
      id: locationChoice.metroArea.id
    })
    var $radioLabel = $('<label>').text(locationChoice.city.displayName + ', ' + locationChoice.city.country.displayName).attr({
      for: locationChoice.metroArea.id
    })
// appends the options to the page in the form of radio buttons
    $('.cities').append($radioButtonsCity, $radioLabel);

  });

  console.log('drop down cities', displayLocation)
// takes the results from the location search and passes it along to the concert search
  appSong.findConcerts(displayLocation)

}


// find concerts that are in the same metroID area as was indicated based on above
appSong.findConcerts = function(findConcerts) {
  $('.cities').on('submit', function(e) {
    e.preventDefault();
    // when the user submits the location (the 'specific Toronto', take the value of the radio button
    //put it into the metroID search to return concert listings within that area
    var usersMetroId = $("input[type=radio]").val()
    console.log("users metroID", usersMetroId)
    appSong.getMetroId(usersMetroId);
  });
}



//take the matching metro id and enter into getMetroID

//then display the concerts in that metro id
appSong.init = function() {
  appSong.usersLocation();
}

$(function() {
  appSong.init();
});