/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals", "import-deals" : "importDeals",
	"deal-rc-0" : "dealsRightClick","deal-rc-1" : "dealsRightClick","deal-rc-2" : "dealsRightClick","deal-rc-3" : "dealsRightClick",
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
		if (_agile_get_prefs("agile_deal_track"))
			pipeline_id = _agile_get_prefs("agile_deal_track");
		/*var deal_filters = _agile_get_prefs('deal-filters');
		if(deal_filters)
		{
			var filtersJSON = $.parseJSON(deal_filters);
			if(filtersJSON && filtersJSON.pipeline_id)
			{
				pipeline_id = filtersJSON.pipeline_id;
			}
		}*/
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
				if (_agile_get_prefs('deal-filters'))
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
						loadPortlets('Deals');
						setTimeout(function(){
							$('#delete-checked',el).attr("id","deal-delete-checked");
						},500);
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
		if (!hasScope("MANAGE_DEALS"))
		{
			$('#content').html('<h2 class="p-l-md"><strong><i class="fa-exclamation-triangle icon-white"></i>&nbsp;&nbsp; Sorry, you do not have privileges to import deals.</strong></h2>');
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
				var usersCollection = new Base_Collection_View({ url : '/core/api/users', sort_collection : false });
				usersCollection.collection.fetch({
					success : function(data){
						var json = data.toJSON();
						$('#owners-list-filters').html('');
						if(json && json.length > 1){
							$('#owners-list-filters').html('<option value="">Any</option>');
						}
						var template = Handlebars.compile('<option value="{{id}}">{{name}}</option>'); 
						$.each(json, function(index, user){
							$('#owners-list-filters').append(template({name : user.name, id : user.id}));
						});
						$('#owners-list-filters').parent().find('img').hide();
						hideTransitionBar();
					}
				});
				var tracksCollection = new Base_Collection_View({ url : '/core/api/milestone/pipelines', sort_collection : false });
				tracksCollection.collection.fetch({
					success : function(data){
						var json = data.toJSON();
						$('#filter_pipeline').html('');
						if(json && json.length > 1){
							$('#filter_pipeline').html('<option value="">Any</option>');
						}
						var template = Handlebars.compile('<option value="{{id}}">{{name}}</option>'); 
						$.each(json, function(index, track){
							$('#filter_pipeline').append(template({name : track.name, id : track.id}));
						});
						$('#filter_pipeline', $('#opportunity-listners')).trigger('change');
						$('#filter_pipeline').parent().find('img').hide();
						hideTransitionBar();
					}
				});
				$('input[name=name]').trigger('focus');
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
			window : 'deal-filters', prePersist : function(model){
				model.set({ 
							'pipeline_id' : $('#filter_pipeline', $("#dealsFilterForm")).val(), 
							'milestone' : $('#milestone', $("#dealsFilterForm")).val(),
							'owner_id' : $('#owners-list-filters', $("#dealsFilterForm")).val() 
						}, 
						{ 
							silent : true 
						});
			}, 
			postRenderCallback : function(el)
			{
				initializeDealListners();
				deserializeForm(deal_filter_json, $("#dealsFilterForm"));
				$('input[name=name]').trigger('focus');
				var usersCollection = new Base_Collection_View({ url : '/core/api/users', sort_collection : false });
				usersCollection.collection.fetch({
					success : function(data){
						var json = data.toJSON();
						$('#owners-list-filters').html('');
						if(json && json.length > 1){
							$('#owners-list-filters').html('<option value="">Any</option>');
						}
						var template = Handlebars.compile('<option value="{{id}}">{{name}}</option>');
						$.each(json, function(index, user){
							$('#owners-list-filters').append(template({id : user.id, name : user.name}));
						});
						if(deal_filter_json && deal_filter_json.owner_id)
						{
							$('#owners-list-filters').find('option[value="'+deal_filter_json.owner_id+'"]').attr("selected", "selected");
						}
						$('#owners-list-filters').parent().find('img').hide();
						hideTransitionBar();
						$('#value_filter').find('option').each(function(){
				    		if($(this).val()==$('#value_filter').val()){
				    			$('.'+$(this).val()).removeClass('hide');
				    		}else{
				    			$('.'+$(this).val()).addClass('hide');
				    		} 
				    	});
					}
				});
				var tracksCollection = new Base_Collection_View({ url : '/core/api/milestone/pipelines', sort_collection : false });
				tracksCollection.collection.fetch({
					success : function(data){
						var json = data.toJSON();
						$('#filter_pipeline').html('');
						if(json && json.length > 1){
							$('#filter_pipeline').html('<option value="">Any</option>');
						}
						var template = Handlebars.compile('<option value="{{id}}">{{name}}</option>');
						$.each(json, function(index, track){
							$('#filter_pipeline').append(template({id : track.id, name : track.name}));
						});
						if(deal_filter_json && deal_filter_json.pipeline_id)
						{
							$('#filter_pipeline').find('option[value="'+deal_filter_json.pipeline_id+'"]').attr("selected", "selected");
						}
						$('#filter_pipeline').parent().find('img').hide();
						hideTransitionBar();

						var track = $('#filter_pipeline').val();
						if (track)
						{
							var milestoneModel = Backbone.Model.extend({ url : '/core/api/milestone/'+track });
							var model = new milestoneModel();
							model.fetch({ 
								success : function(data){
									var json = data.toJSON();
									var milestones = json.milestones;
									milestonesList = milestones.split(",");
									$('#milestone').html('');
									if(milestonesList.length > 1)
									{
										$('#milestone', el).html('<option value="">Any</option>');
									}
									var template = Handlebars.compile('<option value="{{milestone}}">{{milestone}}</option>');
									$.each(milestonesList, function(index, milestone){
										$('#milestone', el).append(template({milestone : milestone}));
									});
									if(deal_filter_json && deal_filter_json.milestone && track == deal_filter_json.pipeline_id)
									{
										$('#milestone').find('option[value="'+deal_filter_json.milestone+'"]').attr("selected", "selected");
									}
									
									$('#milestone', el).parent().find('img').hide();
									hideTransitionBar();
								} 
							});
						}
						else
						{
							$('#milestone', el).html('<option value="">Any</option>');
						}
					}
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
		_agile_set_prefs('deal-filters', JSON.stringify(deal_filter_json));
		App_Deals.deals();
	},

});
