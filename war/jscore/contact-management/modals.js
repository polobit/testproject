/**
 * modals.js script file defines the functionality of click events of some
 * buttons and "show" and "hide" events of person and company modals
 * 
 * @module Contact management
 * @author Rammohan
 */
$(function(){
	   
		/**
		 * "Shown" event of person modal 
		 * Activates tags typeahead to tags field
		 */
		$("#personModal").on('shown', function(){
			setup_tags_typeahead();
		});
	
		/**
		 * Click event of "Save Changes" button in person modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#person_validate').live('click', function (e) {
	    	serialize_and_save_continue_contact(e, 'personForm', 'personModal', false, true, this);	        
	    });
	    
	    /**
	     * Navigates to controller to import contacts from a file
	     */
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
	    
	    /**
		 * Click event of "Save Changes" button in company modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#company_validate').live('click', function (e) {
	    	serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', false, false, this);	        
	    });
	    
	    /**
	     * "Hidden" event of person modal
	     * Hides email alert error and removes validation errors
	     */ 
	    $('#personModal').on('hidden', function () {
	    	
	    	// Hides email error message
	    	$('#personModal').find(".alert").hide();
	    	
	    	// Removes validation error messages
	    	remove_validation_errors('personModal');
	    });
	    
	    /**
	     * "Hidden" event of company modal
	     * Removes validation errors
	     */
	    $('#companyModal').on('hidden', function () {
	    	remove_validation_errors('companyModal');
	    });
});

/**
 * Removes validation messages (error or success) from any modal 
 * based on its id attribute
 * 
 * @method remove_validation_errors
 * @param modalId
 * 			specifies a modal
 */
function remove_validation_errors(modalId){
	$('#' + modalId).find("div.control-group").removeClass("error");
	$('#' + modalId).find("div.control-group").removeClass("success");
	$('#' + modalId).find("span.help-inline").remove();
}
