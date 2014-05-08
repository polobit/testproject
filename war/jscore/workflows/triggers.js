/**
 * triggers.js is a script file that sets tags typeahead when Tag options are
 * selected
 * 
 * @module Campaigns
 * 
 */
$(function()
{

	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('#trigger-type').live('change', function(e)
	{
		e.preventDefault();

		// Hide trigger milestones div for other trigger conditions.
		if ($(this).val() !== 'DEAL_MILESTONE_IS_CHANGED')
			$('form#addTriggerForm').find('select#trigger-deal-milestone').closest('div.control-group').css('display', 'none');

		// Initialize tags typeahead
		if ($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		{
			// Tags typeahead for tag input field
			addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		}

		// Populate milestones for triggers
		if ($(this).val() == 'DEAL_MILESTONE_IS_CHANGED')
		{
			populate_milestones_in_trigger($('form#addTriggerForm'), 'trigger-deal-milestone');
		}

	});
	
	// When cancel clicked, take to Back page
	$('#trigger-cancel').die().live('click', function(e){
		e.preventDefault();
		
		if(history !== undefined)
			history.back(-1);
	});
});

/**
 * Shows hidden trigger-milestones select element and fills with milestones
 * data.
 * 
 * @param trigger_form -
 *            trigger form jQuery object
 * @param milestones_select_id -
 *            trigger milestones select id
 * @param trigger_deal_milestone_value -
 *            trigger milestone value obtained from saved trigger.
 */
function populate_milestones_in_trigger(trigger_form, milestones_select_id, trigger_deal_milestone_value)
{

	// Show milestones select element
	trigger_form.find('select#' + milestones_select_id).closest('div.control-group').css('display', '');

	// Show loading image.
	$('select#' + milestones_select_id).after(LOADING_HTML);

	// Fills milestone select element
	populateMilestones(trigger_form, undefined, undefined, function(data)
	{
		$('.loading').remove();

		// Append obtained option values to select
		trigger_form.find('select#' + milestones_select_id).html(data);

		// Make obtained milestone value selected
		if (trigger_deal_milestone_value !== undefined)
		{
			trigger_form.find('select#' + milestones_select_id).val(trigger_deal_milestone_value).attr('selected', 'selected').trigger('change');
		}
	}, "Select new milestone...");

}
