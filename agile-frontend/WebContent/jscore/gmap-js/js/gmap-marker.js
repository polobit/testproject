
/**
	Creates a new marker and info window.
	Applies a click listener on marker.
*/ 		

function gmap_add_marker(Locations){
  
	gmap_delete_marker();
	
	for (var Loop in Locations) {
	
		var User_Location = (Locations[Loop].city_lat_long).split(",");
	
		var My_Lat_Lng = new google.maps.LatLng(User_Location[0], User_Location[1]);
		var Gmap_Marker = new google.maps.Marker({
			position: My_Lat_Lng,
			map: window.map,
			zIndex: Locations[Loop].z_index
		});
		
		window.gmap_marker_list.push(Gmap_Marker);
	}
	map.setZoom(2);
  // apply marker to map object.
//  marker.setMap(map);
}

function gmap_set_map(map){
	for(var Loop=0; Loop < window.gmap_marker_list.length; Loop++){
		window.gmap_marker_list[Loop].setMap(map);
	}
}

function gmap_delete_marker(){
	gmap_set_map(null);
	window.gmap_marker_list = [];
}
		