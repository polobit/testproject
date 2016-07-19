/**
 * Creates backbone router for contacts search management operations.
 */
var ContactSearchRouter = Backbone.Router.extend({

	routes : {

	/* Search results */

	"contacts/search/:query" : "searchResults" 
		
	},

	/**
	 * search results
	 */
	searchResults : function(query)
	{
	
		//var search_list_filters = serializeForm("advanced-search-filter").fields_set;	
		 var search_filters = _agile_get_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id);
		  var search_list_filters = JSON.parse(search_filters);
		if(search_list_filters){
			$("#content").html("<div id='search-results-container'></div>")
			for(var j=0;j<search_list_filters.length;j++){
			  	$("#search-results-container").append("<div id=search_content_"+search_list_filters[j]+"></div>");
				}

		  	  	for(var i =0; i<search_list_filters.length; i++){
		  	   	if(search_list_filters[i] != undefined && search_list_filters[i] != ""){
		  	   		if(search_list_filters[i]=="person"){
		  	   			var searchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "search", individual_tag_name : 'tr', cursor : true,
						data : QUERY_RESULTS, sort_collection : false, page_size : 10, postRenderCallback : function(el)
						{
							// Shows the query string as heading of search results
							if (searchResultsView.collection.length == 0)
								$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">Contacts');
							else
								$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">Contacts');
						} });

						// If QUERY_RESULTS is defined which are set by agile_typeahead
						// istead of fetching again
						/*
						 * if(QUERY_RESULTS) { //Create collection with results
						 * searchResultsView.collection = new BaseCollection(QUERY_RESULTS, {
						 * restKey : searchResultsView.options.restKey, sortKey :
						 * searchResultsView.options.sortKey });
						 * 
						 * $('#content').html(searchResultsView.render(true).el);
						 * $('body').trigger('agile_collection_loaded'); return; }
						 */

						// If in case results in different page is clicked before
						// typeahead fetch results, then results are fetched here
						searchResultsView.collection.fetch();
						//$('#content').html(searchResultsView.render().el);

						$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(searchResultsView.render().el);
		  	   		}

		  	   	}

	  	   		if(search_list_filters[i]=="company"){
	  	   		var companySearchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "company-search", individual_tag_name : 'tr', cursor : true,
					data : QUERY_RESULTS, sort_collection : false, page_size : 10, postRenderCallback : function(el)
					{
						el.find("#companies").removeClass("showCheckboxes");
						// Shows the query string as heading of search results
						if (companySearchResultsView.collection.length == 0)
							$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">Companies');
						else
							$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">Companies');
					} });
	  	   			companySearchResultsView.collection.fetch();
					$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(companySearchResultsView.render().el);

		  	   	}

		  	   	if(search_list_filters[i]=="opportunity"){
		  	   		var dealSearchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "deal-search", individual_tag_name : 'tr', cursor : true,
						data : QUERY_RESULTS, sort_collection : false, page_size : 10, postRenderCallback : function(el)
						{
							
							el.find(".deals-table").removeClass("showCheckboxes");
							el.find(".panel-heading").css("display","none");
							initializeDealDetailSearch();
							// Shows the query string as heading of search results
							if (dealSearchResultsView.collection.length == 0)
								$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">Deals');
							else
								$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">Deals');
						} });
		  	   			
		  	   			dealSearchResultsView.collection.fetch();
						$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(dealSearchResultsView.render().el);

		  	   	}
		  	   	if(search_list_filters[i]=="document"){

		  	   		var documentSearchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "documents-search", individual_tag_name : 'tr', cursor : true,
						data : QUERY_RESULTS, sort_collection : false, page_size : 10, postRenderCallback : function(el)
						{
							initializeDocumentSearch(el);
							// Shows the query string as heading of search results
							if (documentSearchResultsView.collection.length == 0)
								$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">Documents</span>');
							else
								$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">Documents');
						} });
		  	   			documentSearchResultsView.collection.fetch();
						$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(documentSearchResultsView.render().el);


		  	   	}

		  	   	if(search_list_filters[i]=="tickets"){

		  	   		var ticketSearchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "tickets-search", individual_tag_name : 'tr', cursor : true,
						data : QUERY_RESULTS, sort_collection : false, page_size : 10, postRenderCallback : function(el)
						{
							el.find(".deals-table").removeClass("showCheckboxes");
							// Shows the query string as heading of search results
							if (ticketSearchResultsView.collection.length == 0)
								$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">Tickets');
							else
								$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">Tickets');
						} });
		  	   			ticketSearchResultsView.collection.fetch();
						$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(ticketSearchResultsView.render().el);


		  	   	}

		  	   	/*if(search_list_filters[i]=="cases"){

		  	   		var caseSearchResultsView = new Base_Collection_View({ url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], templateKey : "case-search", individual_tag_name : 'tr', cursor : true,
						data : QUERY_RESULTS, sort_collection : false, page_size : 5, postRenderCallback : function(el)
						{
							initializeCaseSearch();
							// Shows the query string as heading of search results
							if (caseSearchResultsView.collection.length == 0)
								$("#search-query-heading", el).html('No matches found for "' + query + '" in cases');
							else
								$("#search-query-heading", el).html('Search results for "' + query + '" in cases');
						} });
		  	   			caseSearchResultsView.collection.fetch();
						$('#search-results-container').find('#search_content_'+search_list_filters[i]).html(caseSearchResultsView.render().el);


		  	   	}*/
		  	   
		  	   		
		  	   }
		}

		
		/*
		var searchResultsView = new Base_Collection_View({ url : "core/api/search?q=" + encodeURIComponent(query), templateKey : "search", individual_tag_name : 'tr', cursor : true,
			data : QUERY_RESULTS, sort_collection : false, page_size : 15, postRenderCallback : function(el)
			{
				// Shows the query string as heading of search results
				if (searchResultsView.collection.length == 0)
					$("#search-query-heading", el).html('No matches found for "' + query + '"');
				else
					$("#search-query-heading", el).html('Search results for "' + query + '"');
			} });
		*/
		// If QUERY_RESULTS is defined which are set by agile_typeahead
		// istead of fetching again
		/*
		 * if(QUERY_RESULTS) { //Create collection with results
		 * searchResultsView.collection = new BaseCollection(QUERY_RESULTS, {
		 * restKey : searchResultsView.options.restKey, sortKey :
		 * searchResultsView.options.sortKey });
		 * 
		 * $('#content').html(searchResultsView.render(true).el);
		 * $('body').trigger('agile_collection_loaded'); return; }
		 */

		// If in case results in different page is clicked before
		// typeahead fetch results, then results are fetched here
		/*searchResultsView.collection.fetch();

		$('#content').html(searchResultsView.render().el);*/

	}

});

function initializeDealDetailSearch(){
	$('#content').find('#search_content_opportunity').off('click', '#deal-search-model-list > tr > td:not(":first-child")');
	$('#content').find('#search_content_opportunity').on('click', '#deal-search-model-list > tr > td:not(":first-child")', function(e){
		e.preventDefault();
		var currentdeal = $(this).closest('tr').data();
		/*$('.popover').remove();
		var currentdeal = $(this).closest('tr').data();
		if($(this).find(".contact-type-image").length > 0 || $(this).find(".company-type-image").length > 0)
		{
			return;
		}
		if (e.ctrlKey || e.metaKey) {
           window.open("#deal/" +currentdeal.id , '_blank');
           return;
        }*/
		Backbone.history.navigate("deal/" + currentdeal.id, { trigger : true });
		// updateDeal($(this).closest('tr').data());
	});
}

function initializeCaseSearch(){
	$("#content #search_content_cases #case-search-model-list > tr > td:not(':first-child')").off('click');
	$('#content #search_content_cases').on('click', '#case-search-model-list > tr > td:not(":first-child")', function(e) 
	{
		e.preventDefault();
		updatecases($(this).closest('tr').data());
	});
}

function initializeDocumentSearch(e){
	$("#content #search_content_document #documents-search-model-list > tr > td:not(':first-child')").off('click');
	$('#content #search_content_document').on('click', '#documents-search-model-list > tr > td:not(":first-child")', function(e) 
	{
	//if(e.target.parentElement.attributes[0].name!="href" && e.target.parentElement.attributes[1].name!="href"){
     		e.preventDefault();

     	 	updateDocument($(e.currentTarget).closest('tr').data());
     	 //}
     });
}