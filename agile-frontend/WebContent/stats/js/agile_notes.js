/** 
* agile_notes deals with function to add a note with subject,
 * description as parameters to contact by email
 */

/**
 * Add a note to contact based on email
 * 
 * @param subject {String}
 * 				subject field of the note
 * @param description {String}
 * 				content of the note
 * @param callback
 * 				callback for addNote function
 * @param email {String}
 * 				email of the contact
 */
function agile_addNote(data, callback, email)
{
	// Check if email is passed, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-note?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get notes based on contact email
 * @param callback
 * 				callback function for agile_getNote
 * @param email
 * 				email of the contact
 */
function agile_getNotes(callback, email)
{
	if(!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-notes?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}