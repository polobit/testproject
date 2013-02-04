/**
 * Creates a backbone router to create, read and update reports
 * 
 * @module Reports
 */
var ReportsRouter = Backbone.Router.extend({

	routes : {

		/* Reports */
		"reports" : "reports",
		"report-add" : "reportAdd",
		"report-edit/:id" : "reportEdit",
	},

	/**
	 * Shows list of reports, with an option to add new report
	 */
	reports : function() {
		this.reports = new Base_Collection_View({
			url : '/core/api/reports',
			restKey : "reports",
			templateKey : "report",
			individual_tag_name : 'tr'
		});

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
	reportAdd : function() {
		var report_add = new Base_Model_View({
			url : 'core/api/reports',
			template : "reports-add",
			window : "reports",
			isNew : true,
			postRenderCallback : function(el) {

				// Populates users drop down
				populateUsers("owners", el);

				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
						function() {
							chainFilters(el);
						})
			}
		});

		$('#content').html(report_add.render().el);
	},

	/**
	 * Edits a report by de-serializing the existing report into its saving 
	 * form, from there it can be edited and saved.
	 * Populates users and loads agile.jquery.chained.min.js to match the conditions
	 * with the values of input fields. 
	 */
	reportEdit : function(id) {
		
		// If reports view is not defined, navigates to reports
		if (!this.reports || !this.reports.collection
				|| this.reports.collection.length == 0
				|| this.reports.collection.get(id) == null) {
			this.navigate("reports", {
				trigger : true
			});
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var report = this.reports.collection.get(id);
		
		var report_model = new Base_Model_View({
			url : 'core/api/reports',
			model : report,
			template : "reports-add",
			window : 'reports',
			postRenderCallback : function(el) {
				populateUsers("owners", el, report.toJSON(), 'domainUser');

				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
						function() {
							chainFilters(el);
						})
			}
		});

		$("#content").html(report_model.render().el);
	},
})