/**
 * Function to remove common tags from cookie array and tags array
 * 
 * @param tags
 */
function agile_removeCommonTags(a, b)
{
	var i = a.length;
	while (--i >= 0)
	{
		var j = b.length;
		while (--j >= 0)
		{
			if (a[i] && a[i].trim() == b[j].trim())
			{
				a.splice(i, 1);
				i = a.length;
			}
		}
	}
	return a;
}

/**
 * Function to remove / add tags to cookie and update agile-tags cookie
 * 
 * @param tags
 * @param action
 */
function agile_cookieTags(tags, action)
{
	var cookie_tags = agile_read_cookie(agile_guid.cookie_tags);
	if (!cookie_tags)
	{
		if (action == "add")
			agile_create_cookie(agile_guid.cookie_tags, tags, 5 * 365);
		return;
	}
	var cookie_tags_array = cookie_tags.split(",");
	var tags_array = tags.split(",");
	agile_delete_cookie(agile_guid.cookie_tags);
	if (action == "delete")
	{
		var new_tags = agile_removeCommonTags(cookie_tags_array, tags_array);
		if (new_tags.length > 0)
		{
			agile_create_cookie(agile_guid.cookie_tags, new_tags.toString(), 5 * 365);
		}
	}
	if (action == "add")
	{
		var tags_to_add = agile_removeCommonTags(tags_array, cookie_tags_array);
		var i = tags_to_add.length;
		while (--i >= 0)
		{
			cookie_tags_array.push(tags_to_add[i]);
		}
		agile_create_cookie(agile_guid.cookie_tags, cookie_tags_array.toString(), 5 * 365);
	}
	return;
}

/**
 * Function to updated lead score when no email is set
 * 
 * @param action
 * @param score
 * @returns
 */
function agile_cookieScore(action, score)
{
	var cookieScore = agile_read_cookie(agile_guid.cookie_score);
	if (!cookieScore)
	{
		if (action == "add" || action == "delete")
			agile_create_cookie(agile_guid.cookie_score, score, 365 * 5);
		return;
	}
	score = parseInt(score);
	agile_delete_cookie(agile_guid.cookie_score);

	if (action == "add")
		cookieScore = parseInt(cookieScore) + score;
	if (action == "delete")
		cookieScore = parseInt(cookieScore) - score;

	if (cookieScore != 0)
		agile_create_cookie(agile_guid.cookie_score, cookieScore.toString(), 365 * 5);
	return;
}

/**
 * Function to subscribe / unsubscribe multiple campaigns when no email
 * 
 * @param action
 * @param data
 * @returns
 */

function agile_cookieCampaigns(action, data)
{
	var cookieCampaigns = agile_read_cookie(agile_guid.cookie_campaigns);
	if (!cookieCampaigns)
	{
		if (action == "add")
		{
			cookieCampaigns = [];
			cookieCampaigns.push(data.id);
			agile_create_cookie(agile_guid.cookie_campaigns, cookieCampaigns.toString(), 365 * 5);
		}
		return;
	}
	cookieCampaigns = cookieCampaigns.split(",");
	agile_delete_cookie(agile_guid.cookie_campaigns);

	if (action == "add" || action == "delete")
	{
		cookieCampaigns = agile_updateCookieCampaigns(action, data, cookieCampaigns);
		if (cookieCampaigns.length > 0)
			agile_create_cookie(agile_guid.cookie_campaigns, cookieCampaigns.toString(), 365 * 5);
	}
	return;
}

function agile_updateCookieCampaigns(action, data, cookieCampaigns)
{
	for ( var i = 0; i < cookieCampaigns.length; i++)
	{
		if (cookieCampaigns[i] == data.id)
		{
			if (action == "add")
				return cookieCampaigns;
			else if (action == "delete")
			{
				cookieCampaigns.splice(i, 1);
				return cookieCampaigns;
			}
		}
	}
	if (action == "add")
	{
		cookieCampaigns.push(data.id);
		return cookieCampaigns;
	}
	if (action == "delete")
		return cookieCampaigns;
}

/**
 * Function to perform default actions on form submit
 * 
 * @param error
 * @param button
 * @param url
 */
function agile_formCallback(error, button, url, agile_form, contact_id, form_data, new_contact)
{
	if (!error[0])
	{
		if (contact_id)
		{
			var form_name = form_data["_agile_form_name"] || (agile_form.getElementsByTagName("legend")[0] ? agile_form.getElementsByTagName("legend")[0].innerHTML
					: "");
			var trigger_url = agile_id.getURL() + "/formsubmit?id=" + agile_id.get() + "&contactid=" + contact_id + "&formname=" + encodeURIComponent(form_name) + "&formdata=" + encodeURIComponent(JSON
					.stringify(form_data)) + "&new=" + new_contact;
			agile_json(trigger_url);
		}
	}
	else if (error[1])
		error[1].innerHTML = error[0];

	setTimeout(function()
	{
		if (error[1])
			error[1].innerHTML = "";

		if (button)
			button.removeAttribute("disabled");

		if (!agile_form.getAttribute("action") || agile_form.getAttribute("action") == "#" || agile_form.getAttribute("action").indexOf("/formsubmit") != -1)
			agile_form.setAttribute("action", url);
		agile_form.submit();
	}, 1500);
}

function _agile_load_form_fields()
{
	var email = agile_read_cookie("agile-email");
	if (!email)
		return;

	_agile.get_contact(email, { success : function(data)
	{
		if (data)
		{
			var rj = {};
			var cp = data.properties;
			for ( var r = 0; r < cp.length; r++)
			{
				rj[cp[r].name] = cp[r].value;
			}
			var form = document.getElementById("agile-form");
			for ( var s = 0; s < form.length; s++)
			{
				if (rj[form[s].name])
				{
					form[s].value = rj[form[s].name];
				}
			}
		}
	}, error : function(data)
	{
		return;
	} });
}
