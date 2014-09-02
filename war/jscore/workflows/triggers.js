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

		// Hide trigger stripe event div for other trigger conditions.
		if($(this).val() !== 'STRIPE_CHARGE_EVENT')
			$('form#addTriggerForm').find('select#trigger-stripe-event').closest('div.control-group').css('display', 'none');
		
		// Initialize tags typeahead
		if ($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		{
			$('form#addTriggerForm').find('#trigger-custom-tags').closest('div.control-group').css('display', '');
			
			// Tags typeahead for tag input field
			addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		}

		// Show score
		if ($(this).val() == 'ADD_SCORE')
			$('form#addTriggerForm').find('#trigger-custom-score').closest('div.control-group').css('display', '');
		
		// Populate milestones for triggers
		if ($(this).val() == 'DEAL_MILESTONE_IS_CHANGED')
		{
			populate_milestones_in_trigger($('form#addTriggerForm'), 'trigger-deal-milestone');
		}
		
		// Show stripe events
		if($(this).val() == 'STRIPE_CHARGE_EVENT')
		{
			populate_stripe_events_in_trigger($('form#addTriggerForm'), 'trigger-stripe-event');
		}
	});
	
	// When cancel clicked, take to Back page
	$('#trigger-cancel').die().live('click', function(e)
	{
		e.preventDefault();

		if (history !== undefined)
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
	$('select#' + milestones_select_id).after(getRandomLoadingImg());

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

/**
 *	Function to populate the stripe event trigger with stripe events
 * 
 * @param trigger_form
 * 				trigger form object
 * @param stripe_event_select_id
 * 				stripe event select element id
 * @param stripe_event_value
 * 				stripe event type
 */
function populate_stripe_events_in_trigger(trigger_form, stripe_event_select_id, stripe_event_value)
{
	trigger_form.find('select#' + stripe_event_select_id).closest('div.control-group').css('display','');
	
	if(stripe_event_value !== undefined)
	{
		trigger_form.find('select#' + stripe_event_select_id).val(stripe_event_value).attr('selected', 'selected').trigger('change');
	}
}

/**
 * Shows triggers for each td in workflows list
 * 
 * @param el -
 *            Backbone el
 * 
 */
function show_triggers_of_each_workflow(el)
{
	// Fetches triggers from collection and appends
	if (App_Workflows.triggersCollectionView != undefined && App_Workflows.triggersCollectionView.collection.length != 0)
	{
		append_triggers_to_workflow(el);
		return;
	}

	App_Workflows.triggersCollectionView = new Base_Collection_View({ url : '/core/api/triggers', restKey : "triggers", templateKey : "triggers",
		individual_tag_name : 'tr' });

	App_Workflows.triggersCollectionView.collection.fetch({ success : function(data)
	{
		// Shows pending triggers content
		if (App_Workflows.triggersCollectionView == undefined || App_Workflows.triggersCollectionView.collection.length == 0)
		{
			$('#triggers-verification', el).css('display', 'block');
			return;
		}

		// Append triggers to workflow
		append_triggers_to_workflow(el);

	} });

}

/**
 * Appends triggers to each workflow in UI
 * 
 * @param el -
 *            Backbone el
 * 
 */
function append_triggers_to_workflow(el)
{

	// Appends triggers to respective workflow
	$('.workflow-triggers', el).each(function(index, td)
	{

		// Returns filtered array of models
		var trigger_models = App_Workflows.triggersCollectionView.collection.where({ campaign_id : parseInt($(td).attr('workflow-id')) });
		var trigger_collection = new BaseCollection(trigger_models, {});

		// show triggers if exists for a workflow
		if (trigger_collection.length !== 0)
			$(td).html(getTemplate('workflow-triggers', { "triggers" : trigger_collection.toJSON() }));

	});
}
