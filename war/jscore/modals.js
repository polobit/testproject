$(function(){
	   
		$("#personModal").on('shown', function(){
			setupTagsTypeAhead();
		});
	
		// Person Form
	    $('#person_validate').live('click', function (e) {
	    	if (!isValidForm('#personForm')) {
	    		return false;
	    	}
	    	serializeAndSaveContinueContact(e, 'personForm', 'personModal', false, true);	        
	    });
	    
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
	    
	 // Company Form
	    $('#company_validate').live('click', function (e) {
	    	if (!isValidForm('#companyForm')) {
	    		return false;
	    	}
	    	serializeAndSaveContinueContact(e, 'companyForm', 'companyModal', false, false);	        
	    });
	    
	 // Hide email alert error when the modal is hidden in new-person-modal
	    $('#personModal').on('hidden', function () {
	    	
	    	// Remove email error message
	    	$('#personModal').find(".alert").hide();
	    	
	    	// Remove validation error messages
	    	removeValidationErrors('personModal');
	    });
	    
	    $('#companyModal').on('hidden', function () {
	    	removeValidationErrors('companyModal');
	    });
});

function removeValidationErrors(modalId){
	$('#' + modalId).find("div.control-group").removeClass("error");
	$('#' + modalId).find("div.control-group").removeClass("success");
	$('#' + modalId).find("span.help-inline").remove();
}
