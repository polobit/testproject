function saveActivityReport(saveBtn){
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button(saveBtn);
	/*if(!isValidForm('#activityReportsForm')){
		// Removes disabled attribute of save button
		enable_save_button(saveBtn);
		return;
	}*/
	
	var json = serializeForm('activityReportsForm');
	json.activity_type = $('#activity-type-list').val();
	json.user_ids = $('#users-list').val();
	console.log(json);
	
	// Saving that pipeline object
	var activityReportModel = new Backbone.Model();
	activityReportModel.url = '/core/api/activity-reports';
	activityReportModel.save(json, {
		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
		success : function(model, response) {
			console.log(model);
			App_Reports.activityReports.collection.add(model);
			$('#activityReportModal').modal('hide');
		},
		error: function(data,response){
			enable_save_button(saveBtn);
			console.log(response);
		}
	});
	
}

function updateActivityReport(id){
	alert(id);
	var json = App_Reports.activityReports.collection.get(6528900045733888).toJSON();
	$('#activityReportModal').modal('show');
	deserializeForm(json,$('#activityReportsForm'));
	$.each(json.user_ids,function(i,user_id){
		$('#users-list').multiSelect('select',user_id);
	});
	$.each(json.activity_type,function(i,activity){
		$('#activity-type-list').multiSelect('select',activity);
	});
	
}

$(function(){
	
	$('#activityReportModal').live('hidden.bs.modal',function(e){
		$('#users-list, #activity-type-list').multiSelect('deselect_all');
	});
	
	/** 
	    * Deal list view edit
	    
	    $('#activity-report-model-list > tr > td:not(":first-child")').live('click', function(e) {
			e.preventDefault();
			updateActivityReport($(this).closest('tr').find('.data').attr('data'));
		});
	*/
});