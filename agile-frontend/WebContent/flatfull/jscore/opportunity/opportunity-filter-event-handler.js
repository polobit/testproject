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

/**
 * Change name of input[name='temp'] to more random i.e. temp-<unique_number>.
 * This is necessary for showing correct validation errors when multiple entries with same field-name are on the page.
 * @param el
 */
function setOportunityChainFilterValidations(el)
{
	el.find("input").each(function(){
		var selected_val = $(this).closest('td').siblings('td.lhs-block').find("select#LHS").val();

		if (selected_val == "expected_value" || selected_val == "probability")
		{
			$(this).addClass("number");
			$(this).attr("min", "0");
			var max_val = "1000000000000";
			if(selected_val == "probability")
			{
				max_val = "100";
			}
			$(this).attr("max", max_val);
		}
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
    	'change #condition > select' : 'onConditionChanged',
    	'change .lhs_chanined_parent' : 'onParentLHSChanged'
    	
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
			chainDealFilters(htmlContent, undefined, undefined, undefined, undefined, true);

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
			chainDealFilters(htmlContent, undefined, undefined, undefined, undefined, true);

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
			$rhs_ele.find("input").addClass("number");
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
			$rhs_ele.find("input").removeClass("number");
		}

		if (selected_val == "track_milestone")
		{
			$(targetEl).closest('td').siblings('td.track-milestone-error').removeClass("hide");
			var field_name = $rhs_ele.find("input").attr("name");
			populateTrackMilestones(undefined, undefined, undefined, undefined, undefined, undefined, $rhs_ele, field_name);
		}
		else
		{
			$(targetEl).closest('td').siblings('td.track-milestone-error').addClass("hide");
		}

		if(selected_val == "archived")
		{
			var field_name = $rhs_ele.find("input").attr("name");
			$rhs_ele.html(getTemplate("js-deal-filters", {field_name : field_name}));
		}
	},

	onConditionChanged : function(e){
		e.preventDefault();
		var targetEl = $(e.currentTarget);
		var $rhs_ele = $(targetEl).closest('td').siblings('td.rhs-block').find("#RHS");

		if ($(targetEl).find("option:selected").hasClass('tags'))
		{
			var element = $(targetEl).parents().closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}

		if ($(targetEl).closest('tr').find('td.lhs-block').find('option:selected').attr('field_type') == "CONTACT")
		{
			var that = targetEl;
			var custom_contact_display = function(data, item)
			{
				setTimeout(function(){
					$('input', $(that).closest('tr').find('td.rhs-block')).val(item);
					$('input', $(that).closest('tr').find('td.rhs-block')).attr("data", data);
				},10);
				
			}
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("id", $(targetEl).closest('tr').find('td.lhs-block').find('option:selected').attr("id"));
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("placeholder", "Contact Name");
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).addClass("contact_custom_field");
			agile_type_ahead($('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("id"), $(targetEl).closest('tr').find('td.rhs-block'), contacts_typeahead, custom_contact_display, 'type=PERSON');
		}

		if ($(targetEl).closest('tr').find('td.lhs-block').find('option:selected').attr('field_type') == "COMPANY")
		{
			var that = targetEl;
			var custom_company_display = function(data, item)
			{
				setTimeout(function(){
					$('input', $(that).closest('tr').find('td.rhs-block')).val(item);
					$('input', $(that).closest('tr').find('td.rhs-block')).attr("data", data);
				},10);
				
			}
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("id", $(targetEl).closest('tr').find('td.lhs-block').find('option:selected').attr("id"));
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("placeholder", "Company Name");
			$('input', $(targetEl).closest('tr').find('td.rhs-block')).addClass("company_custom_field");
			agile_type_ahead($('input', $(targetEl).closest('tr').find('td.rhs-block')).attr("id"), $(targetEl).closest('tr').find('td.rhs-block'), contacts_typeahead, custom_company_display, 'type=COMPANY');
		}

		if ($(targetEl).closest('td').siblings('td.lhs-block').find('select#LHS').val() == "track_milestone")
		{
			$(targetEl).closest('td').siblings('td.track-milestone-error').removeClass("hide");
			var field_name = $rhs_ele.find("input").attr("name");
			populateTrackMilestones(undefined, undefined, undefined, undefined, undefined, undefined, $rhs_ele, field_name);
		}
		
	},

	onParentLHSChanged :  function(e)
	{
		e.preventDefault();
		var targetEl = $(e.currentTarget);

		if (($(targetEl).val()).indexOf('tags') != -1)
		{
			var element = $(targetEl).closest('tr').find('div#RHS');
			addTagsDefaultTypeahead(element);
		}
	}
	
});
