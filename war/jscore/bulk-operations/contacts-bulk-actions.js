/**
 * Performs operations like changing owner, adding tags and etc.. on contacts bulk
 * 
 * @module Bulk operations
 * -------------------------------------------
 * author: Rammohan 
 */
$(function(){ 
	
   /**
    * Bulk operations - Change owner 
    * Shows all the users as drop down list to select one of them as the owner 
    * for the contacts bulk
    */	
	$("#bulk-owner").live('click', function(e){
		e.preventDefault();
		var id_array = getContactsBulkIds();
		
		// Bind a custom event to trigger on loading the form
		$('body').die('fill_owners').live('fill_owners', function(event){
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	        fillSelect('ownerBulkSelect','/core/api/users', 'domainUsers', 'no-callback ', optionsTemplate); 
		});
		
		// Navigate to show form
		Backbone.history.navigate("bulk-owner", {
            trigger: true
        });
		
	   /**
	    * Changes the owner by sending the new owner name as path parameter 
	    * and contact ids as form data of post request
	    */	
		$('#changeOwnerToBulk').die().live('click',function(e){
			e.preventDefault();
			
			var $form = $('#ownerBulkForm');

			// Validate Form
		    if(!isValidForm($form))
		    {
		    	
		    	return;
		    }
			
			// Show loading symbol until model get saved
		    $('#ownerBulkForm').find('span.save-status').html(LOADING_HTML);
		    
			var new_owner = $('#ownerBulkSelect option:selected').attr('value');
			var url = '/core/api/contacts/bulk/owner/' + new_owner;
			var json = {};
			json.contact_ids = JSON.stringify(id_array);
			$.post(url, json, function(data){

				// Remove loading image
				$('#ownerBulkForm').find('span.save-status img').remove();
				
				Backbone.history.navigate("contacts", {
       	            trigger: true
       	        });
			});

		});
	});
	
   /**
    * Bulk operations - Add to campaign
	* Shows all the workflows as drop down list to select one of them  
	* to subscribe the contacts bulk
	*/
	$("#bulk-campaigns").live('click', function(e){
		e.preventDefault();
		var id_array = getContactsBulkIds();
		
		$('body').die('fill_campaigns').live('fill_campaigns', function(event){
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	        fillSelect('campaignBulkSelect','/core/api/workflows', 'workflow', 'no-callback ', optionsTemplate); 
		});
		
		// Navigate to show form
		Backbone.history.navigate("bulk-campaigns", {
            trigger: true
        });
		
	   /**
	    * Subscribes the contacts bulk to a campaign by sending the wofkflow id and contacts bulk ids 
	    */	
		$('#addBulkTocampaign').die().live('click',function(e){
			e.preventDefault();
			
			var $form = $('#campaignsBulkForm');

			// Validate Form
		    if(!isValidForm($form))
		    {
		    	
		    	return;
		    }
			
			// Show loading symbol until model get saved
		    $('#campaignsBulkForm').find('span.save-status').html(LOADING_HTML);
		    
			var workflow_id = $('#campaignBulkSelect option:selected').attr('value');
						
			var url = '/core/api/campaigns/enroll/bulk/' + workflow_id;
			var json = {};
			json.contact_ids = JSON.stringify(id_array);
			
			$.ajax({
				url: url,
				type: 'POST',
				data: json,
				success: function(data){

					// Remove loading image
					$('#campaignsBulkForm').find('span.save-status img').remove();
					
					Backbone.history.navigate("contacts", {
	       	            trigger: true
	       	        });
				}
			});

		});
        
	});
	
   /**
    * Bulk operations - Add tags
    * Shows the existing tags with help of typeahead to add tags to the contacts bulk. 
    * Also we can add new tags.
    */	
	$("#bulk-tags").live('click', function(e){
		e.preventDefault();
		var id_array = getContactsBulkIds();
		
		// var tags = getTags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags", {
            trigger: true
        });
		
		setupTagsTypeAhead();
		
	   /**
	    * Add the tags to the contacts bulk by sending the contact ids and tags 
	    * through post request to the appropriate url
	    */	
		$('#addTagsToContactsBulk').die().live('click',function(e){
			e.preventDefault();
			var tags = getTags('tagsBulkForm');

			if (tags[0].value.length > 0){
				
				// Show loading symbol until model get saved
			    $('#tagsBulkForm').find('span.save-status').html(LOADING_HTML);
			    
			    var url = '/core/api/contacts/bulk/' + tags[0].value;
			    var json = {};
			    json.contact_ids = JSON.stringify(id_array);
			    $.post(url, json, function(data){
			    	
			    	// Add the added tags to the collection of tags
			    	$.each(tags[0].value, function(index, tag){
	       				tagsCollection.add( {"tag" : tag} );
	       			});
       			
			    	$('#tagsBulkForm').find('span.save-status img').remove();
       			
			    	Backbone.history.navigate("contacts", {
			    		trigger: true
			    	});
			    });
			
			}else{
				Backbone.history.navigate("contacts", {
       	            trigger: true
       	        });
			}
		});
        
	});
	
   /**
    * Bulk operations - Send email
    * Sends email to the bulk of contacts by filling up the send email details
    * like email from address, subject and body by selecting a template. 
    */	
	$("#bulk-email").live('click', function(e){
		e.preventDefault();
		
		var email_array = [];

		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked add store it's id in an array 
			if($(element).is(':checked')){
				var json = $(element).closest('tr').data().toJSON();
				email_array.push(getPropertyValue(json.properties, "email"));
			}
		});
				
		$('body').live('fill_emails', function(event){

			// Populate from address and templates
			populateSendEmailDetails();
			
			$("#emailForm").find( 'input[name="to"]' ).val(email_array);
		
		});

		Backbone.history.navigate("bulk-email", {
            trigger: true
        });
	});	
});

/**
 * Gets an array of contact ids to perform bulk operations
 * @method getContactsBulkIds
 * @returns {Array} id_array of contact ids
 */
function getContactsBulkIds(){
	var id_array = [];

	var table = $('body').find('table.showCheckboxes');

	$(table).find('tr .tbody_check').each(function(index, element){
		
		// If element is checked add store it's id in an array 
		if($(element).is(':checked')){
			id_array.push($(element).closest('tr').data().get('id'));
		}
	});
	return id_array;
}
