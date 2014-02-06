/**
 * Search.js is a used to show typeahead results in different page and also
 * initialized typeahead on search field in navbar client side.
 * 
 * @module Search author: Yaswanth
 */

/**
 * showSearchResults method is used to show the simple search/ typeahead results
 * in a separate page
 * 
 * @method showSearchResults
 */
function showSearchResults()
{
	/*
	 * Reads query keyword from input field to send a query request and show in
	 * separate page.
	 */
	var query_text = $("#searchText").val();

	// If keyword/input field is empty returns with out querying
	if (query_text == "")
		return;

	/*
	 * If App_Contacts route is not initialized, initializes it because
	 * typeahead can be accessed without entering in to contacts list view
	 */
	if (!App_Contacts)
		App_Contacts = new ContactsRouter();

	// Initialize contacts search results view
	App_Contacts.navigate("contacts/search/" + query_text, { trigger : true });
}

function navigateToDetailsPage(data, name)
{
	var model;
	for ( var i = 0; i < QUERY_RESULTS.length; i++)
	{
		if (QUERY_RESULTS[i].id != data)
			continue;

		model = QUERY_RESULTS[i];
		break;
	}
	console.log(model);
	if (model.entity_type == "contact_entity")
	{
		App_Contacts.navigate("contact/" + data, { trigger : true });
		return;
	}
	if(model.entity_type == "deal")
	{
		console.log(model);
		updateDeal(new BaseModel(model));
		return;
	}
	if(model.entity_type == "document")
	{
		console.log(model);
		updateDocument(new BaseModel(model));
		return;
	}
		updatecases(new BaseModel(model));
}

/**
 * Initializes typeahead functionality on search field in top navbar, and
 * defines event action on the filed
 */
$(function()
{

	/*
	 * Enables typeahead in search field in top nav-bar, custom callback to
	 * redefine events on dropdown, which takes to contact details page
	 */
	agile_type_ahead("searchText", undefined, contacts_typeahead, navigateToDetailsPage, undefined, undefined, 'core/api/search/all/');

	/*
	 * Click on search icon in search field top nav-bar, shows simple search
	 * results in separate page
	 */
	$("#search-results").live('click', function(e)
	{
		e.preventDefault();
		showSearchResults();
	});
});
