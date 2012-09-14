$(function(){
	$('#contact-actions-delete').live('click', function(e){
		
		e.preventDefault();
		
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
		$("#addTagsForm").css("display", "block");
	});
	
	// Add tags to a contact 
	$('#contact-add-tags').live('click', function(e){
		e.preventDefault();
		var tags = getTags('addTags');
		$("#addTagsForm").css("display", "none");
		var json = App_Contacts.contactDetailView.model.toJSON();
	    if (tags != undefined){
	    	json = add_contact_tags(json, tags);
   			
	    	// Reset form
	    	$('#addTagsForm').each (function(){
   		  	  	this.reset();
   		  	});
   			
	    	var contact = new Backbone.Model();
	        contact.url = 'core/api/contacts';
	        contact.save(json,{
	       		success: function(data)
	       			{
	       			// Save new tags in Tag class
	       			$.post('core/api/tags/' + tags);
	       			
	       			}
	        });
	    }
	    
	});
	
});

function starify(el){
    head.js('lib/jquery.raty.min.js', function(){
    	
    	var contact_model =  App_Contacts.contactDetailView.model;
    	// Set URL - is this required?
    	contact_model.url = 'core/api/contacts'
    	
    	$('#star', el).raty({
        	click: function(score, evt) {
        	   
        		// alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
        		contact_model.set('star_value', score);
        	
        		// Save model
           		contact_model.save();

        	},
        	score: contact_model.get('star_value')
            
        });
        });
}