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
    $('.contact-add-task').live('click', function(e){
    	e.preventDefault();
    	highlight_task();
    	var	el = $("#taskForm");
    	
    	// Displays contact name, to indicate the task is related to the contact
    	fill_relation(el);
    	$('#activityModal').modal('show');
    	agile_type_ahead("task_related_to", el, contacts_typeahead);
    });
    
    /**
     * Displays note modal, to add a note related to the contact in contact 
     * detail view. Also prepends the contact name to related to field of 
     * activity modal.  
     */ 
    $('.contact-add-note').live('click', function(e){
    	e.preventDefault();
    	var	el = $("#noteForm");
    	
    	// Displays contact name, to indicate the note is related to the contact
    	fill_relation(el);
    	$('#noteModal').modal('show');
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
     });
    
    /**
     * Subscribes contact to a campaign. First loads a form with campaigns select 
     * option and then fills the select drop down with all the campaigns by triggering
     * a custom event (fill_campaigns_contact).
     */ 
    $('#contact-add-campaign').live('click', function(e){
    		e.preventDefault();
    	
    		var contact_id = App_Contacts.contactDetailView.model.id;
    		
    		/*
    		 * Custom event to fill campaigns. This is triggered from the controller
    		 * on loading of the form. 
    		 * This event is died to avoid execution of its functionality multiple
    		 * times, if it is clicked multiple times (when it is clicked first time 
    		 * it executes once, if again it is clicked it executes twice and so on).  
    		 */
    		
    		$('body').die('fill_campaigns_contact').live('fill_campaigns_contact', function(event){
    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    	        fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
    		});
    		
    		// Navigate to controller to show the form and then to trigger the custom event
    		Backbone.history.navigate("add-campaign", {
                trigger: true
            });
    		
    		/*
    		 * Subscribes the contact to selected campaign from the drop down, when
    		 * the Add button is clicked
    		 */
    		$('#subscribe-contact-campaign').die().live('click',function(e){
    			e.preventDefault();
    			
    			var $form = $('#contactCampaignForm');

    			// Validate Form
    		    if(!isValidForm($form))
    		    {
    		    	
    		    	return;
    		    }
    			
    			// Show loading symbol until model get saved
    		    $('#contactCampaignForm').find('span.save-status').html(LOADING_HTML);
    		    
    			var workflow_id = $('#campaign-select option:selected').attr('value');
    						
    			var url = '/core/api/campaigns/enroll/' + contact_id + '/' + workflow_id;
    			
    			$.ajax({
    				url: url,
    				type: 'GET',
    				success: function(){
   				
    					// Remove loading image
    					$('#contactCampaignForm').find('span.save-status img').remove();
					
    					// Navigate back to contact detail view
    					Backbone.history.navigate("contact/" + contact_id, {
    						trigger: true
    					});
    				}
    		   });
    		});
    		
    		// Click event of campaigns form close button
    		$('#contact-close-campaign').live('click', function(e){
    			e.preventDefault();
    			
    			// Navigate back to contact detail view
    			Backbone.history.navigate("contact/" + contact_id, {
       	            trigger: true
       	        });
    	    });
            
    	});
    
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
	var json = App_Contacts.contactDetailView.model.toJSON();
 	var contact_name = getPropertyValue(json.properties, "first_name")+ " " + getPropertyValue(json.properties, "last_name");
 	
 	// Adds contact name to tags ul as li element
 	$('.tags',el).html('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');

}