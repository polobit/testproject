function chainWebRules(el, data, isNew, actions)
{
	var element_clone = $(el).clone();
	
	$("#campaign-actions", el).chained($("#action", el), function(){
	});
	$("#action-details", el).chained($("#action", el),  function(){
	});
	$("#WEB_RULE_RHS", el).chained($("#action", el), function(el, self){

		var select = $('select', $(self));
		
		if(data)
			{
				$.each(data, function(index, action){
					if(index == "actions" && (action[0].action == "ASSIGN_CAMPAIGN" || action[0].action == "UNSUBSCRIBE_CAMPAIGN"))
					{
						$(select).find('option[value='+ action[0].RHS +']').attr("selected", "selected");
						return false;
					}
				});	
			}
		
		// Enable tags typeahead if tags field is available 
		var element = $(".tags", self);
		if(element.length > 0)
			addTagsDefaultTypeahead(self);
		
	});
	$("#campaign", el).chained($("#action", el));
	
	$("#possition", el).chained($("#action", el));

	
	$("#timer", el).chained($("#delay", el));
	$("#delay", el).chained($("#action", el));
	
	$("#noty-message", el).chained($("#action", el), function(select, self){
		var value = $("select", select).val();
		$(self).show();
		console.log(value);
	
		if(value == "MODAL_POPUP" || value == "CORNER_NOTY")
			{
				if(value == "MODAL_POPUP")
				$("#tiny_mce_webrules_link", self).show();
				self.find(".web-rule-preview").show();
			return;
			}
		self.find(".web-rule-preview").hide();
	});
	
	if(data && data.actions)
		deserializeChainedSelect1($(el).find('form'), data.actions, element_clone, data.actions[0]);
	
	scramble_input_names($(".reports-condition-table", element_clone))
}

$(function()
		{
			// Filter Contacts- Clone Multiple
			$(".web-rule-multiple-add").die().live('click', function(e)
			{
				e.preventDefault();
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.webrule-actions > div').clone();
				
				//scramble_input_names($(htmlContent));

				
				chainWebRules($(htmlContent)[0], undefined, true);
				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.webrule-multiple-remove").css("display", "inline-block");
				$(".webrule-actions").append(htmlContent);
				
			});
			
			// Filter Contacts- Remove Multiple
			$("i.webrule-multiple-remove").die().live('click', function(e)
			{
				$(this).closest(".chained-table > div").remove();
			});
			
			// Filter Contacts- Clone Multiple
			$("i.filter-contacts-web-rule-multiple-add").die().live('click', function(e)
			{
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.web-rule-contact-condition-table tr').clone();
				scramble_input_names($(htmlContent));

				$(this).hide();
				
				chainFilters(htmlContent, undefined, undefined, true);

				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});
			
			
			/*$("#noty-type > select").die().live('change', function(){
				console.log($(this).attr('class'));
				var isHtml = $(this).val() ? $(this).val() == 'custom_html' : false;
				if(isHtml)
					setupHTMLEditor($("#noty-message > textarea"));
			})*/
			
			
			$(".web-rule-preview").die().live('click', function(e){
				e.preventDefault();
				var that = this;
				_agile_require_js("https://s3.amazonaws.com/agilewebgrabbers/scripts/agile-webrules-min.js", function(){

					// Serializes webrule action to show preview
					var action = serializeChainedElement($(that).closest('table'));
					// Popup va'ue should be in a json object with key value, as it is returned that way from server text field
					var popup_text = {};
					popup_text["value"] = action.popup_text;
					action.popup_text = popup_text;
					action.delay = "IMMEDIATE";
					
						_agile_execute_action(action);
					});
			});
		});


function loadTinyMCE(name)
{
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var newwindow = window.open('cd_tiny_mce.jsp?id=' + name,'name',strWindowFeatures);
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
	
}

$("#tiny_mce_webrules_link").die().live("click", function(e){
	e.preventDefault();

	// If not empty, redirect to tinymce
	if($('#tinyMCEhtml_email').val() !== "")
	{
		if($('.custom_html').length > 1){
			alert("Only one popup is allowed per webrule. You have already set a popup action for this webrule.");
			$(this).closest(".alert").remove();
			return;
		}
		loadTinyMCE("tinyMCEhtml_email");
		return;
	}
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=web_rules', 'name', strWindowFeatures);
	
	if(window.focus)
		{
			new_window.focus();
		}
	return false;
});

function tinyMCECallBack(name, htmlVal)
{
	$('#' + name).val(htmlVal);
}

/**
 * MergeFields function to fetch all available merge-fields.
 * 
 * @param type - to add specific fields for specific nodes
 *               like unsubscribe link to SendEmail node
 **/
function getMergeFields(type)
{
	var options=
	{
		"Select Merge Field": "",
		"First Name": "{{first_name}}",
		"Last Name": "{{last_name}}",
		"Email": "{{email}}",
		"Company":"{{company}}",
		"Title": "{{title}}",
		"Website": "{{website}}",
		"Phone": "{{phone}}",
		"City": "{{city}}",
		"State": "{{state}}",
		"Country": "{{country}}",
		"Zip": "{{zip}}",
		"Domain": "{{domain}}",
		"Address": "{{address}}",
		"Score": "{{score}}",
		"Created Time": "{{created_time}}",
		"Modified Time": "{{modified_time}}",
		"Owner Name": "{{owner_name}}",
		"Owner Email": "{{owner_email}}"
	};
	
	// Get Custom Fields in template format
	var custom_fields = get_webrules_custom_fields();
	
	console.log("Custom Fields are");
	console.log(custom_fields);
	
	// Merges options json and custom fields json
	var merged_json = merge_webrules_jsons({}, options, custom_fields);
	return merged_json;
}

/**
 * Returns custom fields in format required for merge fields. 
 * E.g., Nick Name:{{Nick Name}}
 */
function get_webrules_custom_fields()
{
    var url = window.location.protocol + '//' + window.location.host;
	
	// Sends GET request for customfields.
    var msg = $.ajax({type: "GET", url: url+'/core/api/custom-fields', async: false, dataType:'json'}).responseText;
	
	// Parse stringify json
	var data = JSON.parse(msg);
	
	var customfields = {};
	
	// Iterate over data and get field labels of each custom field
	$.each(data, function(index,obj)
			{
					// Iterate over single custom field to get field-label
		            $.each(obj, function(key, value){
						
						// Needed only field labels for merge fields
						if(key == 'field_label')
							customfields[value] = "{{[" + value+"]}}"
					});
			});	
	
	return customfields;
}

/**
 * Returns merged json of two json objects
 **/
function merge_webrules_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}
