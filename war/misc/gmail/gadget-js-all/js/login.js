/**
 * Login to open gadget or setup user account by association.
 * 
 * @method agile_login
 */
function agile_login() {

	// Get API Key
	var api_key = agile_get_prefs(PREFS_API_KEY);	
	console.log("API Key from Prefs = " + api_key);
	
	// Show Emails Matched
	if (api_key) {
		
		// Get Domain
		var domain = agile_get_prefs(PREFS_DOMAIN);
		
		// Set Domain and API_Key
		console.log("Setting API key " + api_key +  " " + domain);
		
		_agile.set_account(api_key, domain);		
		
		agile_user_associated();
		agile_show_delete(true);
		
		return;
	}

	// Show User Setup - Choose Domain Form
	agile_user_show_association();
	agile_show_delete(false);
}


function agile_show_delete(status)
{
	if(status)
		$('#delete-button').show();
	else
		$('#delete-button').hide();
	$('#delete-button').live('click',agile_delete_all_prefs);	
}