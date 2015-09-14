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
				"activity-report-edit/:id" : "activityReportEdit", "contact-reports" : "emailReports", "report-add" : "reportAdd",
				"report-edit/:id" : "reportEdit", "report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts",
				"report-funnel/:tags" : "showFunnelReport", "report-growth/:tags" : "showGrowthReport", "report-ratio/:tag1/:tag2" : "showRatioReport" },

			/**
			 * Shows reports categories
			 */
			reports : function()
			{
				if (!tight_acl.checkPermission('REPORT'))
					return;

				$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate('report-categories', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#reports-listerners-container').html($(template_ui));

				initializeReportsListeners();
				hideTransitionBar();
				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");

					$('[data-toggle="tooltip"]').tooltip();

				}, "#reports-listerners-container");

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
				$("#content").html("<div id='reports-listerners-container'></div>");
				$("#reports-listerners-container").html(getRandomLoadingImg());
				this.activityReports = new Base_Collection_View({ url : '/core/api/activity-reports', restKey : "activityReports",
					templateKey : "activity-report", individual_tag_name : 'tr', postRenderCallback : function()
					{
						initializeActivityReportsListeners();
					} });

				this.activityReports.collection.fetch();
				$("#reports-listerners-container").html(this.activityReports.render().el);

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
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
						// if (count != 0)
						// return;

						report_utility.load_activities(el);

					} });

				$("#reports-listerners-container").html(getRandomLoadingImg());
				activity_report_add.render();

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
				$("#content").html("<div id='reports-listerners-container'></div>");
				this.reports = new Base_Collection_View({ url : '/core/api/reports', restKey : "reports", templateKey : "report", individual_tag_name : 'tr',
					postRenderCallback : function()
					{
						initializeReportsListeners();
					} });

				this.reports.collection.fetch();
				$("#reports-listerners-container").html(this.reports.render().el);

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
				var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "contact-reports", isNew : true,
					postRenderCallback : function(el)
					{
						initializeContactFiltersListeners();
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
				var report_model = new Base_Model_View({
					url : 'core/api/reports',
					change : false,
					model : report,
					template : "reports-add",
					window : "contact-reports",
					id : "reports-listerners-container",
					postRenderCallback : function(el)
					{
						initializeContactFiltersListeners();
						initializeReportsListeners();

						if (count != 0)
							return;

							var json = activityReport.toJSON();
							var time=json.activity_start_time;
							
							
							deserializeForm(json,$('#activityReportsForm',el));
						// Gets a report to edit, from reports collection, based
						// on id
						fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
						{

							loadActivityReportLibs(function()
							{
								report_utility.edit_contacts(el, report);
							});
	
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

				if (!report)
				{
					// If reports view is not defined, navigates to reports
					if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
					{

						// Shows loading while report is being fetched
						$("#content").html(getRandomLoadingImg());
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

				initReportLibs(function()
				{
					getTemplate("report-funnel", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;

						// Load Reports Template
						$('#content').html($(template_ui));
						
						// Set the name
						$('#reports-funnel-tags').text(tags);

						initFunnelCharts(function()
						{
							showFunnelGraphs(tags);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");

					}, "#content");

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

				initReportLibs(function()
				{

					// Load Reports Template
					getTemplate("report-growth", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('#content').html($(template_ui));

						// Set the name
						$('#reports-growth-tags').text(tags);

						initFunnelCharts(function()
						{
							showGrowthGraphs(tags);
						});

					}, "#content");

				});

				$(".active").removeClass("active");
				$("#reportsmenu").addClass("active");
			},

			/**
			 * Returns Ratio Graphs with two tag1
			 * 
			 * @param id -
			 *            workflow id
			 */
			showRatioReport : function(tag1, tag2)
			{

				initReportLibs(function()
				{

					// Load Reports Template
					getTemplate("report-ratio", {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('#content').html($(template_ui));

						// Set the name
						$('#reports-ratio-tags').text(tag1 + " versus " + tag2);

						initFunnelCharts(function()
						{
							showRatioGraphs(tag1, tag2);
						});

						$(".active").removeClass("active");
						$("#reportsmenu").addClass("active");

					}, "#content");

				});

			},

			/**
			 * Shows reports charts of growth or funnel
			 */
			reportCharts : function(type)
			{
				var template_name = "report-growth";

				if (type)
					template_name = "report-" + type + "-form";

				$("#content").html("<div id='reports-listerners-container'></div>");
				getTemplate(template_name, {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;

					var el = $(template_ui);
					$("#reports-listerners-container").html(el);
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

				}, "#reports-listerners-container");
			}
});

var count = 0;
