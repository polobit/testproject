/**
 * Generate gadget main UI, when user is associated. And downloads library files
 * first then setup account.
 * 
 * @method agile_user_associated
 * @param {String}
 *            Agile_User_Key user's API key used in requests.
 * @param {String}
 *            Agile_User_Domain user's domain name by which it is associated.
 * 
 */
function agile_user_associated() {

	// Get all emails
	var emails = agile_get_emails();
	
	Contacts_Json = {};
	$.each(emails, function(index, value)
	{
		//if(value.email != agile_get_prefs(PREFS_EMAIL))
		if(value.email != 'test1@gmail.com')
		Contacts_Json[value.email] = value;
	});
	
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH + 'jscore/md5.js', function() {
		
		set_html($('#agile_content'), 'search', Contacts_Json);
	});
	
}
