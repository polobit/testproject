$(function(){ 
	// Display activity(task) modal related to contact
    $('#contact-add-task').live('click', function(e){
    	e.preventDefault();
    	highlightTask();
    	var	el = $("#taskForm");
    	fillRelation(el);
    	$('#activityModal').modal('show');
    });
    
    // Display note modal related to contact
    $('#contact-add-note').live('click', function(e){
    	e.preventDefault();
    	var	el = $("#noteForm");
    	fillRelation(el);
    	$('#noteModal').modal('show');
     });
    
    // Subscribe contact to a campaign
    $('#contact-add-campaign').live('click', function(e){
    	e.preventDefault();
    	
    		var contact_id = App_Contacts.contactDetailView.model.id;
    		
    		$('body').live('fill_campaigns_contact', function(event){
    			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    	        fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
    		});
    		
    		// Navigate to show form
    		Backbone.history.navigate("add-campaign", {
                trigger: true
            });
    		
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
					
    					Backbone.history.navigate("contact/" + contact_id, {
    						trigger: true
    					});
    				}
    		   });
    		});
    		
    		$('#contact-close-campaign').live('click', function(e){
    			e.preventDefault();
    			Backbone.history.navigate("contact/" + contact_id, {
       	            trigger: true
       	        });
    	    });
            
    	});
    
});

function fillRelation(el){
	 var json = App_Contacts.contactDetailView.model.toJSON();
 	 var contact_name = json.properties[0].value + " " + json.properties[1].value;
 	
 	$('.tags',el).html('<li class="tag"  style="display: inline-block; vertical-align: middle; margin-right:3px;" data="'+ json.id +'">'+contact_name+'</li>');

}