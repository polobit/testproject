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
    	if (!isValidForm('#noteForm'))
        	return;
    	
    	// Shows loading symbol until model get saved
        $('#noteModal').find('span.save-status').html(LOADING_HTML);
    	
       	var json = serializeForm("noteForm");
 
      	var noteModel = new Backbone.Model();
      	noteModel.url = 'core/api/notes';
      	noteModel.save(json,{
    		success: function(data){
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
    			if(App_Contacts.contactDetailView){
    				$.each(note.contacts, function(index, contact_id){
    					if(contact_id == App_Contacts.contactDetailView.model.get('id')){
    						
    						console.log(App_Contacts.contactDetailView.model.get('id'));
    						
    						// Activates "Timeline" tab and its tab content in contact detail view 
    						activate_timeline_tab();
    						
    						// Inserts data into time-line
    						$('#timeline').isotope( 'insert', $(getTemplate("timeline", data.toJSON())) );
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