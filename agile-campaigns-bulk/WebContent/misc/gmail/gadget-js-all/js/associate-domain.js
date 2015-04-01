/**
 * Generate gadget setup UI, when user is not associated.
 * 
 * @method agile_user_notassociated
 * @param {String}
 *            Agile_User_Data user info date read from cookie.
 */
function agile_user_show_association() {

	// To minimize the requests every time, we store the popup link for the first time
	var popup_link = agile_get_prefs(PREFS_POPUP_LINK);
	
	// See if the session stored in cookie is valid
	if (popup_link) {
		agile_user_setup();
		return;
	}
	
	// Send auth to server for one-time-session-key
	agile_send_auth(LIB_PATH + 'gmail?command=validate');
}

// Send OAuth Request with open_social_id. Server will send a acknowledgement
// with either user_exists or one-time session key for subsequent
function agile_send_auth(url) {

	var params = {};
	
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED;

	gadgets.io.makeRequest(url, agile_handle_load_response, params);
}

// Handle the auth response
function agile_handle_load_response(data) {

	console.log(data);

	if (data == undefined)
		return;

	agile_gadget_erase_cookie("agile_cookie");

	// Check if the user already exists at server side
	if (data.data.user_exists == true) {

		// Store Domain
		agile_save_prefs(PREFS_DOMAIN, data.data.domain);
		agile_save_prefs(PREFS_EMAIL, data.data.email);
		agile_save_prefs(PREFS_API_KEY, data.data.api_key);
		agile_login();
		return;
	}

	// If the user is not present, server will send popup and
	// one-time-session-key

	// If the user is not present, server will send popup and
	// one-time-session-key
	agile_save_prefs(PREFS_POPUP_LINK, data.data.popup);
	console.log("Setting up");
	agile_user_setup();
}