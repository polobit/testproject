/**
 * agile_tasks.js deals with functions to add or get task based on contact email
 * 
 * @module stats
 */

/**
 * Add a task to contact based on email 
 * @param data {Object}
 *            data consists of type example : CALL/EMAIL/FOLLOW_UP/MEETING/MILESTONE/SEND/TWEET 
 *            priority type example : HIGH/NORMAL/LOW, subject of task etc
 * @param callback
 *            callback for addTask function
 * @param email {String}
 *            email of the contact
 */
function agile_addTask(data, callback, email)
{
	// Check if email is passed else get email from cookie
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
	
	// Callback
	agile_json(agile_url, callback);
}

/**
* Get tasks of contact based on email
* 
* @param email {String}
* 						email of the contact
* 
* @return callback
* 					callback function for getTask
*/
function agile_getTasks(callback, email)
{
	// Check if email is passed else get email from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	
	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-tasks?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}