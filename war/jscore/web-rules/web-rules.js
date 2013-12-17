function chainWebRules(el, data)
{
	$("#campaign-actions", el).chained($("#action", el), function(){
	});
	$("#action-details", el).chained($("#action", el),  function(){
	});
	$("#WEB_RULE_RHS", el).chained($("#action", el), function(el, self){

		console.log(data);
		if(data && data.actions)
			{
				$.each(data.actions, function(index, action){
					if(action.action == "ASSIGN_CAMPAIGN")
					{
						$('select', $(self)).find('option[value='+ action.RHS +']').attr("selected", "selected");
						return false;
					}
				});
	
			}
	});
	$("#campaign", el).chained($("#action", el));
	$("#noty-type", el).chained($("#action", el));
	$("#noty-title", el).chained($("#noty-type", el));
	$("#noty-message", el).chained($("#noty-type", el), function(el, self){
		var text_area = $('textarea', self); 
		if($(text_area).hasClass("custom_html"))
			setupHTMLEditor($(text_area));
		
	});
	if(data && data.actions)
		deserializeChainedSelect1($(el).find('form'), data.actions);
}

$(function()
		{
			// Filter Contacts- Clone Multiple
			$("i.web-rule-multiple-add").die().live('click', function(e)
			{
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.webrule-actions > div').clone();
				
				scramble_input_names($(htmlContent));

				chainWebRules(htmlContent);
				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.webrule-multiple-remove").css("display", "inline-block");
				$(this).parents(".webrule-actions").append(htmlContent);
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
				console.log(htmlContent);
				scramble_input_names($(htmlContent));

				chainFilters(htmlContent);

				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});
			
			$("#action > select").die().live('change', function(){
				
				var isPopup = $("option:selected", $(this)).hasClass('POPUP');
				if(isPopup)
					$("#action-image").html('<img style="padding-right:30px;width:200px;height:200px" src= "https://www.agilecrm.com/img/crm/saas/saas-grabber.png"></img>');
				else
					$("#action-image").empty();
			});
			
			/*$("#noty-type > select").die().live('change', function(){
				console.log($(this).attr('class'));
				var isHtml = $(this).val() ? $(this).val() == 'custom_html' : false;
				if(isHtml)
					setupHTMLEditor($("#noty-message > textarea"));
			})*/
			
		});