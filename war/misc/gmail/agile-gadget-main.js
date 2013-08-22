/**
 * gadget-main.js is starting point of gadget. When we open any email, gmail
 * contextual gadget is triggered based on the extractor (defined in
 * agile-extractor.xml) definition. It loads agile-gadget.xml, window onload
 * calls init method.
 * 
 * This file consist gadget login and script loading.
 * 
 * @author Dheeraj
 */

/*
 * Global variables:- 1) _agile - Access agile API methods through it, 2)
 * Is_Localhost - Local host identifier, 3) Lib_Path - Set library path based on
 * local host or production. 4) Contacts_Json - holds contact detail object,
 * which helps in loading contacts without sending server request.
 */
var _agile = _agile || [];
var Is_Localhost = false;
var Lib_Path;
var Contacts_Json = {};

/**
 * Initialize gadget for Local host or Production.
 * 
 * @method agile_init_agle_gadget
 */
function agile_init_gadget() {

	// Check for Local host, set Lib_Path, check cookie and download scripts.
	if (window.location.host.indexOf("localhost") != -1) {

		Is_Localhost = true;
		// Set library path.
		Lib_Path = "http://localhost:8888/";

		// Download scripts.
		agile_download_scripts();
		head.js(Lib_Path + 'misc/gmail/agile-gadget-ui.js');

		head.ready(function() {
			// Set account and generate UI.
			var Gadget_Cookie = agile_gadget_read_cookie("Agile_Gadget_Cookie");

			// Check for cookie, if not present create it then set account.
			if (Gadget_Cookie == null) {

				/*
				 * value - user data object, User_Seesion_Cookie - session
				 * cookie osapi - dummy open social id, Cookie_Data - cookie
				 * value.
				 */
				var value = {};
				var User_Seesion_Cookie = {};
				var osapi = "abcdefghijkl";
				var Cookie_Data = "";

				value.api_key = '51ekokl790t85b11ivhim9ep7i';
				value.domain = 'localhost';

				// Set cookie value.
				User_Seesion_Cookie[osapi] = value;
				// Convert into string.
				Cookie_Data = JSON.stringify(User_Seesion_Cookie);
				// Create cookie
				agile_gadget_create_cookie('Agile_Gadget_Cookie', Cookie_Data);
				// Set account
				agile_generate_ui(value.api_key, value.domain);
			}
			// Cookie is present, Set account.
			else {
				// Convert into object.
				var User_Data = $.parseJSON(Gadget_Cookie);
				// Fetch user data from cookie.
				for ( var value in User_Data)
					agile_generate_ui(User_Data[value].api_key,
							User_Data[value].domain);
			}
		});
	}
	// Production version, go for login.
	else {

		gadgets.window.adjustHeight();
		// Set library path.
//		Lib_Path = "https://googleapps.agilecrm.com/";
		Lib_Path = "https://googleapps-dot-sandbox-dot-agile-crm-cloud.appspot.com/";

		// Login
		agile_login();

		// Download scripts parallel to login.
		agile_download_scripts();
		gadgets.window.adjustHeight();
	}
}

/**
 * Login to open gadget or setup user account by registration.
 * 
 * @method agile_login
 */
function agile_login() {

	// Cookie
	var Gadget_Cookie = agile_gadget_read_cookie("Agile_Gadget_Cookie");
	
	// Check for cookie, if not there send login request.
	if (Gadget_Cookie == null) {
		// var url = 'https://googleapps.agilecrm.com/gmail';
		var url = Lib_Path + 'gmail';
		console.log("Osapi from " + url);
		/*
		 * Hit the server, passing in a signed request (and OpenSocial ID), to
		 * see if we know who the user is.
		 */
		osapi.http.get({
			'href' : url,
			'format' : 'json',
			'authz' : 'signed'
		}).execute(agile_handle_load_response);
	}
	// Cookie present, Set account.
	else {
		// Download build UI JavaScript file.
		head.js(Lib_Path + 'misc/gmail/agile-gadget-ui.js', function() {

			// Convert into object.
			var User_Data = $.parseJSON(Gadget_Cookie);
			
			head.ready(function() {
				// Set account
				agile_generate_ui(User_Data.api_key, User_Data.domain);
			});
		});
	}
}
/**
 * Handle login response either go to setup user for registration or load gadget
 * UI.
 * 
 * @method agile_handle_load_response
 * @param {Object}
 *            data Contains info whether user exists or not and session data.
 */
function agile_handle_load_response(data) {

	// Create cookie
	agile_gadget_create_cookie('Agile_Gadget_Cookie', JSON.stringify(data.content));

	// Check user exists, OpenID must have occurred previously.
	if (data.content.user_exists) {
		agile_login();
	}

	// User not exist, go for one time domain registration.
	else {
		// Download build UI JavaScript file.
		head.js(Lib_Path + 'misc/gmail/agile-gadget-setup.js', function() {
			agile_user_setup(data);
		});
	}
}

/**
 * Download library and supporting script file for GUI building.
 * 
 * @method agile_download_scripts
 */
function agile_download_scripts() {

	console.log("Downloading scripts");

	// Handle bars, util and MD5.
	head.js(Lib_Path + 'lib/handlebars-1.0.0.beta.6-min.js', Lib_Path
			+ 'jscore/handlebars/handlebars-agile.js', Lib_Path
			+ 'jscore/handlebars/handlebars-helpers.js', Lib_Path
			+ 'jscore/util.js', Lib_Path + 'jscore/md5.js');
	// JS API
	head.js(Lib_Path + 'stats/min/agile-min.js');
	// Gadget supporting JavaScript file.
	head.js(Lib_Path + 'misc/gmail/agile-gadget-email.js');
}

// Window onload event, call method to initiate gadget.
window.onload = agile_init_gadget;