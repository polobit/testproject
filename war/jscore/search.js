$(function(){


	agile_type_ahead("searchText", undefined, contacts_typeahead, function(data){
		App_Contacts.navigate("contact/" + data, {
            trigger: true
        });
	});   
	
	
	$("#search-results").live('click', function(e){
		e.preventDefault();
		
		var query_text = $("#searchText").val();
		
		if(query_text == "")
			return;
		
		if(!App_Contacts)
			App_Contacts = new ContactsRouter();
		
		App_Contacts.navigate("contacts/search/" + query_text, {
            trigger: true
        });
		
		
	});
});

