/**
 * Cookie.js deals with functions used to create, read and erase a cookie.
 * @module jscore
 */

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else returns null
 */
function agile_read_cookie(name)
{
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;

	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++)
	{
		var c = ca[i];

		// Check for ' ' and remove to get to string c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// Check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(nameEQ) == 0)
			return unescape(c.substring(nameEQ.length, c.length));
	}
	return null;
}

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
function agile_create_cookie(name, value, days)
{
	// Add Widget Id to cookie name to differentiate sites
	name = agile_id.get() + "-" + name;

	// If days is not equal to null, undefined or ""
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else
		// If days is null, undefined or "" set expires as ""
		var expires = "";
	
	// Make it a domain level cookie so that it is persistent among sub domains
	var document_cookie = "";
	if(agile_id.getDomain())
	{
		document_cookie = ";domain=" + agile_id.getDomain();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/" + document_cookie;
}

//function creates cookie in all subdomains 
function agile_createCookieInAllAgileSubdomains(name, value, days)
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
 *  Function to delete a cookie
 *  
 * @param name
 */
function agile_delete_cookie(name){
	agile_create_cookie(name, "", -1);
}