/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals", "import-deals" : "importDeals", 
	"deal-filters" : "dealFilters", 
	"deal-filter-add" : "dealFilterAdd",
	"deal-filter-edit/:id" : "dealFilterEdit",
	"deal-filter/:id" : "dealFilter"},

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than
	 * milestone lists. Based on deal_view cookie it show deals to user. Also
	 * fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{
		pipeline_id = 0;
		if (readCookie("agile_deal_track"))
			pipeline_id = readCookie("agile_deal_track");
		/*var deal_filters = readCookie('deal-filters');
		if(deal_filters)
		{
			var filtersJSON = $.parseJSON(deal_filters);
			if(filtersJSON && filtersJSON.pipeline_id)
			{
				pipeline_id = filtersJSON.pipeline_id;
			}
		}*/
		$('#content').html("<div id='opportunity-listners'>&nbsp;</div>");
		// Depending on cookie shows list or milestone view
		if (!readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";

			if (pipeline_id == 1)
				pipeline_id = 0;

			getTemplate("new-opportunity-header", {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#opportunity-listners').html($(template_ui));

				// Add row-fluid if user prefs are set to fluid
				if (IS_FLUID)
				{
					$('#opportunity-listners').find('div.row').removeClass('row').addClass('row');
				}
				pipeline_count = 0;
				deal_fetching = false;
				DEALS_LIST_COLLECTION = null;
				setupDealsTracksList();
				setupDealFilters();
				//setupNewDealFilters();
				initializeDealListners();

			}, "#opportunity-listners");
		}
		else
		{
			var that = this;
			setupNewDealFilters(function(){
				DEALS_LIST_COLLECTION = null;
				var query = ''
				if (readCookie('deal-filters'))
				{
					query = '&filters=' + encodeURIComponent(getDealFilters());
				}
				// Fetches deals as list
				that.opportunityCollectionView = new Base_Collection_View({ url : 'core/api/opportunity/based?pipeline_id=' + pipeline_id + query,
					templateKey : "opportunities", individual_tag_name : 'tr', sort_collection : false, cursor : true, page_size : 25,
					postRenderCallback : function(el)
					{
						if (pipeline_id == 1)
							pipeline_id = 0;
						var cel = App_Deals.opportunityCollectionView.el;
						appendCustomfieldsHeaders(el);
						appendCustomfields(el);
						// Showing time ago plugin for close date
						includeTimeAgo(el);
						// Shows Milestones Pie
						pieMilestonesByPipeline(pipeline_id);
						// Shows deals chart
						dealsLineChartByPipeline(pipeline_id);
						deal_bulk_actions.init_dom(el);
						setupDealsTracksList(cel);
						setupDealFilters(cel);
						setNewDealFilters(App_Deals.deal_filters.collection);
						initializeDealListners(el);
					}, appendItemCallback : function(el)
					{
						appendCustomfields(el);

						// To show timeago for models appended by infini scroll
						includeTimeAgo(el);

					} });
				that.opportunityCollectionView.collection.fetch();

				$('#opportunity-listners').html(that.opportunityCollectionView.render().el);
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
	 * import deals from a csv file and then upload all deals to databse
	 */
	importDeals : function()
	{
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
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
							{
											$(".created_time", el).timeago();
							});

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
		var deals_filter = new Base_Model_View({ url : '/core/api/deal/filters', template : "filter-deals", isNew : "true", window : "deal-filters",
			postRenderCallback : function(el)
			{
				initializeDealListners();
				populateUsers('owners-list-filters',el,undefined,undefined,function(){
					populateTracks(el, undefined, undefined, function(){
						$('#owners-list-filters').find('option[value=""]').attr("selected","selected").text('Any');
						$('#pipeline').find('option[value=""]').text('Any');			
						$('#milestone').find('option[value=""]').text('Any');
					});
				});	
			} });
		$("#opportunity-listners").html(deals_filter.render().el);
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
		var dealFilter = new Base_Model_View({ url : 'core/api/deal/filters', model : deal_filter, template : "filter-deals",
			window : 'deal-filters', postRenderCallback : function(el)
			{
				initializeDealListners();
				populateUsers('owners-list-filters', el, undefined, undefined, function(){
					populateTracks(el, undefined, undefined, function(){
						if(deal_filter.get('pipeline_id')){
							deserializeForm(deal_filter_json, $("#dealsFilterForm"));
							populateMilestones(el, undefined, deal_filter.get('pipeline_id'), deal_filter_json, function(){
								$('#owners-list-filters').find('option[value=""]').text('Any');
								$('#pipeline').find('option[value=""]').text('Any');			
								$('#pipeline', $('#opportunity-listners')).trigger('change');
								$('#value_filter', $('#opportunity-listners')).trigger('change');
								setTimeout(function(){
									if(deal_filter.get('milestone')){
										$('#milestone').find('option[value="'+deal_filter.get("milestone")+'"]').attr("selected","selected");
									}
									$('#milestone').find('option[value=""]').text('Any');
									$('input[name=name]').trigger('focus');
								},500);
							});
						}else{
							$('#owners-list-filters').find('option[value=""]').text('Any');
							$('#pipeline').find('option[value=""]').text('Any');			
							$('#milestone').find('option[value=""]').text('Any');
							$('#value_filter', $('#opportunity-listners')).trigger('change');
							deserializeForm(deal_filter_json, $("#dealsFilterForm"));
						}
					});
				});
			} });

		$("#opportunity-listners").html(dealFilter.render().el);

	},

	/**
	 * Adds new filter to get specific deals
	 */
	dealFilter : function(id)
	{
		var deal_filter = App_Deals.deal_filters.collection.get(id);
		var deal_filter_json = deal_filter.toJSON();
		createCookie('deal-filters', JSON.stringify(deal_filter_json));
		App_Deals.deals();
	},

});
