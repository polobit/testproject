$(function(){
	   
		// Person Form
	    $('#person_validate').live('click', function (e) {
	    	serializeAndSaveContinueContact(e, 'personForm');	        
	    });
	    
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
});

