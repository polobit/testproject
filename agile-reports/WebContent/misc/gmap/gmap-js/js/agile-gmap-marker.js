
/**
	Creates a new marker and info window.
	Applies a click listener on marker.
*/ 		
function add_marker(){
	
	// Create a lat-long variable.
	var myCenter=new google.maps.LatLng(51.508742,-0.120850);
	// Create a marker object.
	var marker=new google.maps.Marker({
		position:myCenter,
		animation:google.maps.Animation.BOUNCE,
		icon:'img/ducky.png'
	});
	// Create a info window object.
	var infowindow = new google.maps.InfoWindow({
		content:"Scrooge Mcduck"
	});
	
	// Zoom in to 8 when clicking on marker.
	google.maps.event.addListener(marker,'click',function() {
		map.setZoom(8);
		map.setCenter(marker.getPosition());
		// Set time out, after 5 sec zoom out map to 5 and open info window.
		window.setTimeout(function() {
			map.setZoom(5);
			map.setCenter(marker.getPosition());
			infowindow.open(map,marker);
		},5000);
	});
	// Set message.
	document.getElementById("message").innerHTML = "Click on Ducky to Zoom In !!!"
	// set map center to marker position.
	map.setCenter(marker.getPosition());
	// apply marker to map object.
	marker.setMap(map);
}

		