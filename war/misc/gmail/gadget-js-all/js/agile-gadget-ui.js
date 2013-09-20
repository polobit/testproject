/**
 * Generate GUI for first time from mail list.
 * 
 * @author Dheeraj
 */

/**
 * Set user account by passing API key and domain.
 * 
 * @mrthod agile_generate_ui
 * @param {String}
 *            api_key User's unique api key.
 * @param {String}
 *            domain User's registered domain.
 */
function agile_generate_ui(Api_Key, domain) {

	// Set account.
	_agile.set_account(Api_Key, domain);
	// Build mail list UI and call callback.
	agile_build_ui(function() {
		// Load validation, event handlers and util JS files.
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-event-handlers.min.js',
				Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-util.min.js', 
				Lib_Path + 'lib/jquery.validate.min.js', function() {
					/*
					 * User generated events (click, key press, etc.) will be
					 * available after handlers file loading.
					 */
					agile_init_handlers();
				});
	});
}

/**
 * Build GUI, get mail list from gmail.
 * 
 * @method agile_build_ui
 * @param {Function}
 *            callback Callback function.
 */
function agile_build_ui(callback) {

	var emails;
	// Get emails
	if (!Is_Localhost)
		emails = agile_get_emails(true);
	else
		emails = agile_get_emails(false);

	// Build UI for mails.
	console.log("Building UI");
	agile_build_ui_for_emails(emails);

	if (callback && typeof (callback) === "function") {
		callback();
	}
}

/**
 * Build email list GUI.
 * 
 * @method agile_build_ui_for_emails
 * @param {Array}
 *            email_ids Contains email list, sender's name and email.
 */
function agile_build_ui_for_emails(Email_Ids) {

	// Clear main HTML container.
	$('#agile_content').html('');
	// Clear contact data.
	Contacts_Json = {};
	
	// Iterate for each mails.
	$.each(Email_Ids[0], function(index, email) {

		var val = {};
		var Full_Name = (Email_Ids[1][index]).trim();
		val.fname = (Full_Name).split(" ")[0];
		val.lname = (Full_Name).split(" ")[1] == undefined ? "" : (Full_Name).split(" ")[1];
		val.email = email;
		
		// Store user data for future use.
		Contacts_Json[val.email] = val;
		agile_fill_individual_template_ui(val, $('#agile_content'));
	});
	console.log(Contacts_Json);
	
}

/**
 * Fill UI template with data, using handlerbar
 * 
 * @method agile_fill_individual_template_ui
 * @param {Object}
 *            val Object having user detail.
 * @param {Object}
 *            selector jQuery selector object, location for appending contact
 *            list.
 */
function agile_fill_individual_template_ui(val, selector) {
	
	// Compile template and generate UI.
	var Individual_Template = getTemplate('gadget', val, 'no');
	// Append contact to container in HTML.
	selector.append($(Individual_Template));

	// Adjust gadget window height.
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}
