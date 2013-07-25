/**
 * Creates backbone router for Deals/Opportunities create, read and update
 * operations
 */
var DealsRouter = Backbone.Router.extend({

	routes : {

	/* Deals/Opportunity */
	"deals" : "deals",
	// "deals-add": "dealsAdd",
	// "deals/:id": "dealsDetails"
	},

	/**
	 * Fetches all the opportunities and shows them as a list. Also fetches
	 * Milestones pie-chart and Details graph if deals exist.
	 * 
	 */
	deals : function()
	{

		var url = 'core/api/opportunity';
		var template_key = "opportunities";
		var individual_tag_name = 'tr';

		this.opportunityCollectionView = new Base_Collection_View({ url : url,
		// restKey: "opportunity",
		templateKey : template_key, individual_tag_name : individual_tag_name, postRenderCallback : function(el)
		{
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".deal-close-time", el).timeago();
			});

			// Shows Milestones Pie
			pieMilestones();

			// Shows deals chart
			pieDetails();

		} });

		this.opportunityCollectionView.collection.fetch();

		if (readCookie("agile_deal_view"))
		{
			template_key = "opportunities-by-milestones";
			individual_tag_name = "div";
			url = 'core/api/opportunity/byMilestone';
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
					$('#opportunities-by-milestones-model-list > div').css({
						"white-space" : "nowrap",
						"overflow" : "auto",
						"width" : "100%",
						"height" : "517px",
						"border" : "1px solid #d5d5d5",
						"border-radius" : "3px"
					});

					setup_deals_in_milestones();

					// Shows Milestones Pie
					pieMilestones();

					// Shows deals chart
					pieDetails();

				} });

			this.opportunityMilestoneCollectionView.collection.fetch();

			$('#content').html(this.opportunityMilestoneCollectionView.render().el);
		}
		else
			$('#content').html(this.opportunityCollectionView.render().el);

		$(".active").removeClass("active");
		$("#dealsmenu").addClass("active");
	},

	/**
	 * Saves new Deal. Initializes contacts typeahead, milestone select,
	 * date-picker and owner select list from postRenderCallback of its
	 * Base_Model_View.
	 * 
	 */
	dealsAdd : function()
	{
		this.opportunityModelview = new Base_Model_View({ url : 'core/api/opportunity', template : "opportunity-add", isNew : true, window : 'deals',
			postRenderCallback : function(el)
			{

				// Contacts type-ahead
				agile_type_ahead("relates_to", el, contacts_typeahead);
				// Fills milestone select element
				populateMilestones(el);
				// Fills owner select element
				populateUsers("owners-list", el);

				// Enable the datepicker
				$('#close_date', el).datepicker({ format : 'mm/dd/yyyy', });
			} });

		var view = this.opportunityModelview.render();
		$('#content').html(view.el);
	},

	/**
	 * Updates a deal. Initializes contacts typeahead, milestones select and
	 * owner select from postRenderCallback of its Base_Model_View.
	 * 
	 * @param id -
	 *            Opportunity Id
	 */
	dealsDetails : function(id)
	{

		// Navigates to deals if the user refreshes it directly
		if ((!this.opportunityCollectionView || this.opportunityCollectionView.collection.length == 0) && (!dealsView || dealsView.collection.length == 0))
		{
			this.navigate("deals", { trigger : true });
			return;
		}

		if (this.opportunityCollectionView && this.opportunityCollectionView.collection)
			// Gets a deal from deals collection based on id
			var model = this.opportunityCollectionView.currentDeal = this.opportunityCollectionView.collection.get(id);

		else if (dealsView && dealsView.collection)
			// Gets a deal from deals collection based on id
			var model = dealsView.collection.get(id);

		// console.log(model.toJSON());

		var view = new Base_Model_View({ url : 'core/api/opportunity', data : model.toJSON(), template : "opportunity-add", window : 'back',
			postRenderCallback : function(el)
			{
				// Call setupTypeAhead to get contacts
				agile_type_ahead("relates_to", el, contacts_typeahead);

				// Fills milestone select element
				populateMilestones(el, undefined, model.toJSON());

				// Fills owner select element
				populateUsers("owners-list", el, model.toJSON(), 'owner');

			}, });

		var view = view.render();
		$("#content").html(view.el);
	} });
