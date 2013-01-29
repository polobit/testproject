/**
 * workflows.js is a script file having routes for CRU operations of workflows
 * and triggers.
 * 
 * @module Campaigns
 * 
 */
var WorkflowsRouter = Backbone.Router.extend({

	routes : {

		/* workflows */
		"workflows" : "workflows",
		"workflow-add" : "workflowAdd",
		"workflow/:id" : "workflowEdit",

		/* Logs */
		"workflows/logs/:id" : "logsToCampaign",
		
		/* Campaign Stats */
		"campaign-stats" : "campaignStats",

		/* Triggers */
		"triggers" : "triggers",
		"trigger-add" : "triggerAdd",
		"trigger/:id" : "triggerEdit"
	},

	/**
	 * Gets workflows list.Sets page-size to 10, so that initially workflows are
	 * 10. Cursor is true, when scrolls down , the workflows list increases.
	 */
	workflows : function() {
		this.workflowsListView = new Base_Collection_View({
			url : '/core/api/workflows',
			restKey : "workflow",
			templateKey : "workflows",
			individual_tag_name : 'tr',
			cursor : true,
			page_size : 10
		});

		this.workflowsListView.collection.fetch();
		$('#content').html(this.workflowsListView.el);

		$(".active").removeClass("active");
		$("#workflowsmenu").addClass("active");
	},

	/**
	 * Saves new workflow.After workflow saved,the page should navigate to
	 * workflows list.
	 */
	workflowAdd : function() {
		if (!this.workflowsListView || !this.workflowsListView.collection) {
			this.navigate("workflows", {
				trigger : true
			});
			return;
		}

		/* Reset the designer JSON */
		this.workflow_json = undefined;
		this.workflow_model = undefined;

		$('#content').html(getTemplate('workflow-add', {}));
	},

	/**
	 * Updates existing workflow. After workflow updated, the page navigates to 
	 * workflows list
	 * 
	 * @param id
	 *            Workflow Id
	 */
	workflowEdit : function(id) {
		if (!this.workflowsListView
				|| this.workflowsListView.collection.length == 0) {
			this.navigate("workflows", {
				trigger : true
			});
			return;
		}

		/* Set the designer JSON. This will be deserialized */
		this.workflow_model = this.workflowsListView.collection.get(id);
		this.workflow_json = this.workflow_model.get("rules");

		$('#content').html(getTemplate('workflow-add', {}));

		// Set the name
		$('#workflow-name').val(this.workflow_model.get("name"));
	},

	/**
	 * Gets list of logs with respect to campaign.
	 * 
	 * @param id
	 *            Workflow Id
	 */
	logsToCampaign : function(id) {
		var logsListView = new Base_Collection_View({
			url : '/core/api/campaigns/logs/' + id,
			restKey : "logs",
			templateKey : "campaign-logs",
			individual_tag_name : 'tr'
		});

		logsListView.collection.fetch();
		$('#content').html(logsListView.el);
	},
	
	campaignStats : function(){
		this.campaignStatsCollectionView = new Base_Collection_View({
			url : 'core/api/campaign-stats',
			templateKey : "campaign-stats",
			individual_tag_name : 'tr'
		});
		this.campaignStatsCollectionView.collection.fetch();
		$('#content').html(this.campaignStatsCollectionView.el);
	},

	/** Gets list of triggers */
	triggers : function() {
		this.triggersCollectionView = new Base_Collection_View({

			url : '/core/api/triggers',
			restKey : "triggers",
			templateKey : "triggers",
			individual_tag_name : 'tr',
		});

		this.triggersCollectionView.collection.fetch();
		$('#content').html(this.triggersCollectionView.el);
	},

	/**
	 * Saves new trigger. Loads jquery.chained.js to link Conditions and Value of
	 * input field.Fills campaign list using fillSelect function
	 */
	triggerAdd : function() {
		this.triggerModelview = new Base_Model_View(
				{
					url : 'core/api/triggers',
					template : "trigger-add",
					isNew : true,
					window : 'triggers',
					/**
					 * Callback after page rendered.
					 * 
					 * @param el
					 *            el property of Backbone.js
					 */
					postRenderCallback : function(el) {

						// Loads jquery.chained.min.js
						head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
								function() {
									var LHS, RHS;

									// Assigning elements with ids LHS and RHS
									// in trigger-add.html
									LHS = $("#LHS", el);
									RHS = $("#RHS", el);

									// Chaining dependencies of input fields
									// with jquery.chained.js
									RHS.chained(LHS);

								});

						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						/**
						 * Fills campaign select with existing Campaigns.
						 * 
						 * @param campaign-select -
						 *            Id of select element of Campaign
						 * @param /core/api/workflows -
						 *            Url to get workflows
						 * @param 'workflow' -
						 *            parse key
						 * @param no-callback -
						 *            No callback
						 * @param optionsTemplate-
						 *            to fill options with workflows
						 */
						fillSelect('campaign-select', '/core/api/workflows',
								'workflow', 'no-callback', optionsTemplate);
					}
				});

		var view = this.triggerModelview.render();
		$('#content').html(view.el);
	},

	/**
	 * Updates trigger.
	 * 
	 * @param id -
	 *            trigger id
	 */
	triggerEdit : function(id) {

		// Send to triggers if the user refreshes it directly
		if (!this.triggersCollectionView
				|| this.triggersCollectionView.collection.length == 0) {
			this.navigate("triggers", {
				trigger : true
			});
			return;
		}

		// Gets trigger with respect to id
		var currentTrigger = this.triggersCollectionView.collection.get(id);

		var view = new Base_Model_View(
				{
					url : 'core/api/triggers',
					model : currentTrigger,
					template : "trigger-add",
					window : 'triggers',
					postRenderCallback : function(el) {

						// Loads jquery.chained.min.js
						head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
								function() {
									var LHS, RHS;

									LHS = $("#LHS", el);
									RHS = $("#RHS", el);

									// Chaining dependencies of input fields
									// with jquery.chained.js
									RHS.chained(LHS);

								});

						/**
						 * Shows given values when trigger selected
						 */

						// To get the input values
						var type = currentTrigger.toJSON()['type'];

						// Shows the Value field with given value
						$('#trigger-type', el).find(
								'option[value=' + type + ']').attr("selected",
								"selected").trigger('change');

						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						/**
						 * Fills campaign select drop down with existing Campaigns and
						 * shows previous option as selected.
						 * 
						 * @param campaign-select -
						 *            Id of select element of Campaign
						 * @param /core/api/workflows -
						 *            Url to get workflows
						 * @param 'workflow' -
						 *            parse key
						 * @param callback-function -
						 *            Shows previous option selected
						 * @param optionsTemplate-
						 *            to fill options with workflows
						 */
						fillSelect('campaign-select', '/core/api/workflows',
								'workflow', function fillCampaign() {
									var value = currentTrigger.toJSON();
									if (value) {
										$('#campaign-select', el).find(
												'option[value='
														+ value.campaign_id
														+ ']').attr('selected',
												'selected');
									}
								}, optionsTemplate);
					},
				});

		var view = view.render();
		$("#content").html(view.el);
	}
});