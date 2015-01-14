/**
 * local-storage.js deals with functions used to store data in the client side.
 * Stores in localstorage if available otherwise usrs cookies.
 * @module jscore
 */

/**
 * stores data with given name in local storage or cookies.
 * 
 * @param name
 *            name of the variable example : agile-email etc.
 * @param value
 *            value of the variable example: agilecrm@example.com
 * @param days
 *            time in days before the variable expires example : 15*365
 * @returns cookie
 */
function storeData(name, value, days)
{
	if(typeof(Storage) !== "undefined") {
		localStorage.setItem(name, value);
	} else {
	    createCookie(name, value, days);
	}
}

/**
 * Used to read a particular variable's value from local storage
 * 
 * @param name
 *            the name of the cookie variable to read example :
 *            agile-crm-session_start_time
 * @returns value of the cookie variable else it returns null
 */
function readData(name)
{
	if(typeof(Storage) !== "undefined") {
		return localStorage.getItem(name);
	} else {
	    return raedCookie(name);
	}
}

/**
 * Used to delete a variable from storage
 * 
 * @param name
 *            name of the variable to be removed from the cookie
 */
function eraseData(name)
{

	if(typeof(Storage) !== "undefined") {
		return localStorage.removeItem(name);
	} else {
	    return eraseCookie(name);
	}
}