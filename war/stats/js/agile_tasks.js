/**
 * agile_tasks.js deals with function to add task to contact based on email
 * @param data
 * 			 data consists of type eg: CALL/EMAIL/FOLLOW_UP/MEETING/MILESTONE/SEND/TWEET
 * 			 priority type eg : HIGH/NORMAL/LOW, subject of task etc
 * @param callback
 * 				callback for addTask function
 * @param email
 * 				email of the contact
 * @module stats
 */
function agile_addTask(data, callback, email)
{
	//check if email is passed else get email from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "task={0}&email={1}".format(encodeURIComponent(JSON.stringify(data)), encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/task?callback=?&id=" + agile_id.get() + "&" + params;
	//callback
	agile_json(agile_url, callback, data);
}