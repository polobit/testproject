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
}// Get Emails
function agile_get_emails()
{
	var emails = [];

	// If Local Host,
	if (Is_Localhost)
	{
		emails = [
				{ email_from : "devika@faxdesk.com" },
				{ name_from : "Devika Jakkannagari" },
				{ email_to : "abhi@gashok.mygbiz.com;rahul@gashok.mygbiz.com;dheeraj@gashok.mygbiz.com;chandan@gashok.mygbiz.com;abhiranjan@gashok.mygbiz.com" },
				{ name_to : "Abhi;;D j p;;" }, { email_cc : "devikatest1@gmail.com;devikatest@gmail.com;teju@gmail.com" }, { name_cc : "Dev T1;;Teju" },
				{ email : "devikatest@gmail.com" }, { email : "test1@gmail.com" }, { email : "test1@gmail.com" }, { email : "pbx.kumar@gmail.com" },
				{email_body : "Testing local emails body extractor."},{subject : "Testing local subject extractor."}
		];

		// emails = [{email:"devikatest@gmail.com"}];
		//console.log(JSON.stringify(emails));

		return validateEmails(parse_emails(emails));
	}

	// Google Matches in 2D format
	emails = google.contentmatch.getContentMatches();
	//console.log(emails);
	//console.log(JSON.stringify(emails));
	return validateEmails(parse_emails(emails));
}

function validateEmails(emails){
	for(var email in emails){
		console.log('--------',emails[email]);
	}
	return emails;
}

// Convert 2d to 1d
function parse_emails(emails)
{
	return $.merge(collate_emails(emails, "from"), collate_emails(emails, "to")).concat(collate_emails(emails, "cc")).concat(agile_grep(emails, "email"));
}

function getSubBody(){
	var emails = [];

	// If Local Host,
	if (Is_Localhost)
	{
		emails = [
				{email_body : "Testing local emails body extractor."},{subject : "Testing local subject extractor."}
		];

		// emails = [{email:"devikatest@gmail.com"}];
		console.log(JSON.stringify(emails));
	}
	try{
		// Google Matches in 2D format
		emails = google.contentmatch.getContentMatches();
	} catch(error){
		console.log(error);
	}
	
	var tempMsg = {};
	tempMsg.subject = agile_grep(emails,'subject');
	tempMsg.body = agile_grep(emails,'email_body');
	return tempMsg;
}

// Finds email_key and then finds name_key and collates them
function collate_emails(emails, key)
{
	var emails1D = [];

	var email_key_array = agile_grep(emails, "email_" + key);
	if (email_key_array.length > 0)
	{
		// Parse from names
		email_key_name_array = agile_grep(emails, "name_" + key);
		$.each(email_key_array, function(index, email_key)
		{
			var email = {};
			email.key = key;
			email.email = email_key;
			
			if(email_key_name_array[index])
				email.name = email_key_name_array[index].trim();
			else
				email.name = "";
			emails1D.push(email);
		});
	}
console.log('--------',emails1D);
	return emails1D;
}

// Find for a certain element in emails
function agile_grep(array, key)
{
	var map = jQuery.grep(array, function(obj)
	{
		if (obj.hasOwnProperty(key))
			return obj; // or return obj.name, whatever.
	});

	if (map.length == 1 && key != 'email')
	{
		// console.log(map[0][key].split(";"));
		return map[0][key].split(";");
	}

	// console.log(map);
	return map;
}
// Is Valid Form
function agile_is_valid_form(form) {
	$(form).validate();
	return $(form).valid();
}

// Serialize Form
function agile_serialize_form(form) {
	
	if (!agile_is_valid_form(form)) {
		return;
	}
	
	return form.serializeArray();
}var _agile = _agile || [];
var Is_Localhost = false;

// Holds Contact Detail Object
var Contacts_Json = {}; 

var DEFAULT_GRAVATAR_url = "https://dpm72z3r2fvl4.cloudfront.net/css/images/user-default.png";

var PUBLIC_EMAIL_DOMAINS = ['gmail','yahoo','hotmail','gmx','googlemail','mail','web','live','aol','ymail'];/**
 * gadget-main.js is starting point of gadget. When we open any email, gmail
 * contextual gadget is triggered based on the extractor (defined in
 * agile-extractor.xml) definition. It loads agile-gadget.xml, window onload
 * calls init method.
 * 
 * This file consist gadget login and script loading.
 * 
 * @author Dheeraj
 */

/**
 * Initialize gadget for Local host or Production.
 * 
 * @method agile_init_agle_gadget
 */
function agile_init_gadget() {

	//  ------ Check for Local host, set LIB_PATH, check cookie and download scripts. ------ 
	if (window.location.host.indexOf("localhost") != -1) {
		
		// Set Localhost
		Is_Localhost = true;
		
		// Lib Path 
		LIB_PATH = "http://localhost:8888/";
		
		_agile.set_account('3en1iuvi164jimp4n78u5o1nkp', 'localhost');	
		
		agile_user_associated();
		
		return;
	}
	
	// Login
	agile_login();
}/**
 * Login to open gadget or setup user account by association.
 * 
 * @method agile_login
 */
function agile_login() {

	// Get API Key
	var api_key = agile_get_prefs(PREFS_API_KEY);	
	console.log("API Key from Prefs = " + api_key);
	
	// Show Emails Matched
	if (api_key) {
		
		// Get Domain
		var domain = agile_get_prefs(PREFS_DOMAIN);
		
		// Set Domain and API_Key
		console.log("Setting API key " + api_key +  " " + domain);
		
		_agile.set_account(api_key, domain);		
		
		agile_user_associated();
		agile_show_delete(true);
		
		return;
	}

	// Show User Setup - Choose Domain Form
	agile_user_show_association();
	agile_show_delete(false);
}


function agile_show_delete(status)
{
	if(status)
		$('#delete-button').show();
	else
		$('#delete-button').hide();
	$('#delete-button').live('click',agile_delete_all_prefs);	
}/**
 * Generate gadget main UI, when user is associated. And downloads library files
 * first then setup account.
 * 
 * @method agile_user_associated
 * @param {String}
 *            Agile_User_Key user's API key used in requests.
 * @param {String}
 *            Agile_User_Domain user's domain name by which it is associated.
 * 
 */
function agile_user_associated() {

	// Get all emails
	var emails = agile_get_emails();
	
	Contacts_Json = {};
	//Contacts_Json[emails[0].email] = emails[0];
	$.each(emails, function(index, value)
	{
		if(value.email != agile_get_prefs(PREFS_EMAIL))
			Contacts_Json[value.email] = value;
	});
	
	delete Contacts_Json[agile_get_prefs(PREFS_EMAIL)];
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH + 'jscore/md5.js', function() {
		
		set_html($('#agile_content'), 'search', Contacts_Json);
		$('#agile_content').prepend('<span style="float:right;cursor:pointer;margin-top: 20px;" id="delete-button"><a style="font-size:1em;">Disassociate</a></span>');
		$('#delete-button').live('click',agile_delete_all_prefs);
	});
	
}
// Prefs after association
var PREFS_API_KEY = "agile_api_key";
var PREFS_DOMAIN = "agile_domain";
var PREFS_EMAIL = "agile_email";

// Prefs before association - server sends expiration date and session_key
var PREFS_POPUP_LINK = "agile_popup_link";

// Save Prefs
function agile_save_prefs(key, value)
{
	// Store it in Google Gadget Prefs
	var prefs = new gadgets.Prefs();
	prefs.set(key, value);

	// Store it in Cookie too as Gadget prefs are sometimes not immediately
	// available
	agile_gadget_create_cookie(key, value, 0);
}

// Get Prefs
function agile_get_prefs(key)
{
	// Get from Gadget Prefs
	var gadget_prefs = new gadgets.Prefs();
	var value = gadget_prefs.getString(key);

	// If not available, check in cookie too as sometimes prefs are immediately
	// available
	if (!value)
		value = agile_gadget_read_cookie(key);
	else
	{
		// Delete from cookie since prefs now has this value
		agile_gadget_erase_cookie(key);
	}

	return value;
}

// Delete Prefs
function agile_delete_prefs(key)
{

	// Delete from Gadget Prefs
	var gadget_prefs = new gadgets.Prefs();
	gadget_prefs.set(key, '');

	// Delete Cookie
	agile_gadget_erase_cookie(key);
}

function agile_delete_all_prefs()
{
	agile_delete_prefs(PREFS_API_KEY);
	agile_delete_prefs(PREFS_DOMAIN);
	agile_delete_prefs(PREFS_EMAIL);
	agile_delete_prefs(PREFS_POPUP_LINK);

	console.log("Deleted all prefs");

	var params = {};

	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.SIGNED;

	gadgets.io.makeRequest(LIB_PATH + 'gmail?command=delete', function()
	{
		agile_init_gadget();	
	}, params);

	
}

/**
 * Creates a session cookie variable with the given name and value.
 * 
 * @method agile_gadget_create_cookie
 * @param {String}
 *            name Name of the variable example : agile-email etc.
 * @param {String}
 *            value Value of the variable example: agilecrm@example.com
 * @param {Integer}
 *            days Sets cookie expiration time example: days=0 sets browser
 *            session cookie.
 */
function agile_gadget_create_cookie(name, value, days)
{

	// Check days, if not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		var expires = "";

	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @method agile_gadget_read_cookie
 * @param {String}
 *            name The name of the cookie variable to read.
 * 
 * @returns Value of the cookie variable else it returns null.
 */
function agile_gadget_read_cookie(name)
{

	name = name + "=";

	// split document.cookie into array at each ";" and iterate through it
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		// check for ' ' and remove to get string from c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(name) == 0)
			return unescape(c.substring(name.length, c.length));
	}

	return undefined;
}

/**
 * Used to delete a variable from document.cookie
 * 
 * @method agile_gadget_erase_cookie
 * @param {String}
 *            name Name of the variable to be removed from the cookie.
 */
function agile_gadget_erase_cookie(name)
{
	agile_gadget_create_cookie(name, "", -1);
}
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
}var TPL_PATH = "http://localhost:8888/misc/gmail/gadget-js-all/tpl/min/"

// Get HTML
function set_html(selector, template, context, update)
{
	// Get Template first
	var template = getTemplate(template, context);
	if (!template)
		return;

	if (update)
		template = selector.html() + template;

	selector.html(template);

	if (!Is_Localhost)
	{
		console.log("Adjusting height");
		gadgets.window.adjustHeight();
	}
}

function getTemplate(templateName, context, download)
{

	// Check if the template is already found
	var template = Handlebars.templates[templateName];
	if (template)
	{
		// console.log("Template " + templateName + " found");
		return template(context);
	}

	// Check if the download is explicitly set to no
	if (download == 'no')
	{
		console.log("Not found " + templateName);
		return;
	}

	downloadSynchronously(TPL_PATH + templateName + ".js");

	return getTemplate(templateName, context, 'no');
}

function downloadSynchronously(url)
{
	var dataType = 'script';

	console.log(url + " " + dataType);

	jQuery.ajax({ url : url, dataType : dataType, success : function(result)
	{
		console.log("Downloaded url " + url);
	}, async : false });

	return "";
}

/**
 * Build form template.
 * 
 * @method agile_build_form_template
 * @param {Object}
 *            That Current context jQuery object ($(this)).
 * @param {String}
 *            template Template's name to be generated.
 * @param {String}
 *            Template_Location Class name (location) of template to be filled.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_build_form_template(That, Template, Template_Location, callback)
{

	// ------ Take contact data from global object variable. ------
	var Json = Contacts_Json[That.closest(".show-form").data("content")];

	// ------ Compile template and generate UI. ------
	var Handlebars_Template = getTemplate(Template, Json, 'no');
	// ------ Insert template to container in HTML. ------
	That.closest(".gadget-contact-details-tab").find(Template_Location).html($(Handlebars_Template));

	if (callback && typeof (callback) === "function")
	{
		callback();
	}
}

/**
 * Adjust height of gadget window.
 * 
 * @method agile_gadget_adjust_height
 * 
 */
function agile_gadget_adjust_height()
{
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}

/**
 * Build tags list from contact data object.
 * 
 * @method agile_build_tag_ui
 * @param {Array}
 *            Tag_List Container for list tags.
 * @param {Array}
 *            val array of tags got from server.
 */
function agile_build_tag_ui(Tag_List, Val)
{

	// ------ Remove all tags from list except first, hidden list item. ------
	$(Tag_List).children("li:gt(0)").remove();
	// ------ Iterate up to number of tags in array. ------
	for (Index = 0; Index < Val.tags.length; Index++)
	{
		// ------ Clone hidden list item. ------
		var Clone_Element = $(Tag_List).children().eq(0).clone(true);
		$(Clone_Element).css('display', 'inline-block');
		// ------ Fill tag value. ------
		$('.tag-name', Clone_Element).text(Val.tags[Index]);
		// ------ Append list item to list container. ------
		Clone_Element.appendTo(Tag_List);
	}
}

/**
 * Load and set bootstrap date picker.
 * 
 * @method agile_load_datepicker
 * @param {Object}
 *            calendar jQuery object of date picker container text box.
 * @param {Function}
 *            callback Function to be called as callback.
 */
function agile_load_datepicker(Calendar, callback)
{
	// ------ Load Bootstrap libraries. ------
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js', function()
	{

		// ------ Enables date picker. ------
		Calendar.datepicker({ format : 'mm/dd/yyyy' });

		if (callback && typeof (callback) === "function")
		{
			callback();
		}
	});
}
/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for ( var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

function ucfirst(value)
{
 return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';
}

function isValidTag(tag, showAlert) {
	
	var r = '\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
	var regexString = '^['+r+']['+r+' 0-9_-]*$';
	var is_valid = new RegExp(regexString).test(tag);
	if (showAlert && !is_valid)
		alert("Tag name should start with an alphabet and can not contain special characters other than underscore space and hypen");
	return is_valid;
}