/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals",
	"import-deals" :"importDeals",
	},

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than
	 * milestone lists. Based on deal_view cookie it show deals to user. Also
	 * fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{
		pipeline_id = 0;
		if(readCookie("agile_deal_track"))
			pipeline_id = readCookie("agile_deal_track");
		
		// Depending on cookie shows list or milestone view
		if (!readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";
			
			if(pipeline_id == 1)
				pipeline_id = 0;
			
			$('#content').html(getTemplate("new-opportunity-header", {}));
			// Add row-fluid if user prefs are set to fluid
			if (IS_FLUID)
			{
				$('#content').find('div.row').removeClass('row').addClass('row-fluid');
			}
			pipeline_count = 0;
			deal_fetching = false;
			DEALS_LIST_COLLECTION = null;
			setupDealsTracksList();
			setupDealFilters();
		}
		else
		{
			DEALS_LIST_COLLECTION = null;
			var query = ''
				if(readCookie('deal-filters')){
					query = '&filters='+encodeURIComponent(getDealFilters());
				}
			// Fetches deals as list
			this.opportunityCollectionView = new Base_Collection_View({ url : 'core/api/opportunity/based?pipeline_id='+pipeline_id+query, templateKey : "opportunities", individual_tag_name : 'tr', sort_collection : false, cursor : true, page_size : 25,
				postRenderCallback : function(el)
				{
					if(pipeline_id == 1)
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
				},
				appendItemCallback : function(el)
				{ 
					appendCustomfields(el);

					// To show timeago for models appended by infini scroll
					includeTimeAgo(el);
					
				}
				});
			this.opportunityCollectionView.collection.fetch();

			$('#content').html(this.opportunityCollectionView.render().el);
		}

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
		setTimeout(function(){$('a.deal-notes').tooltip();}, 2000);
	},
	
	
	/**
	 * import deals from a csv file and then upload all deals to databse
	 */
	importDeals : function()
	{
		$('#content').html(getTemplate("import-deals", {}));
	},

});
