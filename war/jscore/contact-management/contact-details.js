/**
 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
 * detail view and highlights the (no.of) stars based on star_value of the contact.
 * 
 * @method starify 
 * @param {Object} el
 * 			html object of contact detail view
 */
function starify(el){
    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
    	
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
 * Used to fill the contact details for generating QR code.
 * @param properties
 * @returns details{name, email, url, phone number, address}
 */
function fill_QR(properties){
	var details = {};
	details.name = getPropertyValue(properties, 'first_name') + " " +getPropertyValue(properties, 'last_name');
	//details.email = "", details.number = "", details.url = "";
	for ( var i = 0; i < properties.length; i++){
		
		if(properties[i].name == "address"){
			var adr = JSON.parse(properties[i].value);
			var address = "";
			for(var key in adr){
				if(adr[key] && adr[key] != undefined){
					address += adr[key] + ", ";
					}
			}
			details.address = address;
		}
		else if(properties[i].name == "email" && details.email == undefined){
			details.email = properties[i].value;
		}
		else if(properties[i].name == "phone" && details.number == undefined){
			details.number = properties[i].value;
		}
		else if(properties[i].name == "website" && details.url == undefined){
			details.url = properties[i].value;
		}
	}
	
	return details;
}

/**
 * Shows all the domain users names as ul drop down list 
 * to change the owner of a contact 
 */
function fill_owners(el, data){
	var optionsTemplate = "<li><a class='contact-owner-list' data='{{id}}'>{{name}}</a></li>";
    fillSelect('contact-detail-owner','/core/api/users', 'domainUsers', undefined, optionsTemplate, true); 
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
	$('#add-tags').live('click', function(e) {
		e.preventDefault();
		$(this).css("display", "none");
		$("#addTagsForm").css("display", "block");
		$("#addTags").focus();
		setup_tags_typeahead();
	});
	
	/**
	 * "click" event of add button of tags form in contact detail view
	 * Pushes the added tags into tags array attribute of the contact and saves it
	 */ 
	$('#contact-add-tags').live('click', function(e){
		e.preventDefault();
		
	    // Add Tags
		var new_tags = get_new_tags('addTags');
		$('#add-tags').css("display", "block");
		$("#addTagsForm").css("display", "none");
		
		if(!new_tags || (/^\s*$/).test(new_tags))
		{
			console.log(new_tags);
			return;
		}
		
		if(new_tags) {
			var json = App_Contacts.contactDetailView.model.toJSON();
	    	
	    	// Push the new tags 
	    	//for(var i = 0; i < new_tags.length; i++)
	    		json.tags.push(new_tags.toString());
	    	
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
	       			if ($.inArray(new_tags, old_tags) == -1) 
	       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + new_tags + '"><span><a class="anchor" href="#tags/'+ new_tags + '">'+ new_tags + '</a><a class="close remove-tags" id="' + new_tags + '">&times</a></span></li>');
	       			
	       			
	       			// Adds the added tags (if new) to tags collection
	       			$.each(new_tags,function(index, tag){
	       				tagsCollection.add( {"tag" : tag} );
	       			});
	       		}
	        });
		}
	});
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	$('.contact-owner-list').live('click', function(){
		
		$('#change-owner-ul').css('display', 'none');
		var id_array = [];
		id_array.push(App_Contacts.contactDetailView.model.get('id'));
		
		// Reads the owner id from the selected option
		var new_owner_id = $(this).attr('data');
		var new_owner_name = $(this).text();
		var current_owner_id = $('#contact-owner').attr('data');
		
		// Returns, if same owner is selected again 
		if(new_owner_id == current_owner_id)
			return;
		
		var url = '/core/api/contacts/bulk/owner/' + new_owner_id;
		var json = {};
		json.contact_ids = JSON.stringify(id_array);
		$.post(url, json, function(data){
			
			// Replaces old owner details with changed one
			$('#contact-owner').text(new_owner_name);
			$('#contact-owner').attr('data', new_owner_id);
			
			// Shows acknowledgement of owner change
			// $(".change-owner-succes").html('<div class="alert alert-success"><a class="close" data-dismiss="alert" href="#">×</a>Owner has been changed successfully.</div>');
		});
   	});
});


$(function(){
	
	$(".tooltip_info").die().live("hover", function() {
		 $(this).tooltip('show');
		});
	
	/**
	 * Adds score to a contact (both in UI and back end)
	 * When '+' symbol is clicked in contact detail view score section, the score
	 * gets increased by one, both in UI and back end
	 * 
	 */  
	$('#add').live('click', function(e){
	    e.preventDefault();
	    
	    // Convert string type to int
	    var add_score = parseInt($('#lead-score').text());
	    
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
		
		// Converts string type to Int
		var sub_score = parseInt($('#lead-score').text());
		
		if(sub_score <= 0)
			return;
		
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
	   
    $('#change-owner-element').live('mouseenter',function(e){
    	e.preventDefault();
    	$('#change-owner-ul').css('display', 'none');
        $(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>'
        });
        $(this).popover('show');
    });
    
    $('#change-owner-element').live('click',function(e){
    	e.preventDefault();
    	$('#change-owner-element').popover('hide');
    	if($('#change-owner-ul').css('display') == 'block')
    		$('#change-owner-ul').css('display', 'none');
    	else
    		$('#change-owner-ul').css('display', 'block');
    });
});


