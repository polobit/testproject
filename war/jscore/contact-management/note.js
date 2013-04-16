/**
 * note.js script file defines the functionality of saving a note in Note database.
 * If note is related to a contact, which is in contact detail view then the note
 * model is inserted into time-line.
 * 
 * @module Contact management
 * @author Rammohan  
 */
$(function(){ 
    
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
    	
    	if (!isValidForm('#noteForm')){
        	
    		// Removes disabled attribute of save button
    		$(this).removeAttr('disabled');
    		return;
    	}
    	
    	// Shows loading symbol until model get saved
        $('#noteModal').find('span.save-status').html(LOADING_HTML);
    	
       	var json = serializeForm("noteForm");
    	var that = this;

      	var noteModel = new Backbone.Model();
      	noteModel.url = 'core/api/notes';
      	noteModel.save(json,{
    		success: function(data){
    			
    			// Removes disabled attribute of save button
    			$(that).removeAttr('disabled');
    			
    			$('#noteForm').each (function(){
    	          	  this.reset();
    	        });

    			// Removes loading symbol and hides the modal
    			$('#noteModal').find('span.save-status img').remove();
    	        $("#noteModal").modal('hide');
    			
       	        var note = data.toJSON();
       	        
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
});