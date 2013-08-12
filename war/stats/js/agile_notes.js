/**
 * agile_notes deals with function to add a note with subject, 
 * description as parameters to contact by email
 * 
 * @param subject
 * 				subject field of the note
 * @param description
 * 				content of the note
 * @param callback
 * 				callback for addNote function
 * @param email
 * 				email of the contact
 */
function agile_addNote(subject, description, callback, email)
{
	//check if email is passed, else get from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	//converting the parameters to json object
	var data ={};
	data.subject = subject;
	data.description = description;
		
	var params = "data={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/add-note?callback=?&id=" + agile_id.get() + "&" + params;
	console.log(agile_url);
	//callback
	agile_json(agile_url, callback, data);
}