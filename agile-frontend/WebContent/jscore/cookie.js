/**
 * Cookie.js deals with functions used to create, read and erase a cookie.
 * @module jscore
 */

/**
 * Creates a cookie variable with the given name, value and expire time in days
 * 
 * @param name
 *            name of the variable example : agile-email etc.
 * @param value
 *            value of the variable example: agilecrm@example.com
 * @param days
 *            time in days before the variable expires example : 15*365
 * @returns cookie
 */
function createCookie(name, value, days)
{
	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();

		// Set cookie variable's updated expire time in milliseconds
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		// If days is null, undefined or "" set expires as ""
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}

function createCookieInAllAgileSubdomains(name, value, days)
{
	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();

		// Set cookie variable's updated expire time in milliseconds
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		// If days is null, undefined or "" set expires as ""
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/; domain=agilecrm.com";
}

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else it returns null
 */
function readCookie(name)
{
	var nameEQ = name + "=";

	// Split document.cookie into array at each ";" and iterate through it
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		// Check for ' ' and remove to get string from c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(nameEQ) == 0)
			return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
}

/**
 * Used to delete a variable from document.cookie
 * 
 * @param name
 *            name of the variable to be removed from the cookie
 * @returns cookie without the variable
 */
function eraseCookie(name)
{
	createCookie(name, "", -1);
}
