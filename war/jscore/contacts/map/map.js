/**
 * Loads the "google map API" by appending the url as script to html document
 * body and displays the map (using callback of url) based on the address of the
 * contact. If the google map is already loaded, just displays the map.
 * 
 * Geocoder is used to get the latitude and longitude of the given address
 * 
 * @method show_map
 * @param {object}
 *            el html object of the contact detail view
 * @param {Object}
 *            contact going to be shown in detail
 */
function show_map(el) {
	var contact = App_Contacts.contactDetailView.model.toJSON();
	var address = getPropertyValue(contact.properties, "address");

	// Return, if no address is found 
	if (!address) 
		return;
	
	try
	{
		address = JSON.parse(address);
	}
	catch (err)
	{
		return;
	}
	
	

	// If all the address fields are empty, just return.
	if (!address.address && !address.city && !address.state
			&& !address.country)
		return;

	// If google map is already loaded display the map else load the
	// "google maps api"
	try {
		if (google.maps) {
			display_google_map();
		}
	} catch (err) {

		load_gmap_script();
	}
}

/**
 * Loads "google maps api", by appending the related url (with a callback
 * function to display map) as script element to html document body
 */
function load_gmap_script() {
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=display_google_map";
	document.body.appendChild(script);
}

/**
 * Displays related map of the given contact address.
 * 
 * Validates the status code returned by the geocoder, if it is ok proceeds
 * further to display the map using latitude and longitude of results object.
 * 
 */
function display_google_map() {

	var contact = App_Contacts.contactDetailView.model.toJSON();
	var address = JSON.parse(getPropertyValue(contact.properties, "address"));

	// Gets the location (latitude and longitude) from the address
	var geocoder = new google.maps.Geocoder();

	// Latitude and longitude were not saved to the contact (chances to update the address)
	
	if(!address.address)address.address="";
	if(!address.city)address.city="";
	if(!address.state)address.state="";
	if(!address.country)address.country="";
	if(!address.zip)address.zip="";
	
	geocoder.geocode({
		'address' : '"' + address.address + ', ' + address.city + ', '
				+ address.state + ', ' + address.country + ', ' + address.zip + '"'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			
			console.log(results);
			displayTimeZone(results);

			// Displays map portion
			$("#map").css('display', 'block');
			
			var myOptions = {
				zoom : 8,
				center : results[0].geometry.location,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}

			var map = new google.maps.Map(document.getElementById("map"),
					myOptions);
			
			var marker = new google.maps.Marker({
				map : map,
				position : results[0].geometry.location
			});
		}
	});
}
