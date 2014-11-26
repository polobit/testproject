/**
 * designerutil.js is the newly added js for adding required utility methods. It 
 * initializes merge fields, modifies URL Visited validation based on condition
 * and initialize tags typeahead.
 * 
 * @author Naresh
 *  
 **/

/**
 * Inserts selected value of merge-fields into target-id field.
 * 
 * @param ele -
 *            select element.
 * @param target_id -
 *            id of target field where value should be inserted.
 * 
 */

function insertSelectedMergeField(ele, target_id)
{
	// current value
	var curValue = $(ele).find(':selected').val();

	// inserts text based on cursor.
	insertAtCaret(target_id, curValue)
}

/**
 * MergeFields function to fetch all available merge-fields.
 * 
 * @param type -
 *            to add specific fields for specific nodes like unsubscribe link to
 *            SendEmail node
 */
function getMergeFields(type)
{

	var options = { "Select Merge Field" : "", "First Name" : "{{first_name}}", "Last Name" : "{{last_name}}", "Score" : "{{score}}",
		"Created Date" : "{{created_date}}", "Modified Date" : "{{modified_date}}", "Email" : "{{email}}", "Company" : "{{company}}", "Title" : "{{title}}",
		"Website" : "{{website}}", "Phone" : "{{phone}}", "City" : "{{location.city}}", "State" : "{{location.state}}", "Country" : "{{location.country}}",
		"Twitter Id" : "{{twitter_id}}", "LinkedIn Id" : "{{linkedin_id}}", "Owner Name" : "{{owner.name}}", "Owner Email" : "{{owner.email}}" };

	// Get Custom Fields in template format
	var custom_fields = get_custom_fields();

	console.log("Custom Fields are");

	console.log(custom_fields);

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	// If type is send_email add unsubscribe link
	if (type !== undefined && type == "send_email")
	{
		// Rename Select Merge field for Send Email
		var json_str = JSON.stringify(merged_json);

		var replaced_json = json_str.replace("Select Merge Field", "Add Merge Field");

		// Parsing the altered string
		merged_json = JSON.parse(replaced_json);

		merged_json["Unsubscribe Link"] = "{{{unsubscribe_link}}}";
	}

	merged_json["Powered by"] = "{{{powered_by}}}";

	return merged_json;
}

/**
 * 
 * 
 */

function getUpdateFields(type)
{

	var options = {

	"First Name" : "first_name", "Last Name" : "last_name", "Email" : "email", "Company" : "company", "Title" : "title", "Website" : "website",
		"Phone" : "phone", };

	// Get Custom Fields in template format
	var custom_fields = get_custom_fields(type);

	console.log("Custom Fields are");

	console.log(custom_fields);

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	return merged_json;
}

function getTwilioIncomingList(type)
{
	var numbers;
	$.ajax({
		  url: 'core/api/sms-gateway/numbers',
		  type: "GET",
		  async:false,
		  dataType:'json',
		  success: function (twilioNumbers) {
			  numbers=  twilioNumbers;
		}
		
	});

	if (numbers == null)
		return null;

	var numbersList = {};
	var length = numbers.length;
	if (length > 0)
	{
		for (var i = 0; i < length; i++)
			numbersList[numbers[i]] = numbers[i];
	}
	// Parse stringify json
	return numbersList;
}

function getCampaignList(type)
{
	var workflows = $.ajax({ type : "GET", url : '/core/api/workflows', async : false, dataType : 'json' }).responseText;

	// Parse stringify json
	var data = JSON.parse(workflows);

	var listOfWorkflows = {"All":"All"};

	$.each(data, function(index, obj)
	{

			//if (key == 'name')
				listOfWorkflows[obj["name"]] = obj["id"];

	});

	return listOfWorkflows;
}

/**
 * Returns custom fields in format required for merge fields. E.g., Nick
 * Name:{{Nick Name}}
 */
function get_custom_fields(type)
{
	var url = window.location.protocol + '//' + window.location.host;

	// Sends GET request for customfields.
	var msg = $.ajax({ type : "GET", url : url + '/core/api/custom-fields/scope?scope=CONTACT', async : false, dataType : 'json' }).responseText;

	// Parse stringify json
	var data = JSON.parse(msg);

	var customfields = {};

	// Iterate over data and get field labels of each custom field
	$.each(data, function(index, obj)
	{
		// Iterate over single custom field to get field-label
		$.each(obj, function(key, value)
		{

			// Needed only field labels for merge fields
			if (key == 'field_label')
			{
				if (type == "update_field")
					customfields[value] = value
				else
					customfields[value] = "{{" + value + "}}"
			}
		});
	});

	return customfields;
}

/**
 * Returns merged json of two json objects
 */
function merge_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}

/**
 * Function to insert text on cursor position in textarea. It inserts the
 * supplied text into the textarea of given id.
 * 
 * @param textareaId -
 *            Id of textarea.
 * 
 * @param text -
 *            text to be inserted, here like merge field
 */
function insertAtCaret(textareaId, text)
{
	var txtarea = document.getElementById(textareaId);
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff" : (document.selection ? "ie" : false));
	if (br == "ie")
	{
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		strPos = range.text.length;
	}
	else if (br == "ff")
		strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0, strPos);
	var back = (txtarea.value).substring(strPos, txtarea.value.length);
	txtarea.value = front + text + back;
	strPos = strPos + text.length;
	if (br == "ie")
	{
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		range.moveStart('character', strPos);
		range.moveEnd('character', 0);
		range.select();
	}
	else if (br == "ff")
	{
		txtarea.selectionStart = strPos;
		txtarea.selectionEnd = strPos;
		txtarea.focus();
	}
	txtarea.scrollTop = scrollPos;
}

/**
 * It is onchange event callback for Url Visited url-type select option. Based
 * on two options available: 1. Contains - It allows part of the text of url,
 * the type should be text. 2. Exact Match - It allows complete url.
 * 
 * @param ele -
 *            select element
 * @param target_id -
 *            id of target element where changes should affect.
 */
function url_visited_select_callback(ele, target_id)
{
	// current value
	var curValue = $(ele).find(':selected').val();

	var tempObj = $('<span />').insertBefore('#' + target_id);

	// if 'contains' selected, make type attribute 'text'
	if (curValue === 'contains')
	{
		// replacing type attribute from url to text
		$('#' + target_id).detach().attr('type', 'text').insertAfter(tempObj).focus();
	}

	// if 'exact_match' selected, make type attribute 'url'
	if (curValue === 'exact_match')
	{
		// replacing type attribute to url.
		$('#' + target_id).detach().attr('type', 'url').insertAfter(tempObj).focus();
	}

	tempObj.remove();
}

/**
 * Retrieves tag objects from TagsAPI. Inserts each tag value within tag object
 * into an array.
 */
function get_tags()
{
	// Fetch tags from collection if defined
	if (window.parent.tagsCollection)
	{
		console.log("Fetching tags from collection...");

		var tags_JSON = window.parent.tagsCollection.toJSON();
		return get_tags_array(tags_JSON);
	}

	var url = window.location.protocol + '//' + window.location.host;

	// Sends GET request for tags.
	var msg = $.ajax({ type : "GET", url : url + '/core/api/tags', async : false, dataType : 'json' }).responseText;

	// Parse stringify json
	var data = JSON.parse(msg);

	return get_tags_array(data);
}

/**
 * Returns array of tags. Separates tags from tag objects and inserts each tag
 * into an array.
 * 
 * @param data -
 *            Tag objects
 */
function get_tags_array(data)
{
	var tags = [];

	// Iterate over data and insert tag values into tags array.
	$.each(data, function(index, obj)
	{
		// Iterate over single tag object to get tag value.
		$.each(obj, function(key, value)
		{

			// Needed only tag values.
			if (key == 'tag')
				tags[index] = value;

		});
	});

	return tags;

}

/**
 * Initialize tags typeahead using jquery ui auto-complete. Shows typeahead on
 * multiple tags separated by comma.
 */
function init_tags_typeahead()
{
	// fetch array of tags.
	var tags_array = get_tags();

	// Initialize tags typeahead for Tags and CheckTags node
	// $('#tag_names, #tag_value').autocomplete({source: tags_array});

	$("#tag_names, #tag_value").autocomplete({ minLength : 0, source : function(request, response)
	{
		// delegate back to autocomplete, but extract the last term
		response($.ui.autocomplete.filter(tags_array, extractLast(request.term)));
	}, focus : function()
	{
		// prevent value inserted on focus
		return false;
	}, select : function(event, ui)
	{

		var terms = split(this.value);

		// remove the current input
		terms.pop();

		// Prevent duplicate tags to insert
		if ($.inArray(ui.item.value, terms) === -1)
		{
			// add the selected item
			terms.push(ui.item.value);
		}

		// add placeholder to get the comma-and-space at the end
		terms.push("");
		this.value = terms.join(", ");

		return false;
	} });

	// Add scroll for tags list
	$('#tag_names, #tag_value').parents('body').find('.ui-autocomplete').css({ 'max-height' : '200px', 'overflow-y' : 'scroll',
	/* prevent horizontal scrollbar */
	'overflow-x' : 'hidden' });

}

/**
 * Utility function to split string based on comma
 */
function split(val)
{
	return val.split(/,\s*/);
}

/**
 * Utility function for array to get last element
 */
function extractLast(term)
{
	return split(term).pop();
}

/**
 * Prefills Send Email's node from name and from email with CurrentUser email
 * and name.
 * 
 * @param nodeJSONDefinition -
 *            node json
 * 
 * @param jsonData -
 *            prefilled data
 * 
 */
function prefill_from_details(nodeJSONDefinition)
{
	try
	{
		var current_domain_user = window.parent.CURRENT_DOMAIN_USER;

		var from_json = { "from_name" : current_domain_user["name"], "from_email" : current_domain_user["email"] }

		return JSON.parse(JSON.stringify(from_json));
	}
	catch (err)
	{
		console.log("Error occured in prefill_from_details...");
		console.log(err);
		return {};
	}
}

/**
 * Disables Text mandatory field only if HTML is given and Text is empty.
 * 
 * @param selector -
 *            nodeui element
 */
function disable_text_required_property(selector)
{
	// Remove 'required' property of 'text' if 'html' is not empty and 'text' is
	// empty
	if (selector.find('#tinyMCEhtml_email').val() != "" && selector.find('#text_email').val() == "")
		selector.find('#text_email').removeProp("required");
}
// Bhasuri 10/25/2014
function getDate(selector)
{
	$('#duration').datepicker({ changeMonth : true, changeYear : true, yearRange : "+0:+100]", constrainInput : false,
	// minDate: 0
	});

}
