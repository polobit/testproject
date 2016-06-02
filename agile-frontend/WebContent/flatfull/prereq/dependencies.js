/*
**
**	This file contains the code that is added to js-all-min-1.js
**	Any javascript functions that are required by other modules have to be added here
**	in case the build is not functioning due to dependencies
**
*/


/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else it returns null
 *
 * NOTE: This function is moved here from jscore/util/cookie.js
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