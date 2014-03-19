/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals", },

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
			individual_tag_name = "div";
			url = 'core/api/opportunity/byMilestone';

			// Fetchs deals by milestones list
			this.opportunityMilestoneCollectionView = new Base_Collection_View({ url : url, templateKey : template_key,
				individual_tag_name : individual_tag_name, postRenderCallback : function(el)
				{
					// To show timeago for close date
					includeTimeAgo(el);

					$('#opportunities-by-milestones-model-list > div').addClass("milestone-main");
					// $('.milestone-main
					// :last-child').find("ul").closest('div').css({"border-right":"none"});

					setup_deals_in_milestones();

					// Shows Milestones Pie
					pieMilestones();

					// Shows deals chart
					dealsLineChart();
				} });
			this.opportunityMilestoneCollectionView.collection.fetch();

			// Shows deals as milestone list view
			$('#content').html(this.opportunityMilestoneCollectionView.render().el);
		}
		// Fetches deals as list
		this.opportunityCollectionView = new Base_Collection_View({ url : 'core/api/opportunity', templateKey : "opportunities", individual_tag_name : 'tr',
			postRenderCallback : function(el)
			{
				// Showing time ago plugin for close date
				includeTimeAgo(el);
				// Shows Milestones Pie
				pieMilestones();

				// Shows deals chart
				dealsLineChart();
			},
			appendItemCallback : function(el)
			{ 
				// To show timeago for models appended by infini scroll
				includeTimeAgo(el);
			}
			});
		this.opportunityCollectionView.collection.fetch();

		// Shows deals as list view
		if (readCookie("agile_deal_view"))
			$('#content').html(this.opportunityCollectionView.render().el);

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
	}

});
