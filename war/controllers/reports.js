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
		"report-results/:id": "reportInstantResults"
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

				// Hide table until chaining is done, to avoid showing all fields and hiding.
				$(".reports-condition-table", el).hide();
				
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
						function() {
				
							chainFilters(el);
							$(".reports-condition-table", el).show();
						})						
				
						
						fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data){console.log(data)}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true);
						
		       			head.js(LIB_PATH + 'lib/jquery.multi-select.js', LIB_PATH + 'lib/jquery-ui.min.js', function(){

		       				$('#multipleSelect', el).multiSelect({ selectableOptgroup: true });
		       				
		       					$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id","fields_set").sortable();
		     	
		       			});
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
				
				$(".reports-condition-table", el).hide();
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js',
						function() {
							chainFilters(el);
							
							$(".reports-condition-table", el).show();
							
							deserializeChainedSelect($(el).find('form'), report.toJSON().rules);
						})
					
						
				fillSelect("custom-fields-optgroup", "core/api/custom-fields", undefined, function(data){console.log(data)}, '<option value="custom_{{field_label}}">{{field_label}}</option>', true);
				
       			head.js(LIB_PATH + 'lib/jquery.multi-select.js', LIB_PATH + 'lib/jquery-ui.min.js', function(){
       				       	
       				
       						
       					$('#multipleSelect', el).multiSelect({ selectableOptgroup: true });
       					
       					
       					$.each(report.toJSON()['fields_set'], function(index, field){
       						$('#multipleSelect', el).multiSelect('select', field); 
       					});
       					
       					$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id","fields_set").sortable();
     	
       			});
       			
       			
			}
		});

//		report_model.render();
		
		report_model.render();
		$("#content").html(report_model.el);
	
	},
	
	reportInstantResults : function(id, report) {
		
		if(!report)
		// If reports view is not defined, navigates to reports
		if (!this.reports || !this.reports.collection
				|| this.reports.collection.length == 0
				|| this.reports.collection.get(id) == null) {
			
			$("#content").html(LOADING_HTML);
			var reportModel = new Backbone.Model();
			reportModel.url = "core/api/reports/" + id;
			reportModel.fetch({success: function(data){
					App_Reports.reportInstantResults(id, data.toJSON());
				}
			});
		return;
		
		}
		else
		{
			report = this.reports.collection.get(id).toJSON();
		}

		REPORT = report;
		var report_results_view = new Base_Collection_View({
				url : "core/api/reports/query/" + id,
				modelData: report ,
				templateKey: "report-search",
				individual_tag_name: 'tr',
				cursor: true,		        
		        sort_collection : false,
		        page_size: 15, 
		});// Collection
	
		report_results_view.appendItem = reportsContactTableView;

		report_results_view.collection.fetch();
		
		$("#content").html(report_results_view.render().el);
	}
})