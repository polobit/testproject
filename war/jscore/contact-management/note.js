/**
 * note.js script file defines the functionality of saving a note in Note database.
 * If note is related to a contact, which is in contact detail view then the note
 * model is inserted into time-line.
 * 
 * @module Contact management
 * @author Rammohan  
 */
$(function(){ 
	
	$(".edit-note").die().live('click', function(e) {
		e.preventDefault();
		console.log($(this).attr('data'));
		var note = notesView.collection.get($(this).attr('data'));
		
		// Clone modal, so we dont have to create a update modal.
		// we can clone add change ids and use it as different modal
		
		$('#noteUpdateModal').remove();
		
		var noteModal = $("#noteModal").clone();

		$("#noteForm > fieldset", noteModal).prepend('<input name="id" type="hidden"/>')
		$("#noteForm", noteModal).attr('id', "noteUpdateForm");
		noteModal.attr('id', "noteUpdateModal");
		$("#note_validate", noteModal).attr("id", "note_update");
		deserializeForm(note.toJSON(), $("#noteUpdateForm", noteModal));
		

		noteModal.modal('show');
		//noteModal.modal('show');
	});
    
	$("#note_update").live('click', function(e){
		e.preventDefault();
		
		// Returns, if the save button has disabled attribute 
    	if($(this).attr('disabled'))
    		return;
    	
    	// Disables save button to prevent multiple click event issues
    	$(this).attr('disabled', 'disabled');
    	
    	if (!isValidForm('#noteUpdateForm')) {
        	
    		// Removes disabled attribute of save button
    		$(this).removeAttr('disabled');
    		return;
    	}
    	
    	// Shows loading symbol until model get saved
        $('#noteUpdateModal').find('span.save-status').html(LOADING_HTML);
    	
       	var json = serializeForm("noteUpdateForm");
    	
    	saveNote($("#noteUpdateForm"),  $("#noteUpdateModal"), this, json);
	});
    /**
     * Saves note model using "Bcakbone.Model" object, and adds saved
     * data to time-line if necessary.
     */  
    $('#note_validate').live('click', function(e){
    	e.preventDefault();
    	
    	// Returns, if the save button has disabled attribute 
    	if($(this).attr('disabled'))
    		return;
    	
    	// Disables save button to prevent multiple click event issues
    	$(this).attr('disabled', 'disabled');
    	
    	if (!isValidForm('#noteForm')) {
        	
    		// Removes disabled attribute of save button
    		$(this).removeAttr('disabled');
    		return;
    	}
    	
    	// Shows loading symbol until model get saved
        $('#noteModal').find('span.save-status').html(LOADING_HTML);
    	
       	var json = serializeForm("noteForm");
    	
    	saveNote($("#noteForm"),  $("#noteModal"), this, json);
    });
    
    /**
     * Shows note modal and activates contacts typeahead to its related to field
     */   
    $('#show-note').live('click', function(e){
    	e.preventDefault();
     	$("#noteModal").modal('show');
    	
    	var	el = $("#noteForm");
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#noteModal').on('hidden', function () {
    	
    	  // Removes appended contacts from related-to field
    	  $("#noteForm").find("li").remove();
    	  
    	// Removes validation error messages
    	  remove_validation_errors('noteModal');
    });
    
    function saveNote(form, modal, element, note)
    {

      	var noteModel = new Backbone.Model();
      	noteModel.url = 'core/api/notes';
      	noteModel.save(note,{
    		success: function(data){
    			
    			// Removes disabled attribute of save button
    			$(element).removeAttr('disabled');
    			
    			form.each (function(){
    	          	  this.reset();
    	        });

    			// Removes loading symbol and hides the modal
    			modal.find('span.save-status img').remove();
    	        modal.modal('hide');
    			
       	        var note = data.toJSON();
       	        
       	        if(notesView && notesView.collection)
       	        	notesView.collection.add(new BaseModel(note));
       	        
       	             	        /*
       	         * Updates data (saved note) to time-line, when contact detail view is defined and 
       	         * the note is related to the contact which is in detail view.
       	         */    
    			if(App_Contacts.contactDetailView && Current_Route == "contact/"
					+ App_Contacts.contactDetailView.model.get('id')){
    				$.each(note.contacts, function(index, contact) {
    					if(contact.id == App_Contacts.contactDetailView.model.get('id')) {
    						
    						// Activates "Timeline" tab and its tab content in contact detail view 
    						activate_timeline_tab();

    						/*
    						 * If timeline is not defined yet, initiates with the 
    						 * data else inserts
    						 */
    						if (timelineView.collection.length == 0) {
    							timelineView.collection.add(data);
    							
    							setup_timeline(timelineView.collection.toJSON(),
    									App_Contacts.contactDetailView.el,
    									undefined);
    						} else{
    							var newItem = $(getTemplate("timeline", data.toJSON()));
    							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
    							$('#timeline').isotope('insert', newItem);
    						}
    						return false;
    					}
    					
    				});
    			}
			}    
      	});
    }
});