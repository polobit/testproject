/**
 * Function to delete tags from cookie and update agile-tags cookie
 * 
 * @param tags
 */
function agile_deleteTagsFromCookie(tags)
{
	var cookie_tags = agile_read_cookie("agile-tags");
	;
	var cookie_tags_array = cookie_tags.split(",");
	var tags_array = tags.split(",");
	for ( var i = 0; i < cookie_tags_array.length; i++)
	{
		for ( var j = 0; j < tags_array.length; j++)
		{
			if (cookie_tags_array[i] != -1 && cookie_tags_array[i].trim() == tags_array[j].trim())
			{
				cookie_tags_array[i] = -1;
			}
		}
	}
	var final_array = [];
	for ( var i = 0; i < cookie_tags_array.length; i++)
	{
		if (cookie_tags_array[i] != -1)
		{
			final_array.push(cookie_tags_array[i]);
		}
	}
	agile_delete_cookie("agile-tags");
	if (final_array.length > 0)
	{
		agile_create_cookie("agile-tags", final_array.toString(), 5 * 365);
	}
}

function agile_addTagsToCookie(tags)
{
	var cookie_tags = agile_read_cookie("agile-tags");
	var cookie_tags_array = cookie_tags.split(",");
	var tags_array = tags.split(",");
	var final_tags = [];
	for ( var i = 0; i < tags_array.length; i++)
	{
		for ( var j = 0; j < cookie_tags_array.length; j++)
		{
			if (tags_array[i] != -1 && tags_array[i].trim() == cookie_tags_array[j].trim())
			{
				tags_array[i] = -1;
			}
		}
	}
	for ( var i = 0; i < tags_array.length; i++)
	{
		if (tags_array[i] != -1)
		{
			cookie_tags_array.push(tags_array[i]);
		}
	}
	agile_delete_cookie("agile-tags");
	agile_create_cookie("agile-tags", cookie_tags_array.toString(), 5 * 365);
}
