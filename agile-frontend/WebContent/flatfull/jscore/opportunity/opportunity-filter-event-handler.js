/**
 * contact-filter.js defines functionalities to show filter in dropdown, events
 * on selecting filter, call to set cookie when filter is selected. Shows name
 * of the selected filter on dropdown button client side. This also defines
 * clone function, used while adding multiple filter conditions
 * 
 * @module Search author: Yaswanth
 */
var opportunity_filter_name;
var OPPORTUNITY_DYNAMIC_FILTER_COOKIE_STATUS = "toggle_dynamic_filter_" + CURRENT_DOMAIN_USER.id;
var OPPORTUNITY_TRACK_MILESTONES;
var OPPORTUNITY_LHS_FILTER_CHANGE = true;

/**
 * Change name of input[name='temp'] to more random i.e. temp-<unique_number>.
 * This is necessary for showing correct validation errors when multiple entries with same field-name are on the page.
 * @param el
 */
var scrambled_index=0;
function scramble_input_names(el)
{
	el.find("input").each(function(){
		$(this).attr('name','temp-'+scrambled_index);
		$(this).addClass('required');
		scrambled_index+=1;
	});
}
SEARCHABLE_OPPORTUNITY_CUSTOM_FIELDS = undefined;
OPPORTUNITY_CUSTOM_FIELDS = undefined;

/**
*  Contact Reports filters event view
*/
var Opportunity_Filters_Event_View = Base_Model_View.extend({
    events: {
    	'click .filter-opportunities-multiple-add' : 'opportunitiesFilterMultipleAdd',
    	'click i.filter-opportunities-multiple-remove' : 'opportunitiesFilterRemove',
    	'click .filter-opportunities-multiple-add-or-rules' : 'opportunitiesFilterAddOrRules',
    	'change #LHS > select' : 'onLhsChanged',
    	
    },

	// Filter Deals- Clone Multiple
	opportunitiesFilterMultipleAdd: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var that = targetEl;
		// To solve chaining issue when cloned

		getTemplate("filter-deals", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			
			var htmlContent = $($(template_ui).find('.chained-table.opportunity')[0]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent, undefined, undefined, undefined, undefined, true);

			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			
			$(that).prev('table').find("tbody").append(htmlContent);

		}, null);
	},

	// Filter Opportunities- Remove Multiple
	opportunitiesFilterRemove: function(e)
	{
		var targetEl = $(e.currentTarget);
		$(targetEl).closest("tr").remove();
	},

	// Filter Opportunities- Clone Multiple
	opportunitiesFilterAddOrRules: function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		var that = targetEl;
		// To solve chaining issue when cloned
		getTemplate("filter-deals", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var htmlContent = $($(template_ui).find('.chained-table.opportunity')[1]).find('tr').clone();
			$(htmlContent).removeClass('hide');
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent, undefined, undefined, undefined, undefined, true);

			$(htmlContent).find("i.filter-contacts-multiple-remove").css("display", "inline-block");
			
			$(that).prev('table').find("tbody").append(htmlContent);

		}, null);
		
	},

	onLhsChanged : function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);
		var $rhs_ele = $(targetEl).closest('td').siblings('td.rhs-block').find("#RHS");
		var selected_val = $(targetEl).find("option:selected").val();

		if (selected_val == "expected_value" || selected_val == "probability")
		{
			$rhs_ele.find("input").toggleClass("number");
			$rhs_ele.find("input").attr("min", "0");
			var max_val = "1000000000000";
			if(selected_val == "probability")
			{
				max_val = "100";
			}
			$rhs_ele.find("input").attr("max", max_val);
		}
		else
		{
			$rhs_ele.find("input").toggleClass("number");
		}

		if (selected_val == "track_milestone" && OPPORTUNITY_LHS_FILTER_CHANGE)
		{
			var field_name = $rhs_ele.find("input").attr("name");
			populateTrackMilestones(undefined, undefined, undefined, undefined, undefined, undefined, $rhs_ele, field_name);
		}

		if(selected_val == "archived" && OPPORTUNITY_LHS_FILTER_CHANGE)
		{
			var field_name = $rhs_ele.find("input").attr("name");
			$rhs_ele.html("<select name='"+field_name+"' class='form-control'><option value='true'>Archived</option><option value='false'>Active</option><option value='all'>Any</option></select>");
		}
	},


	onRhsChanged : function(e)
	{
		
	}
	
});

function fillOpportunityCustomFieldsInFilters(el, callback)
{
	if(!OPPORTUNITY_CUSTOM_FIELDS)
	{
		$.getJSON("core/api/custom-fields/searchable/scope?scope=DEAL", function(fields){
			console.log(fields);
			OPPORTUNITY_CUSTOM_FIELDS = fields;
			fillCustomFields(fields, el, callback, false);
		});
	} else {
		fillCustomFields(OPPORTUNITY_CUSTOM_FIELDS, el, callback, false)
	}
}

function chainFiltersForOpportunity(el, data, callback) {
	if(data) {
		chainFilters($(el).find('.chained-table.opportunity.and_rules'), data.rules, undefined, false, false, true);
		chainFilters($(el).find('.chained-table.opportunity.or_rules'), data.or_rules, callback, false, false, true);
	} else {
		chainFilters($(el).find('.chained-table.opportunity.and_rules'), undefined, undefined, false, false, true);
		chainFilters($(el).find('.chained-table.opportunity.or_rules'), undefined, callback, false, false, true);
	}
}
