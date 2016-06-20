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
function agile_generate_ui(Api_Key, Domain) {

	
	//  ------ Build mail list UI and call callback. ------ 
	agile_build_ui(function() {
		
		var Handlers_Path = Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-event-handlers.min.js';
		var Util_Path = Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-util.min.js';
		
		if(Is_Localhost){
			Handlers_Path = Lib_Path + 'misc/gmail/gadget-js-all/js/agile-gadget-event-handlers.js';
			Util_Path = Lib_Path + 'misc/gmail/gadget-js-all/js/agile-gadget-util.js';
		}
			
		//  ------ Load validation, event handlers and util JS files. ------ 
		head.js(Handlers_Path, Util_Path, Lib_Path + 'lib/jquery.validate.min.js', function() {
					/* ------ 
					 * User generated events (click, key press, etc.) will be
					 * available after handlers file loading. ------ 
					 */
					agile_init_util();
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

	var Emails;
	//  ------ Get emails ------ 
	if (!Is_Localhost)
		Emails = agile_get_emails(true);
	else
		Emails = agile_get_emails(false);

	//  ------ Build UI for mails. ------ 
	console.log("Building UI");
	agile_build_ui_for_emails(Emails);

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

	//  ------ Clear contact data object. ------ 
	Contacts_Json = {};
	Contacts_Json = Email_Ids;
	
	//  ------ Clear search mail HTML container. ------ 
	$('#search_mail_div').html('');
	
	//  ------ Fill and create html for mail list. ------ 
	agile_fill_individual_template_ui(Email_Ids, $("#search_mail_div"));
	
	$(".agile-mail-dropdown").data("email", $(".agile-mail-dropdown option:eq(0)").data("content"));
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
function agile_fill_individual_template_ui(Val, Selector) {
	
	//  ------ Compile template and generate UI. ------ 
	var Individual_Template = getTemplate('gadget', Val, 'no');
	//  ------ Append contact to container in HTML. ------ 
	Selector.append($(Individual_Template));
	//  ------ Adjust gadget window height. ------ 
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}

	
