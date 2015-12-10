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
				{ email : "devikatest@gmail.com" }, { email : "test1@gmail.com" }, { email : "test1@gmail.com" }, { email : "pbx.kumar@gmail.com" }
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
		
		_agile.set_account('najgcc239kine9ungm8ip2ftj0', 'localhost');	
		
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
		$('#agile_content').prepend('<span style="float:right;cursor:pointer;margin-top:10px;" title="Reset Gadget" id="delete-button"><i class="icon-trash" style="font-size:1em;"></i></span>');
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
}$(function()
{

	// ------------------------------------------------- agile-action-event.js
	// --------------------------------------------- START --

	/**
	 * Action Drop Down option events. Opens corresponding form. Add
	 * Note/Task/Deal/To Campaign forms.
	 * 
	 * @author Dheeraj
	 */

	// ------------------------------------------------- Click event for Action
	// Menu (add note) -----------------------------------
	$('.action-add-note').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		$('.gadget-notes-tab-list', el).hide();
		// ------ Build notes tab UI to add note. ------
		agile_build_form_template($(this), "gadget-note", ".gadget-notes-tab-list", function()
		{
			// ------ Show notes tab. ------
			$('.gadget-notes-tab a', el).tab('show');
			$('.gadget-notes-tab-list', el).show();
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();
		});
	});

	// ------------------------------------------------- Click event for Action
	// Menu (add task) -----------------------------------

	$('.action-add-task').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		$('.gadget-tasks-tab-list', el).hide();
		// ------ Build tasks tab UI to add task. ------
		agile_build_form_template($(this), "gadget-task", ".gadget-tasks-tab-list", function()
		{
			/*
			 * ------ Load and apply Bootstrap date picker on text box in Task
			 * form. ------
			 */
			agile_load_datepicker($('.task-calender', el), function()
			{
				$('.gadget-tasks-tab a', el).tab('show');
				$('.gadget-tasks-tab-list', el).show();
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();
			});
		});
	});

	// ------------------------------------------------- Click event for Action
	// Menu (add deal) -----------------------------------

	$('.action-add-deal').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		var That = $(this);
		$('.gadget-deals-tab-list', el).hide();
		
		// ------ Get campaign work-flow data. ------
		_agile.get_pipelines({ success : function(Response)
		{
			/*Milestone_Array = Response.milestones.split(",");
			for ( var Loop in Milestone_Array)
				Milestone_Array.splice(Loop, 1, Milestone_Array[Loop].trim());*/

			// ------ Take contact data from global object variable. ------
			var Json = Contacts_Json[el.closest(".show-form").data("content")];
			Json.pipelines = Response;

			// ------ Compile template and generate UI. ------
			var Handlebars_Template = getTemplate("gadget-deal", Json, 'no');
			// ------ Insert template to container in HTML. ------
			That.closest(".gadget-contact-details-tab").find(".gadget-deals-tab-list").html($(Handlebars_Template));
			$('.gadget-deals-tab a', el).tab('show');
			$('.gadget-deals-tab-list', el).show();
			/*
			 * ------ Load and apply Bootstrap date picker on text box in Deal
			 * form. ------
			 */
			agile_load_datepicker($('.deal-calender', el), function()
			{
				$('.gadget-deals-tab a', el).tab('show');
				$('.gadget-deals-tab-list', el).show();
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();
			});
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();
			
			console.log(Response);
			if(Response.length==1){
				console.log('auto select track');
				$('#pipeline').val(Response[0].id);
				$('#pipeline').trigger('change');
				$('#pipeline').closest('.control-group').hide();
			}

		}, error : function(Response)
		{

		} });

	});
	
	$('#pipeline').die().live('change',function(e){
		var pipeline_id = $(this).val();
		console.log('-----',pipeline_id);
		if(pipeline_id.length >0)
		_agile.get_milestones_by_pipeline(pipeline_id,{ success : function(Response)
			{
				Milestone_Array = Response.milestones.split(",");
				for ( var Loop in Milestone_Array)
					Milestone_Array.splice(Loop, 1, Milestone_Array[Loop].trim());
				
				var html = '';
				for(var mile in Milestone_Array)
					html+='<option value="'+Milestone_Array[mile]+'">'+Milestone_Array[mile]+'</option>';
				$('#milestone').html(html);

			}, error : function(Response)
			{
				console.log('Error in getting milestones',Response);
				$('#milestone').html("");
			} });
		else
			$('#milestone').html("");
	});

	// ------------------------------------------------- Click event for Action
	// Menu (add to campaign) ----------------------------

	$('.action-add-campaign').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		var That = $(this);
		$('.gadget-campaigns-tab-list', el).hide();

		// ------ Get campaign work-flow data. ------
		_agile.get_workflows({ success : function(Response)
		{
			// ------ Compile template and generate UI. ------
			var Handlebars_Template = getTemplate("gadget-campaign", Response, 'no');
			// ------ Insert template to container in HTML. ------
			That.closest(".gadget-contact-details-tab").find(".gadget-campaigns-tab-list").html($(Handlebars_Template));
			$('.gadget-campaigns-tab a', el).tab('show');
			$('.gadget-campaigns-tab-list', el).show();
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();

		}, error : function(Response)
		{

		} });

	});

	// ------------------------------------------------- agile-action-event.js
	// ----------------------------------------------- END --

});
$(function()
{

// ------------------------------------------------- agile-button-event.js --------------------------------------------- START --

/**
 * Contains button events.
 * Add contact/note/task/deal/to campaign buttons event.
 * Cancel button event common for all cancel buttons.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add contact ----------------------------------------------- 
	
	$('.gadget-contact-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var That = $(this);
		var Json = [];
		var Data = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form(el.find(".gadget-contact-form"));

		$.each(Json, function(index, Val) {
			Data[Val.name] = Val.value;
		});
		//  ------ Show saving image. ------ 
		$('.contact-add-waiting', el).show();
		//  ------ Add contact ------ 
		_agile.create_contact(Data, 
				{success: function(Response){
							//  ------ Hide saving image. ------ 
							$('.contact-add-waiting', el).hide(1);
							//  ------ Generate UI. ------ 
							agile_create_contact_ui(el, That, Data.email, Response);
							
				}, error: function(Response){
					
							$('.contact-add-waiting', el).hide(1);
							//  ------ Show duplicate contact message. ------ 
							$('.contact-add-status', el).text(Response.error).show().delay(5000).hide(1);
				}});
	});


//  ------------------------------------------------- Click event for add Note ------------------------------------------------- 
	
	$('.gadget-note-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-note-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});

		$('.note-add-waiting', el).show();
		//  ------ Add Note ------ 
		_agile.add_note(Data,
				{success: function(Response){
							$('.note-add-waiting', el).hide(1);
							//  ------ Show notes list, after adding note. ------ 
							$('.gadget-notes-tab', el).trigger('click');
					
				}, error: function(Response){
									
											
				}}, Email.email);
	});

	
//  ------------------------------------------------- Click event for add Task ------------------------------------------------- 

	$('.gadget-task-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-task-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		//  ------ Format date. ------ 
		Data.due = new Date(Data.due).getTime() / 1000.0;

		$('.task-add-waiting', el).show();
		//  ------ Add Task ------ 
		_agile.add_task(Data,
				{success: function(Response){
							$('.task-add-waiting', el).hide(1);
							//  ------ Show tasks list, after adding task. ------ 
							$('.gadget-tasks-tab', el).trigger('click');
			
				}, error: function(Response){
									
											
				}}, Email.email);
	});

	
//  ------------------------------------------------- Click event for add Deal ------------------------------------------------- 
	
	$('.gadget-deal-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-deal-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		//  ------ Format date. ------ 
		Data.close_date = new Date(Data.close_date).getTime() / 1000.0;

		$('.deal-add-waiting', el).show();
		//  ------ Add Deal ------ 
		_agile.add_deal(Data,
				{success: function(Response){
							$('.deal-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-deals-tab', el).trigger('click');
			
				}, error: function(Response){
									
											
				}}, Email.email);
	});
	
	
//  ------------------------------------------------- Click event for add to Campaign ------------------------------------------ 
	
	$('.gadget-campaign-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = $(el).data("content");
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-campaign-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		
		$('.campaign-add-waiting', el).show();
		//  ------ Add Campaign ------ 
		_agile.add_campaign(Data,
				{success: function(Response){
							$('.campaign-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-campaigns-tab', el).trigger('click');
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for cancel button -------------------------------------------- 
	
	$(".cancel").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		
		var That = $(this).data('tab-identity');
		//  ------ Show tabs default list. ------ 
		$('.gadget-' + That + '-tab').trigger('click');
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab");
		//  ------ Toggle add contact UI. ------ 
		$(".show-add-contact-form", el).toggle();
		agile_gadget_adjust_height();
	});
	
	

// ------------------------------------------------- agile-button-event.js --------------------------------------------- END --
	

});$(function()
{

// ------------------------------------------------- agile-link-event.js --------------------------------------------- START --

/**
 * All link related events.
 * Search Contact/ Show Contact/ Add Contact/ Hide Contact. 
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for search contact ------------------------------------------- 
	$(".gadget-search-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		var Email = "";
		
		//  ------ Check whether it is Search panel or single email. ------ 
		if(!That.hasClass("search-mail-button")){
			
			Email = $(el).data("content");
			//  ------ Adjust width of mail list for Process icon. ------ 
			agile_gadget_adjust_width(el, $(".contact-search-waiting", el), true);
			//  ------ Show searching icon. ------ 
			$('.contact-search-waiting', el).css('visibility','visible');
		}
		else {
			
			Email = $(".agile-mail-dropdown option:selected").attr("data-content");
			
			console.log(Email);
			console.log(Contacts_Json[Email]);
			
			
			//  ------ Chaeck if requested mail already present in list. ------ 
			if(Contacts_Json[Email].mail_exist == true){
				//  ------ Show if contact is present otherwise do nothing. ------ 
				$('#agile_content .show-form').each(function(){
					if($(this).data('content') == Email){
						$(this).find(".gadget-show-contact").trigger('click');
						return false;
					}
				});
				console.log("Email is already in list");
				return;
			}
			$('.contact-search-waiting', el).show();
		}
				
		//  ------ Get contact status based on email. ------ 
		_agile.get_contact(Email, 
				{success: function(Response){
							
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}							
				
				}, error: function(Response){
					
							Response.id = null;
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								$(".contact-search-status", el).fadeIn().delay(4000).fadeOut();
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}
		}});
	});


//  ------------------------------------------------- Click event for toggle add contact ---------------------------------------

	$(".gadget-add-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var newContact = Contacts_Json[$(this).closest(".show-form").attr("data-content")];
		//  ------ Build contact add template. ------ 
		agile_build_form_template($(this), "gadget-add-contact", ".show-add-contact-form", function() {

			$(".show-add-contact-form", el).toggle();
			agile_gadget_adjust_height();
			
			console.log('add this email - ',newContact);
			if(newContact.name.trim().length > 0){
				console.log(newContact.name.split(' '));
				$('#fname',el).val(newContact.name.split(' ')[0]);
				$('#lname',el).val(newContact.name.substring(newContact.name.indexOf(' '),newContact.name.length));
			} else if(newContact.email.length>0)
				$('#fname',el).val(ucfirst(newContact.email.substring(0,newContact.email.indexOf('@'))));
			
			if(newContact.email.length>0){
				var reg = new RegExp('@([a-z]+)\.');
				if(reg.test(newContact.email)){
					var comp = reg.exec(newContact.email)[1];
					if(PUBLIC_EMAIL_DOMAINS.indexOf(comp)<0)
						$('#company',el).val(ucfirst(comp));
				}
			}
		});
	});
	
	
//  ------------------------------------------------- Click event for toggle show contact -------------------------------------- 

	$(".gadget-show-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		//  ------ Build show contact form template. ------ 
		agile_build_form_template(That, "gadget-contact-summary", ".show-contact-summary", function() {

			var Json = Contacts_Json[$(el).data("content")];
			//  ------ Build tags list. ------ 
			agile_build_tag_ui($("#added_tags_ul", el), Json);

			//  ------ Hide list view of contact. ------ 
			$(".display-toggle", el).addClass("hide-contact-summery").removeClass("gadget-show-contact");
			$(".display-toggle i", el).removeClass("icon-plus").addClass("icon-minus");
			$(".display-toggle span", el).text("Hide Details");
			$(".display-toggle", el).next().hide();
			
			agile_gadget_adjust_height();
			//  ------ Show contact summary. ------ 
			$(".show-contact-summary", el).toggle();
			agile_gadget_adjust_height();
			//  ------ Build tabs. ------ 
			agile_build_form_template(That, "gadget-tabs", ".option-tabs", function() {
				
				//  ------ Enables Tab. ------ 
				$('.gadget_tabs', el).tab();
				//  ------ Show Tabs. ------ 
				$(".option-tabs", el).toggle();
				agile_gadget_adjust_height();
				//  ------ Show notes tab by default. ------ 
				$('.gadget-notes-tab', el).trigger('click');
				
				//  ------ Enables Drop down. ------ 
				$('.dropdown-toggle').dropdown();
			});
		});
	});
	

//  ------------------------------------------------- Click event for hide contact info summary -------------------------------- 

	$(".hide-contact-summery").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");

		//  ------ Show list view of contact. ------ 
		$(".display-toggle", el).removeClass("hide-contact-summery").addClass("gadget-show-contact");
		$(".display-toggle i", el).removeClass("icon-minus").addClass("icon-plus");
		$(".display-toggle span", el).text("Show");
		$(".display-toggle", el).next().show();
		
		agile_gadget_adjust_height();
		//  ------ hide contact summary. ------ 
		$(".show-contact-summary", el).toggle();
		agile_gadget_adjust_height();
		//  ------ Show tabs. ------ 
		$(".option-tabs", el).toggle();
		agile_gadget_adjust_height();
	});
	
});
	
/**
 * Calculates total width of mail list and adjusts max-width of e-mail and/or name.
 * 
 * @method agile_gadget_adjust_width
 * @param {Object} el Jquery object gives the current object.
 * @param {Object} Text_Width Jquery object of text to be shown.
 * @param {Boolean} Boolean Boolean variable.
 * */
function agile_gadget_adjust_width(el, Text_Width, Boolean){
	if(Boolean){
		var Total_Width = $(".agile-no-contact", el).width();
		var Total_Text_width = parseInt(Text_Width.width(), 10) + parseInt(Text_Width.css("margin-left"), 10) + 10;
		var Rest_Width = (((Total_Width - Total_Text_width)/Total_Width)*100) + "%";
		$(".contact-list-width", el).css("max-width", Rest_Width);
	}
	else{
		$(".contact-list-width", el).css("max-width", "95%");
	}
}


/**
 * Mail search callback, when only one mail in the mail list.
 * 
 * @method agile_create_contact_ui
 * @param {Object} el It is a jquery object which refers to the current contact container in DOM.
 * @param {Object} that It is jquery object which refer to current event object.
 * @param {String} email Email of the current contact.
 * @param {JSON} Val Response JSON object/array/string.
 * 
 * */
function agile_create_contact_ui(el, That, Email, Val){
	
	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = LIB_PATH;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);

	//  ------ Build show contact form template. ------ 
	agile_build_form_template(That, "gadget-contact-list", ".contact-list", function() {
		
		//  ------ Contact not found for requested mail, show add contact in mail list. ------ 
		if (Val.id == null) {
			agile_gadget_adjust_width(el, $(".contact-search-status", el), true);
			
			console.log(el);
			console.log(el.html());
			
			$('.contact-search-status', el).show().delay(4000).hide(1,function(){
				agile_gadget_adjust_width(el, $(".contact-search-status", el), false);
			});
			$('.gadget-add-contact', el).trigger('click');
		}	
		//  ------ Contact found, show contact summary. ------  
		else {
			$('.gadget-show-contact', el).trigger('click');
		}
	});
}



/**
 * Mail search callback, when more then one mail in the mail list.
 * And add mail to list below search box.
 * 
 * @method agile_add_mail_to_list
 * 
 */
function agile_add_mail_to_list(Val, Email, el){

	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = LIB_PATH;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	var Contact_Data = {};
	Contact_Data[Email] = Contacts_Json[Email];
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);
	Contacts_Json[Email].mail_exist = true;
	
	//  ------ Compile template and generate UI. ------ 
	var Individual_Template = getTemplate('search', Contact_Data, 'no');
	//  ------ Append contact to container in HTML. ------ 
	$("#agile_content").append($(Individual_Template));
	//  ------ Temporarily hide the list. ------ 
	$("#agile_content").find(".contact-list:last").hide();
	
	
		//  ------ Take contact data from global object variable. ------ 
		var Json = Contacts_Json[Email];
		//  ------ Compile template and generate UI. ------ 
		var Handlebars_Template = getTemplate("gadget-contact-list", Json, 'no');
		//  ------ Insert template to container in HTML. ------ 
		$("#agile_content").find(".contact-list:last").html($(Handlebars_Template));
		//  ------ Show temporarily hidden list element. ------ 
		$("#agile_content").find(".contact-list:last").show();
		//  ------ Adjust gadget window height. ------ 
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
		
		//  ------ Contact found, show contact summary. ------ 		
		if (Json.id != null) {
			$("#agile_content").find('.gadget-show-contact:last').trigger('click');
		}	
		else{
			$("#agile_content").find('.contact-search-status:last').hide();
			$("#agile_content").find(".contact-list-width:last").css("max-width", "95%");
			$("#agile_content").find('.gadget-add-contact').trigger('click');
		}
 	
}



//------------------------------------------------- agile-link-event.js ------------------------------------------------ END --


$(function()
{

// ------------------------------------------------- agile-score-event.js --------------------------------------------- START --

/**
 * All events related to score board UI block.
 * Add Score/ Subtract Score.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add Score ------------------------------------------------- 

	$('.add-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(Old_Score + 1);
		//  ------ Add Score ------ 
		_agile.add_score(1,
				{success: function(Response){
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[Email], Response);
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for subtract Score --------------------------------------------- 
	
	$('.subtract-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);

		if (Old_Score > 0) {
			$('.score-value', el).text(Old_Score - 1);
			//  ------ Subtract Score ------ 
			_agile.add_score(-1,
					{success: function(Response){
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[Email], Response);
						
					}, error: function(Response){
										
												
					}}, Email);
		}
	});
	

// ------------------------------------------------- agile-score-event.js ------------------------------------------------ END --
	

});$(function()
{

	// ------------------------------------------------- agile-tab-event.js
	// ----------------------------------------------- START --

	/**
	 * Tab related events. Click event for all four tabs
	 * (note/task/deal/campaign).
	 * 
	 * @author Dheeraj
	 */

	// ------------------------------------------------- Click event for notes
	// tab -------------------------------------------------
	$('.gadget-notes-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear notes tab data. ------
		$('.gadget-notes-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Notes. ------
		_agile.get_notes({ success : function(Response)
		{
			// ------ Load Date formatter libraries. ------
			head.js(LIB_PATH + 'lib/date-formatter.js', LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".tab-waiting", el).hide();
				// ------ Fill notes list in tab. ------
				$('.gadget-notes-tab-list', el).html(getTemplate('gadget-notes-list', Response, 'no'));
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();

				// ------ Apply date formatter on date/time field. ------
				$("time", el).timeago();
			});

		}, error : function(Response)
		{

		} }, Email);
	});

	// ------------------------------------------------- Click event for tasks
	// tab ------------------------------------------------

	$('.gadget-tasks-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear tasks tab data. ------
		$('.gadget-tasks-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Tasks. ------
		_agile.get_tasks({ success : function(Response)
		{
			$(".tab-waiting", el).hide();
			// ------ Fill tasks list in tab. ------
			$('.gadget-tasks-tab-list', el).html(getTemplate('gadget-tasks-list', Response, 'no'));
			$('.gadget-tasks-tab-list', el).show();
			agile_gadget_adjust_height();
			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();

		}, error : function(Response)
		{

		} }, Email);
	});

	// ------------------------------------------------- Click event for deals
	// tab -------------------------------------------------

	$('.gadget-deals-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear deals tab data. ------
		$('.gadget-deals-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Deals. ------
		_agile.get_deals({ success : function(Response)
		{
			$(".tab-waiting", el).hide();
			// ------ Fill deals list in tab. ------
			$('.gadget-deals-tab-list', el).html(getTemplate('gadget-deals-list', Response, 'no'));
			$('.gadget-deals-tab-list', el).show();
			agile_gadget_adjust_height();
			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();

		}, error : function(Response)
		{

		} }, Email);
	});

	// ------------------------------------------------- Click event for
	// campaigns tab ---------------------------------------------

	$('.gadget-campaigns-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear campaigns tab data. ------
		$('.gadget-campaigns-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Campaigns. ------
		_agile.get_campaign_logs({ success : function(Response)
		{
			$(".tab-waiting", el).hide();
			var Lib_Json = {};
			// ------ Set library path for campaign link, check for local
			// host. ------
			if (Is_Localhost)
				Lib_Json["ac_path"] = LIB_PATH;
			else
			{
				Lib_Json["ac_path"] = "https://" + agile_id.namespace + ".agilecrm.com/";
			}
			Lib_Json["lib_path"] = LIB_PATH;
			Lib_Json["response"] = Response;

			// ------ Fill campaigns list in tab. ------
			$('.gadget-campaigns-tab-list', el).html(getTemplate('gadget-campaigns-list', Lib_Json, 'no'));
			$('.gadget-campaigns-tab-list', el).show();
			agile_gadget_adjust_height();

			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();

		}, error : function(Response)
		{

		} }, Email);
	});

	// ------------------------------------------------- agile-tab-event.js
	// --------------------------------------------------- END --

});
$(function()
{

// ------------------------------------------------- agile-tag-event.js ----------------------------------------------- START --

/**
 * All events related to tags.
 * Add Tag/ Remove Tag/ Show Add Tag.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add tags ------------------------------------------------- 
	
	$('#contact_add_tags').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		var Json = [];
		var Tags = {};
		var Email = {};
		//  ------ Form serialization. ------ 
		Json = agile_serialize_form($("#add_tags_form", el));

		$.each(Json, function(index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Tags[Val.name] = Val.value;
		});

		//  ------ Send request if tags are entered. ------ 
		if (Tags.tags.length != 0) {
			
			$("#add_tags_form", el).hide();
			$('.tag-waiting', el).show("fast");
			
			//  ------ Add Tags ------ 
			_agile.add_tag(Tags.tags,
					{success: function(Response){
								$('.tag-waiting', el).hide();
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[Email.email], Response);
								//  ------ Add tag to list. ------ 
								agile_build_tag_ui($("#added_tags_ul", el), Response);
								$(".toggle-tag", el).show("medium");
								agile_gadget_adjust_height();		
						
					}, error: function(Response){
										
												
					}}, Email.email);
		}
		//  ------ If tags are not entered, hide form. ------ 
		else {
			$("#add_tags_form", el).hide();
			$(".toggle-tag", el).show("medium");
		}
	});

	
//  ------------------------------------------------- Click event for remove tags ----------------------------------------------- 
	
	$('.remove-tag').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		var Email = $(el).find('#add_tags_form input[name="email"]').val();
		var Tag = $(this).prev().text();
		
		$('.toggle-tag', el).hide("fast",function(){
			$('.tag-waiting', el).show();
		});
		
		//  ------ Remove Tag ------ 
		_agile.remove_tag(Tag,
				{success: function(Response){
							$('.tag-waiting', el).hide();
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[Email], Response);
							//  ------ Removing tag from list. ------ 
							agile_build_tag_ui($("#added_tags_ul", el), Response);
							$('.toggle-tag', el).show("medium");
							agile_gadget_adjust_height();		
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for show add tag ---------------------------------------------- 

	$('.toggle-tag').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		$(".toggle-tag", el).hide("fast", function(){
			$("#add_tags_form", el).show();
			//  ------ Focus on text box and clear value. ------ 
			$('form input[name="tags"]', el).val("").focus();
			agile_gadget_adjust_height();
		});
	});

	
//  ------------------------------------------------- Enter key press event for tag input box ---------------------------------

	$('#tags').die().live('keypress', function(Evt) {
		//  ------ Select event object, because it is different for IE. ------ 
		var Evt = (Evt) ? Evt : ((Event) ? Event : null);
		var Node = (Evt.target) ? Evt.target
				: ((Evt.srcElement) ? Evt.srcElement : null);

		//  ------ Check for enter key code. ------ 
		if (Evt.keyCode === 13) {
			//  ------ Prevent default functionality. ------ 
			Evt.preventDefault();
			//  ------ Trigger add tag click event. ------ 
			$(this).next().trigger('click');
		}
	});
	

// ------------------------------------------------- agile-tag-event.js -------------------------------------------------- END --
	
});