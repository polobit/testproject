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
				
				/* workflow templates*/
				"workflow-templates":"workflowTemplates",
				"workflow-add/:t":"workflowAddTemplate",
				
				/* Logs */
				"workflows/logs/:id" : "logsToCampaign",

				/* Campaign Stats */
				"campaign-stats" : "campaignStats",
				"email-reports/:id" : "emailReports",

				/* Triggers */
				"triggers" : "triggers",
				
				// Appends campaign-id to show selected campaign-name in add trigger form.
				"trigger-add/:id" : "triggerAdd",
				
				"trigger-add": "triggerAdd",
				"trigger/:id" : "triggerEdit",
				
				/* Subscribers*/
				"workflow/:id/active-contacts": "activeContacts",
				"workflow/:id/completed-contacts": "completedContacts"
			},

			/**
			 * Gets workflows list.Sets page-size to 10, so that initially
			 * workflows are 10. Cursor is true, when scrolls down , the
			 * workflows list increases.
			 */
			workflows : function() {
				this.workflow_list_view = new Base_Collection_View({
					url : '/core/api/workflows',
					restKey : "workflow",
					templateKey : "workflows",
					individual_tag_name : 'tr',
					cursor : true,
					page_size : 20,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.campaign-created-time", el).timeago();
							
						});
						  start_tour(undefined, el);

						  // Shows pending triggers content when there are no triggers.
						  if (App_Workflows.workflow_list_view
									&& !(App_Workflows.workflow_list_view.collection.length === 0))
						  {
							  $.get('/core/api/triggers',function(data){
							      
								  if(data.length===0)
								  $('#triggers-verification',el).css('display','block');
								  
						      });
						  }
						 
					},
					appendItemCallback:function(el)
					{
						$("time.campaign-created-time", el).timeago();
					}
				});

				this.workflow_list_view.collection.fetch();
				$('#content').html(this.workflow_list_view.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new workflow.After workflow saved,the page should navigate
			 * to workflows list.
			 */
			workflowAdd : function() {
				if (!this.workflow_list_view
						|| !this.workflow_list_view.collection) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				$('#content').html(getTemplate('workflow-add', {}));
				initiate_tour("workflows-add", $('#content'));
			},
			
			/**
			 * Fetches various default workflow template jsons such as newsletter etc and build UI
			 * to show various templates to select workflow template.
			 * 
			 **/
			workflowTemplates: function(){
				if (!this.workflow_list_view
						|| !this.workflow_list_view.collection) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				// Insert workflow categories template into content div
				var $workflow_categories_template  = $('#content').html(getTemplate('workflow-categories', {}));

				console.log(this.worflow_templates_json === undefined);
				var workflow_templates = this.worflow_templates_json;
			    
				// Download template jsons, if undefined.
				if(workflow_templates === undefined)
			    {
					console.log("Downloading template jsons...");
					
					// to maintain scope of 'this' inside callback
					var that = this;
					var origin = location.origin;
					
					// Show loading image.
					$('.workflow-templates-loading-img', $workflow_categories_template).append(LOADING_HTML);
					
					// Download template jsons
					$.getJSON(origin + '/workflow-default-templates', function(data){
						
						// Remove loading image.
						$('.loading').remove();
						
						// Initialize workflow_templates_json
						that.worflow_templates_json = data;
						
						// build UI with obtained templates json
						build_workflow_templates(data, $workflow_categories_template);
					});
			    	
			    	return;
			    }
				
				build_workflow_templates(workflow_templates, $workflow_categories_template);
			},
			
			/**
			 * Shows constructed workflow that matches with the template_name.
			 * 
			 * @param template_name - template name.
			 **/
			workflowAddTemplate: function(template_name){
				if (!this.workflow_list_view
						|| !this.workflow_list_view.collection) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				// Returns workflow json with the template name and initialize this.workflow_json.
				this.workflow_json = JSON.stringify(get_template_json(this.worflow_templates_json, template_name));
				
				$('#content').html(getTemplate('workflow-add',{}));
				
			},

			/**
			 * Updates existing workflow. After workflow updated, the page
			 * navigates to workflows list
			 * 
			 * @param id
			 *            Workflow Id
			 */
			workflowEdit : function(id, workflow) {
				
				if (!this.workflow_list_view
						|| this.workflow_list_view.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
 
				/* Set the designer JSON. This will be deserialized */
				if(workflow)
					this.workflow_model = workflow;
				else
					this.workflow_model = this.workflow_list_view.collection.get(id);
				
				// Download new one if undefined
				if(this.workflow_model === undefined)
				{
					console.log("Downloading workflow.");
					
					// get count value from first attribute count
					var total_count = this.workflow_list_view.collection.at(0).attributes.count;
					
					if (this.workflow_list_view.collection.length !== total_count)
					{
						// if not in the collection, download new one.
						var new_workflow_model = Backbone.Model.extend(
								{
									url : '/core/api/workflows/' + id
								});

							var model = new new_workflow_model();
							model.id = id;
							
							model.fetch(
							 {
							 success : function(data)
									   {
									       // Call workflowEdit again if not Empty
										 	if(!$.isEmptyObject(data.toJSON()))
											{
												App_Workflows.workflowEdit(id, model);
												return;
											}
										}
							 });
						}
					}
				
				if(this.workflow_model === undefined)
					return;
				
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
				
				if (!this.workflow_list_view
						|| this.workflow_list_view.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
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

			/**
			 * Returns campaign stats graphs data for given campaign-id.
			 * 
			 * @param id - workflow id
			 **/
			emailReports : function(id) {
				
				if (!this.workflow_list_view
						|| this.workflow_list_view.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
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
			 * function.
			 * When + Add is clicked in workflows, fill with selected campaign-name
			 */
			triggerAdd : function(campaign_id) {
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

								// fill the selected campaign-id
								if(campaign_id)
								{
									fillSelect('campaign-select','/core/api/workflows','workflow', function(id){
										$('#campaign-select', el)
										.find(
												'option[value='
														+ campaign_id
														+ ']')
										.attr('selected',
												'selected');
									}, optionsTemplate);

								}
								else
								{
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
								$('#trigger-type', el).val(type).attr(
										"selected", "selected").trigger(
										'change');

								// Populate milestones list and make obtained milestone selected.
								if(type === 'DEAL_MILESTONE_IS_CHANGED'){
									
									var trigger_deal_milestone_value = currentTrigger.toJSON()['trigger_deal_milestone'];
									populate_milestones_in_trigger($('form#addTriggerForm', el), 'trigger-deal-milestone', trigger_deal_milestone_value);

								}

								// Calls TagsTypeAhead on focus event.
								if (type == 'TAG_IS_ADDED'
										|| type == 'TAG_IS_DELETED')
									$('.trigger-tags', el).live("focus",
											function(e) {
												e.preventDefault();
												addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
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
			},
			
			/** 
			 * Returns list of subscribers having campaignStatus campaignId-ACTIVE
			 * 
			 * @param id - workflow id.
			 **/
			activeContacts:function(id)
			{
				if (!this.workflow_list_view
						|| this.workflow_list_view.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
				var workflowName = this.workflow_model.get("name");
				
				this.active_contacts_collection = new Base_Collection_View({
					url:'core/api/workflows/active-contacts/'+id,
					templateKey:'workflow-active-contacts',
					individual_tag_name : 'tr',
					cursor : true,
					page_size : 20,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.campaign-started-time", el).timeago();
							
						});
						
						$('#subscribers-campaign-name').text(workflowName);
						
						// Add href to Completed Subscribers
						$('a#completed-subscribers-link').attr('href', '#workflow/'+id+'/completed-contacts');
					},
					appendItemCallback:function(el)
					{
						$("time.campaign-started-time", el).timeago();
					}
				});
				
				this.active_contacts_collection.collection.fetch();
				$("#content").html(this.active_contacts_collection.el);
				
			},
			
			/**
			 * Returns list of completed subscribers of given campaign-id having 
			 * campaignStatus campaignId-DONE
			 * 
			 * @param id - workflow id.
             *
			 **/
			completedContacts: function(id){
				
				if (!this.workflow_list_view
						|| this.workflow_list_view.collection.length == 0) {
					this.navigate("workflows", {
						trigger : true
					});
					return;
				}
				
				/* Set the designer JSON. This will be deserialized */
				this.workflow_model = this.workflow_list_view.collection.get(id);
				var workflowName = this.workflow_model.get("name");
				
				this.completed_contacts_collection = new Base_Collection_View({
					url:'core/api/workflows/completed-contacts/'+id,
					templateKey:'workflow-completed-contacts',
					individual_tag_name : 'tr',
					cursor : true,
					page_size : 20,
					postRenderCallback : function(el) {
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$("time.campaign-started-time", el).timeago();
							$("time.campaign-completed-time", el).timeago();
						});
						
						$('#subscribers-campaign-name').text(workflowName);
						
						// Add href to Active Subscribers
						$('a#active-subscribers-link', el).attr('href', '#workflow/'+id+'/active-contacts');
					},
					appendItemCallback:function(el)
					{
						$("time.campaign-started-time", el).timeago();
						$("time.campaign-completed-time", el).timeago();
					}
				});
				
				this.completed_contacts_collection.collection.fetch();
				$("#content").html(this.completed_contacts_collection.el);
			}
		});