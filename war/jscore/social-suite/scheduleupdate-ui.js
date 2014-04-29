/**
 * This file contains event of button which shows calendar and timer in message
 * modal and check selected schedules range.
 */

$(function()
{
	/* Show calender and time for selection on message modal. */
	$("#tweet_scheduling").die().live(
			"click",
			function(e)
			{
				// Message modal open for edit scheduled update.
				if ($("#schedule_controls").css("display") == "block" && Scheduled_Edit)
					return;

				// Toggle calendar and timer.
				$("#schedule_controls").toggle();

				if ($("#schedule_controls").css("display") == "block")
				{
					// Change send button's text.
					document.getElementById("send_tweet").innerHTML = "Schedule";
					$("#send_tweet").attr("disabled", "disable");

					this.className = "tweet-scheduling tweet-scheduling-active";

					// Set current date.
					$('input.date').val(new Date().format('mm/dd/yyyy'));
					$('#scheduled_date').datepicker({ startDate : "today", autoclose : true, todayHighlight : true, format : 'mm/dd/yyyy' }).on('changeDate',
							function(ev)
							{
								console.log(new Date(ev.date));

								// Check selected schedule
								isPastSchedule();
							});

					// Set current time.
					$('#scheduled_time').timepicker({ template : 'modal', showMeridian : false, defaultTime : 'current' }).on('changeTime.timepicker',
							function(e)
							{
								console.log(e.time.value);

								// Check selected schedule
								isPastSchedule();
							});

					// Save original URL from model.
					Previous_URL = Message_Model.model.url;

					// Update scheduled URL in model.
					Message_Model.model.url = '/core/scheduledupdate';
				}
				else
				{
					// Message modal open for scheduled update edit.
					if (Scheduled_Edit)
						return;

					this.className = "tweet-scheduling";
					// $('input.date').val()='';
					$('#scheduled_time').attr("value", '');

					// Set original URL back to model.
					Message_Model.model.url = Previous_URL;

					// Change send button's text.
					document.getElementById("send_tweet").innerHTML = "Send";
					$('#send_tweet').removeAttr("disabled");

					// Scheduling de-select
					Schedule_In_Future = false;

					// To check text limit after button text change.
					$('#twit-tweet').keypress();
				}
			});

	/**
	 * Calls function to check selected time after cloasing Time picker modal.
	 */
	/**$('.bootstrap-timepicker').die().live('hide', function()
	{
		isPastSchedule();
	});
	*/

	/**
	 * Calls function to open Message modal with selected scheduled update
	 * details and save into DB after modifications.
	 */
	$('.edit-scheduled-update').die().live('click', function()
	{
		var updateId = $(this).closest('tr').find('.data').attr('data');

		// Opens Message Modal and save modifications in DB, makes changes in
		// UI.
		scheduledmessagesEdit(updateId);
	});
});
