function startCallScriptWidget(){
	// CallScript widget name as a global variable
	CallScript_PLUGIN_NAME = "CallScript";

	// Twilio loading image declared as global
	CALLSCRIPT_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	if(App_Widgets.Catalog_Widgets_View)
	  var callscript_widget = App_Widgets.Catalog_Widgets_View.collection.where({ name : CallScript_PLUGIN_NAME })[0].toJSON();
	else
	// Following wont give current updated widget 
	  var callscript_widget = agile_crm_get_widget(CallScript_PLUGIN_NAME);

	// ID of the CallScript widget as global variable
	CallScript_Plugin_Id = callscript_widget.id;

	/*
	 * Gets CallScript widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget
	 */
	if (callscript_widget.prefs == undefined || callscript_widget.prefs == "{}")
	{
		// show default text
		$('#CallScript').html("<div class='wrapper-sm'>Welcome to CallScript</div>");
		return;
	}			
	
	// Parse string preferences as JSON
	var callscript_prefs = JSON.parse(callscript_widget.prefs);

	_agile_contact = agile_crm_get_contact();
	
	// Apply call script rules
	_agile_execute_callscriptrules(callscript_prefs.csrules);
}

//Run callscriptrules against a contact
function _agile_execute_callscriptrules(_agile_web_rules)
{
	// Get All callscriptrules and execute each
	for ( var j = 0; j < _agile_web_rules.length; j++)
	{
		if(_agile_execute_callscriptrule(_agile_web_rules[j]))
			{
			console.log("condition applied");
			return;			
			}			
	}
	
	// show default text as no rule defined 
	$('#CallScript').html("<div class='wrapper-sm'>No matching call script found.</div>");	
}

// Run a single web rule
function _agile_execute_callscriptrule(callscriptrule)
{
	// Get all conditions and return if any of it doesn't match
	var l = callscriptrule.rules.length;
	for ( var i = 0; i < l; i++)
	{
		var condition = callscriptrule.rules[i];

		if (!_agile_check_condition(condition))
		 {
			console.log("not matched: ")
			return false;
		 }
	}
		
	// Replace data with merge fields
	var displayText = replaceMergeFields(callscriptrule.displaytext);
	// show text as per rules
	$('#CallScript').html("<div class='wrapper-sm'><span class='text-base'>"+displayText+"</span></div>");	
	
	return true;
}

// Replace data of contact with merge fields
function replaceMergeFields(displayText)
{
	var result = displayText;
	
	// Get merge fields	
	var matches = [];

	var pattern = /\{{(.*?)\}}/g;
	var match;
	while ((match = pattern.exec(displayText)) != null)
	{
	  matches.push(match[1]);
	}
	
    // Counter for how many merge fields replcae with data
	var j = 0;
	
	// Replace merge fields with data
	for(var i =0;i<matches.length;i++)
	{	  
	  // Get contact property data
	  var k = _agile_contact.properties.length;
		for ( var s = 0; s < k; s++)
		{			
			// Check if contact properties from callscriptrules match with contact properties
			if (_agile_contact.properties[s].name == matches[i])
			{
				// Replace merge fields with contact property data
				result = result.replace('{{'+matches[i]+'}}', _agile_contact.properties[s].value);				
				j++;
			} // if end
		} // for end s	  	
 	}// for end i
		
	// if no such field found, then replace with null
	while(j != matches.length)
	 {		
		var match;
		while ((match = pattern.exec(result)) != null)
		{
			// Replace remaining merge fields which are not with contact property data
			result = result.replace(match[0], "");
			j++;
		}
  	 }
	return result;
}

//Core Function which checks if the condition matches with the contact (global)
function _agile_check_condition(condition)
{
	switch (condition.LHS) {
	case "tags":
	{
		switch (condition.CONDITION) {
		case "EQUALS":
			return _agile_rules["tags_in"](condition);
		case "NOTEQUALS":
			return _agile_rules["tags_out"](condition);
		}

	}
		break;	
	case "tags_time":
		return _agile_rules["tags_time"](condition);
	case "created_time":
		return _agile_rules["contact_time"](condition);
	case "title":
	{
		switch (condition.CONDITION) {
		case "EQUALS":
			return _agile_rules["contact_properties_in"](condition);
		case "NOTEQUALS":
			return _agile_rules["contact_properties_out"](condition);
		}
	}
		break;
	case "company":
	{
		switch (condition.CONDITION) {
		case "EQUALS":
			return _agile_rules["contact_properties_in"](condition);
		case "NOTEQUALS":
			return _agile_rules["contact_properties_out"](condition);
		}
	}
		break;
	case "lead_score":
	{
		switch (condition.CONDITION) {
		case "IS_LESS_THAN":
			return _agile_rules["max_score"](condition);
		case "IS_GREATER_THAN":
			return _agile_rules["min_score"](condition);
		case "EQUALS":
			return _agile_rules["score"](condition);
		}
	}
		break;		
	case "visitor":
	{
		switch (condition.CONDITION) {
		case "KNOWN":
			return _agile_rules["is_known_visitor"](condition);
		case "UNKNOWN":
			return _agile_rules["is_unknown_visitor"](condition);
		}
	}
		break;	
	case "owner_id":
	{
		switch (condition.CONDITION) {
		case "EQUALS":
			return _agile_rules["owner_is"](condition);
		case "NOTEQUALS":
			return _agile_rules["owner_is_not"](condition);
		}
	}
		break;
	default:
	{		
		switch (condition.CONDITION) {
		case "EQUALS":
			return _agile_rules["contact_properties_in"](condition);			
		case "NOTEQUALS":
			return _agile_rules["contact_properties_out"](condition);			
		case "MATCHES":
			return _agile_rules["contact_properties_match"](condition);
		case "NOT_CONTAINS":
			return _agile_rules["contact_properties_doesnot_match"](condition);
		default:
		{
			return _agile_rules["custom_time"](condition);
		}
		}
	}
	}
}

var _agile_rules = {

	// To check if tags are equal
	tags_in : function(condition)
	{
		if (condition.RHS && _agile_contact)
		{
			var j = _agile_contact.tags.length;
			for ( var l = 0; l < j; l++)
			{

				// Check if tags from callscriptrules match with contact
				// tags
				if (condition.RHS === _agile_contact.tags[l])
				{
					return true;
				}
			}
		}
	},

	// To check if tags are not equal
	tags_out : function(condition)
	{
		// If contact is not present, return true as he doesn't have any tags
		if (!_agile_contact)
			return true;

		if (_agile_contact && condition.RHS)
		{
			var flag = 0;
			var j = _agile_contact.tags.length;
			for ( var l = 0; l < j; l++)
			{

				// Check if tags from callscriptrules match contact tags
				if (_agile_contact.tags[l] !== condition.RHS)
				{
					flag++;
				}
			}
			if (flag == j && flag !== 0 && j !== 0)
				return true;
		}
	},

	// To check if tags match and verify time conditions like tags created
	// after, before, in the last specified days
	tags_time : function(condition)
	{
		if (condition.RHS && _agile_contact)
		{
			var tag = condition.RHS;
			var time = condition.nested_lhs;
			var time_max = condition.nested_rhs;

			var j = _agile_contact.tagsWithTime.length;
			for ( var l = 0; l < j; l++)
			{
				if (tag == _agile_contact.tagsWithTime[l].tag)
				{
					var current_time = new Date().getTime();
					var created_time = (_agile_contact.tagsWithTime[l].createdTime);
					var dif = (current_time - created_time);
					if ((condition.nested_condition == "LAST" && (0 <= dif && dif <= (time * 86400000))) || (condition.nested_condition == "AFTER" && (time <= created_time) && ((created_time - time) >= 86400000)) || (condition.nested_condition == "BEFORE" && (time >= created_time)) || (condition.nested_condition == "EQUALS" && (0 <= (created_time - time) && (created_time - time) <= 86400000)) || (condition.nested_condition == "BETWEEN" && (time <= created_time && created_time <= time_max)))
					{
						return true;
					}
				}
			}
		}
	},

	// To check if score greater than min_score
	min_score : function(condition)
	{
		if (_agile_contact && condition.RHS && _agile_contact.lead_score > condition.RHS)
			return true;
	},

	// To check if score less than max_score
	max_score : function(condition)
	{
		if (_agile_contact && condition.RHS && _agile_contact.lead_score < condition.RHS)
			return true;
	},

	// To check if score is equal to score
	score : function(condition)
	{
		if (_agile_contact && condition.RHS && _agile_contact.lead_score == condition.RHS)
			return true;
	},

	// To check if referrer url matches with url in callscriptrules
	referrer_is : function(condition)
	{
		if (condition.RHS == document.referrer)
			return true;
	},

	// To check if referrer url matches with specified string in callscriptrules
	referrer_matches : function(condition)
	{
		var url = document.referrer;
		if (url.indexOf(condition.RHS) !== -1)
			return true;
	},

	// To check if referrer url does not matches with specified string in
	// callscriptrules
	referrer_not_matches : function(condition)
	{
		var url = document.referrer;
		if (url.indexOf(condition.RHS) == -1)
			return true;
	},

	// To check if referrer url doesnot match with url in callscriptrules
	referrer_is_not : function(condition)
	{
		if (condition.RHS !== document.referrer)
			return true;
	},

	// To check current page matches with given url in callscriptrules
	page_view_is : function(condition)
	{
		if (condition.RHS === document.location.href)
			return true;
	},

	// To check if referrer url doesnot match with url in callscriptrules
	page_view_is_not : function(condition)
	{
		if (condition.RHS !== document.location.href)
			return true;
	},

	// To check if page url does not matches with specified string in
	// callscriptrules
	page_view_not_matches : function(condition)
	{
		var url = document.location.href;
		if (url.indexOf(condition.RHS) == -1)
			return true;
	},

	// To check if current page url matches with given string in callscriptrules
	page_view_matches : function(condition)
	{
		var url = document.location.href;
		if (url.indexOf(condition.RHS) !== -1)
			return true;
	},

	// To check if contact properties match or not
	contact_properties_in : function(condition)
	{		
		if (_agile_contact && condition.RHS)
		{
			var k = _agile_contact.properties.length;
			for ( var s = 0; s < k; s++)
			{
				// Check if contact properties from callscriptrules match with
				// contact properties
				if (condition.LHS == _agile_contact.properties[s].name && condition.RHS == _agile_contact.properties[s].value)
				{
					return true;
				}
			}
		}
	},

	// To check if contact properties do not match
	contact_properties_out : function(condition)
	{
		if (_agile_contact && condition.RHS)
		{
			var flag = 0;
			var k = _agile_contact.properties.length;
			for ( var h = 0; h < k; h++)
			{

				// Check if contact properties from callscriptrules match with
				// contact properties
				if (condition.LHS == _agile_contact.properties[h].name && condition.RHS != _agile_contact.properties[h].value)
				{
					return true;
				}
				if (condition.LHS !== _agile_contact.properties[h].name)
					flag++;
			}
			if (flag == k && flag != 0 && k != 0)
				return true;
		}
	},

	// To check contact created time is after, before or in the last few
	// days
	contact_time : function(condition)
	{
		if (_agile_contact && condition.RHS)
		{
			var current_time = new Date().getTime();
			var created_time = (_agile_contact.created_time * 1000);
			var dif = (current_time - created_time);
			var time = condition.RHS;
			var time_max = condition.RHS_NEW;
			if ((condition.CONDITION == "LAST" && (0 <= dif && dif <= (time * 86400000))) || (condition.CONDITION == "AFTER" && (time <= created_time) && ((created_time - time) >= 86400000)) || (condition.CONDITION == "BEFORE" && (time >= created_time)) || (condition.CONDITION == "ON" && (0 <= (created_time - time) && (created_time - time) <= 86400000)) || (condition.CONDITION == "BETWEEN" && (time <= created_time && created_time <= time_max)))
				return true;
		}
	},

	// To check custom date condition is after, before or in the last few
	// days
	custom_time : function(condition)
	{
		if (_agile_contact && condition.RHS)
		{
			var time = condition.RHS;
			var time_max = condition.RHS_NEW;
			var l = _agile_contact.properties.length;
			for ( var g = 0; g < l; g++)
			{
				if (condition.LHS == (_agile_contact.properties[g].name + "_time"))
				{
					var current_time = new Date().getTime();
					var property_time = _agile_contact.properties[g].value * 1000;
					var dif = (current_time - property_time);
					if ((condition.CONDITION == "LAST" && (0 <= dif && dif <= (time * 86400000))) || (condition.CONDITION == "AFTER" && (time <= property_time) && ((property_time - time) >= 86400000)) || (condition.CONDITION == "BEFORE" && (time >= property_time)) || (condition.CONDITION == "ON" && (0 <= (property_time - time) && (property_time - time) <= 86400000)) || (condition.CONDITION == "BETWEEN" && (time <= property_time && property_time <= time_max)))
						return true;
				}
			}
		}
	},

	// To check owner equals
	owner_is : function(condition)
	{
		if (_agile_contact && condition.RHS && _agile_contact.owner.id.toString() == condition.RHS)
			return true;
	},

	// To check if owner is not equal
	owner_is_not : function(condition)
	{
		if (_agile_contact && condition.RHS && _agile_contact.owner.id.toString() !== condition.RHS)
			return true;
	},

	// To check if contact custom properties contains input string
	contact_properties_match : function(condition)
	{
		if (_agile_contact && condition.RHS)
		{
			var k = _agile_contact.properties.length;
			for ( var g = 0; g < k; g++)
			{
				if ((condition.LHS == _agile_contact.properties[g].name) && _agile_contact.properties[g].value && (_agile_contact.properties[g].value
						.indexOf(condition.RHS) !== -1))
					return true;
			}
		}
	},

	// To check if contact custom properties doesnot contains input string
	contact_properties_doesnot_match : function(condition)
	{
		if (_agile_contact && condition.RHS)
		{
			var k = _agile_contact.properties.length;
			var a = 0;
			for ( var g = 0; g < k; g++)
			{
				if ((condition.LHS == _agile_contact.properties[g].name) && _agile_contact.properties[g].value && (_agile_contact.properties[g].value
						.indexOf(condition.RHS) == -1))
					return true;
				if (condition.LHS !== _agile_contact.properties[g].name)
					a++;
			}
			if (a == k && k != 0 && a != 0)
				return true;
		}
	},

	// To check if cart is empty
	is_cart_empty : function(condition)
	{
		try
		{
			return (_agile_shopify_cart.item_count == 0);
		}
		catch (e)
		{
		}

		return false;
	},

	// To check if cart is not
	is_cart_not_empty : function(condition)
	{
		try
		{
			return (_agile_shopify_cart.item_count != 0);
		}
		catch (e)
		{
		}

		return false;
	},

	// To check if cart has a particular item
	cart_has_item : function(condition)
	{
		try
		{
			for ( var i = 0; i < _agile_shopify_cart.items.length; i++)
			{
				if (condition.RHS == _agile_shopify_cart.items[i].title)
				{
					return true;
				}
			}
			return false;
		}
		catch (e)
		{
		}

		return false;
	},

	// To check if cart value is greater than
	cart_value_greater_than : function(condition)
	{
		try
		{
			return ((_agile_shopify_cart.total_price / 100) >= condition.RHS);
		}
		catch (e)
		{
		}

		return false;
	},

	// To check if cart value is less than
	cart_value_less_than : function(condition)
	{
		try
		{
			return ((_agile_shopify_cart.total_price / 100) <= condition.RHS);
		}
		catch (e)
		{
		}

		return false;
	},

	// To check if device is mobile
	is_mobile : function(condition)
	{
		try
		{
			return (_agile_is_mobile_browser() && condition.RHS == "MOBILE");
		}
		catch (e)
		{
		}
	},

	// To check if device is not mobile
	is_not_mobile : function(condition)
	{
		try
		{
			return (!_agile_is_mobile_browser() && condition.RHS == "MOBILE");
		}
		catch (e)
		{
		}
	},

	// To check if visitor is known or not
	is_known_visitor : function(condition)
	{
		if (typeof _agile_email == "string" && typeof _agile_contact !== "undefined")
			return true;
	},

	// To check if visitor is unknown
	is_unknown_visitor : function(condition)
	{
		if (typeof _agile_email !== "string" || typeof _agile_contact == "undefined")
			return true;
	},

	// To check if callscriptrule_id is present in only once persistent cookie
	once : function(condition)
	{
		if (!agile_read_cookie("agile-callscriptrules_v2"))
			return true;

		if (_agile_callscriptrule_get_cookie("agile-callscriptrules_v2", condition.callscriptrule_id))
			return false;
	},

	// To check if callscriptrule_id is present in once per session session cookie
	once_per_session : function(condition)
	{
		if (!agile_read_cookie("agile-session-callscriptrules_v2"))
			return true;

		if (_agile_callscriptrule_get_cookie("agile-session-callscriptrules_v2", condition.callscriptrule_id))
			return false;
	},

	// To check for web rule count
	max_of : function(condition)
	{
		if (!agile_read_cookie("agile-maxof-callscriptrules_v2"))
			return true;

		var web_rule_cookie = _agile_callscriptrule_get_cookie("agile-maxof-callscriptrules_v2", condition.callscriptrule_id);
		if (!web_rule_cookie)
			return true;

		return (condition.RHS > web_rule_cookie.count);

	},

	// To check for web rule time
	once_every : function(condition)
	{
		if (!agile_read_cookie("agile-every-callscriptrules_v2"))
			return true;

		var web_rule_cookie = _agile_callscriptrule_get_cookie("agile-every-callscriptrules_v2", condition.callscriptrule_id);
		if (!web_rule_cookie)
			return true;

		// Get Web Rule Cookie time and add the condition time (in mins)
		var time = web_rule_cookie.time + condition.RHS * 1000 * 60;

		return (new Date().getTime() > time);
	},

	// To check if country matches
	country_is : function(condition)
	{
		return (condition.RHS == condition.callscriptrule_country);
	},

	// To check if country doesnt match
	country_is_not : function(condition)
	{
		return (condition.RHS != condition.callscriptrule_country);
	},

	// To check if userAgent is equal
	ua_is : function(condition)
	{
		return (window.navigator.userAgent == condition.RHS);
	},

	// To check if userAgent is not equal
	ua_is_not : function(condition)
	{
		return (window.navigator.userAgent !== condition.RHS);
	},

	// To check if userAgent contains
	ua_contains : function(condition)
	{
		return (window.navigator.userAgent.indexOf(condition.RHS) != -1);
	},

	// To check if userAgent doesnot contains
	ua_not_contains : function(condition)
	{
		return (window.navigator.userAgent.indexOf(condition.RHS) == -1);
	},

	// To execute callscriptrule everytime
	everytime : function(condition)
	{
		return true;
	} };
