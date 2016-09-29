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
	App_Contact_Search.navigate("contacts/search/" + query_text);
	App_Contact_Search.searchResults(query_text);
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
	$('.searchicon-dropdown').removeClass('open');
	console.log(model);
	if (model.entity_type == "contact_entity" || model.entity_type == "company_entity")
	{
		if(model.type == "COMPANY")
			Backbone.history.navigate("company/" + data, { trigger : true });
		else
			Backbone.history.navigate("contact/" + data, { trigger : true });
		return;
	}
	if(model.entity_type == "deal")
	{
		if(!tight_acl.checkPermission('DEALS')){
			var obj = {};
			obj.entity = 'Deals';
			getTemplate('no-permission',obj, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$(template_ui).modal('show');
			}, null);
			return;
		}
		// updateDeal(new BaseModel(model));
		console.log(model);
		var currentdeal=model;
		Backbone.history.navigate("deal/"+currentdeal.id , {
            trigger: true
        });
		return;
	}
	if(model.entity_type == "document")
	{
		if(!tight_acl.checkPermission('DOCUMENT')){
			var obj = {};
			obj.entity = 'Documents';

			getTemplate('no-permission',obj, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$(template_ui).modal('show');
			}, null);

			return;
		}

		console.log(model);
		updateDocument(new BaseModel(model));
		return;
	}

	if(model.entity_type == "tickets")
	{
		/*if(!tight_acl.checkPermission('DOCUMENT')){
			var obj = {};
			obj.entity = 'Documents';

			getTemplate('no-permission',obj, undefined, function(template_ui){
				if(!template_ui)
					  return;

				$(template_ui).modal('show');
			}, null);

			return;
		}*/

		var url = '#ticket/' +  model.id;

		Backbone.history.navigate(url, {trigger : true});

		return;
	}
		
	if(!tight_acl.checkPermission('CASES')){
		var obj = {};
		obj.entity = 'Cases';
		getTemplate('no-permission',obj, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$(template_ui).modal('show');
		}, null);

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
	agile_type_ahead("searchText", undefined, contacts_typeahead, navigateToDetailsPage, undefined, undefined, 'core/api/search/all/keyword', undefined, undefined, undefined, 5, function(){
		  
		  //var filters = serializeForm("advanced-search-filter").fields_set;
		  var search_filters = _agile_get_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id);
		  var filters = JSON.parse(search_filters);
		  
		  var filterCriteria = "type=";
		  if(filters){
		  	   for(var i =0; i<filters.length; i++){
		  	   	if(filters[i] != undefined && filters[i] != ""){
		  	   		filterCriteria += filters[i] + ",";
		  	   	}
		  	   }
		  }

	 	  console.log("checked elements  first are = "+ filters);

	 	  return filterCriteria;	
	});

	/*
	 * Click on search icon in search field top nav-bar, shows simple search
	 * results in separate page
	 */
	$('body').on('click', '#search-results', function(e)
	{
		// e.preventDefault();
		$('.searchicon-dropdown').removeClass('open');
		showSearchResults();
		//$("#searchText").val("");
	});
});
