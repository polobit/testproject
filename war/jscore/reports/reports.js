// Stores report object, so it can be used while creating report table headings
var REPORT;
$(function(){
	$("#reports-show-now").die().live('click', function(e){
		e.preventDefault();
		
		// Saves report and then calls to show results based on the saved report. 
		// It is required to save because of the possibility, user can change rules 
		// in from and hit show results
		saveReportForm(function(data){
				REPORT = data.toJSON()
		    	Backbone.history.navigate("report-results/" + REPORT.id, {
		    			trigger: true
		    		});
			})
	}); // Click event
	
	$("#reports-email-now").die().live('click', function(e){
		e.preventDefault();
		
		$(that).parent('.form-actions').append(LOADING_HTML);

		var that = this;
	
		saveReportForm(function(data){
			REPORT = data.toJSON()
			
			$.get('core/api/reports/send/' + REPORT.id, function(data){
				
				$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Report will be send shortly</i></p></small></div>');
				
				$(that).parent('.form-actions').append($save_info);
				
				$save_info.show().delay(3000).hide(1);
			});
		});
	})
})


function reportsContactTableView(base_model) {

	// Creates list view for
	var itemView = new Base_List_View({
		model : base_model,
		template : 'contacts-custom-view-model',
		tagName : this.options.individual_tag_name
	});

	// Reads the modelData (customView object)
	var modelData = this.options.modelData;

	// Reads fields_set from modelData
	var fields = modelData['fields_set'];

	// Converts base_model (contact) in to JSON
	var contact = base_model.toJSON();
	
	// Clears the template, because all the fields are appended, has to be reset
	// for each contact
	$('#contacts-custom-view-model-template').empty();

	// Iterates through, each field name and appends the field according to
	// order of the fields
	$.each(fields, function(index, field_name) {
		if(field_name.indexOf("properties_") != -1)
			field_name = field_name.split("properties_")[1];
		
		$('#contacts-custom-view-model-template').append(
				getTemplate('contacts-custom-view-' + field_name, contact));
	});

	// Appends model to model-list template in collection template
	$(("#" + this.options.templateKey + '-model-list'), this.el).append(
			itemView.render().el);

	// Sets data to tr
	$(('#' + this.options.templateKey + '-model-list'), this.el).find('tr:last').data(
			base_model);

}

/**
 * Saved reports form and on success calls callback sent to the function.
 * @param callback
 */
function saveReportForm(callback)
{
	
	if (!isValidForm($("#reportsForm"))) {
		isValid = false;
		return;
	}
	
	var reports = serializeForm("reportsForm");
	
	var reportModel = new Backbone.Model();
	reportModel.url = "core/api/reports";
	reportModel.save(reports, {success: function(data){
		
		// Adds input field with id, so after saving first time 
		// it will not be create new report and selecting send email again
		if($("#reportsForm").find('*[name="id"]').length == 0)
			$("#reportsForm").append('<input type="text" name="id" class="hide" value="'+data.toJSON().id+'" />');
		
		
		if (callback && typeof (callback) === "function")
		{
			// execute the callback, passing parameters as necessary
			callback(data);
		}

	}});// Model save
	
}