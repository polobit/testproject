
/**
	Creates a new marker and info window.
	Applies a click listener on marker.
*/ 		
function agile_gmap_add_marker(Locations){
	
  for (var Loop in Locations) {
	var beach = (Locations[Loop].city_lat_long).split(",");
	var myLatLng = new google.maps.LatLng(beach[0], beach[1]);
	var marker = new google.maps.Marker({
	      position: myLatLng,
	      map: window.map,
	      zIndex: Locations[Loop].z_index
	});
  }
  map.setZoom(3);
  // apply marker to map object.
//  marker.setMap(map);
}

		