$(function(){


	agile_type_ahead("searchText", undefined, contacts_typeahead, function(data){
		
		App_Contacts.navigate("contact/" + data, {
            trigger: true
        });
	});   
	
});