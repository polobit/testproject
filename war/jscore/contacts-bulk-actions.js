$(function(){ 
	
	// Bulk owner
	$("#bulk-owner").live('click', function(e){
		e.preventDefault();
		var id_array = getContactsBulkIds();
		
		$('body').die('fill_owners').live('fill_owners', function(event){
			var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
	        fillSelect('ownerBulkSelect','/core/api/users', 'domainUsers', 'no-callback ', optionsTemplate); 
		});
		
		// Navigate to show form
		Backbone.history.navigate("bulk-owner", {
            trigger: true
        });
		
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
	
	// Bulk campaigns
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
	
	// Bulk tags
	$("#bulk-tags").live('click', function(e){
		e.preventDefault();
		var id_array = getContactsBulkIds();
		
		// var tags = getTags('tagsBulkForm');

		Backbone.history.navigate("bulk-tags", {
            trigger: true
        });
		
		setupTagsTypeAhead();
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
	
	// Bulk email
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
