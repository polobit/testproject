/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router.extend({

	routes : {

	/* Reports */
	"reports" : "reports", "email-reports" : "emailReports", "report-add" : "reportAdd", "report-edit/:id" : "reportEdit",
		"report-results/:id" : "reportInstantResults", "report-charts/:type" : "reportCharts", "report-funnel/:tags" : "showFunnelReport",
		"report-growth/:tags" : "showGrowthReport", "report-cohorts/:tag1/:tag2" : "showCohortsReport", "report-ratio/:tag1/:tag2" : "showRatioReport" },

	/**
	 * Shows reports categories
	 */
	reports : function()
	{
		$("#content").html(getTemplate('report-categories', {}));
		$(".active").removeClass("active");
		$("#reportsmenu").addClass("active");
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
		CONTACT_CUSTOM_FIELDS = undefined;
		var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "email-reports", isNew : true,
			postRenderCallback : function(el)
			{
				// Counter to set when script is loaded. Used to avoid flash in
				// page
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						++count;
						if (count > 1)
							$("#content").html(el)
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
		var report_model = new Base_Model_View({ url : 'core/api/reports', change : false, model : report, template : "reports-add", window : "email-reports",
			postRenderCallback : function(el)
			{
				if (count != 0)
					return;
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=CONTACT", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{
						console.log(el);
						console.log(report.toJSON());
						$('#multipleSelect', el).multiSelect({ selectableOptgroup : true });
						++count;
						if (count > 1)
							deserialize_multiselect(report.toJSON(), el);
					})

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

		// Report built with custom table, as reports should be shown with
		// custom order selected by user
		report_results_view.appendItem = reportsContactTableView;

		report_results_view.collection.fetch();

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
