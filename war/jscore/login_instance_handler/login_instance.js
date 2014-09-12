/**
 * Checks if user loggedin in different instance or not.
 * @param pubnub_message
 */
function check_login_instance(pubnub_message)
{
	// Gets current user id
	current_user_id = get_current_user_id();
	
	// Checks if user logged in has same id as in id received from pubnub
	if(pubnub_message.id && pubnub_message.id == current_user_id)
	{
	
		
		// Reads JESSION ID to compare with 
		JSESSIONID = readCookie("JSESSIONID");
		console.log(JSESSIONID);
		session_id_in_message = pubnub_message.session_id;
	
		if(session_id_in_message == JSESSIONID)
			return;
		
		setTimeout(function()
				{
						window.location = "/login";
				}, 3000);
		
		showNotyPopUp('information', "Logging out", "top", 4000);
		
	}
		
}

function get_current_user_id()
{
	return CURRENT_DOMAIN_USER.id	
}

// Publishes user details who logged in to check if someone loggedin with same credentials
function publishLoginEvent(pubnub)
{
	
	var publishJSON = {
			
	};
	publishJSON["type"] = "LOGIN_INSTANCE"
	publishJSON["id"] = CURRENT_DOMAIN_USER.id;
	publishJSON["session_id"] = readCookie("JSESSIONID");
	publishJSON["login_time"] = new Date().getTime();
	
	// Message has data.
	pubnub.publish({ channel : "_localhost", message : publishJSON, callback : function(info)
	{
		console.log(info);
	}});
}