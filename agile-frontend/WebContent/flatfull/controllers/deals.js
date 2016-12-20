/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {
		/* Deals/Opportunity */
		"deals" : "deals", 
		"import-deals" : "importDeals",
		"deal-rc-0" : "dealsRightClick",
		"deal-rc-1" : "dealsRightClick",
		"deal-rc-2" : "dealsRightClick",
		"deal-rc-3" : "dealsRightClick",
		"deal-filters" : "dealFilters", 
		"deal-filter-add" : "dealFilterAdd",
		"deal-filter-edit/:id" : "dealFilterEdit",
		"deal-filter/:id" : "dealFilter",
		"filter/:tag" : "deals"
	},

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than
	 * milestone lists. Based on deal_view cookie it show deals to user. Also
	 * fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{	
		var dealTag = null ;
		var postReportData=null;
		if(_agile_get_prefs('report_filter')) {
			_agile_set_prefs("agile_deal_view", "list_view");
			//url = 'core/api/filters/filter/dynamic-filter';
			postReportData = _agile_get_prefs('report_filter');
			_agile_delete_prefs("deal-filter-name");
			_agile_delete_prefs('deal-filters');
		} 

		if(window.location.hash.indexOf("filter")==1){
       		dealTag = window.location.hash.substr(window.location.hash.lastIndexOf("/")+1);
       		_agile_set_prefs("agile_deal_view", "list_view");
  		}	
		pipeline_id = 0;
		if (_agile_get_prefs("agile_deal_track"))
			pipeline_id = _agile_get_prefs("agile_deal_track");
		
		$('#content').html("<div id='opportunity-listners'>&nbsp;</div>");
		
		//fix for mobile view showing only list view 
		if(agile_is_mobile_browser())
			createCookie("agile_deal_view", "list_view"); 
		
		// Depending on cookie shows list or milestone view
		if (!_agile_get_prefs("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";

			if (pipeline_id == 1)
				pipeline_id = 0;

			getTemplate("opportunities-header", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#opportunity-listners').html($(template_ui));

				DEALS_LIST_COLLECTION = null;
				setupDealsTracksList();
				setupDealFilters();
				setUpDealSortFilters($('#opportunity-listners'));
				initializeDealListners();
				loadPortlets('Deals',$('.route_Portlet',$('#opportunity-listners')));
				contactListener();

			}, "#opportunity-listners");
		}
		else
		{
			var that = this;
			DEALS_LIST_COLLECTION = null;
			setupDealFilters(function(data){
				if(postReportData)
				{
					data["reportFilter"] = postReportData ;
				}
				if(dealTag){
					data["dealToFilter"] = dealTag ;
				}
				getTemplate("opportunities-header", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#opportunity-listners').html($(template_ui));

					setUpDealSortFilters($('#opportunity-listners'));
					
					loadPortlets('Deals',$('.route_Portlet',$('#opportunity-listners')));
				});
				fetchDealsList(data);
			});
		}

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
		
		setTimeout(function()
		{
			$('a.deal-notes').tooltip();
			$('.deal_won_date').tooltip();
			
		}, 2000);
	},

	/**
	 * Open deal view in new page when right clicked
	 */
	dealsRightClick : function()
	{
		var link = window.location.hash;
		var param = link.split("-")[2];
		
		if(param == "0"){
			_agile_set_prefs("agile_deal_view", "list_view");
		}else if(param == "1"){
			_agile_delete_prefs("agile_deal_view");
			_agile_delete_prefs('deal-milestone-view');
		}else if(param == "2"){
			_agile_set_prefs('deal-milestone-view','compact');			
		}else if(param == "3"){
			_agile_set_prefs('deal-milestone-view','fit');
		}
		App_Deals.deals();
		window.location.hash = "deals";
	},
	
	/**
	 * import deals from a csv file and then upload all deals to databse
	 */
	importDeals : function()
	{
		if (!hasScope("CREATE_DEALS"))
		{
			$('#content').html('<h2 class="p-l-md"><strong><i class="fa-exclamation-triangle icon-white"></i>&nbsp;&nbsp; '+_agile_get_translated_val('import','deals-no-priviliges')+'</strong></h2>');
			hideTransitionBar();
			return;
		}
		$('#content').html("<div id='import-deals-listener'></div>");
		getTemplate("import-deals", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#import-deals-listener').html($(template_ui));
			initializeImportEvents("import-deals-listener");	
		}, "#import-deals-listener");
		
	},

	/**
	 * Shows contact filters list
	 */
	dealFilters : function()
	{
		this.dealFiltersList = new Base_Collection_View({ url : '/core/api/deal/filters', restKey : "DealFilter", templateKey : "deal-filter", isNew : "true", window : "deal-filters",
			individual_tag_name : 'tr', sort_collection : false,
			postRenderCallback : function(el)
			{
				agileTimeAgoWithLngConversion($(".created_time", el));

			}});

		this.dealFiltersList.collection.fetch();
		$("#content").html(this.dealFiltersList.render().el);
	},

	/**
	 * Adds new filter to get specific deals
	 */
	dealFilterAdd : function()
	{
		$('#content').html("<div id='opportunity-listners'></div>");
		var deals_filter = new Opportunity_Filters_Event_View({ url : '/core/api/deal/filters', template : "filter-deals", isNew : "true", window : "deal-filters",
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFiltersForOpportunity(el, undefined, function()
					{
						$("#opportunity-listners", $("#content")).html(el);
						scramble_input_names($(el).find('#filter-settings'));
					});
				});
				initializeDealListners();
				contactListener();
				$('input[name=name]').trigger('focus');
			} });
		deals_filter.render();
	},

	/**
	 * Edits filter created
	 */
	dealFilterEdit : function(id)
	{
		if (!this.dealFiltersList || this.dealFiltersList.collection.length == 0 || this.dealFiltersList.collection.get(id) == null)
		{
			this.navigate("deal-filters", { trigger : true });
			return;
		}

		$('#content').html("<div id='opportunity-listners'></div>");
		$("#opportunity-listners").html(LOADING_HTML);
		var deal_filter = this.dealFiltersList.collection.get(id);
		var deal_filter_json = deal_filter.toJSON();
		var dealFilter = new Opportunity_Filters_Event_View({ url : 'core/api/deal/filters', model : deal_filter, template : "filter-deals",
			window : 'deal-filters', 
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFiltersForOpportunity(el, deal_filter_json, function()
					{
						$("#opportunity-listners", $("#content")).html(el);
						setOportunityChainFilterValidations($(el).find('#filter-settings'));
					});
					scramble_input_names($(el).find('#filter-settings'));
				});
				initializeDealListners();
				contactListener();
				$('input[name=name]').trigger('focus');
			} });

		dealFilter.render();
	},

	/**
	 * Adds new filter to get specific deals
	 */
	dealFilter : function(id)
	{
		var deal_filter = App_Deals.deal_filters.collection.get(id);
		var deal_filter_json = deal_filter.toJSON();
		_agile_set_prefs('deal-filters', JSON.stringify(deal_filter_json));
		App_Deals.deals();
	},

});
