/**
 * agile_tags.js deals with functions to add or remove tags to contact 
 * based on the email of the contact.
 */
/**
 * Checks and returns parameters tags and email as params
 * @param tags
 * 				tags to be added to the contact
 * @param email
 * 				email of the contact
 * @returns
 * 			params
 */
function agile_getTagsData(tags, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email)	// check if email is passed else get it from cookie
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var params = "email={0}&tags={1}".format(encodeURIComponent(email), encodeURIComponent(tags));

	return params;
}
/**
 * Add tags to contact based on email
 * @param tags
 * 			   tags to be added to contact
 * @param callback
 * 				callback for agile_addTag
 * @param email
 * 				email of the contact
 */		
function agile_addTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)		//if no params return 
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;
	//callback
	agile_json(agile_url, callback);
}

function agile_removeTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)		//if no params return
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;
	//callback
	agile_json(agile_url, callback);
}