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
		Lib_Path = "https://googleapps.agilecrm.com/";
//		Lib_Path = "https://googleapps-dot-sandbox-dot-agile-crm-cloud.appspot.com/";

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

	//  ------ Get user preferences. ------ 
    var Gadget_Prefs = new gadgets.Prefs();
    var Agile_User_Exists = Gadget_Prefs.getString("agile_user_exists");
    
	//  ------ Set account. ------ 
	if (Agile_User_Exists == "true") {
    	var Agile_User_Key = Gadget_Prefs.getString("agile_user_key");
        var Agile_User_Domain = Gadget_Prefs.getString("agile_user_domain");
		//  ------ Download scripts. ------ 
		agile_download_scripts();
    	
		//  ------ Download build UI JavaScript file. ------ 
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/min/agile-gadget-ui.min.js');
		head.ready(function() {
			//  ------ Set account and generate UI. ------ 
			agile_generate_ui(Agile_User_Key, Agile_User_Domain);
		});
	}
	
	//  ------ New user set domain, go for One Time Setup. ------ 
    else {
    	var Agile_User_Popup = Gadget_Prefs.getString("agile_user_popup");
    	var Agile_User_Expire_At = parseInt(Gadget_Prefs.getString("agile_user_expire_at"));
		var Today_Date = new Date().getTime();
    	if(Today_Date < Agile_User_Expire_At)
    		agile_user_setup_load(Agile_User_Popup);
    	else{
    		Gadget_Prefs.set("agile_user_expire_at", "0");
    		agile_send_auth(Lib_Path + 'gmail', agile_handle_load_response);
    	}
	}
}

/**
 * Sends Auth request.
 * 
 * @method agile_send_auth
 * 
 * */
function agile_send_auth(Url, callback){
	
	//  ------ Increase counter and append to request, so that it will not be cached. ------ 
	Timestamp += 1;
	var Url = Url + '?Timestamp=' + Timestamp;
	console.log("Osapi from: " + Url);
	/* ------ 
	 * Hit the server, passing in a signed request (and OpenSocial ID), to 
	 * see if we know who the user is. ------ 
	 */
	osapi.http.get({
		'href' : Url,
		'format' : 'json',
		'authz' : 'signed'
	}).execute(callback);
}

/**
 * Handle login response either go to setup user for registration or load gadget
 * UI.
 * 
 * @method agile_handle_load_response
 * @param {Object}
 *            data Contains info whether user exists or not and session data.
 */
function agile_handle_load_response(data) {

	console.log("Auth response: ");
	console.log(data);
	
	var Gadget_Prefs = new gadgets.Prefs();
    
	if(data.content != undefined){
		//  ------ Check user exists, OpenID must have occurred previously. ------ 
		if (data.content.user_exists == true) {
			data.content.user_exists = "true";
			//  ------ Set user preferences. ------ 
			Gadget_Prefs.set("agile_user_key", data.content.api_key);
			Gadget_Prefs.set("agile_user_domain", data.content.domain);
			Gadget_Prefs.set("agile_user_email", data.content.email);
			Gadget_Prefs.set("agile_user_exists", data.content.user_exists);
			agile_login();
		}
		
		//  ------ User not exist, go for one time domain registration. ------ 
		else {
			data.content.user_exists = "false";
			//  ------ Set user preferences. ------ 
			Gadget_Prefs.set("agile_user_expire_at", data.content.expires_at.toString());
			Gadget_Prefs.set("agile_user_popup", data.content.popup);
			Gadget_Prefs.set("agile_user_exists", data.content.user_exists);
			agile_user_setup_load(data.content.popup);
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
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/js/agile-gadget-email.min.js');
	}
	else{
		//  ------ Gadget supporting JavaScript file. ------ 
		head.js(Lib_Path + 'misc/gmail/gadget-js-all/js/agile-gadget-email.js');
	}
}

//  ------ Window onload event, call method to initiate gadget. ------ 
window.onload = agile_init_gadget;