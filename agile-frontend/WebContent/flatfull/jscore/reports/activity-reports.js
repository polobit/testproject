/**
 * Initializes listener to perform various event function related to activity
 * reports
 */
function initializeActivityReportsListeners()
{

	$('body').on('hidden.bs.modal', '#activityReportModal', function(e)
	{
		$('#users-list, #activity-type-list').multiSelect('deselect_all');
	});

	$('#reports-listerners-container').on('click', '#activity-reports-email-now', function(e)
	{
		e.preventDefault();
		e.stopPropagation();
		
		var id = $(this).attr('data');
		var date = Math.floor(Date.now() / 1000);
		var url='/core/api/activity-reports/email/' + id + '?end_time=' + date;
		$("#report-send-confirmation").find('input').attr("data",url);
		$('#report-send-confirmation').modal('show');
		initializeReportSendConfirm();
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


/**
 * Confirmation box event to send email reports
 */
function initializeReportSendConfirm()
{

	$("#report-send-confirm")
			.click(
					function(event)
					{
						event.preventDefault();
						$('.report-message').html(getRandomLoadingImg());
						var url= $('#report-send-confirmation').find('input').attr('data');
						if ($(this).attr("disabled"))
							return;

						$(this).attr("disabled", "disabled");
						$
								.get(
										url,
										function(data)
										{

											console.log("sending email");
											$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Report will be sent shortly</i></p></small></div>');

											$('.report-message').html($save_info);

											$save_info.show();

											setTimeout(function()
											{
												$('#report-send-confirmation').modal('hide');
												$('.report-message').empty();
												$("#report-send-confirm").removeAttr("disabled");
											}, 2000);

										})
								.fail(
										function(response)
										{
											$save_info = $('<div style="display:inline-block"><small><p style="color:#B94A48; font-size:14px"><i>' + response.responseText + '</i></p></small></div>');

											$('.report-message').html($save_info);

											$save_info.show();

											setTimeout(function()
											{
												$('#report-send-confirmation').modal('hide');
												$('.report-message').empty();
												$("#report-send-confirm").removeAttr("disabled");
											}, 2000);

										});
					});

}
