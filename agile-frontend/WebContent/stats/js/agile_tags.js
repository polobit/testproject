/**
 * agile_tags.js deals with functions to add or remove tags to contact 
 * based on the email of the contact.
 */

/**
 * Add tags to contact based on email
 * 
 * @param tags
 *            {String} tags to be added to contact
 * @param callback
 *            callback for agile_addTag
 * @param email
 *            {String} email of the contact
 */
function agile_addTag(tags, callback, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email) // Check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			agile_cookieTags(tags, "add");
			return;
		}
		else
			email = agile_guid.get_email();
	}

	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;
	
	// Callback
	agile_json(agile_url, callback);
}

/**
 * Remove tags from contact based on email
 * 
 * @param tags
 *            {String} tags to be removed
 * @param callback
 *            callback function for agile_removeTag
 * @param email
 *            {String} email of the contact
 */
function agile_removeTag(tags, callback, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email) // Check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			agile_cookieTags(tags, "delete");
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
		agile_json(agile_url, callback);
}

/**
 * Get tags based on contact email
 * 
 * @param callback
 *            callback function for agile_getTag
 * @param email
 *            email of the contact
 */
function agile_getTags(callback, email)
{
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}".format(encodeURIComponent(email));

	// Get
	var agile_url = agile_id.getURL() + "/contacts/get-tags?callback=?&id=" + agile_id.get() + "&" + params;

	// Callback
		agile_json(agile_url, callback);
}
