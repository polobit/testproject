/**
 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
 * detail view and highlights the (no.of) stars based on star_value of the contact.
 * 
 * @method starify 
 * @param {Object} el
 * 			html object of contact detail view
 */
function starify(el){
    head.js('lib/jquery.raty.min.js', function(){
    	
    	var contact_model =  App_Contacts.contactDetailView.model.toJSON();
    	
    	// Set URL - is this required?
    	// contact_model.url = 'core/api/contacts';
    	
    	$('#star', el).raty({
    		
    		/**
    		 * When a star is clicked, the position of the star is set as star_value of
    		 * the contact and saved.    
    		 */
        	click: function(score, evt) {
        	   
        		/*// (commented- reloading as silent:true is not effecting) 
        		  // alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
        		contact_model.set('star_value', score, {silent: true});
        	
        		// Save model
           		contact_model.save();*/
           		
           		contact_model.star_value = score;
        		
        		var new_model = new Backbone.Model();
        		new_model.url = 'core/api/contacts';
        		new_model.save(contact_model,{
        			success: function(model){

        			}
        		});

        	},
        	
        	/**
        	 * Highlights the stars based on star_value of the contact
        	 */
        	score: contact_model.star_value
            
        });
    });
    
}

/**
 * Shows all the domain users names as select drop down options (current owner as selected) 
 * to change the owner of a contact 
 */
function fill_owners(el, data){
	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
    fillSelect('contact-detail-owner','/core/api/users', 'domainUsers', function presentOwner() {
    		$('#contact-detail-owner',el).find('option.default-select').remove();
    		if(data.domainUser)
    			$('#contact-detail-owner',el).find('option[value='+data.domainUser.id+']').attr("selected", "selected");
	}, optionsTemplate); 
}

/**
 * This script file (contact-details.js) performs some actions (delete contact, add 
 * and remove tags, change owner and change score etc...) on a contact when it is in 
 * its detail view.
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){
	
	// Deletes a contact from database
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
	
	/**
	 * Deletes a tag of a contact (removes the tag from the contact and saves the contact)
	 */ 
	$('.remove-tags').live('click', function(e){
		e.preventDefault();
		var tag = $(this).attr("id");
		$(this).closest("li").remove();
     	var json = App_Contacts.contactDetailView.model.toJSON();
     	
     	// Returns contact with deleted tag value
     	json = delete_contact_tag(json, tag);
     	
        var contact = new Backbone.Model();
        contact.url = 'core/api/contacts';
        contact.save(json,{
       		success: function(data)
       			{
       				// Also deletes from Tag class if no more contacts are found with this tag
       				$.ajax({
       					url: 'core/api/tags/' + tag,
       					type: 'DELETE',
       				});
       			}
        });
	});
	
	/**
	 * Shows a form to add tags with typeahead option
	 */ 
	$('#add-tags').live('click', function(e){
		e.preventDefault();
		$("#addTagsForm").css("display", "block");
		setup_tags_typeahead();
	});
	
	/**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	$('#contact-add-tags').live('click', function(e){
		e.preventDefault();
		var tags = get_tags('addTagsForm');

		$("#addTagsForm").css("display", "none");
		
	    if (tags[0].value.length > 0){
	    	var json = App_Contacts.contactDetailView.model.toJSON();
	    	
	    	// Push the new tags 
	    	for(var i = 0; i < tags[0].value.length; i++)
	    		json.tags.push(tags[0].value[i]);
	    	
	    	// Reset form
	    	$('#addTagsForm').each (function(){
   		  	  	this.reset();
   		  	});
   			
	    	// Save the contact with added tags
	    	var contact = new Backbone.Model();
	        contact.url = 'core/api/contacts';
	        contact.save(json,{
	       		success: function(data){
	       			
	       			// Get all existing tags of the contact to compare with the added tags
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
	       			//$.post('core/api/tags/' + tags[0].value, function(){
	       			//	console.log(tags[0].value);
	       			//});
	       			
	       			// Adds the added tags (if new) to tags collection
	       			$.each(tags[0].value,function(index, tag){
	       				tagsCollection.add( {"tag" : tag} );
	       			});
	       			
	       		}
	        });
	    }
	    
	});
	
	/**
	 * Changes, owner of the contact, when select option of owners drop down
	 * is changed.   
	 */
	$('#contact-detail-owner').live('change', function(){
		var id_array = [];
		id_array.push(App_Contacts.contactDetailView.model.get('id'));
		
		// Reads the owner id from the selected option
		var new_owner_id = $('#contact-detail-owner option:selected').val();
		
		var url = '/core/api/contacts/bulk/owner/' + new_owner_id;
		var json = {};
		json.contact_ids = JSON.stringify(id_array);
		$.post(url, json, function(data){
			
			// Shows acknowledgement of owner change
			$(".change-owner-succes").html('<div class="alert alert-success"><a class="close" data-dismiss="alert" href="#">×</a>Owner has been changed successfully.</div>');
		});
   	});
	
});


$(function(){
	
	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	$('#add').live('click', function(e){
	    e.preventDefault();
	    // Convert text to float
	    var add_score = parseFloat($('#lead-score').text());
	    
	    add_score = add_score + 1;
	    
	    // Changes score in UI
	    $('#lead-score').text(add_score);
       
	    // Changes lead_score of the contact and save it.
	    var contact_model =  App_Contacts.contactDetailView.model.toJSON();
	    
	  /* // Refreshing the view ({silent: true} not working)
	    contact_model.url = 'core/api/contacts';
	    contact_model.set('lead_score', add_score, {silent: true});
	
	    // Save model
	    contact_model.save();*/
	    
	    contact_model.lead_score = add_score;
		
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
		          
	});
	
	   
	/**
	 * Subtracts score of a contact (both in UI and back end)
	 * When '-' symbol is clicked in contact detail view score section, the score
	 * gets decreased by one, both in UI and back end
	 * 
	 */
	$('#minus').live('click', function(e){
		e.preventDefault();
		
		// Converts text to float
		var sub_score = parseFloat($('#lead-score').text());
		
		sub_score = sub_score - 1;
		
		// Changes score in UI
		$('#lead-score').text(sub_score);
		
		// Changes lead_score of the contact and save it.
		var contact_model =  App_Contacts.contactDetailView.model.toJSON();
			
	   /* contact_model.url = 'core/api/contacts';
		contact_model.set('lead_score', sub_score, {silent: true});
	 
		// Save model
		contact_model.save();
	    */
	   
	    contact_model.lead_score = sub_score;
		
		var new_model = new Backbone.Model();
		new_model.url = 'core/api/contacts';
		new_model.save(contact_model,{
			success: function(model){

			}
		});
	});
	
	// Makes the score section unselectable, when clicked on it
	$('#score').children().attr('unselectable', 'on');
	
	// Popover for help in contacts,tasks etc
    $('#element').live('mouseenter',function(e){
    	e.preventDefault();
        $(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
        });
    $('#element-title').live('mouseenter',function(e){
    	e.preventDefault();
        $(this).popover('show');});
	    
});


