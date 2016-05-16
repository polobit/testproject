/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router
		.extend({

			routes : {

			/* Reports */
			"reports" : "reports", "email-reports" : "emailReportTypes", "activity-reports" : "activityReports", "activity-report-add" : "activityReportAdd",
				"activity-report-edit/:id" : "activityReportEdit", "campaign-reports" : "campaignReports","contact-reports" : "emailReports", 
				"report-add" : "reportAdd","campaign-report-add" : "campaignReportAdd", "campaign-report-edit/:id" : "campaignReportEdit",
				"report-campaign-results/:id" : "campaignReportInstantResults","report-edit/:id" : "reportEdit", "report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts",
				"report-funnel/:tags" : "showFunnelReport", "report-growth/:tags" : "showGrowthReport", "report-ratio/:tag1/:tag2" : "showRatioReport","report-sales":"showrevenuegraph","report-deals":"showIncomingDeals","report-calls/:type" : "showCallsReport","user-reports": "showUserReports",
				"report-lossReason":"showDealsLossReason","reports-wonDeals":"showDealsWonChart","rep-reports":"showRepPerformance","report-comparison":"showComparisonReport" },


			/**
			 * Shows reports categories 
			 */
			reports : function()
			{
				report_utility.loadReportsTemplate(function(){
				var tab_active=$('.nav-tabs li:first-child>a').attr('href').substring(1);
				var tav_inner = $('.nav-tabs li li:first-child>a').attr('href').substring(1);
				$.each($('.tab-content .tab-pane'),function()
				{
					if($(this).attr('id')==tav_inner)
					{
						var route=$('a',this).attr('href').substring(1);
						_agile_set_prefs("reports_tab",tab_active);
						$('#reports-tab-container a[href="#'+tab_active+'"]').parent().addClass('report-selected');
						Backbone.history.loadUrl(route);
						return;
					}
				});
			});
			},

			/**
			 * Shows email-reports categories
			 */
			emailReportTypes : function()
			{
				getTemplate('email-report-categories', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));

					$(".active").removeClass("active");
					$("#reportsmenu").addClass("active");

				}, "#content");

			},

			/** shows list of activity reports added * */
			activityReports : function()
			{
			
				this.activityReports = new Base_Collection_View({ url : '/core/api/activity-reports', restKey : "activityReports",
					templateKey : "activity-report", individual_tag_name : 'tr', postRenderCallback : function()
					{
						initializeActivityReportsListeners();
					} });

				this.activityReports.collection.fetch();
				var b=this.activityReports;
					report_utility.loadReportsTemplate(function(){
				$(".reports-Container").html(getRandomLoadingImg());
				$(".reports-Container").html(b.render().el);

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				});
			},

			/** shows list of campaign reports added * */
			campaignReports : function()
			{
				$("#content").html("<div id='reports-listerners-container'></div>");

				this.reports = new Base_Collection_View({ url : '/core/api/campaignReports', restKey : "reports", templateKey : "report-campaign", individual_tag_name : 'tr',
					postRenderCallback : function()
					{
						initializeReportsListeners();
					} });



				this.reports.collection.fetch();
				$("#reports-listerners-container").html(this.reports.render().el);
			},

			/**
			 * adds new activity report with various condtion like user, type of
			 * activity ,user email ,frequency and advanced conditions
			 */
			activityReportAdd : function()
			{

				if (!tight_acl.checkPermission('REPORT'))
					return;

				if (!tight_acl.checkPermission('ACTIVITY'))
					return;

				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());
				count = 0;

				var activity_report_add = new Base_Model_View({ url : 'core/api/activity-reports', template : "activity-reports-add",
					window : "activity-reports", isNew : true, postRenderCallback : function(el)
					{

						initializeActivityReportsListeners();
						initializeReportsListeners();
						if (count != 0)
						 return;

						report_utility.load_activities(el);

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				activity_report_add.render();

			},

			/**
			 * adds new campaign report with various condtion like user,
			 * campaign ,user email ,frequency and advanced conditions
			 */
			campaignReportAdd : function()
			{

				count = 0;

				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());

				SEARCHABLE_CONTACT_CUSTOM_FIELDS = undefined;
				var report_add = new Report_Filters_Event_View({ url : 'core/api/campaignReports', template : "reports-campaign-add", window : "campaign-reports", isNew : true,
					postRenderCallback : function(el)
					{
						initializeReportsListeners();
						var optionsTemplate = "<option value='{{id}}'{{#if is_disabled}}disabled=disabled>{{name}} (Disabled){{else}}>{{name}}{{/if}}</option>";
						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function(id)
							{
								//$('#campaign-select', el).find('option[value=' + campaign_id + ']').attr('selected', 'selected');
							}, optionsTemplate, false, el);
						// Counter to set when script is loaded. Used to avoid
						// flash in
						// page
						if (count != 0)
							return;

						report_utility.load_contacts(el, count);

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_add.render();

			},

			/**
			 * Edits a report by de-serializing the existing report into its
			 * saving form, from there it can be edited and saved. Populates
			 * users and loads agile.jquery.chained.min.js to match the
			 * conditions with the values of input fields.
			 */
			campaignReportEdit : function(id)
			{
				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());

				// Counter to set when script is loaded. Used to avoid flash in
				// page
				count = 0;

				// Gets a report to edit, from reports collection, based on id
				var report = this.reports.collection.get(id);
				var report_model = new Report_Filters_Event_View({
					url : 'core/api/campaignReports',
					change : false,
					model : report,
					template : "reports-campaign-add",
					window : "campaign-reports",
					id : "reports-listerners-container",
					postRenderCallback : function(el)
					{
						initializeReportsListeners();

						if (count != 0)
							return;

						var optionsTemplate = "<option value='{{id}}'{{#if is_disabled}}disabled=disabled>{{name}} (Disabled){{else}}>{{name}}{{/if}}</option>";


						fillSelect('campaign-select', '/core/api/workflows', 'workflow', function fillCampaign()
						{
							var value = report.toJSON();
							if (value)
							{
								$('#campaign-select', el).find('option[value=' + value.campaignId + ']').attr('selected', 'selected');
							}
						}, optionsTemplate, false, el);

						// Gets a report to edit, from reports collection, based
						// on id

						fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
						{

							loadActivityReportLibs(function()
							{
								report_utility.edit_contacts(el, report, true);
							});
	

						}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

						head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', LIB_PATH + 'lib/jquery.multi-select.js',
								function()
								{

									chainFiltersForContact(el, report.toJSON(), function()
									{
										++count
										if (count > 1)
											deserialize_multiselect(report.toJSON(), el);
									});

									scramble_input_names($(el).find('div#report-settings'));
								});

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_model.render();

			},


			/**
			 * Edits a report by de-serializing the existing report into its
			 * saving form, from there it can be edited and saved. Populates
			 * users and loads agile.jquery.chained.min.js to match the
			 * conditions with the values of input fields.
			 */
			activityReportEdit : function(id)
			{

				if (!tight_acl.checkPermission('REPORT'))
					return;

				if (!tight_acl.checkPermission('ACTIVITY'))
					return;

				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());

				// Counter to set when script is loaded. Used to avoid flash in
				// page
				count = 0;

				// If reports view is not defined, navigates to reports
				if (!this.activityReports || !this.activityReports.collection || this.activityReports.collection.length == 0 || this.activityReports.collection
						.get(id) == null)
				{
					this.navigate("activity-reports", { trigger : true });
					return;
				}

				// Gets a report to edit, from reports collection, based on id
				var activityReport = this.activityReports.collection.get(id);
				var report_model = new Base_Model_View({
					url : 'core/api/activity-reports',
					change : false,
					model : activityReport,
					template : "activity-reports-add",
					window : "activity-reports",
					postRenderCallback : function(el)
					{
						initializeActivityReportsListeners();
						initializeReportsListeners();
						if (count != 0)
							return;

						fillSelect("users-list", '/core/api/users', 'domainUser', function()
						{
							var json = activityReport.toJSON();
							var time = json.activity_start_time;

							var frequency = json.frequency;

							deserializeForm(json, $('#activityReportsForm', el));

							head.js(LIB_PATH + 'lib/jquery.multi-select.js', CSS_PATH + 'css/businesshours/jquerytimepicker.css',
									LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
									{

										report_utility.edit_activities(el, json);

									});
						}, '<option value="{{id}}">{{name}}</option>', true, el);

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_model.render();

			},

			/**
			 * Shows list of reports, with an option to add new report
			 */
			emailReports : function()
			{
				
				//$("#content").html("<div id='reports-listerners-container'></div>");
				this.reports = new Base_Collection_View({ url : '/core/api/reports', restKey : "reports", templateKey : "report", individual_tag_name : 'tr',
					postRenderCallback : function()
					{
						initializeReportsListeners();
					} });

				this.reports.collection.fetch();
				var a=this.reports;
				report_utility.loadReportsTemplate(function(){
				$(".reports-Container").html(a.render().el);
			});

			},

			/**
			 * Loads a template to add new report. Populates users drop down
			 * list and loads agile.jquery.chained.min.js to chain conditions
			 * and values of input fields, from postRenderCallback of its
			 * Base_Model_View.
			 */
			reportAdd : function()
			{
				count = 0;

				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());

				SEARCHABLE_CONTACT_CUSTOM_FIELDS = undefined;
				var report_add = new Report_Filters_Event_View({ url : 'core/api/reports', template : "reports-add", window : "contact-reports", isNew : true,
					postRenderCallback : function(el)
					{
						initializeReportsListeners();
						// Counter to set when script is loaded. Used to avoid
						// flash in
						// page
						if (count != 0)
							return;

						report_utility.load_contacts(el, count);

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_add.render();
			},

			/**
			 * Edits a report by de-serializing the existing report into its
			 * saving form, from there it can be edited and saved. Populates
			 * users and loads agile.jquery.chained.min.js to match the
			 * conditions with the values of input fields.
			 */
			reportEdit : function(id)
			{
				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());

				// Counter to set when script is loaded. Used to avoid flash in
				// page
				count = 0;

				// Gets a report to edit, from reports collection, based on id
				var report = this.reports.collection.get(id);
				var report_model = new Report_Filters_Event_View({
					url : 'core/api/reports',
					change : false,
					model : report,
					template : "reports-add",
					window : "contact-reports",
					id : "reports-listerners-container",
					postRenderCallback : function(el)
					{
						initializeReportsListeners();

						if (count != 0)
							return;

						// Gets a report to edit, from reports collection, based
						// on id
						fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
						{

							loadActivityReportLibs(function()
							{
								report_utility.edit_contacts(el, report);
							});
	

						}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

						head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', LIB_PATH + 'lib/jquery.multi-select.js',
								function()
								{

									chainFiltersForContact(el, report.toJSON(), function()
									{
										++count
										if (count > 1)
											deserialize_multiselect(report.toJSON(), el);
									});

									scramble_input_names($(el).find('div#report-settings'));
								});

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				report_model.render();

			},

			/**
			 * Shows report results. It gets report object from reports list, if
			 * it is list is not available then it fetches report based on
			 * report id, send request to process results, and shows them
			 */
			reportInstantResults : function(id, report)
			{
				report_utility.loadReportsTemplate(function(){
				if (!report)
				{
					// If reports view is not defined, navigates to reports
					if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
					{

						// Shows loading while report is being fetched
						$(".reports-Container").html(getRandomLoadingImg());
						var reportModel = new Backbone.Model();
						reportModel.url = "core/api/reports/" + id;
						reportModel.fetch({ success : function(data)
						{
							// Fetches reports and call to show instant results
							App_Reports.reportInstantResults(id, data.toJSON());
						} });
						return;

					}
					else
					{
						report = this.reports.collection.get(id).toJSON();
					}

				}

				// Stores in global variable, as it is required to build custom
				// table
				// headings
				REPORT = report;

				var report_results_view = new Base_Collection_View({ url : "core/api/reports/show-results/" + id, modelData : report,
					templateKey : "report-search", individual_tag_name : 'tr', cursor : true, sort_collection : false, page_size : 15, });// Collection
				var _that = this;
				
				$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=CONTACT", function(customDatefields)
				{
					// Report built with custom table, as reports should be
					// shown with
					// custom order selected by user
					report_results_view.appendItem = function(base_model)
					{
						reportsContactTableView(base_model, customDatefields, this);
					};

					report_results_view.collection.fetch();
				});
				$(".reports-Container").html(report_results_view.render().el);
				});
			},

			/**
			 * Shows report results. It gets report object from reports list, if
			 * it is list is not available then it fetches report based on
			 * report id, send request to process results, and shows them
			 */
			campaignReportInstantResults : function(id, report)
			{	
				

				var report_results_view = new Base_Model_View({ url : "core/api/campaignReports/show-results/" + id, template : "campaign-report-via-email"});// Collection
				var _that = this;
				$("#content").html(report_results_view.render().el);
			},


			/**
			 * Returns Funnel reports based on tags
			 * 
			 * @param tags -
			 *            workflow id
			 */
			showFunnelReport : function(tags)
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
				{
					getTemplate("report-funnel", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;

						// Load Reports Template
						$('.reports-Container').html($(template_ui));
						
						// Set the name
						$('#reports-funnel-tags').text(tags);

						initFunnelCharts(function()
						{
							showFunnelGraphs(tags);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");

						
						highlightDatepickerOption();

					}, ".reports-Container");

				});
				});
			},

			/**
			 * Returns growth report based on the tags
			 * 
			 * @param tags -
			 *            comma separated tags
			 */
			showGrowthReport : function(tags)
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()

				{

					// Load Reports Template
					getTemplate("report-growth", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('.reports-Container').html($(template_ui));

						// Set the name
						$('#reports-growth-tags').text(tags);

						initFunnelCharts(function()
						{
							showGrowthGraphs(tags);
						});

					}, ".reports-Container");

					
				});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				highlightDatepickerOption();
			});
			},
			
			
				
		/**
			 * Returns calls report
			 * 
			 * @param tags -
			 *            comma separated tags
			 */
			showCallsReport : function(reportType)
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()

				{
					
					/** Default dropdown value to be considered*/ 
					var graphOn='number-of-calls';
					
					/**Default template id to be loaded*/
					var templateId="report-calls";
					
					/**when it is a call outcome selection*/
					if(reportType == 'pie-graph'){
						//templateId="report-calls-piechart";
						templateId=templateId+"-piechart";
						
					}
					if(reportType == 'timebased')
						templateId=templateId+"-timeGraph";
					
					getTemplate(templateId, {}, undefined, function(template_ui){
						if(!template_ui)
							  return;

						// Load Reports Template
						$('.reports-Container').html($(template_ui));
					
					/**Reinitialize the variable which holds the user preference abt report type*/
	               if(reportType == 'average-calls'){
						graphOn='average-calls';
						$('select[id="typeCall"]').find('option[value="average-calls"]').attr("selected",true);
						
					}else{
						$('select[id="typeCall"]').find('option[value="number-of-calls"]').attr("selected",true);
					}
	               
	               initReportsForCalls(function()
							{
	            	   
	            	   /** Get date range selected for every call back call */
	            	   
	            		var options = "?";

						var range = $('#range').html().split("-");
						var start_time=new Date(range[0]).getTime() / 1000;

						var end_value = $.trim(range[1]);

						
						if (end_value)
							end_value = end_value + " 23:59:59";

						var end_time=new Date(end_value).getTime() / 1000;
						options += ("start-date=" + start_time + "&end-date=" + end_time);
						
						var url='core/api/portlets/calls-per-person/' + options;
						if(reportType == 'timebased'){
										if ($('#frequency').length > 0)
									{
									// Get Frequency
									var frequency = $("#frequency").val();
									options += ("&frequency=" + frequency);
								}
							url='core/api/reports/calls-time-based/' + options;
						}
						graphOn=$("#typeCall option:selected").val();
					    
					    var userDropDown=$('#users option:selected').val();
					    
					    if(userDropDown != undefined){
					    	if(userDropDown != 'All' && userDropDown != ""){
								var usersUrl=url;
								url=url+'&user=["'+userDropDown+'"]';
							}
					    	
					    }
					     report_utility.call_reports(url,reportType,graphOn);
					    
							
							});

					}, ".reports-Container");
				});
				});
			},
			
			/**
			 * Shows User Reports
			 */
			showUserReports : function()

			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
						{
					getTemplate("report-revenue-user", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	

						initUserReports(function()
								{
							salesReportGraphForUserReports();
							showLossReasonGraphForUserReports();
								
							var callReportUrl='core/api/portlets/calls-per-person/' + getSelectedDates();
							
							if ($('#owner').length > 0)
							{
								if ($("#owner").val() != "" && $("#owner").val() != "All Owners"){
								var user=$("#owner").val();
								callReportUrl=callReportUrl+'&user=["'+user+'"]';
							}
							}
							
							report_utility.user_reports(callReportUrl);
							
								});
						
						
				}, ".reports-Container");

						});
			});
			},



			/**
			 * Returns Ratio Graphs with two tag1
			 * 
			 * @param id -
			 *            workflow id
			 */
			showRatioReport : function(tag1, tag2)
			{

				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()

				{

					// Load Reports Template
					getTemplate("report-ratio", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('.reports-Container').html($(template_ui));

						// Set the name
						$('#reports-ratio-tags').text(tag1 + " versus " + tag2);

						initFunnelCharts(function()
						{
							showRatioGraphs(tag1, tag2);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");

						highlightDatepickerOption();

					}, ".reports-Container");

				});
				});

			},

			/**
			 * Shows reports charts of growth or funnel
			 */
			reportCharts : function(type)
			{
				report_utility.loadReportsTemplate(function(){
				var template_name = "report-growth";

				if (type)
					template_name = "report-" + type + "-form";

				//$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate(template_name, {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;

							var el = $(template_ui);
				$(".reports-Container").html(el);
				initializeChartReportsListeners();

				if (type && (type == 'growth' || type == 'funnel'))
				{
					setup_tags_typeahead();
					return;
				}
				$.each($("[id=tags-reports]", el), function(i, element)
				{
					console.log(element);
					addTagsDefaultTypeahead(element);
				});

				}, ".reports-Container");
			});
			},

			showIncomingDeals : function(){
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
						{

							// Load Reports Template
						getTemplate("report-deals", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	


							initFunnelCharts(function()
							{
								showDealsGrowthReport();
							});
						}, ".reports-Container");
					});
			});
			},

			showDealsLossReason : function()
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
				{

					// Load Reports Template
				getTemplate("report-DealsLoss", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	

					initSalesCharts(function()
							{
						showLossReasonGraphs();
							});

					$(".active").removeClass("active");
					$("#reportsmenu").addClass("active");
				}, ".reports-Container");
			});
			});
			},

			showDealsWonChart : function()
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
			initReportLibs(function()
				{

					// Load Reports Template
				getTemplate("report-DealsWon", {}, undefined, function(template_ui){

					if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	

					initSalesCharts(function()
							{
						showWonPieChart();
							});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
				}, ".reports-Container");
			  });	
		});
},

			showrevenuegraph : function()
			{
						hideTransitionBar();
						report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
				{
							// Load Reports Template
						getTemplate("report-sales", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	
							// Set the name

							initSalesCharts(function()
							{
								showsalesReportGraphs();
					});
						}, ".reports-Container");
					});
			});
			},

			showComparisonReport : function()
			{
					hideTransitionBar();
					report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
				{
							// Load Reports Template
						getTemplate("report-comparison", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	
							// Set the name

							initComparisonReports(function()
							{
								showComparisonReportGraph();
					});
						}, ".reports-Container");
					});
			});
			},
			
			showRepPerformance : function()
			{
				hideTransitionBar();
				report_utility.loadReportsTemplate(function(){
				initReportLibs(function()
				{
							// Load Reports Template
						getTemplate("report-user-performance", {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('.reports-Container').html($(template_ui));	
							// Set the name

						initRepReports(function()
							{
								showRepPerformanceReport();
								
					});
						}, ".reports-Container");
					});
			});
			},
			
});

var count = 0;
