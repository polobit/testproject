/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param {Element} el - parent element
 * @param {Object} data - lead filter object
 * @param {Function} callback - callback function
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

/**
 * To fill lead custom fields in staric filters.
 * 
 * @param {Element} el - parent element
 * @param {Function} callback - callback function
 */
function fillLeadCustomFieldsInFilters(el, callback)
{
	$.getJSON("core/api/custom-fields/searchable/scope?scope=LEAD", function(fields){
		console.log(fields);
		App_Leads.LEAD_CUSTOM_FIELDS = fields;
		fillCustomFields(fields, el, callback, false);
	});
}

/**
 * Chains fields using jquery.chained library. It deserialzed data into form
 * 
 * @param {Element} el - parent element
 * @param {Object} data - lead filter object
 * @param {Function} callback - callback function
 */
function chainFiltersForLead(el, data, callback) {
	if(data) {
		chainLeadFilters($(el).find('.chained-table.lead.and_rules'), data.rules, undefined);
		chainLeadFilters($(el).find('.chained-table.lead.or_rules'), data.or_rules, callback);
	} else {
		chainLeadFilters($(el).find('.chained-table.lead.and_rules'), undefined, undefined);
		chainLeadFilters($(el).find('.chained-table.lead.or_rules'), undefined, callback);
	}
}