
var geocoder;
var map;
var address;
function showMap(el, contact){
		address = getPropertyValue(contact.properties, "address");
		
		if(address){
			address = JSON.parse(address);
		
			try{
				if(google.maps)
				{
					if(address.address || address.city || address.state || address.country)
					googlemaps_init();
				}		
			}catch(err){
				if(address.address || address.city || address.state || address.country)
					loadGmapScript();	
			}
		}
}

function loadGmapScript() {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  script.src = "http://maps.googleapis.com/maps/api/js?&sensor=false&callback=googlemaps_init";
	  document.body.appendChild(script);
	}

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

