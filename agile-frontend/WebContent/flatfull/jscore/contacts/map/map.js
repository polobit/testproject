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
	
	//reads the value from cookie or local store if the value is no it will return from here
	
	var map_view=localStorage.getItem('MAP_VIEW');
	if(map_view=="disabled"){
		$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		return;
	}
		

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
		'address' : '"'+ address.address + ', '+ address.city + ', '
		+ address.state + ', ' + getNormalCountryNameFromShortName(address.country) + ', ' + address.zip + '"'
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			console.log(results);
			displayTimeZone(results);

			// Displays map portion
			$("#map").css('display', 'block');
			
			var myOptions = {
				zoom : 4,
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

function getNormalCountryNameFromShortName(name){
	if (!name)
		return;

	var name_json = {  "AF" : "Afghanistan",
		    "AX" : "Aland Islands",
		    "AL" : "Albania",
		    "DZ" : "Algeria",
		    "AS" : "American Samoa",
		    "AD" : "Andorra",
		    "AO" : "Angola",
		    "AI" : "Anguilla",
		    "AQ" : "Antarctica",
		    "AG" : "Antigua And Barbuda",
		    "AR" : "Argentina",
		    "AM" : "Armenia",
		    "AW" : "Aruba",
		    "AU" : "Australia",
		    "AT" : "Austria",
		    "AZ" : "Azerbaijan",
		    "BS" : "Bahamas",
		    "BH" : "Bahrain",
		    "BD" : "Bangladesh",
		    "BB" : "Barbados",
		    "BY" : "Belarus",
		    "BE" : "Belgium",
		    "BZ" : "Belize",
		    "BJ" : "Benin",
		    "BM" : "Bermuda",
		    "BT" : "Bhutan",
		    "BO" : "Bolivia",
		    "BA" : "Bosnia And Herzegovina",
		    "BW" : "Botswana",
		    "BV" : "Bouvet Island",
		    "BR" : "Brazil",
		    "IO" : "British Indian Ocean Territory",
		    "BN" : "Brunei Darussalam",
		    "BG" : "Bulgaria",
		    "BF" : "Burkina Faso",
		    "BI" : "Burundi",
		    "KH" : "Cambodia",
		    "CM" : "Cameroon",
		    "CA" : "Canada",
		    "CV" : "Cape Verde",
		    "KY" : "Cayman Islands",
		    "CF" : "Central African Republic",
		    "TD" : "Chad",
		    "CL" : "Chile",
		    "CN" : "China",
		    "CX" : "Christmas Island",
		    "CC" : "Cocos (Keeling) Islands",
		    "CO" : "Colombia",
		    "KM" : "Comoros",
		    "CG" : "Congo",
		    "CD" : "Congo, Democratic Republic",
		    "CK" : "Cook Islands",
		    "CR" : "Costa Rica",
		    "CI" : "Cote D\"Ivoire",
		    "HR" : "Croatia",
		    "CU" : "Cuba",
		    "CY" : "Cyprus",
		    "CZ" : "Czech Republic",
		    "DK" : "Denmark",
		    "DJ" : "Djibouti",
		    "DM" : "Dominica",
		    "DO" : "Dominican Republic",
		    "EC" : "Ecuador",
		    "EG" : "Egypt",
		    "SV" : "El Salvador",
		    "GQ" : "Equatorial Guinea",
		    "ER" : "Eritrea",
		    "EE" : "Estonia",
		    "ET" : "Ethiopia",
		    "FK" : "Falkland Islands (Malvinas)",
		    "FO" : "Faroe Islands",
		    "FJ" : "Fiji",
		    "FI" : "Finland",
		    "FR" : "France",
		    "GF" : "French Guiana",
		    "PF" : "French Polynesia",
		    "TF" : "French Southern Territories",
		    "GA" : "Gabon",
		    "GM" : "Gambia",
		    "GE" : "Georgia",
		    "DE" : "Germany",
		    "GH" : "Ghana",
		    "GI" : "Gibraltar",
		    "GR" : "Greece",
		    "GL" : "Greenland",
		    "GD" : "Grenada",
		    "GP" : "Guadeloupe",
		    "GU" : "Guam",
		    "GT" : "Guatemala",
		    "GG" : "Guernsey",
		    "GN" : "Guinea",
		    "GW" : "Guinea-Bissau",
		    "GY" : "Guyana",
		    "HT" : "Haiti",
		    "HM" : "Heard Island & Mcdonald Islands",
		    "VA" : "Holy See (Vatican City State)",
		    "HN" : "Honduras",
		    "HK" : "Hong Kong",
		    "HU" : "Hungary",
		    "IS" : "Iceland",
		    "IN" : "India",
		    "ID" : "Indonesia",
		    "IR" : "Iran, Islamic Republic Of",
		    "IQ" : "Iraq",
		    "IE" : "Ireland",
		    "IM" : "Isle Of Man",
		    "IL" : "Israel",
		    "IT" : "Italy",
		    "JM" : "Jamaica",
		    "JP" : "Japan",
		    "JE" : "Jersey",
		    "JO" : "Jordan",
		    "KZ" : "Kazakhstan",
		    "KE" : "Kenya",
		    "KI" : "Kiribati",
		    "KR" : "Korea",
		    "KW" : "Kuwait",
		    "KG" : "Kyrgyzstan",
		    "LA" : "Lao People\"s Democratic Republic",
		    "LV" : "Latvia",
		    "LB" : "Lebanon",
		    "LS" : "Lesotho",
		    "LR" : "Liberia",
		    "LY" : "Libyan Arab Jamahiriya",
		    "LI" : "Liechtenstein",
		    "LT" : "Lithuania",
		    "LU" : "Luxembourg",
		    "MO" : "Macao",
		    "MK" : "Macedonia",
		    "MG" : "Madagascar",
		    "MW" : "Malawi",
		    "MY" : "Malaysia",
		    "MV" : "Maldives",
		    "ML" : "Mali",
		    "MT" : "Malta",
		    "MH" : "Marshall Islands",
		    "MQ" : "Martinique",
		    "MR" : "Mauritania",
		    "MU" : "Mauritius",
		    "YT" : "Mayotte",
		    "MX" : "Mexico",
		    "FM" : "Micronesia, Federated States Of",
		    "MD" : "Moldova",
		    "MC" : "Monaco",
		    "MN" : "Mongolia",
		    "ME" : "Montenegro",
		    "MS" : "Montserrat",
		    "MA" : "Morocco",
		    "MZ" : "Mozambique",
		    "MM" : "Myanmar",
		    "NA" : "Namibia",
		    "NR" : "Nauru",
		    "NP" : "Nepal",
		    "NL" : "Netherlands",
		    "AN" : "Netherlands Antilles",
		    "NC" : "New Caledonia",
		    "NZ" : "New Zealand",
		    "NI" : "Nicaragua",
		    "NE" : "Niger",
		    "NG" : "Nigeria",
		    "NU" : "Niue",
		    "NF" : "Norfolk Island",
		    "MP" : "Northern Mariana Islands",
		    "NO" : "Norway",
		    "OM" : "Oman",
		    "PK" : "Pakistan",
		    "PW" : "Palau",
		    "PS" : "Palestinian Territory, Occupied",
		    "PA" : "Panama",
		    "PG" : "Papua New Guinea",
		    "PY" : "Paraguay",
		    "PE" : "Peru",
		    "PH" : "Philippines",
		    "PN" : "Pitcairn",
		    "PL" : "Poland",
		    "PT" : "Portugal",
		    "PR" : "Puerto Rico",
		    "QA" : "Qatar",
		    "RE" : "Reunion",
		    "RO" : "Romania",
		    "RU" : "Russian Federation",
		    "RW" : "Rwanda",
		    "BL" : "Saint Barthelemy",
		    "SH" : "Saint Helena",
		    "KN" : "Saint Kitts And Nevis",
		    "LC" : "Saint Lucia",
		    "MF" : "Saint Martin",
		    "PM" : "Saint Pierre And Miquelon",
		    "VC" : "Saint Vincent And Grenadines",
		    "WS" : "Samoa",
		    "SM" : "San Marino",
		    "ST" : "Sao Tome And Principe",
		    "SA" : "Saudi Arabia",
		    "SN" : "Senegal",
		    "RS" : "Serbia",
		    "SC" : "Seychelles",
		    "SL" : "Sierra Leone",
		    "SG" : "Singapore",
		    "SK" : "Slovakia",
		    "SI" : "Slovenia",
		    "SB" : "Solomon Islands",
		    "SO" : "Somalia",
		    "ZA" : "South Africa",
		    "GS" : "South Georgia And Sandwich Isl.",
		    "ES" : "Spain",
		    "LK" : "Sri Lanka",
		    "SD" : "Sudan",
		    "SR" : "Suriname",
		    "SJ" : "Svalbard And Jan Mayen",
		    "SZ" : "Swaziland",
		    "SE" : "Sweden",
		    "CH" : "Switzerland",
		    "SY" : "Syrian Arab Republic",
		    "TW" : "Taiwan",
		    "TJ" : "Tajikistan",
		    "TZ" : "Tanzania",
		    "TH" : "Thailand",
		    "TL" : "Timor-Leste",
		    "TG" : "Togo",
		    "TK" : "Tokelau",
		    "TO" : "Tonga",
		    "TT" : "Trinidad And Tobago",
		    "TN" : "Tunisia",
		    "TR" : "Turkey",
		    "TM" : "Turkmenistan",
		    "TC" : "Turks And Caicos Islands",
		    "TV" : "Tuvalu",
		    "UG" : "Uganda",
		    "UA" : "Ukraine",
		    "AE" : "United Arab Emirates",
		    "GB" : "United Kingdom",
		    "US" : "United States",
		    "UM" : "United States Outlying Islands",
		    "UY" : "Uruguay",
		    "UZ" : "Uzbekistan",
		    "VU" : "Vanuatu",
		    "VE" : "Venezuela",
		    "VN" : "Viet Nam",
		    "VG" : "Virgin Islands, British",
		    "VI" : "Virgin Islands, U.S.",
		    "WF" : "Wallis And Futuna",
		    "EH" : "Western Sahara",
		    "YE" : "Yemen",
		    "ZM" : "Zambia",
		    "ZW" : "Zimbabwe"};

	name = name.trim();

	if (name_json[name])
		return name_json[name];

	return name;

}
