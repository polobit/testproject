function chainWebRules(el, data)
{
	$("#campaign-actions", el).chained($("#action", el));
	$("#action-details", el).chained($("#action", el));
	$("#WEB_RULE_RHS", el).chained($("#action", el));
	$("#campaign", el).chained($("#action", el));
	$("#noty-type", el).chained($("#action", el));
	$("#noty-title", el).chained($("#noty-type", el));
	$("#noty-message", el).chained($("#noty-type", el));
	if(data && data.actions)
		deserializeChainedSelect1($(el).find('form'), data.actions);
}

$(function()
		{
			// Filter Contacts- Clone Multiple
			$("i.web-rule-multiple-add").die().live('click', function(e)
			{
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('tr.webrule-actions').clone();
				
				scramble_input_names($(htmlContent));

				chainWebRules(htmlContent);
				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});
			
			// Filter Contacts- Clone Multiple
			$("i.filter-contacts-web-rule-multiple-add").die().live('click', function(e)
			{
				// To solve chaining issue when cloned
				var htmlContent = $(getTemplate("webrules-add", {})).find('.web-rule-contact-condition-table tr').clone();
				
				scramble_input_names($(htmlContent));

				chainFilters(htmlContent);

				// var htmlContent = $(this).closest("tr").clone();
				$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
				$(this).parents("tbody").append(htmlContent);
			});
			
		});