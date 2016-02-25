/**
 * Checks if user loggedin in different instance or not.
 * @param pubnub_message
 */
 var IPCHECK = ["183.83.0.113","117.247.178.90","117.247.109.22","117.247.109.20"];
function check_login_instance(pubnub_message)
{
	
	// Gets current user id
	current_user_id = get_current_user_id();
	
	console.log(pubnub_message);
	// Checks if user logged in has same id as in id received from pubnub
	if(pubnub_message.id && pubnub_message.id == current_user_id)
	{
		// Reads JESSION ID to compare with 
		JSESSIONID = readCookie("JSESSIONID");
		console.log(JSESSIONID);
		session_id_in_message = pubnub_message.session_id;
		var pubnub_ip = pubnub_message.CURRENTIP;
		var pubnub_loginFromPanel = pubnub_message.LOGIN_FROM_PANEL;
		if(session_id_in_message == JSESSIONID)
			return;
		if($.inArray(CURRENTIP, IPCHECK) != -1 && LOGIN_FROM_PANEL == "true")
			return;
		if(pubnub_ip != undefined && pubnub_loginFromPanel != undefined && $.inArray(pubnub_ip, IPCHECK) != -1 && pubnub_loginFromPanel == "true")
			return;
		if(pubnub_message.login_time < get_current_user_loggedin_time())
			return;

		// If mobile no logout on other end
		if(agile_is_mobile_browser())
			   return;
		
		pubnub_message["email"] = get_current_user_email();
		
		// Sets cookie to user it in error page to show information. 0.0025 is 10min in approx
		createCookie("_multiple_login", JSON.stringify(pubnub_message), 0.0025);
		
		window.location = "/login?ml=true";
		
		
	}
		
}

/**
 * Gets user logged in time
 * @returns
 */
function get_current_user_loggedin_time()
{
	
	var infoJSON = CURRENT_DOMAIN_USER.info_json_string;
	
	infoJSON = JSON.parse(infoJSON);
	return infoJSON.logged_in_time;
}

function get_current_user_id()
{
	return CURRENT_DOMAIN_USER.id	
}

function get_current_user_email()
{
	return CURRENT_DOMAIN_USER.email	
}


// Publishes user details who logged in to check if someone loggedin with same credentials
function publishLoginEvent(pubnub)
{

	// If mobile no logout on other end
	if(agile_is_mobile_browser())
		   return;
	
	var publishJSON = {
			
	};
	publishJSON["type"] = "LOGIN_INSTANCE"
	publishJSON["id"] = CURRENT_DOMAIN_USER.id;
	publishJSON["session_id"] = readCookie("JSESSIONID");
	publishJSON["login_time"] = get_current_user_loggedin_time()
	publishJSON["userAgent"] = getBrowserDetails();
	publishJSON["CURRENTIP"] = CURRENTIP;
	publishJSON["LOGIN_FROM_PANEL"] = LOGIN_FROM_PANEL;
	console.log(getBrowserDetails());
	
	// Message has data.
	pubnub.publish({ channel : CURRENT_DOMAIN_USER.domain, message : publishJSON, callback : function(info)
	{
		console.log(info);
	}});
}

function getBrowserDetails()
{
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1) 
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
	          (verOffset=nAgt.lastIndexOf('/')) ) 
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion); 
	 majorVersion = parseInt(navigator.appVersion,10);
	}
	
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

	var json = {};
	json["browser_name"] = browserName;
	json["full_version"] = fullVersion;
	json["major_version"] = majorVersion;
	json["app_name"] = navigator.appName;
	json["navigator.userAgent"] = navigator.userAgent;
	json["OSName"] = OSName;
	
	return json;

}
