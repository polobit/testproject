/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param el
 */
function chainLeadFilters(el, data, callback)
{
	if(!App_Leads.LEAD_CUSTOM_FIELDS)
	{			
		fillLeadCustomFieldsInFilters(el, function(){
			show_chained_fields(el, data, true);
			if (callback && typeof (callback) === "function")
			{
				// execute the callback, passing parameters as necessary
				callback();
			}
		})
		return;
	}
	
	fillCustomFields(App_Leads.LEAD_CUSTOM_FIELDS, el, undefined, false)
	
	show_chained_fields(el, data);
	if (callback && typeof (callback) === "function")
	{
		// execute the callback, passing parameters as necessary
		callback();
	}
	
}

function fillLeadCustomFieldsInFilters(el, callback)
{
	$.getJSON("core/api/custom-fields/searchable/scope?scope=LEAD", function(fields){
		console.log(fields);
		App_Leads.LEAD_CUSTOM_FIELDS = fields;
		fillCustomFields(fields, el, callback, false);
	});
}

function chainFiltersForLead(el, data, callback) {
	if(data) {
		chainLeadFilters($(el).find('.chained-table.lead.and_rules'), data.rules, undefined);
		chainLeadFilters($(el).find('.chained-table.lead.or_rules'), data.or_rules, callback);
	} else {
		chainLeadFilters($(el).find('.chained-table.lead.and_rules'), undefined, undefined);
		chainLeadFilters($(el).find('.chained-table.lead.or_rules'), undefined, callback);
	}
}