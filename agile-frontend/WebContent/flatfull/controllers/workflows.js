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
			"workflows" : "workflows", "workflow-add" : "workflowAdd", "workflow/:id" : "workflowEdit",

			/* workflow templates */
			"workflow-templates" : "workflowTemplates", "workflow-add/:c/:t" : "workflowAddTemplate",

			/* Logs */
			"workflows/logs/:id" : "logsToCampaign",

			/* Campaign Stats */
			"campaign-stats" : "campaignStats", "email-reports/:id" : "emailReports",

			/* Triggers */
			"triggers" : "triggers",

			// Appends campaign-id to show selected campaign-name in add trigger
			// form.
			"trigger-add/:id" : "triggerNewUI",

			"trigger-add" : "triggerNewUI", "trigger/:id" : "triggerEdit",

			/* Subscribers */
			"workflow/all-subscribers/:id" : "allSubscribers", "workflow/active-subscribers/:id" : "activeSubscribers",
				"workflow/completed-subscribers/:id" : "completedSubscribers", "workflow/removed-subscribers/:id" : "removedSubscribers",

				"workflow/unsubscribed-subscribers/:id" : "unsubscribedSubscribers", "workflow/hardbounced-subscribers/:id" : "hardBouncedSubscribers",
				"workflow/softbounced-subscribers/:id" : "softBouncedSubscribers", "workflow/spam-reported-subscribers/:id" : "spamReportedSubscribers"

			},

			/**
			 * Gets workflows list.Sets page-size to 10, so that initially
			 * workflows are 10. Cursor is true, when scrolls down , the
			 * workflows list increases.
			 */
			workflows : function()
			{

				this.workflow_list_view = new Base_Collection_View({ url : '/core/api/workflows', restKey : "workflow", sort_collection : false,
					templateKey : "workflows", individual_tag_name : 'tr', cursor : true, page_size : 20, postRenderCallback : function(el)
					{
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
						{
							$("time.campaign-created-time", el).timeago();

						});

						start_tour(undefined, el);

						// If workflows not empty, show triggers
						if (App_Workflows.workflow_list_view && !(App_Workflows.workflow_list_view.collection.length === 0))
							show_triggers_of_each_workflow(el);

					}, appendItemCallback : function(el)
					{
						$("time.campaign-created-time", el).timeago();

						// Shows triggers to workflows appended on scroll
						show_triggers_of_each_workflow(el);

					} });

				this.workflow_list_view.collection.fetch();

				$("#content").html('<div id="workflows-listener-container"></div>').find('#workflows-listener-container').html(this.workflow_list_view.el);
				initializeWorkflowsListeners();

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Saves new workflow.After workflow saved,the page should navigate
			 * to workflows list.
			 */
			workflowAdd : function()
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				$("#content").html('<div id="workflows-listener-container"></div>');
				getTemplate('workflow-add', { "is_new" : true, "is_disabled" : "false", "was_disabled" : "false" }, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#workflows-listener-container').html($(template_ui));	
					initializeWorkflowsListeners();
					initiate_tour("workflows-add", $('#content'));
					
					// Init SendVerify Email
					send_verify_email();
				}, "#workflows-listener-container");

			},

			/**
			 * Updates existing workflow. After workflow updated, the page
			 * navigates to workflows list
			 * 
			 * @param id
			 *            Workflow Id
			 */
			workflowEdit : function(id, workflow)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Set the designer JSON. This will be deserialized */
				if (workflow)
					this.workflow_model = workflow;
				else
					this.workflow_model = this.workflow_list_view.collection.get(id);

				// Download new one if undefined
				if (this.workflow_model === undefined)
				{
					console.log("Downloading workflow.");

					// get count value from first attribute count
					var total_count = this.workflow_list_view.collection.at(0).attributes.count;

					if (this.workflow_list_view.collection.length !== total_count)
					{
						// if not in the collection, download new one.
						var new_workflow_model = Backbone.Model.extend({ url : '/core/api/workflows/' + id });

						var model = new new_workflow_model();
						model.id = id;

						model.fetch({ success : function(data)
						{
							// Call workflowEdit again if not Empty
							if (!$.isEmptyObject(data.toJSON()))
							{
								App_Workflows.workflowEdit(id, model);
								return;
							}
						} });
					}
				}

				if (this.workflow_model === undefined)
					return;

				this.workflow_json = this.workflow_model.get("rules");
				this.is_disabled = this.workflow_model.get("is_disabled");
				var that = this;

				getTemplate('workflow-add', {"is_disabled" : ""+that.is_disabled}, undefined, function(template_ui){
					if(!template_ui)
						  return;

					var el = $(template_ui);

					$("#content").html('<div id="workflows-listener-container"></div>');
					$('#workflows-listener-container').html(el);
					initializeWorkflowsListeners();

					if(that.is_disabled)
						$('#designer-tour').addClass("blur").removeClass("anti-blur");
                    
					// Set the name
					$('#workflow-name').val(that.workflow_model.get("name"));

					var unsubscribe = that.workflow_model.get("unsubscribe");

					$('#unsubscribe-email').val(unsubscribe.unsubscribe_email);
					$('#unsubscribe-tag').val(unsubscribe.tag);
					$('#unsubscribe-action').val(unsubscribe.action);
					$('#unsubscribe-action').trigger('change');

					// Init SendVerify Email
					send_verify_email();
				}, "#content");
			},

			/**
			 * Fetches various default workflow template jsons such as
			 * newsletter etc and build UI to show various templates to select
			 * workflow template.
			 * 
			 */
			workflowTemplates : function()
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				$("#content").html('<div id="workflows-listener-container"></div>');
				getTemplate('workflow-categories', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#workflows-listener-container').html($(template_ui));
					initializeWorkflowsListeners();
				}, "#workflows-listener-container");
			},

			/**
			 * Shows constructed workflow that matches with the template_name.
			 * 
			 * @param template_name -
			 *            template name.
			 */
			workflowAddTemplate : function(category, template_name)
			{
				if (!this.workflow_list_view || !this.workflow_list_view.collection)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				/* Reset the designer JSON */
				this.workflow_json = undefined;
				this.workflow_model = undefined;

				// Get workflow template based on category and template name
				var workflow_template_model = Backbone.Model.extend({

				url : 'misc/campaign-templates/' + category + '/' + template_name + '_template.jsp' });

				var model = new workflow_template_model();

				var that = this;

				model.fetch({ success : function(data)
				{
					that.workflow_json = JSON.stringify(data);
				} });

				$("#content").html('<div id="workflows-listener-container"></div>');

				getTemplate('workflow-add', { "is_new" : true, "is_disabled" : false, "was_disabled" : false }, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#workflows-listener-container').html($(template_ui));
					initializeWorkflowsListeners();
					// Init SendVerify Email
					send_verify_email();

				}, "#workflows-listener-container");
			},

			/**
			 * Gets list of logs with respect to campaign.
			 * 
			 * @param id
			 *            Workflow Id
			 * 
			 * @param log_type -
			 *            log-filter type
			 * 
			 * @param log_filter_title -
			 *            selected title to show on button.
			 */
			logsToCampaign : function(id, log_type, log_filter_title)
			{

				getTemplate("campaign-analysis-tabs", { "id" : id }, undefined, function(template_ui)
				{
					if (!template_ui)
						return;

					// Render tabs
					$('#campaign-analysis-tabs').html($(template_ui));

					if (log_type == undefined || log_type == "ALL")
						log_type = "";
					else
						log_type = '?log-type=' + log_type;

					var logsListView = new Base_Collection_View({ url : '/core/api/campaigns/logs/' + id + log_type, templateKey : "campaign-logs",
						cursor : true, page_size : 20, individual_tag_name : 'tr', sort_collection : false, postRenderCallback : function(el)
						{
							initializeTriggersListeners();
							head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
							{
								$("time.log-created-time", el).timeago();
							});

							// $('#logs-campaign-name').text(workflowName);

							$('#log-filter-title').html(log_filter_title);
						}, appendItemCallback : function(el)
						{
							includeTimeAgo(el);
						} });

					logsListView.collection.fetch({ success : function(collection)
					{
						if (collection.length === 0)
							fill_logs_slate('logs-slate', log_type.split('=')[1]);
					} });

					$('#campaign-analysis-tabs-content').html(logsListView.el);

					$('#campaign-tabs .select').removeClass('select');
					$('.campaign-logs-tab').addClass('select');

				}, "#campaign-analysis-tabs");
			},

			/** Gets list of campaign-stats * */
			campaignStats : function()
			{
				hideTransitionBar();
				// Load Reports Template
				getTemplate("campaign-stats-chart", {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));

					// Show bar graph for campaign stats
					showBar('/core/api/campaign-stats/stats/', 'campaign-stats-chart', 'Campaigns Comparison', 'Email Stats', null);

					$(".active").removeClass("active");
					$("#workflowsmenu").addClass("active");
				}, "#content");
			},

			/**
			 * Returns campaign stats graphs data for given campaign-id.
			 * 
			 * @param id -
			 *            workflow id
			 */
			emailReports : function(id)
			{
				showTransitionBar();

				// Fetches workflows if not filled
				if ($('#campaign-reports-select').html() === null || $('#campaign-reports-select').html() === undefined)
				{
					getTemplate('campaign-analysis', {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('#content').html($(template_ui));
						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						// fill workflows
						fillSelect('campaign-reports-select', '/core/api/workflows', 'workflow', function fillCampaign()
						{
							$('#campaign-reports-select').find('option[value=' + id + ']').attr('selected', 'selected');

						}, optionsTemplate);

						getTemplate("campaign-analysis-tabs", { "id" : id }, undefined, function(template_ui)
				{
					if (!template_ui)
						return;

					// Render tabs with id
					$('#campaign-analysis-tabs').html($(template_ui));
					// Hide bulk subscribers block
					$('#subscribers-block').hide();

					initReportLibs(function()
					{
						// Load Reports Template
						getTemplate('campaign-email-reports', {}, undefined, function(template_ui1)
						{
							if (!template_ui1)
								return;
							
							$('#campaign-analysis-tabs-content').html($(template_ui1));
							
							// Set the name
							// $('#reports-campaign-name').text(workflowName);
							initChartsUI(function()
							{
								// Updates table data
								get_email_table_reports(id);

								// shows graphs by default week date range.
								showEmailGraphs(id);
							});
						}, "#campaign-analysis-tabs-content");

					});

					$(".active").removeClass("active");
					$("#workflowsmenu").addClass("active");

					$('#campaign-tabs .select').removeClass('select');
					$('.campaign-stats-tab').addClass('select');

					hideTransitionBar();

				}, "#campaign-analysis-tabs");
					}, "#content");

					

				}

				else
				{
					getTemplate("campaign-analysis-tabs", { "id" : id }, undefined, function(template_ui)
				{
					if (!template_ui)
						return;

					// Render tabs with id
					$('#campaign-analysis-tabs').html($(template_ui));
					// Hide bulk subscribers block
					$('#subscribers-block').hide();

					initReportLibs(function()
					{
						// Load Reports Template
						getTemplate('campaign-email-reports', {}, undefined, function(template_ui1)
						{
							if (!template_ui1)
								return;
							
							$('#campaign-analysis-tabs-content').html($(template_ui1));
							
							// Set the name
							// $('#reports-campaign-name').text(workflowName);
							initChartsUI(function()
							{
								// Updates table data
								get_email_table_reports(id);

								// shows graphs by default week date range.
								showEmailGraphs(id);
							});
						}, "#campaign-analysis-tabs-content");

					});

					$(".active").removeClass("active");
					$("#workflowsmenu").addClass("active");

					$('#campaign-tabs .select').removeClass('select');
					$('.campaign-stats-tab').addClass('select');

					hideTransitionBar();

				}, "#campaign-analysis-tabs");
				}
				
			},

			/** Gets list of triggers */
			triggers : function()
			{
				this.triggersCollectionView = new Base_Collection_View({

				url : '/core/api/triggers', restKey : "triggers", templateKey : "triggers", individual_tag_name : 'tr', postRenderCallback : function()
				{
				} });

				this.triggersCollectionView.collection.fetch();

				$('#content').html(this.triggersCollectionView.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Shows new trigger UI
			 */
			 triggerNewUI : function(campaign_id)
			 {
			 	$('#content').html("<div id='trigger-listener'>&nbsp;</div>");

				this.triggerModelview = new Base_Model_View({ url : 'core/api/triggers', template : "trigger-categories", isNew : true, window : 'triggers',
					/**
					 * Callback after page rendered.
					 * 
					 * @param el
					 *            el property of Backbone.js
					 */
					postRenderCallback : function(el)
					{
					//	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";

						// fill the selected campaign-id
						
						$('#campaign-id').val(campaign_id);

						initializeTriggerEventListners(campaign_id);
					}
				
				});
				
				var view = this.triggerModelview.render();

				$('#trigger-listener').html(view.el);

				$('#campaign-id').val(campaign_id);


			 },
			/**
			 * Saves new trigger. Loads jquery.chained.js to link Conditions and
			 * Value of input field.Fills campaign list using fillSelect
			 * function. When + Add is clicked in workflows, fill with selected
			 * campaign-name
			 */
			triggerAdd : function(id,trigger_type)
			{

				$('#content').html("<div id='trigger-selector'>&nbsp;</div>");

				this.triggerModelview = new Base_Model_View({ url : 'core/api/triggers', template : "trigger-add", isNew : true, window : 'triggers',
				/**
				 * Callback after page rendered.
				 * 
				 * @param el
				 *            el property of Backbone.js
				 */
				postRenderCallback : function(el)
				{
					initializeAccountSettingsListeners();

					initializeTriggerListEventListners(id,trigger_type);

					// Loads jquery.chained.min.js
					head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
					{
						var LHS, RHS;

						// Assigning elements with ids LHS
						// and RHS
						// in trigger-add.html
						LHS = $("#LHS", el);
						RHS = $("#RHS", el);

						CALL = $('#CALL', el);

						// Chaining dependencies of input
						// fields
						// with jquery.chained.js
						RHS.chained(LHS);

						// Chain Call trigger options
						CALL.chained(LHS);

					});

					var optionsTemplate = "<option value='{{id}}'{{#if is_disabled}}disabled=disabled>{{name}} (Disabled){{else}}>{{name}}{{/if}}</option>";

					
					/**
					* Shows given values when trigger selected
					*/

					// To get the input values
					var type = trigger_type;
					var campaign_id = id;
					
					setTimeout(function(){
							// Shows the Value field with given value
						$('#trigger-type', el).val(type).attr("selected", "selected").trigger('change');
					}, 100);

					
						 
						if (campaign_id)
						{
							fillSelect('campaign-select', '/core/api/workflows', 'workflow', function(id)
							{
								$('#campaign-select', el).find('option[value=' + campaign_id + ']').attr('selected', 'selected');
							}, optionsTemplate, false, el);

						}
						else
						{
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
							fillSelect('campaign-select', '/core/api/workflows', 'workflow', 'no-callback', optionsTemplate, false, el);
						}

				},

				saveCallback : function()
				{

					// To get newly added trigger in triggers list
					App_Workflows.triggersCollectionView = undefined;
				}

				});

				var view = this.triggerModelview.render();

				$('#trigger-selector').html(view.el);
			},

			/**
			 * Updates trigger.
			 * 
			 * @param id -
			 *            trigger id
			 */
			triggerEdit : function(id)
			{

				// Send to triggers if the user refreshes it directly
				if (!this.triggersCollectionView || this.triggersCollectionView.collection.length == 0)
				{
					this.navigate("triggers", { trigger : true });
					return;
				}

				// Gets trigger with respect to id
				var currentTrigger = this.triggersCollectionView.collection.get(id);

				$('#content').html("<div id='trigger-edit-selector'>&nbsp;</div>");

				var view = new Base_Model_View({ url : 'core/api/triggers', model : currentTrigger, template : "trigger-add", window : 'triggers',
					postRenderCallback : function(el)
					{
						initializeTriggersListeners();

						// Loads jquery.chained.min.js
						head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
						{
							var LHS, RHS;

							LHS = $("#LHS", el);
							RHS = $("#RHS", el);

							CALL = $('#CALL', el);

							// Chaining dependencies of input
							// fields
							// with jquery.chained.js
							RHS.chained(LHS);

							// Chain Call Trigger options
							CALL.chained(LHS);

						});

						/**
						 * Shows given values when trigger selected
						 */

						// To get the input values
						var type = currentTrigger.toJSON()['type'];

						initializeTriggerListEventListners(id,type);

						// Shows the Value field with given value
						$('#trigger-type', el).val(type).attr("selected", "selected").trigger('change');

						// Populate milestones list and make obtained milestone
						// selected.
						if (type === 'DEAL_MILESTONE_IS_CHANGED')
						{

							var trigger_deal_milestone_value = currentTrigger.toJSON()['trigger_deal_milestone'];
							populate_milestones_in_trigger($('form#addTriggerForm', el), 'trigger-deal-milestone', trigger_deal_milestone_value);

						}

						if (type == 'FORM_SUBMIT')
						{
							var trigger_form_id = currentTrigger.toJSON()['trigger_form_event'];
							var trigger_run_on_new_contacts = currentTrigger.toJSON()['trigger_run_on_new_contacts'];
							populate_forms_in_trigger($('form#addTriggerForm', el), 'trigger-form-event', trigger_form_id, trigger_run_on_new_contacts);
						}

						// Populate contact filters list and make obtained
						// contact filter
						// selected
						if (type == 'RUNS_DAILY' || type == 'RUNS_WEEKLY' || type == 'RUNS_MONTHLY')
						{
							var trigger_filter_value = currentTrigger.toJSON()['contact_filter_id'];
							populate_contact_filters_in_trigger($('form#addTriggerForm', el), 'contact-filter', trigger_filter_value);
						}

						// Calls TagsTypeAhead on focus event.
						if (type == 'TAG_IS_ADDED' || type == 'TAG_IS_DELETED')
						{

							// Show custom tags textbox
							$('#trigger-custom-tags', el).closest('div.control-group').css('display', '');

							$('.trigger-tags', el).on("focus", function(e)
							{
								e.preventDefault();
								addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
							});
						}

						if (type == 'ADD_SCORE')
							$('#trigger-custom-score', el).closest('div.control-group').css('display', '');

						if (type == 'STRIPE_CHARGE_EVENT')
						{
							var stripe_charge_event_type = currentTrigger.toJSON()['trigger_stripe_event'];
							var trigger_run_on_new_contacts = currentTrigger.toJSON()['trigger_run_on_new_contacts'];
							populate_stripe_events_in_trigger($('form#addTriggerForm', el), 'trigger-stripe-event', stripe_charge_event_type,
									trigger_run_on_new_contacts);
						}

						if (type == 'SHOPIFY_EVENT')
						{
							var shopify_event_type = currentTrigger.toJSON()['trigger_shopify_event'];
							var trigger_run_on_new_contacts = currentTrigger.toJSON()['trigger_run_on_new_contacts'];
							populate_shopify_events_in_trigger($('form#addTriggerForm', el), 'trigger-shopify-event', shopify_event_type,
									trigger_run_on_new_contacts);
						}

						if (type == 'INBOUND_MAIL_EVENT')
						{
							var new_email_trigger_run_on_new_contacts = currentTrigger.toJSON()['new_email_trigger_run_on_new_contacts'];
							populate_inbound_mail_events_in_trigger($('form#addTriggerForm', el), 'trigger-inbound-mail-event',
									new_email_trigger_run_on_new_contacts);
						}

						if (type == 'EMAIL_OPENED' || type == 'EMAIL_LINK_CLICKED' || type == 'UNSUBSCRIBED')
						{
							if (type !== 'UNSUBSCRIBED')
							{
								// Show custom tags textbox
								$('#email-tracking-type', el).closest('div.control-group').css('display', '');

								$('#email-tracking-type', el).find('option[value=' + currentTrigger.toJSON()["email_tracking_type"] + ']').attr('selected',
										'selected').trigger('change');
							}

							if (currentTrigger.toJSON()["email_tracking_type"] == "CAMPAIGNS" || type == 'UNSUBSCRIBED')
							{
								$('#email-tracking-campaign-id', el).closest('div.control-group').css('display', '');

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
								fillSelect('email-tracking-campaign-id', '/core/api/workflows', 'workflow', function fillCampaign()
								{
									$('#email-tracking-campaign-id option:first').after('<option value="0">All</option>');

									var value = currentTrigger.toJSON();
									if (value)
									{
										$('#email-tracking-campaign-id', el).find('option[value=' + value.email_tracking_campaign_id + ']').attr('selected',
												'selected');
									}

									// Remove loading image
									$('.loading', el).remove();

								}, optionsTemplate, false, el);
							}

							if (type == 'EMAIL_LINK_CLICKED')
							{
								// Show custom tags textbox
								$('#custom-link-clicked', el).closest('div.control-group').css('display', '');
							}

						}

						if (type == 'EVENT_IS_ADDED')
						{
							$('form#addTriggerForm', el).find('select#event-type').closest('div.control-group').css('display', '');

							$('#email-type', el).find('option[value=' + currentTrigger.toJSON()["email_type"] + ']').attr('selected', 'selected').trigger(
									'change');

							populate_owners_in_trigger($('form#addTriggerForm', el), 'event-owner-id', currentTrigger.toJSON()["event_owner_id"]);
						}

						// Inbound of Outbound call
						if (type == 'INBOUND_CALL' || type == 'OUTBOUND_CALL')
						{
							populate_call_trigger_options($('form#addTriggerForm', el), currentTrigger.toJSON());
						}

						var optionsTemplate = "<option value='{{id}}'{{#if is_disabled}}disabled=disabled>{{name}} (Disabled){{else}}>{{name}}{{/if}}</option>";

						/**
						 * Fills campaign select drop down with existing
						 * Campaigns and shows previous option as selected.
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
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function fillCampaign()
						{
							var value = currentTrigger.toJSON();
							if (value)
							{
								$('#campaign-select', el).find('option[value=' + value.campaign_id + ']').attr('selected', 'selected');
							}
						}, optionsTemplate, false, el);
					},

					saveCallback : function()
					{

						// To get newly added trigger in triggers list
						App_Workflows.triggersCollectionView = undefined;
					}

				});

				$("#trigger-edit-selector").html(view.render().el);
			},

			/**
			 * Saves new automation. Loads jquery.chained.js to link Conditions
			 * and Value of input field.Fills campaign list and contact filter
			 * list using fillSelect function.
			 */
			automationAdd : function()
			{
				this.automationModelview = new Base_Model_View({ url : '/core/api/automations', template : "automation-add", isNew : true,
					window : 'automations',
					/**
					 * Callback after page rendered.
					 * 
					 * @param el
					 *            el property of Backbone.js
					 */
					postRenderCallback : function(el)
					{

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
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', 'no-callback', optionsTemplate, false, el);

						fillSelect('filter-select', '/core/api/filters', 'workflow', 'no-callback', optionsTemplate, false, el);
					}

				});

				var view = this.automationModelview.render();

				$('#content').html(view.el);
			},

			/** Gets list of automations */
			automations : function()
			{
				this.automationsCollectionView = new Base_Collection_View({

				url : '/core/api/automations', restKey : "automations", templateKey : "automations", individual_tag_name : 'tr' });

				this.automationsCollectionView.collection.fetch();

				$('#content').html(this.automationsCollectionView.el);

				$(".active").removeClass("active");
				$("#workflowsmenu").addClass("active");
			},

			/**
			 * Updates automation.
			 * 
			 * @param id -
			 *            automation id
			 */
			automationEdit : function(id)
			{

				// Send to triggers if the user refreshes it directly
				if (!this.automationsCollectionView || this.automationsCollectionView.collection.length == 0)
				{
					this.navigate("automations", { trigger : true });
					return;
				}

				// Gets automation with respect to id
				var currentAutomation = this.automationsCollectionView.collection.get(id);

				var view = new Base_Model_View({ url : 'core/api/automations', model : currentAutomation, template : "automation-add", window : 'automations',
					postRenderCallback : function(el)
					{

						/**
						 * Shows given values when automation selected
						 */

						// To get the input values
						var durationType = currentAutomation.toJSON()['durationType'];

						// Shows the Value field with given value
						$('#period-type', el).val(durationType).attr("selected", "selected").trigger('change');

						var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
						/**
						 * Fills campaign select drop down with existing
						 * Campaigns and shows previous option as selected.
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
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function fillCampaign()
						{
							var value = currentAutomation.toJSON();
							if (value)
							{
								$('#campaign-select', el).find('option[value=' + value.campaign_id + ']').attr('selected', 'selected');
							}
						}, optionsTemplate, false, el);

						/**
						 * Fills contact filer select drop down with existing
						 * Contact filters and shows previous option as
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
						fillSelect('filter-select', '/core/api/filters', 'workflow', function fillContactFilter()
						{
							var value = currentAutomation.toJSON();
							if (value)
							{
								$('#filter-select', el).find('option[value=' + value.contactFilter_id + ']').attr('selected', 'selected');

							}
						}, optionsTemplate, false, el);

					},

				});

				$("#content").html(view.render().el);
			},

			/**
			 * Returns all subscribers including active, completed and removed.
			 * 
			 * @param id -
			 *            workflow id.
			 */
			allSubscribers : function(id)
			{
				// Render tabs
				getTemplate("campaign-analysis-tabs", { "id" : id }, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#campaign-analysis-tabs').html($(template_ui));
					var all_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/all-subscribers/' + id,
							'workflow-other-subscribers');
					all_subscribers_collection.collection.fetch({ success : function(collection)
					{
						if (collection.length === 0)
							fill_subscribers_slate('subscribers-slate', "all-subscribers");
					} });
					$("#campaign-analysis-tabs-content").html(all_subscribers_collection.el);
					// Hide bulk subscribers block
					$('#subscribers-block').hide();

					$('#campaign-tabs .select').removeClass('select');
					$('.campaign-subscribers-tab').addClass('select');
				}, "#campaign-analysis-tabs");
			},

			/**
			 * Returns list of subscribers having campaignStatus
			 * campaignId-ACTIVE
			 * 
			 * @param id -
			 *            workflow id.
			 */
			activeSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				this.active_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/active-subscribers/' + id,
						'workflow-active-contacts');

				this.active_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "active-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(this.active_subscribers_collection.el);

				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');

			},

			/**
			 * Returns list of completed subscribers of given campaign-id having
			 * campaignStatus campaignId-DONE
			 * 
			 * @param id -
			 *            workflow id.
			 * 
			 */
			completedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var completed_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/completed-subscribers/' + id,
						'workflow-other-subscribers');

				completed_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "completed-subscribers");
				} });
				$("#campaign-analysis-tabs-content").html(completed_subscribers_collection.el);

				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			},

			/**
			 * Returns list of subscribers removed from a campaign.
			 * 
			 * @param id -
			 *            workflow id.
			 */
			removedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var removed_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/removed-subscribers/' + id,
						'workflow-other-subscribers');

				removed_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "removed-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(removed_subscribers_collection.el);

				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			},
			unsubscribedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var unsubscribed_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/unsubscribed-subscribers/' + id,
						'workflow-other-subscribers');

				unsubscribed_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "unsubscribe-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(unsubscribed_subscribers_collection.el);

				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			},

			hardBouncedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var hardbounced_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/hardbounced-subscribers/' + id,
						'workflow-other-subscribers');

				hardbounced_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "hardbounced-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(hardbounced_subscribers_collection.el);
				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			},

			softBouncedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var softbounced_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/softbounced-subscribers/' + id,
						'workflow-other-subscribers');

				softbounced_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "softbounced-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(softbounced_subscribers_collection.el);
				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			},

			spamReportedSubscribers : function(id)
			{

				if (!this.workflow_list_view || this.workflow_list_view.collection.length == 0)
				{
					this.navigate("workflows", { trigger : true });
					return;
				}

				var spam_reported_subscribers_collection = get_campaign_subscribers_collection(id, 'core/api/workflows/spam-reported-subscribers/' + id,
						'workflow-other-subscribers');

				spam_reported_subscribers_collection.collection.fetch({ success : function(collection)
				{

					// show pad content
					if (collection.length === 0)
						fill_subscribers_slate('subscribers-slate', "spam-reported-subscribers");
				} });

				$("#campaign-analysis-tabs-content").html(spam_reported_subscribers_collection.el);
				// Hide bulk subscribers block
				$('#subscribers-block').hide();

				$('#campaign-tabs .select').removeClass('select');
				$('.campaign-subscribers-tab').addClass('select');
			} });

function initializeWorkflowsListeners()
{

}
