/**
 * map.js loads a map based on the address of the contact, if the contact has no
 * address tries to get address from the browsing history of the contact based
 * on its email and stores the address
 */
var geocoder;
var map;
var address;

/**
 * Loads the google map by appending the url as script to html document body
 * and initializes the map (using callback of url) based on the address of the contact.
 * If the google map is already loaded, just initializes the map. If the contact
 * has no address then calls a function to get its address from the browsing
 * history based on its email
 * 
 * @method show_map
 * @param {object}
 *            el html object of the contact detail view
 * @param {Object}
 *            contact going to be shown in detail
 */
function show_map(el, contact) {
	var email = getPropertyValue(contact.properties, "email");

	address = getPropertyValue(contact.properties, "address");
	if (address) {
		address = JSON.parse(address);
		if (address.address || address.city || address.state || address.country) {

			// If google map is loaded just call initialize method else load the
			// map
			try {
				if (google.maps) {
					googlemaps_init();
				}
			} catch (err) {

				load_gmap_script();
			}
		} else {
			get_address_from_browsing_history(email, contact, true);
		}
	} else {
		get_address_from_browsing_history(email, contact, false);
	}
}

/**
 * Loads google maps api, by appending the related url (with a callback function
 * to initialize map) as script element to html document body
 */
function load_gmap_script() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=googlemaps_init";
	document.body.appendChild(script);
}

/**
 * Initializes map with some default values of latitude and longitude and then
 * calls a function to replace it with its original address
 */
function googlemaps_init() {

	// Gets the location (latitude and longitude) from the address
	geocoder = new google.maps.Geocoder();

	var latlng = new google.maps.LatLng(-34.397, 150.644);
	var myOptions = {
		zoom : 8,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	}

	// Displays a map using the above options at the specified id (map) of the html
	// document
	map = new google.maps.Map(document.getElementById("map"), myOptions);

	// Called to replace the default map with the original address
	code_address('"' + address.address + ',' + address.city + ','
			+ address.state + ',' + address.country + '"');
}

/**
 * Replaces the default map with the original one.
 * 
 * Geocoder returns result (details of the address like location and etc..) and
 * status. By verifying the status replaces the default map with the original
 * map in its callback function
 */
function code_address(address) {
	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		console.log(results);
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map : map,
				position : results[0].geometry.location
			});
		}
	});
}

/**
 * When contact has no address, based on its email, traces address from its
 * browsing history and stores as address property of the contact.
 * 
 * To get address of a contact with its email, you should run the java script
 * api provided at api & analytics (admin settings) by pushing the email of the
 * contact
 * 
 * @param {String}
 *            email of the contact
 * @param {Object}
 *            contact present in contact detail view
 * @param {Boolean}
 *            empty_address refers the address presence (empty address or no
 *            address field) of a contact
 */
function get_address_from_browsing_history(email, contact, empty_address) {

	// Get browsing address of contact with it's email, when it is defined
	if (email) {
		var url = 'core/api/stats?e=' + encodeURIComponent(email);

		$.get(url, function(data) {

			// Go further only when the contact got browsing address
			if (data && data.length > 0) {
				var items = contact.properties;
				var addressJSON = {};
				addressJSON.address = " ";
				addressJSON.city = data[0].c.city;
				addressJSON.state = " ";
				addressJSON.country = data[0].c.country;

				// If contact has no address property push the new one
				if (!empty_address) {
					contact.properties.push({
						"name" : "address",
						"value" : JSON.stringify(addressJSON)
					});
				} else {

					// Replace the empty address value with the browsing address
					for ( var i = 0, l = items.length; i < l; i++) {
						if (items[i].name == "address") {
							items[i].value = JSON.stringify(addressJSON);
							contact.properties[i] = items[i];
						}
					}
				}

				// Update contact with the browsing address
				var contactModel = new Backbone.Model();
				contactModel.url = 'core/api/contacts';
				contactModel.save(contact, {
					success : function(obj) {

					}
				});
			}
		});
	}
}