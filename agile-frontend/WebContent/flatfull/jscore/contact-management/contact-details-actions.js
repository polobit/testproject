/**
 * contact-details-actions.js defines some of the functionalities (add note, task and 
 * campaign to a contact) of actions drop down menu of a contact in its detail view.
 * The remaining functionalities are defined through controller.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){ 
	
	/**
	 * Displays activity modal with all task features,  to add a task 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
	$('body').on('click', '.contact-add-task', function(e){ 
    	e.preventDefault();

    	var	el = $("#taskForm");
		$('#activityTaskModal').modal('show');
		highlight_task();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("task_related_to", el, contacts_typeahead);

		categories.getCategoriesHtml(undefined,function(catsHtml){
			$('#type',el).html(catsHtml);
			// Fills owner select element
			populateUsers("owners-list", $("#taskForm"), undefined, undefined,
					function(data) {
						$("#taskForm").find("#owners-list").html(data);
						$("#owners-list", el).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
						$("#owners-list", $("#taskForm")).closest('div').find('.loading-img').hide();					
			});
		});
       activateSliderAndTimerToTaskModal();
    });
	
	/**
	 * Displays activity modal with all event features,  to add a event 
	 * related to the contact in contact detail view. Also prepends the 
	 * contact name to related to field of activity modal.
	 */ 
    $('body').on('click', '.contact-add-event', function(e){ 
    	e.preventDefault();

    	var	el = $("#activityForm");
		$('#activityModal').modal('show');
		highlight_event();
		// Displays contact name, to indicate the task is related to the contact
		fill_relation(el);
		agile_type_ahead("event_related_to", el, contacts_typeahead);

    });
    
    /**
     * Displays note modal, to add a note related to the contact in contact 
     * detail view. Also prepends the contact name to related to field of 
     * activity modal.  
     */ 
    $('body').on('click', '.contact-add-note', function(e){ 
    	e.preventDefault();
        console.log("execution");
    	var	el = $("#noteForm");
    	
    	// Displays contact name, to indicate the note is related to the contact
    	fill_relation(el);

        if(!$(this).attr("data-toggle"))
             $('#noteModal').modal('show');
         
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });
    
    /**
     * Subscribes contact to a campaign. First loads a form with campaigns select 
     * option and then fills the select drop down with all the campaigns by triggering
     * a custom event (fill_campaigns_contact).
     */ 
	$('body').on('click', '.contact-add-campaign, .add-to-campaign', function(e){ 
    		e.preventDefault();
    	
    		var contact_id = App_Contacts.contactDetailView.model.id;
    		
    		// Navigate to Add Campaigns page
    		if($(this).hasClass('contact-add-campaign'))
    		{
   			
	    		/*
	    		 * Custom event to fill campaigns. This is triggered from the controller
	    		 * on loading of the form. 
	    		 * This event is died to avoid execution of its functionality multiple
	    		 * times, if it is clicked multiple times (when it is clicked first time 
	    		 * it executes once, if again it is clicked it executes twice and so on).  
	    		 */
    		
	    		$('body').off('fill_campaigns_contact').on('fill_campaigns_contact', function(event){
	    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	    	        fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
	    		});
	    		
	    		// Navigate to controller to show the form and then to trigger the custom event
	    		Backbone.history.navigate("add-campaign", {
	                trigger: true
	            });
    			
    		}
    		
    		// If link clicked is within Campaigns tab, hide link and show form.
    		if($(this).hasClass('add-to-campaign'))
    		{
    			$(this).css('display','none');
    			
    			$('.show_campaigns_list').css('display','inline-block');
    			
    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    			
    		    fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
    		}
    		
    		
    		/*
    		 * Subscribes the contact to selected campaign from the drop down, when
    		 * the Add button is clicked
    		 */
			$('body').on('click', '#subscribe-contact-campaign, #add-to-campaign', function(e){
    			e.preventDefault();

    			var $form;
    			
    			// Add Campaigns form in another page.
    			if($(this).attr('id') === 'subscribe-contact-campaign')
    				$form = $('#contactCampaignForm');
    			
    			// For within Campaigns tab, campaigns list form
    			if($(this).attr('id') === 'add-to-campaign')
    				$form = $('#add-to-campaign-form');
    			
    			// Verify form validation
    			if(!isValidForm($form))
    				return;

    			// Button disabled || Validate Form fails
    		    if($(this).attr('disabled') == 'disabled')
    		    	return;
    			
    		    var saveButton=$(this);
    		    disable_save_button(saveButton);
    		    
    		    // Temporary variable to hide Campaigns list form within
    		    // Campaigns tab.
    		    var $add_to_campaign = $(this).attr('id');
    		    
    			// Show loading symbol until model get saved
    		    //$('#contactCampaignForm').find('span.save-status').html(getRandomLoadingImg());
    		    
    			var workflow_id = $('#campaign-select option:selected').prop('value');
    			var workflow_name = $('#campaign-select option:selected').text();
    			
    			// If Active, don't add to campaign
    			if(is_subscriber_active(workflow_id))
    			{
    				var properties = App_Contacts.contactDetailView.model.get('properties');
    				
    				var name = "Contact";
    				
    				if(properties)
    				    name = getPropertyValue(properties, "first_name");
    				
    				var message = name + " is already active in Campaign '" + workflow_name+"'.";
    				
    				showNotyPopUp("information", message, "top", 10000);
    				
    				enable_save_button(saveButton);
    				
    				return;
    			}
    						
    			var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;
    			
    			$.ajax({
    				url: url,
    				type: 'GET',
    				success: function(){
   				
    					// Remove loading image
    					//$('#contactCampaignForm').find('span.save-status img').remove();
    	    		    enable_save_button(saveButton);
    	    		    
    					// Hides form and shows link within Campaigns tab.
    	    		    if($add_to_campaign === 'add-to-campaign')
    					{
    	    		    	// Temp Flag inorder to show Active campaigns immediately.
        	    		    // if true, downloads contact rather than fetching from collection
        	    		    CONTACT_ASSIGNED_TO_CAMPAIGN = true;
    						
        	    		    $('.show_campaigns_list').css('display','none');
    						
    						$('.add-to-campaign').css('display','inline-block');
    						
    						// Triggers Campaigns tab click, to update contact model
    						$('#contactDetailsTab a[href="#campaigns"]').trigger('click');
    						
    						return;
    						
    					}
    					
    					// Navigate back to contact detail view
    					Backbone.history.navigate("contact/" + contact_id, {
    						trigger: true
    					});
    				}
    		   });
    		}); // End of Add button of form Event Handler
    		
    		// Click event of campaigns form close button
			$('body').on('click', '#contact-close-campaign, #cancel-to-add-campaign', function(e){
    			e.preventDefault();
    			
    			// Campaigns tab form
    			if($(this).attr('id') === 'cancel-to-add-campaign')
    			{
    				var $form = $('#add-to-campaign-form');
    				
    				// Reset form if any errors
    				var validator = $('form#add-to-campaign-form').validate();
    				validator.resetForm();
    				$form.find('div.controls').removeClass('single-error');
    				
    				// Hides form and show link
    				$('.show_campaigns_list').css('display','none');
    				$('.add-to-campaign').css('display','inline-block');
    				
    				return;
    			}
    			
    			// Navigate back to contact detail view
    			Backbone.history.navigate("contact/" + contact_id, {
       	            trigger: true
       	        });
    			
    	    }); // End of Close button of form Event Handler
            
    	}); // End of Add to Campaign Event Handler
    
});

/**
 * Prepends the name of the contact (which is in contact detail view),
 * to the pop-up modal's (task and note) related to field.
 * 
 * @method fill_relation
 * @param {Object} el
 * 			html object of the task or note form
 */
function fill_relation(el){
	var json = null;
	if(company_util.isCompany()){
		json = App_Companies.companyDetailView.model.toJSON();
	} else {
		json = App_Contacts.contactDetailView.model.toJSON();
	}
 	var contact_name = getContactName(json);//getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ json.id +'">'+contact_name+'</li>');

}

function is_subscriber_active(workflow_id)
{
	var model = App_Contacts.contactDetailView.model;
	
	if(!model)
		return false;
	
	var contact = App_Contacts.contactDetailView.model.toJSON();
	
	var campaign_statuses = contact.campaignStatus;
	
	if(!campaign_statuses)
		return false;
	
	for(var i=0; i < campaign_statuses.length; i++)
	{
		if(campaign_statuses[i].status == workflow_id+"-ACTIVE")
			return true;
	}
	
	return false;
	
}