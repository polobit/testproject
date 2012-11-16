
var geocoder;
var map;
var address;
function showMap(el, contact){
		address = getPropertyValue(contact.properties, "address");
		
		if(address){
			address = JSON.parse(address);
			if(address.address || address.city || address.state || address.country){
			
				// If google map is loaded just call initialize method else load the map
				try{
					if(google.maps)
					{
						googlemaps_init();
					}		
				}catch(err){
					
						loadGmapScript();	
				}
			}
		}
}

// Load google map
function loadGmapScript() {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=googlemaps_init";
	  document.body.appendChild(script);
	}

// Initialize map
function googlemaps_init(){  
    
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
			zoom: 8,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map"), myOptions);

	codeAddress('"' + address.address + ',' + address.city + ',' + address.state + ',' + address.country + '"');
}

// Get required map by sending the address
function codeAddress(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      }
    });
  }

