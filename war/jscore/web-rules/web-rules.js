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
					if(action.action == "ASSIGN_CAMPAIGN")
					{
						$(select).find('option[value='+ action.RHS +']').attr("selected", "selected");
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
	

	$("#noty-title", el).chained($("#action", el), function(select, self){
		if($("select", select).val() == "CORNER_NOTY")
			{
				$(self).hide();
				return;
			}
		$(self).show();
		
	});
	$("#possition", el).chained($("#action", el));
	$("#noty-title", el).chained($("#noty-type", el), function(select, self){
		var select_field = $("select option:selected", select);
		if(select_field.hasClass("CORNER_NOTY") || select_field.hasClass("JAVA_SCRIPT"))
		{
			$(self).hide();
			$(select).hide();
			return;
		}
		$(select).show();
		$(self).show();
	});
	

	
	$("#timer", el).chained($("#delay", el));
	$("#delay", el).chained($("#action", el));
	
	$("#noty-message", el).chained($("#noty-type", el), function(el, self){
		var text_area = $('textarea', self); 
		if($(text_area).hasClass("custom_html"))
			{
			
			$("#tiny_mce_webrules_link", self).show();

			}
		else {
			$("#tiny_mce_webrules_link", self).hide();
		}
	});
	
	$("#noty-type", el).chained($("#action", el), function(select, self){
		var value = $("select", select).val();
		$(self).show();
		console.log(value);
		if(value == "CORNER_NOTY" || value == "JAVA_SCRIPT")
			{
			console.log($(self));
			console.log("here");
				$(self).hide();
			}
		else
			{
				$(self).show();
			}
		if(value == "MODAL_POPUP" || value == "CORNER_NOTY")
			{
			select.closest('table').siblings('div').find(".web-rule-prevew").show();
			return;
			}
		console.log(select);
		console.log(select.closest('table').siblings('div').find(".web-rule-prevew"));
		select.closest('table').siblings('div').find(".web-rule-prevew").hide();
	});
	
	if(data && data.actions)
		deserializeChainedSelect1($(el).find('form'), data.actions, element_clone, data.actions[0]);
	
	scramble_input_names($(".reports-condition-table", element_clone))
}

function show_web_rule_action_preview(action)
{
	if(!action)
		return;
	head.js("lib/web-rule/lib/mootools-core-1.3.1.js", "lib/web-rule/lib/mootools-more-1.3.1.1.js", "lib/web-rule/simple-modal.js", function(){
		var modal_options = {};
		modal_options["show_btn_cancel"] = true;
		
		var actions = [];
		actions.push(action);
		var json = {};
		json["actions"] = actions;
		
		var actions_array = [];
		json.rules = [];
		console.log(json);
		actions_array.push(json);
		
		head.js("https://d2l6lw2yloivu1.cloudfront.net/web-grabbers/lib/head.load.min.js", "https://agilegrabbers.appspot.com/demo/appspotmodal.js", function(){
			webrules_execute(actions_array, Agile_Contact, "email", false);
		});
//		perform_actions(actions_array, false);
	});
	
	
	
	

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
				
				chainFilters(htmlContent);

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
			
			
			$(".web-rule-prevew").die().live('click', function(e){
				e.preventDefault();
				show_web_rule_action_preview(serializeChainedElement($(this).closest('table')));
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

function load_email_templates()
{
		loadTinyMCE("tinyMCEhtml_email");
		return;
}

$("#tiny_mce_webrules_link").die().live("click", function(e){
	e.preventDefault();
	load_email_templates();
})

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
		"Company":"{{company}}"
	};
	
	return options;
}

/**
 * Returns merged json of two json objects
 **/
function merge_jsons(target, object1, object2)
{
	return $.extend(target, object1, object2);
}


