/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals",
	"deals/import" :"importDeals",
	},

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than
	 * milestone lists. Based on deal_view cookie it show deals to user. Also
	 * fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{
		// Depending on cookie shows list or milestone view
		if (!readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";
			
			var pipeline_id = 0;
			if(readCookie("agile_deal_track"))
				pipeline_id = readCookie("agile_deal_track");
			
			if(pipeline_id == 1)
				pipeline_id = 0;
			
			individual_tag_name = "div";
			url = 'core/api/opportunity/byPipeline/based?pipeline_id='+pipeline_id;

			// Fetchs deals by milestones list
			this.opportunityMilestoneCollectionView = new Base_Collection_View({ url : url, templateKey : template_key,
				individual_tag_name : individual_tag_name, postRenderCallback : function(el)
				{
					// To show timeago for close date
					includeTimeAgo(el);
					
					var element = $('#opportunities-by-milestones-model-list');

					var id = $(element).attr('id');
					$("#" + id + "> div").addClass("milestone-main");
					
					$('.milestone-main div:last-child').css({"border-right":"none"});
					setup_deals_in_milestones(id);
					
					// For adding dynamic width to milestone columns
					var count;
					$.ajax({
						url: '/core/api/milestone/'+pipeline_id,
						type: 'GET',
						success: function(data) {
							if(pipeline_id == 0){
								pipeline_id = data.id;
								createCookie("agile_deal_track",pipeline_id);
							}
							var milestones = data.milestones;
							milestones = milestones.split(",");
							count = milestones.length;
							if(!count)return;
							
							var width;
							// Setting dynamic auto width
							width = (100/count);
							
							$("#" + id).find('.milestone-column').width(width +"%");

						}
					});
					
					setupDealsTracksList(el);

				} });
			this.opportunityMilestoneCollectionView.collection.fetch();

			// Shows deals as milestone list view
			$('#content').html(this.opportunityMilestoneCollectionView.render().el);
		}
		else
		{

			var pipeline_id = 0;
			if(readCookie("agile_deal_track"))
				pipeline_id = readCookie("agile_deal_track");
			
			// Fetches deals as list
			this.opportunityCollectionView = new Base_Collection_View({ url : 'core/api/opportunity/based?pipeline_id='+pipeline_id, templateKey : "opportunities", individual_tag_name : 'tr', sort_collection : false, cursor : true, page_size : 25,
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
					setupDealsTracksList(cel);
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
