/**
 * agile_setEmail reads and checks if
 * email is present in cookie and if email passed is new email then sets it, else
 * resets the agile_session.
 * 
 * @param email
 *            email of the contact
 */
function agile_setEmail(email)
{
	agile_guid.set_email(email);
}
/**
 * Gets the email stored in cookie
 * 
 * @param callback
 * 					callback function
 */
function agile_getEmail(callback)
{
	// Email
	var email = agile_guid.get_email();
	
	// Get
	var agile_url = agile_id.getURL() + "/email?callback=?&id=" + agile_id.get() + "&email=" + encodeURIComponent(email);

	// Request
	agile_json(agile_url, callback);
}