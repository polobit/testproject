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
