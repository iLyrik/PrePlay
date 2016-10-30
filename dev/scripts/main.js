var appSong = {};

appSong.city = '';
appSong.state = '';
appSong.country = '';

appSong.locationPicked = '';
appSong.bandPicked = '';

//this is the start of everything
//STEP 1
//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function (city) {
  //console.log('usersLocation', city)
  $('.cities').hide();

  $('.locationInput').on('submit', function(e) {
    // load screen
    $('#loadScreen').show();
    $('.cities').show();
    $('.cities').ready(function() {
      $('#loadScreen').delay(1000).fadeOut();
    });

    e.preventDefault();
    //move from the search section to the concerts section using fade
    $('.search').fadeOut();
    $('.bandSelection').fadeIn();
    appSong.locationPicked = $('#autocomplete').val();
    //take the location that the user entered and split into an array
    appSong.locationPicked = appSong.locationPicked.split(', ');

    //assigning the answers to different objects

    if (appSong.locationPicked.length === 3) {
      appSong.city = appSong.locationPicked[0];
      appSong.state = appSong.locationPicked[1];
      appSong.country = appSong.locationPicked[2];

      appSong.getMatchingCities(appSong.city);
    } else if (appSong.locationPicked.length === 2) {
      appSong.city = appSong.locationPicked[0];
      appSong.country = appSong.locationPicked[1];

      appSong.getMatchingCities(appSong.city);
    }
  });
}; //appSong.usersLocation


//STEP 1A autocomplete the input for city selection
appSong.getLocations = function () {
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), { types: ['geocode'] });
}; //appSong.getLocations


//STEP 2
//returns list of cities that match query name
appSong.getMatchingCities = function (city) {
  //console.log('getMatchingCities', city)
  $.ajax({
    // console.log('appSong.getMetro', arguments);
    url: 'http://api.songkick.com/api/3.0/search/locations.json',
    method: 'GET',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      query: city,
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function (metroLocation) {
    metroLocation = metroLocation.resultsPage.results.location;
    //gives appSong.matchLocation the results
    appSong.matchLocations(metroLocation);
    //console.log('appSong.getMatchingCities', metroLocation);
  });
};

//STEP 3
appSong.matchLocations = function (matchLocations) {

  console.log('matchLocations', matchLocations)

  for (var i = 0; i <= matchLocations.length; i = i + 1) {

    if (appSong.city === matchLocations[i].city.displayName && appSong.country === matchLocations[i].city.country.displayName) {
      var metroID = matchLocations[i].metroArea.id;

  //call more than one page to show more results for larger cities
      $.when(
        appSong.getConcerts(metroID,1),
        appSong.getConcerts(metroID,2),
        appSong.getConcerts(metroID,3)
      ).then(function(results1,results2,results3) {
        var bandReturn = [].concat(results1[0].resultsPage.results.event).concat(results2[0].resultsPage.results.event).concat(results3[0].resultsPage.results.event);
        appSong.displayConcerts(bandReturn);
        //console.log('return bands playing', bandReturn)
        
      });

      return false;
    }
  }
};


//STEP 4

// returns the concerts for the matching metro ID of the user selected city
appSong.getConcerts = function(metroID,pageNumber) {
  return $.ajax({
    url: 'http://api.songkick.com/api/3.0/metro_areas/' + metroID + '/calendar.json',
    method: 'get',
    dataType: 'jsonp',
    jsonp: 'jsoncallback',
    data: {
      page: pageNumber,
      apikey: 'hHSjLHKTmsfByvxU'
    }
  });
}


//STEP 5
appSong.displayConcerts = function(concertsPlaying) {
  //take the concert results and display the concert name and bands involved at the concert
//  console.log('displayConcerts',concertsPlaying)
  if (concertsPlaying.length != 0){

      //var $locationPicked = $('<h2>').text(appSong.city + ", " + appSong.country);
      
      var $howToUse = $('<h2>').text('Here is a list of concerts near you in the next 7 days. Click on a band name to see related playlists!')
      $('.theConcerts').append($howToUse);
      
      //show only the next 7 days of concerts
      //take the current date
      var today = new Date();
      
      //and add 7 days
      var oneWeek = today.setDate(today.getDate() + 7);
      // console.log('1 week', oneWeek)
      //only show those concerts with date in 7 days (compared to the date of the concert) 
     
    //loop through all the concerts
    concertsPlaying.forEach(function(concertInfo) {
      if (concertInfo) { 

      //grab the date of each concert
        var concertDate = +(new Date(concertInfo.start.date))
      //compare that date to the one week date 
        if (concertDate < oneWeek) {
          
          var $concertResults = $('<article>').addClass('concertResults');
          var $concertName = $('<h3>').text(concertInfo.displayName);
          var $bandLists = $('<div>').addClass('bandButtons');
          
          $concertResults.append($concertName, $bandLists);

          var $bandFilter = concertInfo.performance;

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

            $bandLists.append($bandNames, $bandLabel);

          })
          $('.theConcerts').append($concertResults); 
        }
      } 
    });
      
  } else if (concertsPlaying.length === 0) {
    $('.noconcertsresults').fadeIn();
  }

  appSong.matchBands(concertsPlaying)

}

//STEP 6 - take band picked
appSong.matchBands = function (matchBands) {
//console.log('appSong.matchBands', matchBands)
  $('.theConcerts').on('submit', function (e) {
    e.preventDefault();
    appSong.bandPicked = $('input[type=radio]:checked').val();

    appSong.getSpotify(appSong.bandPicked);
    //console.log('bandPicked', appSong.bandPicked)
    $('.bandSelection').hide();

    // show loading screen, then remove loading screen when iframes are loaded
    $('#loadScreen').show();
    $('.spotifyResults').show();

    $('.lists').ready(function() {
      $('#loadScreen').delay(1500).fadeOut(2000);
    });
  });
}; //appSong.matchBands

//STEP 7 - match bands to spotify
appSong.getSpotify = function (artisit) {
//console.log('appSong.getSpotify', artisit)
  $.ajax({
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
  }).then(function (playlists) {
    playlists = playlists.playlists.items;
    //console.log('Spotfiy', playlists)
    appSong.displayPlaylist(playlists);
  });
}; //appSong.getSpotify

//STEP 8 - display playlists
appSong.displayPlaylist = function (displayPlaylist) {
//console.log('appSong.displayPlaylist', displayPlaylist)
  //console.log('displayPlaylist', displayPlaylist)

  if (displayPlaylist.length != 0) {
    //if there are matching playlists - show them

    var $bandPicked = $('<h2>').text(appSong.bandPicked);
    var $modal = $('<article>').addClass('modal')
    var $overflow = $('<div>').addClass('overflow')
    var $allPlayLists = $('<div>').addClass('allPlayLists')

    $($allPlayLists).append($bandPicked);

    displayPlaylist.forEach(function (showingPlaylists) {
      var $playlistResult = $('<article>').addClass('playlist');
      var playlistURI = showingPlaylists.uri;
      console.log(playlistURI);
      var $actualPlaylist = $('<iframe>').attr({
        src: 'https://embed.spotify.com/?uri=' + playlistURI,
        width: '260',
        height: '380',
        frameborder: '0',
        allowtransparency: 'true',
        class: 'lists'
      });

      $playlistResult.append($actualPlaylist);
      $allPlayLists.append($playlistResult);
      $overflow.append($allPlayLists);
      $modal.append($overflow);
      $('.playlists').append($modal);
    });
  } else if (displayPlaylist.length === 0) {
    //if there are no results show .noresults

    $('.noplaylistresults').fadeIn();
  }
}; //displayPlaylist


//Runs all the stuffs
appSong.init = function () {
  appSong.getLocations();
  appSong.usersLocation();
};

$(function () {
  // shows a loading screen before everything loads, then hides it
  window.addEventListener('load', function() {
    $('#loadScreen').fadeOut();
  });

  appSong.init();

  //hide everything except for the heading and the slogan
  $('.search').hide();
  $('.bandSelection').hide();
  $('.spotifyResults').hide();

  //on click of the startBtn, hide the header page and show the search page
  $('.startBtn').on('click', function () {
    $('.titlePage').fadeOut();
    $('.search').fadeIn();
  });

  //when user clicks on the logo or the reset button, refresh the page - go back to start
  $('.reset').on('click', function () {
    window.location.reload();
    setTimeout(window.location.reload);
  });
});