var appSong = {};

appSong.city = '';
appSong.state = '';
appSong.country = '';

//this is the start of everything
//STEP 1
//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function(city) {
    $('.cities').hide();

  $('.locationInput').on('submit', function(e) {
    $('.cities').show();
    e.preventDefault();
    var location = $('#autocomplete').val();
    //take the location that the user entered and split into an array
    location = location.split(', ')

    console.log(location)
    
    //assigning the answers to different objects
    appSong.city = location[0]
    appSong.state = location[1]
    appSong.country = location[2]
    
    appSong.getMatchingCities(appSong.city);

  });

} //appSong.usersLocation


//STEP 1A autocomplete the input for city selection
appSong.getLocations = function(){
 var autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')),
     {types: ['geocode']});
 console.log("testing", autocomplete)

} //appSong.getLocations


//STEP 2
//returns list of cities that match query name
appSong.getMatchingCities = function(city) {
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
    appSong.matchLocations(metroLocation);
    console.log('appSong.getMatchingCities', metroLocation);
  });
}


//STEP 3
appSong.matchLocations = function(matchLocations) {

  console.log('matchLocations', matchLocations)

  for(var i = 0; i <= matchLocations.length; i = i + 1){

    if (appSong.city === matchLocations[i].city.displayName && appSong.country === matchLocations[i].city.country.displayName) {
      var metroID = matchLocations[i].metroArea.id
      
      appSong.getMetroId(metroID)
      return false;
    } else {
      alert("TEST!");
      return false;
    }
  }
} 

//STEP 4
// returns the metro ID of the user selected city
appSong.getMetroId = function(metroID) {
  console.log('appSong.getMetroId', metroID)
  $.ajax ({
    url: `http://api.songkick.com/api/3.0/metro_areas/${metroID}/calendar.json`,
    method: 'get',
    dataType: 'json',
    data: {
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(bandReturn) {
    bandReturn = bandReturn.resultsPage.results.event
    appSong.displayConcerts(bandReturn)
    console.log('return bands playing', bandReturn)
  });
}


//STEP 5
appSong.findConcerts = function(findConcerts) {
// find concerts that are in the same metroID area as was indicated based on above
  $('.cities').on('submit', function(e) {
    e.preventDefault();
    // when the user submits the location (the 'specific Toronto', take the value of the radio button
    //put it into the metroID search to return concert listings within that area
    var usersMetroId = $("input[type=radio]").val()
    console.log("users metroID", usersMetroId)
    appSong.getMetroId(usersMetroId);
  });
}


//STEP 6
appSong.displayConcerts = function(concertsPlaying) {
//take the concert results and display the concert name and bands involved at the concert
  concertsPlaying.forEach(function(concertInfo) {

    var $concertResults = $('<article>').addClass('concertResults')
    var $concertName = $('<h2>').text(concertInfo.displayName)
    
    $concertResults.append($concertName)

    var $bandFilter = concertInfo.performance

      $bandFilter.forEach(function(bandFilter) {
        var $bandNames = $('<input>').attr({
            value: bandFilter.displayName,
            name: "bandNames",
            type: "radio",
            id: bandFilter.displayName
          });
        var $bandLabel = $('<label>').text(bandFilter.displayName).attr({
            for: bandFilter.displayName
          });

        $concertResults.append($bandNames, $bandLabel)

      })

    $('.theConcerts').append($concertResults)

  });

  appSong.matchBands(concertsPlaying)

}

//STEP 7 - take band picked
appSong.matchBands = function(matchBands) {

  $('.theConcerts').on('submit', function(e) {
    e.preventDefault();
    var bandPicked = $('input[type=radio]:checked').val()

    appSong.getSpotify(bandPicked)
    console.log('bandPicked', bandPicked)
  });



} //appSong.matchBands

//STEP 8 - match bands to spotify
appSong.getSpotify = function(artisit) {
  $.ajax ({
    url: 'https://api.spotify.com/v1/search',
    method: 'GET',
    dataType: 'json',
    data: {
      client_id: 'd3dc1222c5184993bddad0fa6b53fbf4',
      client_secret: 'c6461a15139446c6aea0b5854cd1f8ce',
      q: artisit,
      type: 'playlist',
      limit: 3
    }
  }).then(function(playlists) {
    playlists = playlists.playlists.items
    console.log('Spotfiy', playlists)
    appSong.displayPlaylist(playlists)
  });
} //appSong.getSpotify

//STEP 9 - display playlist 
appSong.displayPlaylist = function(displayPlaylist) {

  displayPlaylist.forEach(function(showingPlaylists) {
    var $playlistsDivs = $('<div>').addClass('allPlaylists');
    var $playlistResult = $('<article>').addClass('playlist');

    $playlistsDivs.append($playlistResult);

    for(var i = 1; i <= showingPlaylists.length; i = i + 1){
      var $playlistAlbum = $('<img>').attr('src', showingPlaylists.images[1].url);
      var $actualPlaylist = $('<div>').text(showingPlaylists.tracks.href);

      $playlistResult.append($playlistAlbum, $actualPlaylist)   
    }

    $('.spotifyResults').append($playlistsDivs)

  })

} //displayPlaylist


//then display the concerts in that metro id
appSong.init = function() {
  appSong.getLocations();
  appSong.usersLocation();
}

$(function() {
  appSong.init()
  //hide everything except for the heading and the slogan
  $('.search').hide();
  //$('.bandSelection').hide();
  //$('.spotifyResults').hide();

  //on click of the startBtn, hide the header page and show the search page
  $('.startBtn').on('click', function(){
    $('.titlePage').fadeOut();
    $('.search').fadeIn();
  })
});

