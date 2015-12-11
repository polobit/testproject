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
		if(islocalStorageHasSpace()){
			localStorage.setItem(name, value);
		}
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
	    return readCookie(name);
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

/**
 * This Function will clear the data for every 30days.
 */
function clearLocalStorage() {
	var currentDate = new Date();	
	var setExprDate = false;
	
    var localStorageSize = 1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
    if(localStorageSize < 1242597){
    	localStorage.clear();
    	setExprDate = true;
    }else{
    	//Getting the local Storage expire date.
    	var exprDate = localStorage.getItem('localStorageExpireDate');
    	//Check the expire date has value/not.
        if(exprDate){
        	exprDate = new Date(Date.parse(exprDate));
        	if(currentDate >= exprDate){
        		localStorage.clear();
        		setExprDate = true;
        	}
        }else{    	
        	setExprDate = true; 	
        }
    }
	
    //Set the expire date.
    if(setExprDate){
    	var updateDate = currentDate.getDate()+30;
    	currentDate.setDate(updateDate);
    	localStorage.setItem('localStorageExpireDate',currentDate);
    }
}

/**
 * This function will check the space is available in the local storage.
 */
function islocalStorageHasSpace(){
	var hasSpace = false;
	var fixedLimit = 1242597;
	var localStorageSize = 1024 * 1024 * 5 - unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
	if(localStorageSize){
		if(localStorageSize > fixedLimit){
			hasSpace = true;
		}
	}else{
		hasSpace = true;
	}
	return hasSpace;
}

(function($) {
	clearLocalStorage();
})(jQuery);


// New localstorage prefs 
function _agile_get_prefs(key){

    //  Checks in cookie first. If it is present delete from cookie and reset to localstorage and returns the value
    var value = readCookie(key);
    if(value != null && value != undefined && value != "null"){

    	// Remove value from cookie and 
    	eraseCookie(key);

    	// Set in localstorage
    	storeData(key, value);
    }

    return readData(key);
}

function _agile_set_prefs(key, value, days){
        storeData(key, value, days);
}

function _agile_delete_prefs(key){
        eraseData(key);
}