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
		var searchResultsView = new Base_Collection_View({ url : "core/api/search?q=" + encodeURIComponent(query), templateKey : "search", individual_tag_name : 'tr', cursor : true,
			data : QUERY_RESULTS, sort_collection : false, page_size : 15, postRenderCallback : function(el)
			{
				// Shows the query string as heading of search results
				if (searchResultsView.collection.length == 0)
					$("#search-query-heading", el).html('No matches found for "' + query + '"');
				else
					$("#search-query-heading", el).html('Search results for "' + query + '"');
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

		$('#content').html(searchResultsView.render().el);

	}

});
