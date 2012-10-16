$(function(){
	   
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
});

