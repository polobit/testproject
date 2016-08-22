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
		try{query = query.trim();}catch(e){}
		
		 $("#searchForm").find(".dashboard-search-scroll-bar").css({"display":"none"});
		 currentRoute();
		 
		 var search_filters = _agile_get_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id);
		 var search_list_filters = JSON.parse(search_filters);

		 if(search_list_filters.length == 0){
		 var $allitems = $("#advanced-search-fields-group a input");
		 var list = $allitems.not("[value='']").map(function(){return $(this).prop("value");}).get();
		 	search_list_filters = list;
		}

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

								var collectionURL = collection.url;
								if(collectionURL && collectionURL.indexOf("type=opportunity") != -1)
									   initializeDealDetailSearch();
								else if(collectionURL && collectionURL.indexOf("type=document") != -1)
									   initializeDocumentSearch(el);
								
								// el.find("table").removeClass("showCheckboxes");

								// Shows the query string as heading of search results
								if (collection.length == 0)
									$("#search-query-heading", el).html('{{agile_lng_translate "contact-details" "no-matches-found-for"}} "' + query + '" {{agile_lng_translate "contacts-view" "in"}} <span style="font-weight:600;">' + module_name);
								else
									$("#search-query-heading", el).html('{{agile_lng_translate "contact-details" "search-results-for"}} "' + query + '" {{agile_lng_translate "contacts-view" "in"}} <span style="font-weight:600;">' + module_name);
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
			return "{{agile_lng_translate 'contact-details' 'Contacts'}}";
		}
		else if(url.indexOf("type=company") != -1){
			return "{{agile_lng_translate 'companies-view' 'companies'}}";
		}
		else if(url.indexOf("type=opportunity") != -1){
			return "{{agile_lng_translate 'deal-view' 'deals'}}";
		}
		else if(url.indexOf("type=document") != -1){
			return "{{agile_lng_translate 'deal-view' 'documents'}}";
		}
		else if(url.indexOf("type=tickets") != -1){
			return "{{agile_lng_translate 'report-view' 'tickets'}}";
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