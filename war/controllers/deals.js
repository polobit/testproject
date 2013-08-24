/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals",
	},

	/**
	 * Fetches all the opportunities as list and also as milestone lists.
	 * Fetching both makes easy to add/get deal to the list rather than milestone lists. 
	 * Based on deal_view cookie it show deals to user.
	 * Also fetches Milestones pie-chart and Details graph if deals exist.
	 */
	deals : function()
	{
		// Depending on cookie shows list or milestone view
		var url = 'core/api/opportunity';
		var template_key = "opportunities";
		var individual_tag_name = 'tr';

		// Fetches deals as list
		this.opportunityCollectionView = new Base_Collection_View({
			url : url,
			// restKey: "opportunity",
			templateKey : template_key,
			individual_tag_name : individual_tag_name,
			postRenderCallback : function(el)
				{
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
					{
						$(".deal-close-time", el).timeago();
					});
		
					// Shows Milestones Pie
					pieMilestones();
		
					// Shows deals chart
					dealsLineChart();
		
				}
		});

		this.opportunityCollectionView.collection.fetch();

		if (!readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";
			individual_tag_name = "div";
			url = 'core/api/opportunity/byMilestone';
			
			// Fetchs deals by milestones list
			this.opportunityMilestoneCollectionView = new Base_Collection_View({
				url : url,
				templateKey : template_key,
				individual_tag_name : individual_tag_name,
				postRenderCallback : function(el)
				{
					head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
					{
						$(".deal-close-time", el).timeago();
					});
					
					$('#opportunities-by-milestones-model-list > div').addClass("milestone-main");
					//$('.milestone-main :last-child').find("ul").closest('div').css({"border-right":"none"});
					
					setup_deals_in_milestones();

					// Shows Milestones Pie
					pieMilestones();

					// Shows deals chart
					dealsLineChart();

				}
			});
			this.opportunityMilestoneCollectionView.collection.fetch();
			
			// Shows deals as milestone list view
			$('#content').html(this.opportunityMilestoneCollectionView.render().el);
		}
		// Shows deals as list view
		else
			$('#content').html(this.opportunityCollectionView.render().el);

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
	}

 });
