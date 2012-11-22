
var geocoder;
var map;
var address;

function showMap(el, contact){
	var email = getPropertyValue(contact.properties, "email");
	
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
			}else{
				getAddressFromBrowsingHistory(email, contact, true);
			} 
		}else{
			getAddressFromBrowsingHistory(email, contact, false);
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

// Get required map by sending the address as argument
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

function getAddressFromBrowsingHistory(email, contact, empty_address){

	// Get browsing address of contact with it's email, when it is defined 
	if(email){
		var url = 'core/api/stats?e=' + encodeURIComponent(email);
		
		$.get(url, function(data){
			
			// Go further only when the contact got browsing address
			if(data.length > 0){
				var items = contact.properties;
				var addressJSON = {};
				addressJSON.address = " ";
				addressJSON.city = data[0].c.city;
				addressJSON.state = " ";
				addressJSON.country = data[0].c.country;
				
				// If contact has no address property push the new one
				if(!empty_address){
					contact.properties.push({
						"name": "address",
						"value": JSON.stringify(addressJSON),
						"subtype":" "
					});
				}else{
					
					// Replace the empty address value with the browsing address
					for ( var i = 0, l = items.length; i < l; i++) {
						if (items[i].name == "address"){
							items[i].value = JSON.stringify(addressJSON);
							contact.properties[i] = items[i];
						}	
					}
				}
			
				// Update contact with the browsing address
				var contactModel = new Backbone.Model();
			    contactModel.url = 'core/api/contacts';
			    contactModel.save(contact, {
			        success: function (obj) {
			        	
			        }
			    });
			}
		});
	}
}