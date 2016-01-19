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

var _CONTACT_CUSTOM_FIELDS = undefined;

function insertSelectedMergeField(ele, target_id) {
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
function getMergeFields(type, callback) {

	var options = {
		"Select Merge Field" : "",
		"First Name" : "{{first_name}}",
		"First Name Fix" : "{{first_name_fix}}",
		"Last Name" : "{{last_name}}",
		"Last Name Fix" : "{{last_name_fix}}",
		"Name Fix" : "{{name_fix}}",
		"Score" : "{{score}}",
		"Created Date" : "{{created_date}}",
		"Modified Date" : "{{modified_date}}",
		"Email" : "{{email}}",
		"Company" : "{{company}}",
		"Title" : "{{title}}",
		"Website" : "{{website}}",
		"Phone" : "{{phone}}",
		"City" : "{{location.city}}",
		"State" : "{{location.state}}",
		"Country" : "{{location.country}}",
		"Twitter Id" : "{{twitter_id}}",
		"LinkedIn Id" : "{{linkedin_id}}",
		"Owner Name" : "{{owner.name}}",
		"Owner Email" : "{{owner.email}}",
		"Owner calendar URL" : "{{owner.calendar_url}}",
		"Owner Signature" : "{{{owner.signature}}}"
	};

	// Get Custom Fields in template format
	var custom_fields;

	// Cache Contact Custom fields
	if (_CONTACT_CUSTOM_FIELDS)
		custom_fields = _CONTACT_CUSTOM_FIELDS
	else {
		_CONTACT_CUSTOM_FIELDS = get_custom_fields();
		custom_fields = _CONTACT_CUSTOM_FIELDS;
	}

	console.log("Custom Fields are");

	console.log(custom_fields);

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	// If type is send_email add unsubscribe link
	if (type !== undefined && type == "send_email") {
		// Rename Select Merge field for Send Email
		var json_str = JSON.stringify(merged_json);

		var replaced_json = json_str.replace("Select Merge Field",
				"Add Merge Field");

		// Parsing the altered string
		merged_json = JSON.parse(replaced_json);

		merged_json["Unsubscribe Link"] = "{{{unsubscribe_link}}}";

		merged_json["Online Link"] = "{{{online_link}}}";
	}

	merged_json["Powered by"] = "{{{powered_by}}}";

	if (callback)
		return callback(merged_json);

	return merged_json;
}

/**
 * 
 * 
 */

function getUpdateFields(type) {

	var options = {

		"First Name" : "first_name",
		"Last Name" : "last_name",
		"Email" : "email",
		"Company" : "company",
		"Title" : "title",
		"Website" : "website",
		"Phone" : "phone",
	};

	// Get Custom Fields in template format
	var custom_fields = get_custom_fields(type);

	console.log("Custom Fields are");

	console.log(custom_fields);

	// Merges options json and custom fields json
	var merged_json = merge_jsons({}, options, custom_fields);

	return merged_json;
}

function getTwilioIncomingList(type) {
	var numbers;
	$.ajax({
		url : 'core/api/sms-gateway/numbers',
		type : "GET",
		async : false,
		dataType : 'json',
		success : function(twilioNumbers) {
			numbers = twilioNumbers;
		}

	});

	if (numbers == null)
		return null;

	var numbersList = {};
	var length = numbers.length;
	if (length > 0) {
		for ( var i = 0; i < length; i++)
			numbersList[numbers[i]] = numbers[i];
	}
	// Parse stringify json
	return numbersList;
}

function getCampaignList(type) {

	var workflows = $.ajax({
		type : "GET",
		url : '/core/api/workflows',
		async : false,
		dataType : 'json'
	}).responseText;

	// Parse stringify json
	var data = JSON.parse(workflows);
	// changed to all
	var listOfWorkflows = {
		"All" : "All"
	};

	$.each(data, function(index, obj) {

		// if (key == 'name')
		listOfWorkflows[obj["name"]] = obj["id"];

	});

	return listOfWorkflows;
}

/**
 * Returns count of workflow list
 */
function getCampaignCount(type) {

	try {
		var count = (window.parent.App_Workflows.workflow_list_view.collection.length);
		return count;
	} catch (err) {
		return 0;
	}
	return 0;

}

/**
 * Returns custom fields in format required for merge fields. E.g., Nick
 * Name:{{Nick Name}}
 */
function get_custom_fields(type) {
	var url = window.location.protocol + '//' + window.location.host;

	// Sends GET request for customfields.
	var msg = $.ajax({
		type : "GET",
		url : url + '/core/api/custom-fields/scope?scope=CONTACT',
		async : false,
		dataType : 'json'
	}).responseText;

	// Parse stringify json
	var data = JSON.parse(msg);

	var customfields = {};

	// Iterate over data and get field labels of each custom field
	$.each(data, function(index, obj) {
		if (obj['field_type'] != "FORMULA") {
			// Iterate over single custom field to get field-label
			$.each(obj, function(key, value) {

				// Needed only field labels for merge fields
				if (key == 'field_label') {
					if (type == "update_field")
						customfields[value] = value
					else
						customfields[value] = "{{" + value + "}}"
				}
			});
		}
	});

	return customfields;
}

/**
 * Returns merged json of two json objects
 */
function merge_jsons(target, object1, object2) {
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
function insertAtCaret(textareaId, text) {
	var txtarea = document.getElementById(textareaId);
	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "ff"
			: (document.selection ? "ie" : false));
	if (br == "ie") {
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		strPos = range.text.length;
	} else if (br == "ff")
		strPos = txtarea.selectionStart;

	var front = (txtarea.value).substring(0, strPos);
	var back = (txtarea.value).substring(strPos, txtarea.value.length);
	txtarea.value = front + text + back;
	strPos = strPos + text.length;
	if (br == "ie") {
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		range.moveStart('character', strPos);
		range.moveEnd('character', 0);
		range.select();
	} else if (br == "ff") {
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
function url_visited_select_callback(ele, target_id) {
	// current value
	var curValue = $(ele).find(':selected').val();

	var tempObj = $('<span />').insertBefore('#' + target_id);

	// if 'contains' selected, make type attribute 'text'
	if (curValue === 'contains') {
		// replacing type attribute from url to text
		$('#' + target_id).detach().attr('type', 'text').insertAfter(tempObj)
				.focus();
	}

	// if 'exact_match' selected, make type attribute 'url'
	if (curValue === 'exact_match') {
		// replacing type attribute to url.
		$('#' + target_id).detach().attr('type', 'url').insertAfter(tempObj)
				.focus();
	}

	tempObj.remove();
}

/**
 * Retrieves label objects from labelsAPI. Inserts each label value within label object
 * into an array.
 */
function get_labels() {

	var url = window.location.protocol + '//' + window.location.host;

	// Sends GET request for labels.
	var msg = $.ajax({
		type : "GET",
		url : url + '/core/api/tickets/labels',
		async : false,
		dataType : 'json'
	}).responseText;

	// Parse stringify json
	var data = JSON.parse(msg);

	return get_labels_array(data);
}

/**
 * Returns array of tags. Separates tags from tag objects and inserts each tag
 * into an array.
 * 
 * @param data -
 *            Tag objects
 */
function get_labels_array(data) {
	var labels = [];

	// Iterate over data and insert label values into labels array.
	$.each(data, function(index, obj) {
		// Iterate over single label object to get labels value.
		$.each(obj, function(key, value) {

			// Needed only label values.
			if (key == 'label')
				labels[index] = value;

		});
	});

	return labels;

}

/**
 * Retrieves tag objects from TagsAPI. Inserts each tag value within tag object
 * into an array.
 */
function get_tags() {
	// Fetch tags from collection if defined
	if (window.parent.tagsCollection) {
		console.log("Fetching tags from collection...");

		var tags_JSON = window.parent.tagsCollection.toJSON();
		return get_tags_array(tags_JSON);
	}

	var url = window.location.protocol + '//' + window.location.host;

	// Sends GET request for tags.
	var msg = $.ajax({
		type : "GET",
		url : url + '/core/api/tags',
		async : false,
		dataType : 'json'
	}).responseText;

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
function get_tags_array(data) {
	var tags = [];

	// Iterate over data and insert tag values into tags array.
	$.each(data, function(index, obj) {
		// Iterate over single tag object to get tag value.
		$.each(obj, function(key, value) {

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
function init_tags_typeahead(tag_ids, type) {

	var tags_array;

	// fetch array of tags or labels.
	if (type && type == "labels")
		tags_array = get_labels();
	else
		var tags_array = get_tags();

	// Initialize tags typeahead for Tags and CheckTags node
	// $('#tag_names, #tag_value').autocomplete({source: tags_array});
	$(tag_ids).autocomplete(
			{
				minLength : 0,
				source : function(request, response) {
					// delegate back to autocomplete, but extract the last term
					response($.ui.autocomplete.filter(tags_array,
							extractLast(request.term)));
				},
				focus : function() {
					// prevent value inserted on focus
					return false;
				},
				select : function(event, ui) {

					var terms = split(this.value);

					// remove the current input
					terms.pop();

					// Prevent duplicate tags to insert
					if ($.inArray(ui.item.value, terms) === -1) {
						// add the selected item
						terms.push(ui.item.value);
					}

					// add placeholder to get the comma-and-space at the end
					terms.push("");
					this.value = terms.join(", ");

					return false;
				}
			});

	// Add scroll for tags list
	$(tag_ids).parents('body').find('.ui-autocomplete').css({
		'max-height' : '200px',
		'overflow-y' : 'scroll',
		/* prevent horizontal scrollbar */
		'overflow-x' : 'hidden'
	});

}

/**
 * Utility function to split string based on comma
 */
function split(val) {
	return val.split(/,\s*/);
}

/**
 * Utility function for array to get last element
 */
function extractLast(term) {
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
function prefill_from_details(nodeJSONDefinition) {
	try {
		var current_domain_user = window.parent.CURRENT_DOMAIN_USER;

		var from_json = {
			"from_name" : current_domain_user["name"],
			"from_email" : current_domain_user["email"]
		}

		return JSON.parse(JSON.stringify(from_json));
	} catch (err) {
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
function disable_text_required_property(selector) {
	// Remove 'required' property of 'text' if 'html' is not empty and 'text' is
	// empty
	if (selector.find('#tinyMCEhtml_email').val() != ""
			&& selector.find('#text_email').val() == "")
		selector.find('#text_email').removeProp("required");
}
// Bhasuri 10/25/2014
function getDate(selector) {
	if (!selector)
		selector = '#duration';
	
	$(selector).datepicker({ changeMonth : true, changeYear : true, yearRange: "2010:2050",  constrainInput : false
	// minDate: 0
	});

}

function getMergeFieldsWithOptGroups(uiFieldDefinition, selectEventHandler) {
	var options = {
		"Select Merge Field" : "",
		"Name" : {
			"First Name" : "{{first_name}}",
			"First Name Fix" : "{{first_name_fix}}",
			"Last Name" : "{{last_name}}",
			"Last Name Fix" : "{{last_name_fix}}",
			"Name Fix" : "{{name_fix}}"
		},
		"Properties" : {
			"Score" : "{{score}}",
			"Created Date" : "{{created_date}}",
			"Modified Date" : "{{modified_date}}",
			"Email" : "{{email}}",
			"Email Work" : "{{email_work}}",
			"Email Personal" : "{{email_home}}",
			"Company" : "{{company}}",
			"Title" : "{{title}}",
			"Website" : "{{website}}",
			"Phone" : "{{phone}}",
			"Phone Work" : "{{phone_work}}",
			"Phone Home" : "{{phone_home}}",
			"Phone Mobile" : "{{phone_mobile}}",
			"Phone Main" : "{{phone_main}}",
			"Phone Home fax" : "{{phone_home_fax}}",
			"Phone Work fax" : "{{phone_work_fax}}",
			"Phone Other" : "{{phone_other}}"
		},
		"Custom Fields" : {},
		"Address" : {
			"City" : "{{location.city}}",
			"State" : "{{location.state}}",
			"Country" : "{{location.country}}"
		},
		"Web" : {
			"Twitter Id" : "{{twitter_id}}",
			"LinkedIn Id" : "{{linkedin_id}}"
		},
		"Owner" : {
			"Owner Name" : "{{owner.name}}",
			"Owner Email" : "{{owner.email}}",
			"Owner calendar URL" : "{{owner.calendar_url}}",
			"Owner Signature" : "{{{owner.signature}}}"
		},
		"Misc" : {
			"Unsubscribe Link" : "{{{unsubscribe_link}}}",
			"Online Link" : "{{{online_link}}}",
			"Powered by" : "{{{powered_by}}}"
		}
	};

	// Get Custom Fields in template format
	var custom_fields;

	// Cache Contact Custom fields
	if (_CONTACT_CUSTOM_FIELDS)
		custom_fields = _CONTACT_CUSTOM_FIELDS
	else {
		_CONTACT_CUSTOM_FIELDS = get_custom_fields();
		custom_fields = _CONTACT_CUSTOM_FIELDS;
	}

	options["Custom Fields"] = custom_fields;
	

	var selectoption;
	    
	    if(uiFieldDefinition.style)
	    	selectoption= "<select '"+ getStyleAttribute(uiFieldDefinition.style) +"' onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'" + (uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"></select>";
	    else
	    	selectoption= "<select style='position:relative;float:right;cursor:pointer;width: 145px;margin-right: -5px' onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'" + (uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"></select>";


	$.each(options, function(name, option_value) {
		if (typeof (option_value) == 'object') {
			var optgroup = "<optgroup></optgroup>";
			optgroup = $(optgroup).attr("label", name);
			$.each(option_value, function(subtype_key, subtype_value) {
				var title = subtype_key;
				if (subtype_key.length > 18)
					subtype_key = subtype_key.substr(0, 15) + "...";
				$(optgroup).append(
						"<option value='" + subtype_value + "' title = '"
								+ title + "'>" + subtype_key + "</option>");
			});
			selectoption = $(selectoption).append(optgroup);
		} else {
			if (name.indexOf("*") == 0) {
				name = name.substr(1);
				selectoption = $(selectoption).append(
						"<option selected value='" + option_value
								+ "' title = '" + name + "'>" + name
								+ "</option>");
			} else
				selectoption = $(selectoption).append(
						"<option value='" + option_value + "' title = '" + name
								+ "'>" + name + "</option>");
		}
	});

	console.log(selectoption);
	return selectoption;
}

function get_domain_user() {
	return window.parent.CURRENT_DOMAIN_USER;
}

function openVerifyEmailModal(el) {
	if (window.parent.$('#workflow-verify-email').size() != 0)
		window.parent.$('#workflow-verify-email').remove();

	var selected = $(el).find(':selected').val();

	if (selected == 'verify_email')
		window.parent.workflow_alerts("Verify a new From address", undefined,
				"workflow-verify-email-modal"

				, function(modal) {

					// Focus on input
					modal.on('shown.bs.modal', function() {
						$(this).find('input').focus();

						parent.send_verify_email();
					});

					// On hidden
					modal.on('hidden.bs.modal', function(e) {

						var given_email = $(this).find('input').val();

						resetAndFillFromSelect(given_email);
					});
				});
}

function rearrange_from_email_options($select, data) {

	if (!data)
		return;

	var unverified = [];

	$.each(data, function(index, obj) {

		if (obj.verified == "NO")
			unverified.push(obj.email);

	});

	$select.find('option').each(function() {

		var email = $(this).val()

		if (unverified.indexOf(email) != -1) {
			$(this).attr('unverified', 'unverified');
			$(this).text(email + ' (unverified)');
		}
	});

}

function resetAndFillFromSelect(selected_val) {
	// Make send email node from email empty
	$('#from_email').empty();

	var options = {
		"+ Add new" : "verify_email"
	};

	fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {

				$select
						.find("option:first")
						.before(
								"<option value='{{owner.email}}'>Contact's Owner</option>");

				if (selected_val)
					$select.val(selected_val).attr("selected", "selected");
				else
					$select.val("Contact's Owner").attr("selected", "selected");

				rearrange_from_email_options($select, data);
			});
}

// On Click, fetch verified emails and update
$('#from_email').die('click').live(
		'click',
		function(e) {

			e.preventDefault();

			// current value selected
			var selected_val = $(this).val();

			if (selected_val == "{{owner.email}}"
					|| selected_val == "verify_email")
				return;

			// If not unverified, no need to check
			if (!($('#from_email').find('option[value="' + selected_val + '"]')
					.attr("unverified")))
				return;

			// resetAndFillFromSelect(selected_val);

			$.getJSON('core/api/account-prefs/verified-emails/' + selected_val,
					function(data) {

						if (data && data["verified"] == "YES")
							$('#from_email').find(
									'option[value="' + selected_val + '"]')
									.attr("selected", "selected").removeAttr(
											"unverified").text(
											"" + selected_val + "");

					});
		});

function getTaskCategories(type) {
	var categories = {};
	$.ajax({
		url : '/core/api/categories?entity_type=TASK',
		type : "GET",
		async : false,
		dataType : 'json',
		success : function(tasks) {
			try {
				$.each(tasks, function(name, value) {
					categories[value.label] = value.name;
				});
			} catch (e) {
				categories = null;
			}

		}

	});

	if (categories == null)
		return null;

	// Parse stringify json
	return categories;
}

function show_templates(ele, target_id) {
	// current value
	var curValue = $(ele).find(':selected').val();

	// inserts text based on cursor.
	load_email_templates(curValue);
}

function update_list_with_disabled($select, workflows_json)
{
	if(!$select || !workflows_json)
		return;

	var disabled_ids = [];

	for(var i=0; i < workflows_json.length; i++)
	{
		if(workflows_json[i].is_disabled)
			 $select.find("option[value='"+workflows_json[i].id+"']").attr('disabled', 'disabled').text(workflows_json[i].name + ' (Disabled)');
			
	}
}
function insertSelectedOption(ele ,target_id)
{
	var curValue = $(ele).find(':selected').val();
	insertAtCaret(target_id, curValue)
	var text = $('#new_field').val();
	if(text && text.indexOf("{{")!=-1)
	$('#new_field').val($(ele).find(':selected').val());

}
	// function remove_property(ele)
	// {
	//  	$("#updated_value").prop('disabled', true).val('');
	// }
	// function add_property(ele)
	// {
	// 	$("#updated_value").prop('disabled', false);
	// }

	//for new set_property_node
	// function add_remove_property(ele)
	// {
	// 	if($(ele).val() == "SET_NULL")
	// 	$("#" + id).prop('disabled', true).val('');
	// 	else	
	// 	$("#updated_value").prop('disabled', false);	
	// }

	//disable a field 
	function disable_property(ele, target_id, param)
	{
		if(!target_id)
			target_id = $(ele).attr('id');
		try{
		if(param)
		$('#' + target_id).prop('disabled',param).val('');
		else
		$('#' + target_id).prop('disabled',param);
		}
		catch(err){ }
	}

	//event handlers for radio buttons
	function remove_property(ele, target_id)
	{
		disable_property(ele, target_id, true);
	}
	function add_property(ele, target_id)
	{
		disable_property(ele, target_id, false);
	}

		//for edit set_property_node
     function setPropertyNode(jsonData)
     {
		if(jsonData){
    			for (var i=0;i<jsonData.length;i++){
    				if(jsonData[i].name == "action" && jsonData[i].value == "SET_NULL")
    					disable_property( jsonData[i], "updated_value", true);
    		}
    	}
	}

