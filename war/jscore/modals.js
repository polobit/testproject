$(function(){
	   
		// Person Form
	    $('#person_validate').live('click', function (e) {
	    	if (!isValidForm('#personForm')) {
	    		return false;
	    	}
	    	serializeAndSaveContinueContact(e, 'personForm', 'personModal', 'core/api/contacts');	        
	    });
	    
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
	    
	 // Company Form
	    $('#company_validate').live('click', function (e) {
	    	if (!isValidForm('#companyForm')) {
	    		return false;
	    	}
	    	serializeAndSaveContinueContact(e, 'companyForm', 'companyModal', 'core/api/companies');	        
	    });
});

