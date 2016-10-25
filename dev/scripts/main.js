var appSong = {};

appSong.getMetro = function (metroID) {
  $.ajax ({
    console.log('appSong.getMetro', arguments);
    url: http://api.songkick.com/api/3.0/metro_areas/{metro_area_id}/calendar.json,
    method: 'GET',
    format: 'json',
    data: {
      apikey: 'hHSjLHKTmsfByvxU',
      q: metroID
    }
  }).then(function(metroLocation) {
    metroLocation = metroLocation.location.metro-area.id;
    console.log(metroLocation);
  });
}