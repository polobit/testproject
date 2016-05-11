/**
 * triggers.js is a script file that sets tags typeahead when Tag options are
 * selected
 * 
 * @module Campaigns
 * 
 */
function initializeTriggersListeners(){
}

/**
 * Commented old code for trigger edit. 
 * Made it compatible with new listeners code. 
 * This function is called on trigger-edit route to 
 * initialize change events of trigger
 */
/*$(function(){

	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('body').on('change', '#trigger-type', function(e)
	{
		e.preventDefault();

		// Hide trigger milestones div for other trigger conditions.
		if ($(this).val() !== 'DEAL_MILESTONE_IS_CHANGED'){
			$('form#addTriggerForm').find('select#trigger-deal-milestone').closest('div.control-group').css('display', 'none');
		}
		
		if($(this).val() !== 'RUNS_DAILY' || $(this).val() !== 'RUNS_WEEKLY' || $(this).val() !== 'RUNS_MONTHLY'){
			$('form#addTriggerForm').find('select#contact-filter').closest('div.control-group').css('display', 'none');
		}

		// Hide trigger stripe event div for other trigger conditions.
		if($(this).val() !== 'STRIPE_CHARGE_EVENT'){
			$('form#addTriggerForm').find('select#trigger-stripe-event').closest('div.control-group').css('display', 'none');
			$('form#addTriggerForm').find('select#trigger-stripe-event').val("");
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}
		
		// Hide trigger shopify event div for other trigger conditions.
		if($(this).val() !== 'SHOPIFY_EVENT'){
			$('form#addTriggerForm').find('select#trigger-shopify-event').closest('div.control-group').css('display', 'none');
			$('form#addTriggerForm').find('select#trigger-shopify-event').val("");
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}
		
		// Hide trigger inbound mail event div for other trigger conditions.
		if($(this).val() !== 'INBOUND_MAIL_EVENT'){
			$('form#addTriggerForm').find('div#trigger-inbound-mail-event').css('display', 'none');
			$('#new-mail-trigger-run-on-new-contacts').css('display', 'none');
		}
		
		if($(this).val() != 'EMAIL_OPENED' || $(this).val() != 'EMAIL_LINK_CLICKED'){
			
			$('form#addTriggerForm').find('select#email-tracking-type').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('#custom-link-clicked').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
		}
		
		if($(this).val() != 'UNSUBSCRIBED')
			$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
		
		if($(this).val() != 'EVENT_IS_ADDED')
		{
			$('form#addTriggerForm').find('select#event-owner-id').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('select#event-type').closest('div.control-group').css('display', 'none');
		}
		
		// Hide trigger milestones div for other trigger conditions.
		if ($(this).val() !== 'INBOUND_CALL' || $(this).val() !== 'OUTBOUND_CALL'){
			$('form#addTriggerForm').find('div#CALL').closest('div.control-group').css('display', 'none');
		}
			
		if($(this).val() != 'FORM_SUBMIT'){
			$('form#addTriggerForm').find('select#trigger-form-event').closest('div.control-group').css('display', 'none');
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}

		// Initialize tags typeahead
		if ($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		{
			$('form#addTriggerForm').find('#trigger-custom-tags').closest('div.control-group').css('display', '');
			
			// Tags typeahead for tag input field
			addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		}
		
		// Initialize tags typeahead
		if ($(this).val() == 'RUNS_DAILY' || $(this).val() == 'RUNS_WEEKLY' || $(this).val() == 'RUNS_MONTHLY')
		{	
			populate_contact_filters_in_trigger($('form#addTriggerForm'), 'contact-filter');
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
		
		// Show shopify events
		if($(this).val() == 'SHOPIFY_EVENT')
		{
			populate_shopify_events_in_trigger($('form#addTriggerForm'), 'trigger-shopify-event');
		}

		if($(this).val() == 'INBOUND_MAIL_EVENT')
		{
			populate_inbound_mail_events_in_trigger($('form#addTriggerForm'), 'trigger-inbound-mail-event');
		}
		
		if($(this).val() == 'EMAIL_OPENED' || $(this).val() == 'EMAIL_LINK_CLICKED'){
			$('form#addTriggerForm').find('#email-tracking-type').closest('div.control-group').css('display', '');
			
			if($(this).val() == 'EMAIL_LINK_CLICKED')
				$('form#addTriggerForm').find('#custom-link-clicked').closest('div.control-group').css('display', '');
		}
		
		if($(this).val() == 'EVENT_IS_ADDED')
		{
			$('form#addTriggerForm').find('select#event-type').closest('div.control-group').css('display', '');
			
			populate_owners_in_trigger($('form#addTriggerForm'), 'event-owner-id');
		}
		
		if($(this).val() == 'INBOUND_CALL' || $(this).val() == 'OUTBOUND_CALL')
		{
			populate_call_trigger_options($('form#addTriggerForm'));	
		}
		
		if($(this).val() == 'FORM_SUBMIT')
		{
			populate_forms_in_trigger($('form#addTriggerForm'), 'trigger-form-event');
		}

		if($(this).val() == 'UNSUBSCRIBED')
			show_email_tracking_campaigns();

	});
	
	// When cancel clicked, take to Back page
	$('body').on('click', '#trigger-cancel', function(e)
	{
		e.preventDefault();

		if (history !== undefined)
			history.back(-1);
	});
	
	$('body').on('change', '#email-tracking-type', function(e){
		
		e.preventDefault();
		
		if($(this).val() == 'ANY' || $(this).val() == 'PERSONAL')
		{
			// Show milestones select element
			$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
			return;
		}
		
		// show email tracking campaigns
		show_email_tracking_campaigns();
		
	});
});*/

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

	populateTrackMilestones(trigger_form, undefined, undefined, function(tracks)
	{
//		console.log(tracks);
		$('.loading').remove();

		// Make obtained milestone value selected
		if (trigger_deal_milestone_value !== undefined)
		{
//			"Won" - > "defaultId_Won";
			
			var pipeline_id = trigger_deal_milestone_value.split('_')[0];
			
			// If pipeline_id is not NUMBER
			if(pipeline_id != " " && isNaN(Number(pipeline_id)))
			{
				$.each(tracks, function(index, track){
					
					// For Old code compatibility - Appending Default track id to default milestones
					if(track.isDefault && ~track.milestones.indexOf(trigger_deal_milestone_value))
					{
						trigger_deal_milestone_value = track.id + "_" + trigger_deal_milestone_value;
						return true;
					}
				});
				
			}
			
			trigger_form.find('select#' + milestones_select_id).val(trigger_deal_milestone_value).attr('selected', 'selected').trigger('change');
		}
	}, "Select new milestone...", 'trigger-deal-milestone');

	// Fills milestone select element
/*	populateMilestones(trigger_form, undefined, 0, undefined, function(data)
	{
		$('.loading').remove();
		// Append obtained option values to select
		trigger_form.find('select#' + milestones_select_id).html(data);
		// Make obtained milestone value selected
		if (trigger_deal_milestone_value !== undefined)
		{
			trigger_form.find('select#' + milestones_select_id).val(trigger_deal_milestone_value).attr('selected', 'selected').trigger('change');
		}
	}, "Select new milestone...");*/
}

/**
 * Shows hidden trigger-milestones select element and fills with milestones
 * data.
 * 
 * @param trigger_form -
 *            trigger form jQuery object
 * @param filter_select_id -
 *            contact filter select id
 * @param trigger_deal_milestone_value -
 *            trigger milestone value obtained from saved trigger.
 */
function populate_contact_filters_in_trigger(trigger_form, filter_select_id, value)
{
	// Show milestones select element
	trigger_form.find('select#' + filter_select_id).closest('div.control-group').css('display', '');

	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	fillSelect('contact-filter', '/core/api/filters', 'workflow', function fillContactFilter()
	{
		if (value)
		{
			$('#contact-filter',trigger_form).find('option[value=' + value + ']').attr('selected', 'selected');
		}
	}, optionsTemplate, false,undefined,"Select Contact filter");
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
function populate_stripe_events_in_trigger(trigger_form, stripe_event_select_id, stripe_event_value, trigger_run_on_new_contacts)
{
	trigger_form.find('select#' + stripe_event_select_id).closest('div.control-group').css('display','');
	trigger_form.find("#trigger-run-on-new-contacts").css('display', '');
	if(trigger_run_on_new_contacts)
		trigger_form.find("#trigger-run-on-new-contacts").val(trigger_run_on_new_contacts);

	if(stripe_event_value !== undefined)
	{
		trigger_form.find('select#' + stripe_event_select_id).val(stripe_event_value).attr('selected', 'selected').trigger('change');
	}
}

function populate_shopify_events_in_trigger(trigger_form, shopify_event_select_id, shopify_event_value, trigger_run_on_new_contacts)
{
	trigger_form.find('select#' + shopify_event_select_id).closest('div.control-group').css('display','');
	trigger_form.find("#trigger-run-on-new-contacts").css('display', '');
	if(trigger_run_on_new_contacts)
		trigger_form.find("#trigger-run-on-new-contacts").val(trigger_run_on_new_contacts);

	if(shopify_event_value !== undefined)
	{
		trigger_form.find('select#' + shopify_event_select_id).val(shopify_event_value).attr('selected', 'selected').trigger('change');
	}
}

function populate_inbound_mail_events_in_trigger(trigger_form, inbound_mail_event_div_class, new_email_trigger_run_on_new_contacts)
{
	trigger_form.find('div#' + inbound_mail_event_div_class).css('display','');
	trigger_form.find("#new-mail-trigger-run-on-new-contacts").css('display', '');
	if(new_email_trigger_run_on_new_contacts)
		trigger_form.find("#new-mail-trigger-run-on-new-contacts").val(new_email_trigger_run_on_new_contacts);
}

function populate_owners_in_trigger(trigger_form, owner_select_id, trigger_owner_id)
{
	// Show milestones select element
	trigger_form.find('select#' + owner_select_id).closest('div.control-group').css('display', '');

	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	fillSelect(owner_select_id, '/core/api/users/partial', 'users', function()
			{
		
			$("#" + owner_select_id +' option:first').after('<option value="ANY">Any Owner</option>');
			
			if (trigger_owner_id)
			{
				$('#'+owner_select_id, trigger_form).find('option[value=' + trigger_owner_id + ']').attr('selected', 'selected');
			}
		
	}, optionsTemplate, false, undefined, "Select Event Owner");
}

function populate_call_trigger_options(trigger_form, triggerJSON)
{
	
	trigger_form.find('div#CALL').closest('div.control-group').css('display', '');
	
	if(triggerJSON && triggerJSON["call_disposition"])
		trigger_form.find('div#CALL select').find('option[value="' + triggerJSON["call_disposition"] + '"]').attr('selected', 'selected').trigger('change');
}

function populate_forms_in_trigger(trigger_form, trigger_form_select_id, trigger_form_id, trigger_run_on_new_contacts)
{
	trigger_form.find("#trigger-run-on-new-contacts").css('display', '');
	if(trigger_run_on_new_contacts)
		trigger_form.find("#trigger-run-on-new-contacts").val(trigger_run_on_new_contacts);
	trigger_form.find('select#' + trigger_form_select_id).closest('div.control-group').css('display', '');
	var formOptionsTemplate = "<option value='{{id}}'>{{formName}}</option>";
	fillSelect(trigger_form_select_id, 'core/api/forms', 'forms', function()
	{
		if (trigger_form_id)
		{
			$('#' + trigger_form_select_id, trigger_form).find('option[value=' + trigger_form_id + ']').attr('selected', 'selected');
		}
	}, formOptionsTemplate, false, undefined, "Select Form");
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
		if (trigger_collection.length !== 0){

			getTemplate('workflow-triggers', { "triggers" : trigger_collection.toJSON() }, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$(td).html($(template_ui));	
			}, $(td));

		}
	});
}

function show_email_tracking_campaigns()
{
	// Show campaign select element
	$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', '');

	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	
	/**
	 * Fills campaign select with existing Campaigns.
	 * 
	 * @param campaign-select -
	 *            Id of select element of Campaign
	 * @param /core/api/workflows -
	 *            Url to get workflows
	 * @param 'workflow' -
	 *            parse key
	 * @param no-callback -
	 *            No callback
	 * @param optionsTemplate-
	 *            to fill options with workflows
	 */
	fillSelect('email-tracking-campaign-id', '/core/api/workflows', 'workflow', function()
			{
				
				$('#email-tracking-campaign-id option:first').after('<option value="0">All</option>');
				
			}, optionsTemplate, false);
}

function initializeTriggerEventListners()
{
	$("#trigger-listener").on('click', '.add-trigger', function(e){
		 
		var type = e.target.getAttribute("data");
		var campaign_id = $('#campaign-id').val();
		App_Workflows.triggerAdd(campaign_id,type);
		 
	});

}

function openVerifyEmailModal(el) {
	if (window.parent.$('#workflow-verify-email').size() != 0)
		window.parent.$('#workflow-verify-email').remove();

	var selected = $(el).find(':selected').val();

	if (selected == 'verify_email')
		window.parent.workflow_alerts("Verify a new From address", undefined,
				"workflow-verify-email-modal"

				, function(modal) {

					// Focus on input
					modal.on('shown.bs.modal', function() {
						$(this).find('input').focus();

						parent.send_verify_email();
					});

					// On hidden
					modal.on('hidden.bs.modal', function(e) {

						var given_email = $(this).find('input').val();

						resetAndFillFromSelect(given_email);
					});
				});
}

function rearrange_from_email_options($select, data) {

	if (!data)
		return;

	var unverified = [];

	$.each(data, function(index, obj) {

		if (obj.verified == "NO")
			unverified.push(obj.email);

	});

	$select.find('option').each(function() {

		var email = $(this).val()

		if (unverified.indexOf(email) != -1) {
			$(this).attr('unverified', 'unverified');
			$(this).text(email + ' (unverified)');
		}
	});

}

function resetAndFillFromSelect(selected_val) {
	// Make send email node from email empty
	$('#from_email').empty();

	var options = {
		"+ Add new" : "verify_email"
	};

	fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {

				$select
						.find("option:first")
						.before(
								"<option value='{{owner.email}}'>Contact's Owner</option>");

				if (selected_val)
					$select.val(selected_val).attr("selected", "selected");
				else
					$select.val("Contact's Owner").attr("selected", "selected");

				rearrange_from_email_options($select, data);
			});
}


function fetchAndFillSelect(url, keyField, valField, appendNameField, options, selectContainer, arrange_type, callback)
{

	var selectOptionAttributes ="";
	
	
	// Populate Options - Naresh 23/04/2014
	if(options !== undefined)
	{
		$.each(
				options, function (key, value) {
					
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
						selectOptionAttributes += "<option selected='selected' value='" + value + "'>" + key + "</option>";
					}
					else
						selectOptionAttributes += "<option value='" + value + "'>" + key + "</option>";
				});
	 }

	$.ajax({
		  url: url,
		  async: false,
		  dataType: "json",
		  success: function(data)
		  {	    			
	    
			// Append given options
			if(selectOptionAttributes !== undefined)
	    	$(selectOptionAttributes).appendTo(selectContainer);
	    
		var array = eval (data);	      
		$.each(array, function( index, json )
		{				
				var key = eval("json." + keyField);			
				var value = eval("json." + valField);
				
				var appendName = eval("json."+ appendNameField);
				
				// Append name to email like Naresh <naresh@agilecrm.com    >
				if(key!= undefined && appendName != undefined)
					key = appendName + " &lt;"+key+"&gt;";
				
				if(key != undefined && value != undefined)
				{
					console.log(key); 
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
						
						option = "<option selected value='" + value + "'>" + key + "</option>";
    				}
    				else
    				    option = "<option value='" + value + "'>" + key + "</option>";
        				
    				if(arrange_type && arrange_type == "prepend")
    					$(option).prependTo(selectContainer);
    				else
    				{	
    					// Append to container	
        				$(option).appendTo(selectContainer);	        				        								
        			}
				}											   	   	   	  	   	  				
		});

		  if(callback && typeof (callback) === "function")
		  	callback(selectContainer, data);
		  }
	});
}


function initializeTriggerListEventListners(id,trigger_type)
{

	$('#trigger-selector, #trigger-edit-selector').on('click', '#trigger-cancel', function(e)
 	{
		e.preventDefault();

		if (!history)
			   return;

		if($(this).closest("#trigger-edit-selector").length == 0)
			Backbone.history.loadUrl();
		else history.back(-1);
	});


	$('#trigger-selector, #trigger-edit-selector').on('change', '#email-tracking-type', function(e)
		{
			
			e.preventDefault();
		
			if($(this).val() == 'ANY' || $(this).val() == 'PERSONAL')
				{
					// Show milestones select element
					$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
					return;
				}
		
			// show email tracking campaigns
			show_email_tracking_campaigns();
		});

	
	$('#trigger-selector, #trigger-edit-selector').on('change', '#trigger-type', function(e)
	{
		e.preventDefault();

		var type = $(this).val();
		/*if(type != undefined)
			type = trigger_type;*/
		// Hide trigger milestones div for other trigger conditions.
		if (type !== 'DEAL_MILESTONE_IS_CHANGED'){
			$('form#addTriggerForm').find('select#trigger-deal-milestone').closest('div.control-group').css('display', 'none');
		}
		
		if(type !== 'RUNS_HOURLY' || type !== 'RUNS_DAILY' || type !== 'RUNS_WEEKLY' || type !== 'RUNS_MONTHLY'){
			$('form#addTriggerForm').find('select#contact-filter').closest('div.control-group').css('display', 'none');
		}

		// Hide trigger stripe event div for other trigger conditions.
		if(type !== 'STRIPE_CHARGE_EVENT'){
			$('form#addTriggerForm').find('select#trigger-stripe-event').closest('div.control-group').css('display', 'none');
			$('form#addTriggerForm').find('select#trigger-stripe-event').val("");
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}
		
		// Hide trigger shopify event div for other trigger conditions.
		if(type !== 'SHOPIFY_EVENT'){
			$('form#addTriggerForm').find('select#trigger-shopify-event').closest('div.control-group').css('display', 'none');
			$('form#addTriggerForm').find('select#trigger-shopify-event').val("");
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}
		
		// Hide trigger inbound mail event div for other trigger conditions.
		if(type !== 'INBOUND_MAIL_EVENT'){
			$('form#addTriggerForm').find('div#trigger-inbound-mail-event').css('display', 'none');
			$('#new-mail-trigger-run-on-new-contacts').css('display', 'none');
		}
		
		if(type != 'EMAIL_OPENED' || type != 'EMAIL_LINK_CLICKED'){
			
			$('form#addTriggerForm').find('select#email-tracking-type').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('#custom-link-clicked').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
		}
		
		if(type != 'UNSUBSCRIBED')
			$('form#addTriggerForm').find('select#email-tracking-campaign-id').closest('div.control-group').css('display', 'none');
		
		if(type != 'EVENT_IS_ADDED')
		{
			$('form#addTriggerForm').find('select#event-owner-id').closest('div.control-group').css('display', 'none');
			
			$('form#addTriggerForm').find('select#event-type').closest('div.control-group').css('display', 'none');
		}
		
		// Hide trigger milestones div for other trigger conditions.
		if (type !== 'INBOUND_CALL' || type !== 'OUTBOUND_CALL'){
			$('form#addTriggerForm').find('div#CALL').closest('div.control-group').css('display', 'none');
		}
			
		if(type != 'FORM_SUBMIT'){
			$('form#addTriggerForm').find('select#trigger-form-event').closest('div.control-group').css('display', 'none');
			$('#trigger-run-on-new-contacts').css('display', 'none');
		}

		// Initialize tags typeahead
		if (type == 'TAG_IS_ADDED' || type == 'TAG_IS_DELETED')
		{
			$('form#addTriggerForm').find('#trigger-custom-tags').closest('div.control-group').css('display', '');
			
			// Tags typeahead for tag input field
			addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		}
		
		// Initialize tags typeahead
		if (type == 'RUNS_HOURLY' || type == 'RUNS_DAILY' || type == 'RUNS_WEEKLY' || type == 'RUNS_MONTHLY')
		{	
			populate_contact_filters_in_trigger($('form#addTriggerForm'), 'contact-filter');
		}


		// Show score
		if (type == 'ADD_SCORE')
			$('form#addTriggerForm').find('#trigger-custom-score').closest('div.control-group').css('display', '');
		
		// Populate milestones for triggers
		if (type == 'DEAL_MILESTONE_IS_CHANGED')
		{
			populate_milestones_in_trigger($('form#addTriggerForm'), 'trigger-deal-milestone');
		}
		
		// Show stripe events
		if(type == 'STRIPE_CHARGE_EVENT')
		{
			populate_stripe_events_in_trigger($('form#addTriggerForm'), 'trigger-stripe-event');
		}
		
		// Show shopify events
		if(type == 'SHOPIFY_EVENT')
		{
			populate_shopify_events_in_trigger($('form#addTriggerForm'), 'trigger-shopify-event');
		}

		if(type == 'INBOUND_MAIL_EVENT')
		{
			populate_inbound_mail_events_in_trigger($('form#addTriggerForm'), 'trigger-inbound-mail-event');
		}
		
		if(type == 'EMAIL_OPENED' || type == 'EMAIL_LINK_CLICKED'){
			$('form#addTriggerForm').find('#email-tracking-type').closest('div.control-group').css('display', '');
			
			if(type == 'EMAIL_LINK_CLICKED')
				$('form#addTriggerForm').find('#custom-link-clicked').closest('div.control-group').css('display', '');
		}
		
		if(type == 'EVENT_IS_ADDED')
		{
			$('form#addTriggerForm').find('select#event-type').closest('div.control-group').css('display', '');
			
			populate_owners_in_trigger($('form#addTriggerForm'), 'event-owner-id');
		}
		
		if(type == 'INBOUND_CALL' || type == 'OUTBOUND_CALL')
		{
			populate_call_trigger_options($('form#addTriggerForm'));	
		}
		
		if(type == 'FORM_SUBMIT')
		{
			populate_forms_in_trigger($('form#addTriggerForm'), 'trigger-form-event');
		}

		if(type == 'UNSUBSCRIBED')
			show_email_tracking_campaigns();

	});
}
 