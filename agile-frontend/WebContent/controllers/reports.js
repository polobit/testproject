/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router.extend({

	routes : {

	/* Reports */
	"reports" : "reports", "email-reports" : "emailReportTypes","activity-reports":"activityReports", "activity-report-add" : "activityReportAdd", "activity-report-edit/:id" : "activityReportEdit",
	"acivity-report-results/:id" : "activityReportInstantResults", "contact-reports" : "emailReports", "report-add" : "reportAdd", "report-edit/:id" : "reportEdit",
		"report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts", "report-funnel/:tags" : "showFunnelReport",
		"report-growth/:tags" : "showGrowthReport", "report-cohorts/:tag1/:tag2" : "showCohortsReport", "report-ratio/:tag1/:tag2" : "showRatioReport" },

	/**
	 * Shows reports categories
	 */
	reports : function()
	{
		if(!tight_acl.checkPermission('REPORT'))
			return;
		
		head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function()
				{
					$("#content").html(getTemplate('report-categories', {}));
					$(".active").removeClass("active");
					$("#reportsmenu").addClass("active");
				});
	},

	/**
	 * Shows email-reports categories
	 */
	emailReportTypes : function()
	{
		$("#content").html(getTemplate('email-report-categories', {}));
		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},
	
	activityReports : function()
	{
		$("#content").html(getRandomLoadingImg());
		this.activityReports = new Base_Collection_View({ url : '/core/api/activity-reports', restKey : "activityReports", templateKey : "activity-report", individual_tag_name : 'tr'});
		this.activityReports.collection.fetch();
		$("#content").html(this.activityReports.render().el);

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},
	
	activityReportAdd : function(){
		
		if(!tight_acl.checkPermission('REPORT'))
			return;
		
		if(!tight_acl.checkPermission('ACTIVITY'))
			return;
		
		$("#content").html(getRandomLoadingImg());
		
		var count = 0;
		var activity_report_add = new Base_Model_View({ url : 'core/api/activity-reports', template : "activity-reports-add", window : "activity-reports", isNew : true,
			postRenderCallback : function(el)
			{
				if (count != 0)
					return;
				// Fills owner select element
				fillSelect("users-list", '/core/api/users', 'domainUser', function()
						{
							head.js(LIB_PATH + 'lib/jquery.multi-select.js',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
							{
								$('#activity-type-list, #users-list',el).multiSelect();
								$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
								$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
								++count;
								if (count > 0)
									$("#content").html(el);
									
									$('.activity_time_timepicker').timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
									$(".activity_time_timepicker").val("09:00");
									$("#report_timezone").val(ACCOUNT_PREFS.timezone);
							});
						}, '<option value="{{id}}">{{name}}</option>', true, el);
			} });

		$("#content").html(getRandomLoadingImg());
		activity_report_add.render();

	},
	
	/**
	 * Edits a report by de-serializing the existing report into its saving
	 * form, from there it can be edited and saved. Populates users and loads
	 * agile.jquery.chained.min.js to match the conditions with the values of
	 * input fields.
	 */
	activityReportEdit : function(id)
	{
		if(!tight_acl.checkPermission('REPORT'))
			return;
		
		if(!tight_acl.checkPermission('ACTIVITY'))
			return;
		
		$("#content").html(getRandomLoadingImg());
		// Counter to set when script is loaded. Used to avoid flash in page
		var count = 0;

		// If reports view is not defined, navigates to reports
		if (!this.activityReports || !this.activityReports.collection || this.activityReports.collection.length == 0 || this.activityReports.collection.get(id) == null)
		{
			this.navigate("activity-reports", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var activityReport = this.activityReports.collection.get(id);
		var report_model = new Base_Model_View({ url : 'core/api/activity-reports', change : false, model : activityReport, template : "activity-reports-add", window : "activity-reports",
		postRenderCallback : function(el)
			{
				if (count != 0)
					return;
				fillSelect("users-list", '/core/api/users', 'domainUser', function()
						{
							var json = activityReport.toJSON();
							var time=json.activity_start_time;
							
							var frequency=json.frequency;
							
							deserializeForm(json,$('#activityReportsForm',el));
							
							
							head.js(LIB_PATH + 'lib/jquery.multi-select.js',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
							{

								$('#activity-type-list, #users-list',el).multiSelect();
								$('#ms-activity-type-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
								$('#ms-users-list .ms-selection', el).children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
								
								$("#content").html(el)
								$.each(json.user_ids,function(i,user_id){
									$('#users-list').multiSelect('select',user_id);
									console.log('select user---',user_id);
								});
								$.each(json.activity,function(i,activity){
									$('#activity-type-list').multiSelect('select',activity);
									console.log('select activity-------',activity);
								});
								$('#ms-activity-type-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "activity").attr("id", "activity_type");
								$('#ms-users-list .ms-selection').children('ul').addClass('multiSelect').attr("name", "user_ids").attr("id", "user_ids");
								
								if(json.report_timezone==null){
									$("#report_timezone").val(ACCOUNT_PREFS.timezone);
								}
								// based on frequency we are showing and hideing the time and date and month fields
								if (frequency == "DAILY")
								{
									$("#activity_report_weekday").css("display", "none");
									$("#activity_report_day").css("display", "none");
									$("#activity_report_time").css("display", "block");

								}
								else if (frequency == "WEEKLY")
								{
									$("#activity_report_day").css("display", "none");
									$("#activity_report_time").css("display", "block");
									$("#activity_report_weekday").css("display", "block");

								}
								else if (frequency == "MONTHLY")
								{
									$("#activity_report_weekday").css("display", "none");
									$("#activity_report_time").css("display", "block");
									$("#activity_report_day").css("display", "block");

								}
								$('.activity_time_timepicker').timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
								
							});
						}, '<option value="{{id}}">{{name}}</option>', true, el);
				
			} });

		$("#content").html(getRandomLoadingImg());
		report_model.render();

	},

	
	/**
	 * Shows list of reports, with an option to add new report
	 */
	emailReports : function()
	{
	
			this.reports = new Base_Collection_View({ url : '/core/api/reports', restKey : "reports", templateKey : "report", individual_tag_name : 'tr' });

			this.reports.collection.fetch();
			$("#content").html(this.reports.render().el);

			$(".active").removeClass("active");
			$("#reportsmenu").addClass("active");
	},

	/**
	 * Loads a template to add new report. Populates users drop down list and
	 * loads agile.jquery.chained.min.js to chain conditions and values of input
	 * fields, from postRenderCallback of its Base_Model_View.
	 */
	reportAdd : function()
	{
		var count = 0;
		$("#content").html(getRandomLoadingImg());
		SEARCHABLE_CONTACT_CUSTOM_FIELDS = undefined;
		var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "contact-reports", isNew : true,
			postRenderCallback : function(el)
			{
				// Counter to set when script is loaded. Used to avoid flash in
				// page
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js' ,CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
					{

						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						++count;
						if (count > 1)
							$("#content").html(el);
						$('.report_time_timepicker').timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
						$(".report_time_timepicker").val("09:00");
						$("#report_timezone").val(ACCOUNT_PREFS.timezone);
					});
				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					scramble_input_names($(el).find('div#report-settings'));
					chainFilters(el, undefined, function()
					{
						++count;
						if (count > 1)
							$("#content").html(el)
					});
				});

			} });

		$("#content").html(getRandomLoadingImg());
		report_add.render();

	},

	/**
	 * Edits a report by de-serializing the existing report into its saving
	 * form, from there it can be edited and saved. Populates users and loads
	 * agile.jquery.chained.min.js to match the conditions with the values of
	 * input fields.
	 */
	reportEdit : function(id)
	{
		$("#content").html(getRandomLoadingImg());
		// Counter to set when script is loaded. Used to avoid flash in page
		var count = 0;

		// If reports view is not defined, navigates to reports
		if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
		{
			this.navigate("reports", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var report = this.reports.collection.get(id);
		var report_model = new Base_Model_View({ url : 'core/api/reports', change : false, model : report, template : "reports-add", window : "contact-reports",
			postRenderCallback : function(el)
			{
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js',CSS_PATH + 'css/businesshours/jquerytimepicker.css', LIB_PATH + 'lib/businesshours/jquerytimepicker.js', function()
					{
						console.log(el);
						console.log(report.toJSON());
						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });
						++count;
						if (count > 1)
							deserialize_multiselect(report.toJSON(), el);
						
						setTimeout(function() {
							$('.report_time_timepicker').timepicker({ 'timeFormat': 'H:i ' ,'step': 30});
							
							var frequency=report.toJSON().duration;
							
							if (frequency == "DAILY")
							{
								$("#contact_report_weekday").css("display", "none");
								$("#contact_report_day").css("display", "none");
								$("#contact_report_time").css("display", "block");

							}
							else if (frequency == "WEEKLY")
							{
								$("#contact_report_day").css("display", "none");
								$("#contact_report_time").css("display", "block");
								$("#contact_report_weekday").css("display", "block");

							}
							else if (frequency == "MONTHLY")
							{
								$("#contact_report_weekday").css("display", "none");
								$("#contact_report_time").css("display", "block");
								$("#contact_report_day").css("display", "block");

							}
							
							if(report.toJSON().report_timezone==null){
								$("#report_timezone").val(ACCOUNT_PREFS.timezone);
							}
						}, 1000);
					});

				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
				{

					chainFilters(el, report.toJSON(), function()
					{
						++count
						if (count > 1)
							deserialize_multiselect(report.toJSON(), el);
					});
					scramble_input_names($(el).find('div#report-settings'));
				});

			} });

		$("#content").html(getRandomLoadingImg());
		report_model.render();

	},

	/**
	 * Shows report results. It gets report object from reports list, if it is
	 * list is not available then it fetches report based on report id, send
	 * request to process results, and shows them
	 */
	reportInstantResults : function(id, report)
	{

		if (!report)
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

		// Stores in global variable, as it is required to build custom table
		// headings
		REPORT = report;

		var report_results_view = new Base_Collection_View({ url : "core/api/reports/show-results/" + id, modelData : report, templateKey : "report-search",
			individual_tag_name : 'tr', cursor : true, sort_collection : false, page_size : 15, });// Collection
		var _that = this;
		$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=CONTACT", function(customDatefields)
				{
					// Report built with custom table, as reports should be shown with
					// custom order selected by user
					report_results_view.appendItem = function(base_model){
						reportsContactTableView(base_model,customDatefields,this);
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

		head.load(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css",  function()
		{
			// Load Reports Template
			$("#content").html(getTemplate("report-funnel", {}));

			// Set the name
			$('#reports-funnel-tags').text(tags);

			initFunnelCharts(function()
			{
				showFunnelGraphs(tags);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Returns growth report based on the tags
	 * 
	 * @param tags -
	 *            comma separated tags
	 */
	showGrowthReport : function(tags)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js',  CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-growth", {}));

			// Set the name
			$('#reports-growth-tags').text(tags);

			initFunnelCharts(function()
			{
				showGrowthGraphs(tags);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Returns Cohorts Graphs with two tag1
	 * 
	 * @param id -
	 *            workflow id
	 */
	showCohortsReport : function(tag1, tag2)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-cohorts", {}));

			// Set the name
			$('#reports-cohorts-tags').text(tag1 + " versus " + tag2);

			initFunnelCharts(function()
			{
				showCohortsGraphs(tag1, tag2);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},
	/**
	 * Returns Cohorts Graphs with two tag1
	 * 
	 * @param id -
	 *            workflow id
	 */
	showRatioReport : function(tag1, tag2)
	{

		head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH + 'lib/date-range-picker.js', CSS_PATH + "css/misc/date-picker.css", function()
		{

			// Load Reports Template
			$("#content").html(getTemplate("report-ratio", {}));

			// Set the name
			$('#reports-ratio-tags').text(tag1 + " versus " + tag2);

			initFunnelCharts(function()
			{
				showRatioGraphs(tag1, tag2);
			});
		});

		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
	},

	/**
	 * Shows reports charts of growth or funnel
	 */
	reportCharts : function(type)
	{
		var el = "";
		if (type)
			el = $(getTemplate("report-" + type + "-form", {}));
		else
			el = $(getTemplate("report-growth", {}));

		$("#content").html(el);

		if (type && (type == 'growth' || type == 'funnel'))
		{
			setup_tags_typeahead();
			return;
		}
		$.each($("#tags-reports", el), function(i, element)
		{
			console.log(element);
			addTagsDefaultTypeahead(element);
		});
	}

});
