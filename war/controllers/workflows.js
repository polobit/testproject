/**
 * workflows.js is a script file having routes for CRU operations of workflows
 * and triggers.
 * 
 * @module Campaigns
 * 
 */
var WorkflowsRouter = Backbone.Router
		.extend({

			routes : {

				/* workflows */
				"workflows" : "workflows",
				"workflow-add" : "workflowAdd",
				"workflow/:id" : "workflowEdit",

				/* Logs */
				"workflows/logs/:id" : "logsToCampaign",

				/* Campaign Stats */
				"campaign-stats" : "campaignStats",
				"email-reports/:id" : "emailReports",

				/* Triggers */
				"triggers" : "triggers",
				"trigger-add" : "triggerAdd",
				"trigger/:id" : "triggerEdit"
			},

			/**
			 * Gets workflows list.Sets page-size to 10, so that initially
			 * workflows are 10. Cursor is true, when scrolls down , the
			 * workflows list increases.
			 */
			workflows : function() {
				this.workflowsListView = new Base_Collection_View({
					url : '/core/api/workflows',
					restKey : "workflow",
					templateKey : "workflows",
					individual_tag_name : 'tr',
					cursor : true,
					page_size : 10,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.campaign-created-time", el).timeago();
							
						});
						 startTour("workflows", el);
					},
					appendItemCallback:function(el)
					{
						$("time.campaign-created-time", el).timeago();
					}
				});

				this.workflowsListView.collection.fetch();
				$('#content').html(this.workflowsListView.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new workflow.After workflow saved,the page should navigate
			 * to workflows list.
			 */
			workflowAdd : function() {
				if (!this.workflowsListView
						|| !this.workflowsListView.collection) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				$('#content').html(getTemplate('workflow-add', {}));
				initiateTour("workflows-add", $('#content'));
			},

			/**
			 * Updates existing workflow. After workflow updated, the page
			 * navigates to workflows list
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

				var el = $(getTemplate('workflow-add', {}));
				$('#content').html(el);

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
				
				if (!this.workflowsListView
						|| this.workflowsListView.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflowsListView.collection.get(id);
				var workflowName = this.workflow_model.get("name");
				
				var logsListView = new Base_Collection_View({
					url : '/core/api/campaigns/logs/' + id,
					templateKey : "campaign-logs",
					individual_tag_name : 'tr',
					sortKey:'time',
					descending:true,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.log-created-time", el).timeago();
						});
						
						$('#logs-campaign-name').text(workflowName);
					}
				});

				logsListView.collection.fetch();
				$('#content').html(logsListView.el);
			},

			/** Gets list of campaign-stats * */
			campaignStats : function() {
				
				// Load Reports Template
				$("#content").html(
						getTemplate("campaign-stats-chart", {}));

						// Show bar graph for campaign stats
						showBar('/core/api/campaign-stats/stats/',
								'campaign-stats-chart', 'Campaigns Comparison',
								'Email Stats', null);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			emailReports : function(id) {
				
				if (!this.workflowsListView
						|| this.workflowsListView.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflowsListView.collection.get(id);
				var workflowName = this.workflow_model.get("name");
				
				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH
						+ 'lib/date-range-picker.js', function() {

					// Load Reports Template
					$("#content").html(
							getTemplate("campaign-email-reports", {}));
					
					// Set the name
					$('#reports-campaign-name').text(workflowName);

					initChartsUI(id);
				});

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
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

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new trigger. Loads jquery.chained.js to link Conditions and
			 * Value of input field.Fills campaign list using fillSelect
			 * function
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
								head.js(LIB_PATH
										+ 'lib/agile.jquery.chained.min.js',
										function() {
											var LHS, RHS;

											// Assigning elements with ids LHS
											// and RHS
											// in trigger-add.html
											LHS = $("#LHS", el);
											RHS = $("#RHS", el);

											// Chaining dependencies of input
											// fields
											// with jquery.chained.js
											RHS.chained(LHS);

										});

								var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

								/**
								 * Fills campaign select with existing
								 * Campaigns.
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
								fillSelect('campaign-select',
										'/core/api/workflows', 'workflow',
										'no-callback', optionsTemplate);
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
				var currentTrigger = this.triggersCollectionView.collection
						.get(id);

				var view = new Base_Model_View(
						{
							url : 'core/api/triggers',
							model : currentTrigger,
							template : "trigger-add",
							window : 'triggers',
							postRenderCallback : function(el) {

								// Loads jquery.chained.min.js
								head.js(LIB_PATH
										+ 'lib/agile.jquery.chained.min.js',
										function() {
											var LHS, RHS;

											LHS = $("#LHS", el);
											RHS = $("#RHS", el);

											// Chaining dependencies of input
											// fields
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
										'option[value=' + type + ']').attr(
										"selected", "selected").trigger(
										'change');

								$('#trigger-type', el).trigger('change');

								// Calls TagsTypeAhead on focus event.
								if (type == 'TAG_IS_ADDED'
										|| type == 'TAG_IS_DELETED')
									$('.trigger-tags', el).live("focus",
											function(e) {
												e.preventDefault();
												setup_tags_typeahead();
											});

								var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

								/**
								 * Fills campaign select drop down with existing
								 * Campaigns and shows previous option as
								 * selected.
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
								fillSelect(
										'campaign-select',
										'/core/api/workflows',
										'workflow',
										function fillCampaign() {
											var value = currentTrigger.toJSON();
											if (value) {
												$('#campaign-select', el)
														.find(
																'option[value='
																		+ value.campaign_id
																		+ ']')
														.attr('selected',
																'selected');
											}
										}, optionsTemplate);
							},
						});

				var view = view.render();
				$("#content").html(view.el);
			}
		});