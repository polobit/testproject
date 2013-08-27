/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router.extend({

	routes : {

	/* Reports */
	"reports" : "reports", "report-add" : "reportAdd", "report-edit/:id" : "reportEdit", "report-results/:id" : "reportInstantResults" },

	/**
	 * Shows list of reports, with an option to add new report
	 */
	reports : function()
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
		var report_add = new Base_Model_View({ url : 'core/api/reports', template : "reports-add", window : "reports", isNew : true,
			postRenderCallback : function(el)
			{
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect').multiSelect({ selectableOptgroup : true });

						$('.ms-selection').children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

					});
				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					scramble_input_names($(el));
					chainFilters(el);
				});
			} });

		$("#content").html(report_add.render().el);
	},

	/**
	 * Edits a report by de-serializing the existing report into its saving
	 * form, from there it can be edited and saved. Populates users and loads
	 * agile.jquery.chained.min.js to match the conditions with the values of
	 * input fields.
	 */
	reportEdit : function(id)
	{

		// If reports view is not defined, navigates to reports
		if (!this.reports || !this.reports.collection || this.reports.collection.length == 0 || this.reports.collection.get(id) == null)
		{
			this.navigate("reports", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var report = this.reports.collection.get(id);

		var report_model = new Base_Model_View({ url : 'core/api/reports', model : report, template : "reports-add", window : 'reports',
			postRenderCallback : function(el)
			{

				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function()
				{

					head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect').multiSelect({ selectableOptgroup : true });

						$.each(report.toJSON()['fields_set'], function(index, field)
						{
							$('#multipleSelect').multiSelect('select', field);
						});

						$('.ms-selection').children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();
					})

				}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true, el);

				head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{

					chainFilters(el);
					deserializeChainedSelect($(el).find('form'), report.toJSON().rules);
					scramble_input_names($(el));		
				});

			} });

		// report_model.render();
		$("#content").html(report_model.render().el);
		// report_model.render();

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
				$("#content").html(LOADING_HTML);
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

		// Stores in global variable, as it is required to build custom table headings
		REPORT = report;

		var report_results_view = new Base_Collection_View({ url : "core/api/reports/show-results/" + id, modelData : report, templateKey : "report-search",
			individual_tag_name : 'tr', cursor : true, sort_collection : false, page_size : 15, });// Collection

		// Report built with custom table, as reports should be shown with custom order selected by user
		report_results_view.appendItem = reportsContactTableView;

		report_results_view.collection.fetch();

		$("#content").html(report_results_view.render().el);
	} })
