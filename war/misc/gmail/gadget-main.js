/**
 * gadget-main.js is starting point of gadget. When we open any email, gmail
 * contextual gadget is triggered based on the extractor (defined in
 * agile-extractor.xml) definition. It loads agile-gadget.xml, which calls init
 * method.
 * 
 * This file consist login and script loading also.
 * 
 * @author Dheeraj
 */

/*
 * Setting Global variables: 1) for accessing agile API methods, 2) for
 * identifying Local host, 3) Lib Path - set automatically in init based on
 * local host or production.
 */
var _agile = _agile || [];
var Is_Localhost = true;
var LIB_PATH;

/**
 * Initializing gadget for Local host or Production. Read cookie, if present
 * then don't call for login again and again.
 * 
 * @method init_agle_gadget
 */
function init_agile_gadget() {

	// If Local host then setting Lib Path and downloading scripts.
	if (window.location.host.indexOf("localhost") != -1) {
		Is_Localhost = true;
		LIB_PATH = "http://localhost:8888/";

		// Downloading scripts.
		download_scripts();
		head.js(LIB_PATH + 'misc/gmail/gadget-ui.js');

		head.ready(function() {
			// Set account and generate UI.
			if (!readCookie("gadgetcookie")) {
				var value = {};
				var Cookie_Data = "";
				value.user_apikey = api_key;
				value.user_domain = domain;
				Cookie_Data = JSON.stringify(value);
				createCookie('gadgetcookie', Cookie_Data, 1);
			} else
				generate_ui('51ekokl790t85b11ivhim9ep7i', 'localhost');
		});
	}
	// If production version go for login.
	else {

		gadgets.window.adjustHeight();
		LIB_PATH = "https://googleapps-dot-sandbox-dot-agile-crm-cloud.appspot.com/";
		// Read cookie
		if (!readCookie("gadgetcookie")) {
			// Login
			login();
		}

		// Download scripts parallel to login.
		download_scripts();
		gadgets.window.adjustHeight();
	}
}

/**
 * Login to open gadget or setup user account by registration.
 * 
 * @method login
 */
function login() {

	// var url = 'https://googleapps.agilecrm.com/gmail';
	var url = LIB_PATH + 'gmail';
	console.log("Osapi from " + url);

	/*
	 * Hit the server, passing in a signed request (and OpenSocial ID), to see
	 * if we know who the user is.
	 */
	osapi.http.get({
		'href' : url,
		'format' : 'json',
		'authz' : 'signed'
	}).execute(handleLoadResponse);
}
/**
 * Handling login response either go to setup user for registration or load
 * gadget UI.
 * 
 * @method handleLoadResponse
 * @param {Object}
 *            data contains info whether user exists or not and session data.
 */
function handleLoadResponse(data) {

	// User exists, OpenID must have occurred previously.
	if (data.content.user_exists) {

		head.js(LIB_PATH + 'misc/gmail/gadget-ui.js');
		head.ready(function() {
			// Create cookie
			createCookie('gadgetcookie', JSON.stringify(data), 1);
			// set account and generate UI
			generate_ui(data.content.api_key, data.content.domain);
		});
	}
	// User not exist, go for one time domain registration.
	else {
		head.js(LIB_PATH + 'misc/gmail/gadget-setup.js');
		head.ready(function() {
			user_setup(data);
		});
	}
}

/**
 * Downloading supporting script file for GUI building.
 * 
 * @method download_scripts
 */
function download_scripts() {

	console.log("Downloading scripts");

	// Cookie.js
	head.js(LIB_PATH + 'jscore/cookie.js');
	// Handle bars, util and MD5.
	head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js', LIB_PATH
			+ 'jscore/handlebars/handlebars-agile.js', LIB_PATH
			+ 'jscore/handlebars/handlebars-helpers.js', LIB_PATH
			+ 'jscore/util.js', LIB_PATH + 'jscore/md5.js');
	// JS API
	head.js(LIB_PATH + 'stats/min/agile-min.js');
	// Gadget supporting JavaScript file.
	head.js(LIB_PATH + 'misc/gmail/gadget-email.js');
}

// Window onload event, calling method to initiate gadget.
window.onload = init_agile_gadget;