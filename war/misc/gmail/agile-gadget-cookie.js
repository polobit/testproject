/**
 * agile-gadget-cookie.js deals with functions used to create, read and erase a cookie.
 * 
 * @author Dheeraj
 */

/**
 * Creates a cookie variable with the given name, value and expire time in days
 * 
 * @method agile_gadget_create_cookie
 * @param {String}
 *            name Name of the variable example : agile-email etc.
 * @param {String}
 *            value Value of the variable example: agilecrm@example.com
 * @param {Integer}
 *            days Time in days before the variable expires example : 15*365
 */
function agile_gadget_create_cookie(name, value, days) {
	// Check days, if not equal to null, undefined or ""
	if (days) {
		var date = new Date();

		// set cookie variable's updated expire time in milliseconds
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}

/**
 * Used to read a particular variable's value from document.cookie
 * 
 * @method agile_gadget_read_cookie
 * @param {String}
 *            name The name of the cookie variable to read.
 * @returns Value of the cookie variable else it returns null.
 */
function agile_gadget_read_cookie(name) {
	var Name_Eq = name + "=";

	// split document.cookie into array at each ";" and iterate through it
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++) {
		var c = ca[i];

		// check for ' ' and remove to get string from c
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);

		// check if nameEQ starts with c, if yes unescape and return its value
		if (c.indexOf(Name_Eq) == 0)
			return unescape(c.substring(Name_Eq.length, c.length));
	}
	return null;
}

/**
 * Used to delete a variable from document.cookie
 * 
 * @method agile_gadget_erase_cookie
 * @param {String}
 *            name Name of the variable to be removed from the cookie.
 */
function agile_gadget_erase_cookie(name) {
	agile_create_cookie(name, "", -1);
}
