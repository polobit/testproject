function chainWebRules(el, data, isNew, actions)
{
	var element_clone = $(el).clone();
	
	$("#campaign-actions", el).chained($("#action", el), function(){
	});
	$("#action-details", el).chained($("#action", el),  function(){
	});
	$("#RHS_CALL_POPUOP", el).chained($("#action", el),  function(){
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
		$('#twilio_call_setup').hide();
		console.log(value);
	
		if(value == "MODAL_POPUP" || value == "CORNER_NOTY" || value== "CALL_POPUP")
			{
				if(value == "MODAL_POPUP"  || value=="CALL_POPUP")
				$("#tiny_mce_webrules_link", self).show();

				if(value=="CALL_POPUP"){
					loadSavedTemplate("call/callpopup.html");
					$.ajax({
						url: '/core/api/sms-gateway/twilio',
						type : 'GET',
						success : function(data) {
							App_WebReports.isTwilioSMS=data;
						},
						error : function(data) {
							App_WebReports.isTwilioSMS=false;
						}
					});
				}
				self.find(".web-rule-preview").show();
			return;
			} else if(value == "SITE_BAR") {
				loadSavedTemplate("bar/sitebar.html");
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

/**
*  WebRules event view
*/
var Web_Rules_Event_View = Base_Model_View.extend({
		    events: {
		 		'click .web-rule-multiple-add' : 'ruleMultipleAdd',
		 		'click i.webrule-multiple-remove' : 'ruleMultipleRemove',
		 		'click i.filter-contacts-web-rule-multiple-add' : 'webruleMultipleAdd',
		 		'click i.filter-contacts-web-rule-multiple-remove' : 'webruleMultipleRemove',
		 		'click .web-rule-preview' : 'webrulePreview',
		 		'click #tiny_mce_webrules_link' : 'tinymceWebruleLink',
		    },

			// Filter Contacts- Clone Multiple
			ruleMultipleAdd: function(e)
			{
				e.preventDefault();

				// To solve chaining issue when cloned
				getTemplate('webrules-add', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;

					var htmlContent = $(template_ui).find('.webrule-actions > div').clone();
					var action_count=$('#action select').length;
					for(var i=0;i<action_count;i++){
						var actionSelected = $($('#action select')[i]).val();

						if(actionSelected === 'CALL_POPUP' || actionSelected === 'MODAL_POPUP' || actionSelected === 'SITE_BAR'){
							var listOfOptions = $(htmlContent).find('#action select optgroup option');
							listOfOptions[0].remove();//MODAL_POPUP
							listOfOptions[2].remove();//CALL_POPUP
							listOfOptions[3].remove();//SITE_BAR
						}
					}
					chainWebRules($(htmlContent)[0], undefined, true);
					// var htmlContent = $(this).closest("tr").clone();
					$(htmlContent).find("i.webrule-multiple-remove").css("display", "inline-block");
					$(".webrule-actions").append(htmlContent);

				}, null);

			},
			
			// Filter Contacts- Remove Multiple
			ruleMultipleRemove: function(e)
			{
				$(e.currentTarget).closest(".chained-table > div").remove();
			},
			
			// Filter Contacts- Clone Multiple
			webruleMultipleAdd: function(e)
			{
				// To solve chaining issue when cloned
				var that = $(e.currentTarget);
				getTemplate('webrules-add', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;

					var htmlContent = $(template_ui).find('.web-rule-contact-condition-table tr').clone();
					scramble_input_names($(htmlContent));

					chainFilters(htmlContent, undefined, undefined, true);

					$(htmlContent).find("i.filter-contacts-web-rule-multiple-remove").css("display", "inline-block");
					$(that).parents("tbody").append(htmlContent);

				}, null);
				
			},

			// Filter Contacts- Remove Multiple
			webruleMultipleRemove: function(e)
			{
				var targetEl = $(e.currentTarget);
				$(targetEl).closest("tr").remove();
			},

			webrulePreview: function(e){
				e.preventDefault();
				var that = $(e.currentTarget);
				_agile_require_js("https://s3.amazonaws.com/agilecrm/web-rules-static/agile-webrules-min-26-4.js", function(){

					// Serializes webrule action to show preview
					var action = serializeChainedElement($(that).closest('table'));
					// Popup va'ue should be in a json object with key value, as it is returned that way from server text field
					var popup_text = {};
					popup_text["value"] = action.popup_text;
					action.popup_text = popup_text;
					action.delay = "IMMEDIATE";
					
						_agile_execute_action(action);
					});
			},

			tinymceWebruleLink: function(e){
				e.preventDefault();

				// If not empty, redirect to tinymce
				if(typeof $('#tinyMCEhtml_email').val() != "undefined" && $('#tinyMCEhtml_email').val() != "")
				{
					if($('.custom_html').length > 1){
						showAlertModal("webrule_popup_limit", undefined, function(){
							$($(e.currentTarget)).closest(".alert").remove();
						});
						return;
					}
					loadTinyMCE("tinyMCEhtml_email");
					return;

				}else if($('#callwebrule-code').val() !== "" && $('#action select').val() == 'CALL_POPUP'){

					if($('.custom_html').length > 1){
						showAlertModal("webrule_popup_limit", undefined, function() {
                   			 $($(e.currentTarget)).closest(".alert").remove()
                		});
						return;
					}
					loadTinyMCE("callwebrule-code");
					return;
				} else if($('#agile-bar-code').val() !== "" && $('#action select').val()=='SITE_BAR') {
					loadTinyMCE("agile-bar-code");
					return;
				}
				var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
				var new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=web_rules', 'name', strWindowFeatures);
				new_window.focus();
				/*if(window.focus)
					{
						new_window.focus();
					}*/
				return false;
			},

		});

//Click event on add web rules button
$("#content").on( "click", ".addWebrule", function(e) 
 {
	openEmailTemplate(e);
	console.log($( this ).text());
		
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
function getMergeFields(type, callback)
{
	var options=
	{
		"{{agile_lng_translate 'contact-view' 'select-merge-fields'}}": "",
		"{{agile_lng_translate 'contacts-view' 'First Name'}}": "{{first_name}}",
		"{{agile_lng_translate 'contacts-view' 'Last name'}}": "{{last_name}}",
		"{{agile_lng_translate 'modals' 'email'}}": "{{email}}",
		"{{agile_lng_translate 'contacts-view' 'Company'}}": "{{company}}",
		"{{agile_lng_translate 'other' 'title'}}": "{{title}}",
		"{{agile_lng_translate 'other' 'website'}}": "{{website}}",
		"{{agile_lng_translate 'contacts-view' 'Phone'}}": "{{phone}}",
		"{{agile_lng_translate 'contact-edit' 'city'}}": "{{location.city}}",
		"{{agile_lng_translate 'contact-edit' 'state'}}":"{{location.state}}",
		"{{agile_lng_translate 'contacts-view' 'country'}}":"{{location.country}}",
		"{{agile_lng_translate 'contact-edit' 'zip'}}": "{{zip}}",
		"{{agile_lng_translate 'prefs-settings' 'domain'}}": "{{domain}}",
		"{{agile_lng_translate 'other' 'address'}}": "{{location.address}}",
		"{{agile_lng_translate 'report-add' 'score'}}": "{{score}}",
		"{{agile_lng_translate 'contacts-view' 'Created time'}}": "{{created_time}}",
		"{{agile_lng_translate 'contact-view' 'modified-time'}}": "{{modified_time}}",
		"{{agile_lng_translate 'contact-view' 'owner-name'}}":"{{owner.name}}",
		"{{agile_lng_translate 'contact-view' 'owner-email'}}":"{{owner.email}}", 
	};
	
	// Get Custom Fields in template format
	get_webrules_custom_fields(function(custom_fields){

		console.log("Custom Fields are");
		console.log(custom_fields);
		
		// Merges options json and custom fields json
		var merged_json = merge_webrules_jsons({}, options, custom_fields);
		if(callback)
			 return callback(merged_json);

		return merged_json;

		});
}

/**
 * Returns custom fields in format required for merge fields. 
 * E.g., Nick Name:{{Nick Name}}
 */
function get_webrules_custom_fields(callback)
{
    var url = window.location.protocol + '//' + window.location.host;
	
	// Sends GET request for customfields.
	accessUrlUsingAjax(url+'/core/api/custom-fields', function(resp){

		var customfields = {}, data = resp;
	
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

		if(callback)
			callback(customfields);

	});
	
}

/**
 * Returns merged json of two json objects
 **/
function merge_webrules_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}

/** 
 * It's load email template page on click of add web rule button
 **/
 function openEmailTemplate(e)
 {
 	//e.preventDefault();

				// If not empty, redirect to tinymce
				if($('#tinyMCEhtml_email').val() !== "")
				{
					if($('.custom_html').length > 1){
						showAlertModal("webrule_popup_limit", undefined, function(){
							$($(e.currentTarget)).closest(".alert").remove();
						});
						return;
					}
				}
				var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
				var new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=web_rules', 'name', strWindowFeatures);
				
				if(window.focus)
					{
						new_window.focus();
					}
				return false;
 }
