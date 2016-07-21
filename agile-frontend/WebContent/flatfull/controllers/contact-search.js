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
		 var search_filters = _agile_get_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id);
		 var search_list_filters = JSON.parse(search_filters);
		 if(!search_list_filters)
		 	  return;

		 // Add containers
		 this.addResultsContainers(search_list_filters);

		 for(var i =0; i<search_list_filters.length; i++){
		 	   if(!this.isValid(search_list_filters[i]))
		 	   	     continue;

		 	   var templateKey = this.getTemplateName(search_list_filters[i]);
		 	   var searchResultsView = new Base_Collection_View({ 
   							url : "core/api/search/seachlist?q=" + encodeURIComponent(query)+"&type="+ search_list_filters[i], 
   							templateKey : templateKey, 
   							individual_tag_name : 'tr', 
   							cursor : true,
							data : QUERY_RESULTS, 
							sort_collection : false,
							scroll_target : $("#search_content_" + search_list_filters[i]),
							page_size : 8,
							infiniscroll_fragment : search_list_filters[i],
							postRenderCallback : function(el, collection)
							{
								var module_name = App_Contact_Search.getModuleName(collection.url);
								
								// el.find("table").removeClass("showCheckboxes");

								// Shows the query string as heading of search results
								if (collection.length == 0)
									$("#search-query-heading", el).html('No matches found for "' + query + '" in <span style="font-weight:600;">' + module_name);
								else
									$("#search-query-heading", el).html('Search results for "' + query + '" in <span style="font-weight:600;">' + module_name);
							} });
						
							// If in case results in different page is clicked before
							// typeahead fetch results, then results are fetched here
							searchResultsView.collection.fetch();
						    $('#search-results-container').find('#search_content_'+search_list_filters[i]).html(searchResultsView.render().el);

		 }
	},

	addResultsContainers :  function(options){
		$("#content").html("<div id='search-results-container'></div>")
		for(var j=0; j<options.length; j++)
		{
		  	$("#search-results-container").append("<div class='search-results-scroll-container' id='search_content_"+options[j]+"'></div>");
		}
	},

	isValid : function(val){
		if(val)
			 return true;
		return false;
	},

	getTemplateName : function(module_name){
		var json = {};
		if(module_name == "person")
			return "search";
		else if(module_name == "company")
			return "company-search";
		else if(module_name == "opportunity")
			return "deal-search";
		else if(module_name == "document")
			return "documents-search";
		else if(module_name == "tickets")
			return "tickets-search";
	},
	getModuleName : function(url){
		if(url.indexOf("type=person") != -1){
			return "Contacts";
		}
		else if(url.indexOf("type=company") != -1){
			return "Companies";
		}
		else if(url.indexOf("type=opportunity") != -1){
			return "Deals";
		}
		else if(url.indexOf("type=document") != -1){
			return "Documents";
		}
		else if(url.indexOf("type=tickets") != -1){
			return "Tickets";
		}
	},


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