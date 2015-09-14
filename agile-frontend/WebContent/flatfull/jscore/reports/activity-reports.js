function saveActivityReport(saveBtn){
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button(saveBtn);
	
	var json = serializeForm('activityReportsForm');
	json.activity = $('#activity-type-list').val();
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
	$.each(json.activity,function(i,activity){
		$('#activity-type-list').multiSelect('select',activity);
	});
	
}

function initializeActivityReportsListeners(){
	
	$('body').on('hidden.bs.modal', '#activityReportModal', function(e){
		$('#users-list, #activity-type-list').multiSelect('deselect_all');
	});
	
	$('#reports-listerners-container').on('click', '#activity-reports-email-now', function(e){
		e.preventDefault();
		e.stopPropagation();
		var id = $(this).attr('data');
		$('#report-send-confirmation').modal('show');
		var date = Math.floor(Date.now()/1000);
		$("#report-send-confirm").click(
				function(event)
				{
					event.preventDefault();
					
					if ($(this).attr("disabled")) return;
					
					$(this).attr("disabled", "disabled");
					$.get('/core/api/activity-reports/email/' + id +'?end_time='+date, function(data){
						
						console.log("sending email");
							$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Report will be sent shortly</i></p></small></div>');
				
							$('.report-message').html($save_info);
				
							$save_info.show();

							setTimeout(function ()
							            {
								   $('#report-send-confirmation').modal('hide');
								   $('.report-message').empty();
								   $("#report-send-confirm").removeAttr("disabled");
							            }, 2000);

					}).fail(function(response){
						$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>'+response.responseText+'</i></p></small></div>');
						
						$('.report-message').html($save_info);
			
						$save_info.show();

						setTimeout(function ()
						            {
							  $('#report-send-confirmation').modal('hide');
							  $('.report-message').empty();
							  $("#report-send-confirm").removeAttr("disabled");
						            }, 2000);

					});
				});
	});
	
	$('#reports-listerners-container').on('click', '#activity-type-list-select-all', function(e){
		e.preventDefault();
		$('#activity-type-list').multiSelect('select_all');
	});
	$('#reports-listerners-container').on('click', '#activity-type-list-select-none', function(e){
		e.preventDefault();
		$('#activity-type-list').multiSelect('deselect_all');
	});
	
	$('#reports-listerners-container').on('click', '#users-list-select-all', function(e){
		e.preventDefault();
		$('#users-list').multiSelect('select_all');
	});
	$('#reports-listerners-container').on('click', '#users-list-select-none', function(e){
		e.preventDefault();
		$('#users-list').multiSelect('deselect_all');
	});

}