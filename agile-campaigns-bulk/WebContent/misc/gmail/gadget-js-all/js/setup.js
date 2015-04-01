/**
 * One time user domain registration.
 * 
 * @method agile_user_setup
 * @param {Object}
 *            Popup_Url Contains one time session key with URL for request of
 *            association.
 */
function agile_user_setup() 
{
	// Hide Loading
	$('#loading').hide();
	
	// Show Getting Started
	set_html($('#agile_content'), "getting-started", {});
}

/**
 * Open a pop-up window with URL for registration.
 * 
 * @method agile_gadget_open_popup
 * @param {String}
 *            url URL for domain registration.
 */
function agile_gadget_open_popup(url) {

	// Show loading
	$('#loading').show();
	gadgets.window.adjustHeight();

	// Open the popup
	var url = agile_get_prefs(PREFS_POPUP_LINK);
	var popup = window.open(url, 'Agile-Gadget-URL', 'height=400,width=400');

	// Set a timer to keep checking if the popup has been closed
	var finished_interval = setInterval(function() {
		/*
		 * ------ If the popup is closed, we've either finished OpenID, or the
		 * user closed it. Verify with the server in case the user closed the
		 * popup. ------
		 */
		if (popup.closed) {
			clearInterval(finished_interval);

			// Reset the credentials
			agile_delete_prefs(PREFS_POPUP_LINK);
			agile_login();
		}
	}, 100);
}