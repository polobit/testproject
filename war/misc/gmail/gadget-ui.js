/**
 * Generation of GUI for first time form mail list.
 * 
 * @author Dheeraj
 */

/**
 * Setting user account containing API key and domain.
 * 
 * @mrthod generate_ui
 * @param {String}
 *            api_key user's unique key, it sent by server after authentication.
 * @param {String}
 *            domain usr's registered domain, sent from server (hard coded in
 *            case of Local host).
 */
function generate_ui(api_key, domain) {

	// Setting account.
	_agile.set_account(api_key, domain);
	// Building the contact UI.
	build_ui(function() {
		// Loading validation, event handlers and util JS files.
		head.js(LIB_PATH + 'misc/gmail/gadget-event-handlers.js', LIB_PATH
				+ 'misc/gmail/gadget-util.js', LIB_PATH
				+ 'lib/jquery.validate.min.js');
	});

	head.ready(function() {
		/*
		 * User generated events (click, key press, etc.) will be available
		 * after handlers loading.
		 */
		init_handlers();
	});

}

/**
 * Building GUI, getting mail list from gmail.
 * 
 * @method build_ui
 * @param {Function}
 *            callback calling callback function after Generating UI.
 */
function build_ui(callback) {

	var emails;
	// Get emails
	if (!Is_Localhost)
		emails = get_emails(true);
	else
		emails = get_emails(false);

	// Build UI for mails.
	console.log("Building UI");
	build_ui_for_emails(emails);

	// Adjust gadget window height.
	if (!Is_Localhost)
		gadgets.window.adjustHeight();

	if (callback && typeof (callback) === "function") {
		callback();
	}
}

/*
 * Global variable to hold caontacts object helps in loading contacts without
 * sending server request.
 */
var Contacts_Json = {};

/**
 * Building email list GUI.
 * 
 * @method build_ui_for_emails
 * @param {Array}
 *            email_ids contains email list, sender name and email.
 */
function build_ui_for_emails(email_ids) {

	// Remove HTML of id="content".
	$('#content').html('')

	// Iterating for each mails.
	$.each(email_ids[0], function(index, email) {

		var val = {};

		// Adding sender's first, last name and email to response array.
		if (email == email_ids[2] && val.id == null) {
			val.fname = email_ids[1].split(" ")[0];
			val.lname = email_ids[1].split(" ")[1];
			val.email = email;
		} else {
			val.email = email;
		}

		// Storing user data for future use.
		Contacts_Json[val.email] = val;
		fill_individual_template_ui(val, $('#content'));

	});

	// Adjust gadget window height.
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}

/**
 * Filling UI template with data
 * 
 * @method fill_individual_template_ui
 * @param {Object}
 *            val response object from get contact having contact details.
 * @param {Object}
 *            selector jQuery selector object, location for appending contact
 *            list.
 */
function fill_individual_template_ui(val, selector) {

	// Compiling template and generating UI.
	var individualTemplate = getTemplate('gadget', val, 'no');
	// Appending contact to container in HTML.
	selector.append($(individualTemplate));

	// Adjust gadget window height.
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}
