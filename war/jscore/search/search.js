$(function(){
	
	// agile_type_ahead method call in enable typeahead in search field in top nav-bar, 
	//custom callback to redefine events on dropdown, which takes to contact details page 
	agile_type_ahead("searchText", undefined, contacts_typeahead, function(data){
		App_Contacts.navigate("contact/" + data, {
            trigger: true
        });
	});   
	
	// Click on search image in search field top nav-bar, shows simple search results 
	//in separate page
	$("#search-results").live('click', function(e){
		e.preventDefault();
		showSearchResults();
	});
});

/**
 * showSearchResults method is used to show the simple search/ typeahead results in a separate page
 * @method showSearchResults
 */
function showSearchResults()
{
	// Reads query keyword from input field to send a query request and show in separate page.
	var query_text = $("#searchText").val();
	
	// If keyword/input field is empty return with out querying
	if(query_text == "")
		return;
	
	// If App_Contacts route is not initialized, initialize because typeahead can be accessed 
	//without entering in to contacts list view
	if(!App_Contacts)
		App_Contacts = new ContactsRouter();
	
	// Initialize contacts search results view
	App_Contacts.navigate("contacts/search/" + query_text, {
        trigger: true
    });
}
