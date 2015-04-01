/**
 * gadget-main.js is starting point of gadget. When we open any email, gmail
 * contextual gadget is triggered based on the extractor (defined in
 * agile-extractor.xml) definition. It loads agile-gadget.xml, window onload
 * calls init method.
 * 
 * This file consist gadget login and script loading.
 * 
 * @author Dheeraj
 */

/*
 * Global variables:- 1) _agile - Access agile API methods through it, 2)
 * Is_Localhost - Local host identifier, 3) Lib_Path - Set library path based on
 * local host or production. 4) Contacts_Json - holds contact detail object,
 * which helps in loading contacts without sending server request. 5) Timestamp -
 * Helps in making new Auth request every time. 
 */
var _agile = _agile || [];
var Is_Localhost = false;
var Lib_Path = "";
var Ac_Email = "";
var Contacts_Json = {};
var Timestamp = 0;

/**
 * Initialize gadget for Local host or Production.
 * 
 * @method agile_init_agle_gadget
 */
function agile_init_gadget() {

	//  ------ Check for Local host, set Lib_Path, check cookie and download scripts. ------ 
	if (window.location.host.indexOf("localhost") != -1) {

		Is_Localhost = true;
		//  ------ Set library path. ------ 
		Lib_Path = "http://localhost:8888/";
		//  ------ Set account holder's email id in global variable. ------ 
		Ac_Email = "test@example.com";
		//  ------ Download scripts. ------ 
		agile_download_scripts();
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/js/agile-gadget-ui.js');

		head.ready(function() {
			
			//  ------ Set user data and generate UI. ------ 
			agile_generate_ui("51ekokl790t85b11ivhim9ep7i","localhost");
		});
	}
	
	//  ------ Production version, go for login. ------ 
	else {
		//  ------ Set library path. ------ 
		//Lib_Path = "https://googleapps.agilecrm.com/";
		Lib_Path = "https://googleapps-dot-mcsandbox-dot-agile-crm-cloud.appspot.com/";

		//  ------ Login ------ 
		agile_login();
		gadgets.window.adjustHeight();
	}
}

/**
 * Login to open gadget or setup user account by association.
 * 
 * @method agile_login
 */
function agile_login() {
	
	console.log("Logging in");

	/**
	 *  Generate gadget main UI, when user is associated.
	 *  And downloads library files first then setup account.
	 *  
	 *  @method agile_user_associated
	 *  @param {String} Agile_User_Key user's API key used in requests.
	 *  @param {String} Agile_User_Domain user's domain name by which it is associated.
	 * 
	 * */
	function agile_user_associated(Agile_User_Key, Agile_User_Domain){
	  
	  //  ------ Download scripts. ------ 
	  agile_download_scripts();
      
	  //  ------ Download build UI JavaScript file. ------ 
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-ui.min.js');
	  head.ready(function() {
		//  ------ Set account and generate UI. ------ 
		agile_generate_ui(Agile_User_Key, Agile_User_Domain);
      });	
	}
	
	/**
	 * Generate gadget setup UI, when user is not associated.
	 * 
	 * @method agile_user_notassociated
	 * @param {String} Agile_User_Data user info date read from cookie.
	 * */
	function agile_user_notassociated(Agile_User_Data){

		/*
		 * Compare expiration time of server cookie which holds user gadget id
		 * with current time (in epoc date/time format).
		 * */
		var Agile_User_Popup = Agile_User_Data.popup;
        var Agile_User_Expire_At = Agile_User_Data.expires_at;
        var Today_Date = new Date().getTime();
        if(Today_Date < Agile_User_Expire_At)
        	//  ------ server cookie not expired load one time setup. ------
        	agile_user_setup_load(Agile_User_Popup);
        else{
        	//  ------ server cookie is expired ask server for fresh user info data. ------
        	agile_send_auth(Lib_Path + 'gmail', agile_handle_load_response);
        }
	}
	
	//  ------ Get user preferences. ------ 
    var Agile_Gadget_Prefs = new gadgets.Prefs();
    var Agile_User_Exists = Agile_Gadget_Prefs.getString("agile_user_exists");
    //  ------ Get cookie data. ------
    var Agile_Cookie = agile_gadget_read_cookie("agile_cookie");
    var Agile_User_Data = JSON.parse(Agile_Cookie);
    
	//  ------ Check for user preferences. ------ 
	if (Agile_User_Exists == "true") {
	  	
	  var Agile_User_Key = Agile_Gadget_Prefs.getString("agile_user_key");
      var Agile_User_Domain = Agile_Gadget_Prefs.getString("agile_user_domain");
      //  ------ Setup account and generate UI. ------
      agile_user_associated(Agile_User_Key, Agile_User_Domain);
      //  ------ Delete cookie. ------
      agile_gadget_erase_cookie("agile_cookie");
    }
	
    else {
      
    	//  ------ Check for cookie's presence, if user preferences are not present. ------
    	if(Agile_Cookie == null){
    	    //  ------ Ask server for fresh user info data. ------
    		agile_send_auth(Lib_Path + 'gmail', agile_handle_load_response);  
    	}
      
    	else{
    		if(Agile_User_Data.user_exists == "true"){
	    	    //  ------ Set user preferences. ------ 
	    		Agile_Gadget_Prefs.set("agile_user_key", Agile_User_Data.api_key);
	    		Agile_Gadget_Prefs.set("agile_user_domain", Agile_User_Data.domain);
	    		Agile_Gadget_Prefs.set("agile_user_email", Agile_User_Data.email);
	    		Agile_Gadget_Prefs.set("agile_user_exists", Agile_User_Data.user_exists);
			
	    		agile_user_associated(Agile_User_Data.api_key, Agile_User_Data.domain);  
	    	}
	      
		    else{
		    	agile_user_notassociated(Agile_User_Data);  
		    }  
    	}
    }
}


/**
 * Download setup file and set user domain.
 * 
 * @method agile_user_setup_load
 * @param {Object} data accepts data used to setup user domain.
 * */
function agile_user_setup_load(data){

	//  ------ Download build UI JavaScript file. ------ 
	head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-setup.min.js', function() {
		agile_user_setup(data);
	});
}
/**
 * Download library and supporting script file for GUI building.
 * 
 * @method agile_download_scripts
 */
function agile_download_scripts() {

	console.log("Downloading scripts");
	//  ------ handlebars, md5, util, bootstrap, agile-min ------ 
	head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-lib.min.js');
	if(!Is_Localhost){
		//  ------ Gadget supporting JavaScript file minified. ------ 
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-email.min.js');
	}
	else{
		//  ------ Gadget supporting JavaScript file. ------ 
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-email.js');
	}
}

//  ------ Window onload event, call method to initiate gadget. ------ 
window.onload = agile_init_gadget;

// ------------------------------------------------- agile-gadget-cookie.js --------------------------------------------- START --

/**
 * agile-gadget-cookie.js deals with functions used to create, read and erase a cookie.
 * 
 * @author Dheeraj
 */

/**
 * Creates a session cookie variable with the given name and value.
 * 
 * @method agile_gadget_create_cookie
 * @param {String}
 *            name Name of the variable example : agile-email etc.
 * @param {String}
 *            value Value of the variable example: agilecrm@example.com
 * @param {Integer} 
 * 			  days Sets cookie expiration time example: days=0 sets browser session cookie.
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
	agile_gadget_create_cookie(name, "", -1);
}


//------------------------------------------------- agile-gadget-cookie.js --------------------------------------------- END --