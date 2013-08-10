function agile_getTagsData(tags, email)
{
	if (!tags)
	{
		return; // No tags found
	}

	if (!email)
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

function agile_addTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-tags?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, callback);
}

function agile_removeTag(tags, callback, email)
{
	var params = agile_getTagsData(tags, email);
	if (!params)
		return;

	// Post
	var agile_url = agile_id.getURL() + "/contacts/remove-tags?callback=?&id=" + agile_id.get() + "&" + params;

	agile_json(agile_url, callback);
}