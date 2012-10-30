$(function(){
	$('#contact-actions-delete').live('click', function(e){
		
		e.preventDefault();
		if(!confirm("Do you want to delete the contact?"))
    		return;
		
		App_Contacts.contactDetailView.model.url = "core/api/contacts/" + App_Contacts.contactDetailView.model.id;
		App_Contacts.contactDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("contacts",{trigger: true});
		}});

		
		/* Removing from collection did not work - to do later
		console.log("Deleting");
		
		var model =  App_Contacts.contactDetailView.model;
		console.log(model);
		App_Contacts.contactsListView.collection.remove(model);
		
		Backbone.history.navigate("contacts", {trigger: true});
		*/
	});
	
	// Delete tag from contact
	$('.remove-tags').live('click', function(e){
		e.preventDefault();
		var tag = $(this).attr("id");
		$(this).closest("li").remove();
     	var json = App_Contacts.contactDetailView.model.toJSON();
     	
     	// Delete tag
     	json = delete_contact_tag(json, tag);
        var contact = new Backbone.Model();
        contact.url = 'core/api/contacts';
        contact.save(json,{
       		success: function(data)
       			{
       				// Also delete from Tag class if no more contacts with this tag
       				$.ajax({
       					url: 'core/api/tags/' + tag,
       					type: 'DELETE',
       				});
       			}
        });
	});
	
	// Show form to add tags
	$('#add-tags').live('click', function(e){
		e.preventDefault();
		console.log("in add tags");
		$("#addTagsForm").css("display", "block");
		setupTagsTypeAhead();
	});
	
	// Add tags to a contact 
	$('#contact-add-tags').live('click', function(e){
		e.preventDefault();
		var tags = getTags('addTagsForm');

		$("#addTagsForm").css("display", "none");
		
	    if (tags[0].value.length > 0){
	    	var json = App_Contacts.contactDetailView.model.toJSON();
	    	for(var i = 0; i < tags[0].value.length; i++)
	    		json.tags.push(tags[0].value[i]);
	    	
	    	// Reset form
	    	$('#addTagsForm').each (function(){
   		  	  	this.reset();
   		  	});
   			
	    	var contact = new Backbone.Model();
	        contact.url = 'core/api/contacts';
	        contact.save(json,{
	       		success: function(data)
	       			{
	       			
	       			// Get all existing tags for the contact
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
       					
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			// Append to the list, when no match is found 
	       			for(var i = 0; i < tags[0].value.length; i++){
	       				
	       				if ($.inArray(tags[0].value[i], old_tags) == -1) 
	       					$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + tags[0].value[i] + '"><span><a class="anchor" href="#tags/'+ tags[0].value[i] + '">'+ tags[0].value[i] + '</a><a class="close remove-tags" id="{{this}}">&times</a></span></li>');
	       			}
	       			
	       			// Remove all the elements in ul
	       			$('#ul-add-tags').empty();
	       			
	       			// Save new tags in Tag class
	       			$.post('core/api/tags/' + tags[0].value);
	       			
	       			}
	        });
	    }
	    
	});
	
});


$(function(){
	
	//Saving contact image
	$(".save_img").live('click', function(e){
		e.preventDefault();
		$(".imgholder").css({"width":"50px","height":"50px"});
		var id = $(this).closest("#contact-container").find("#upload_url");
		var image_url = $(id).attr('value');
		agile_crm_update_contact("image", image_url);
	});
	
	//Upload contact image
	$(".upload_pic").live('click', function(e){
		e.preventDefault();
		uploadImage("contact-container");
		$(".save_img").show();
	});
	
	
	// Add score
	    $('#add').live('click', function(e){
	    e.preventDefault();
	    // Convert text to float
	    var add_score = parseFloat($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    $('#lead-score').text(add_score);
       
	    var contact_model =  App_Contacts.contactDetailView.model;
	    
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();
		          
	     });
	
	   
	    // Subtract score
	    $('#minus').live('click', function(e){
		e.preventDefault();
		// Convert text to float
		var sub_score = parseFloat($('#lead-score').text());
		
		sub_score = sub_score - 1;
		$('#lead-score').text(sub_score);
		
		var contact_model =  App_Contacts.contactDetailView.model;
			
	    contact_model.url = 'core/api/contacts';
		contact_model.set('lead_score', sub_score, {silent: true});
	 
		// Save model
		contact_model.save();
	    });
	   
	    $('#score').children().attr('unselectable', 'on');
		
});

function starify(el){
    head.js('lib/jquery.raty.min.js', function(){
    	
    	var contact_model =  App_Contacts.contactDetailView.model;
    	// Set URL - is this required?
    	contact_model.url = 'core/api/contacts';
    	
    	$('#star', el).raty({
        	click: function(score, evt) {
        	   
        		// alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
        		contact_model.set('star_value', score, {silent: true});
        	
        		// Save model
           		contact_model.save();

        	},
        	score: contact_model.get('star_value')
            
        });
        });
    
}