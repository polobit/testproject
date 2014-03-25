/*
 * Check valid scheduled. Selected schedule should be in future time. 
 * If it is past or current time then revert action and show alert.
 */
function isPastSchedule()
{
	// Get selected date and time.
	var scheduledDate = document.getElementById('scheduled_date').value;
	var scheduledTime = document.getElementById('scheduled_time').value;

	console.log(scheduledDate + " " + scheduledTime);

	// Current date and time.
	var today = new Date().format('mm/dd/yyyy');
	var now = new Date();

	var min = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

	now = now.getHours() + ':' + min;

	console.log("current date is : " + today + " current time is : " + now);

	// Convert selected schedule in epoch time.

	// selected schedule.
	var schedulearray = (scheduledTime).split(":");
	var sdate = new Date(scheduledDate);
	var selectedSchedule = sdate.setHours(schedulearray[0], schedulearray[1]) / 1000.0;

	// current schedule.
	var currentSchedulearray = (now).split(":");
	var currentSdate = new Date(today);
	var currentSchedule = currentSdate.setHours(currentSchedulearray[0], currentSchedulearray[1]) / 1000.0;

	console.log("selectedSchedule : " + selectedSchedule + " currentSchedule : " + currentSchedule);

	if (selectedSchedule > currentSchedule) // Future Time
	{
		// Appending schedule.
		var schedulearray = (scheduledTime).split(":");
		var sdate = new Date(scheduledDate);
		sdate = sdate.setHours(schedulearray[0], schedulearray[1]) / 1000.0;
		document.getElementById('schedule').value = sdate;

		var myDate = new Date(sdate * 1000);
		console.log(myDate.toGMTString() + "   " + myDate.toLocaleString());

		// Changes in UI.
		$('#send_tweet').removeAttr("disabled");
		Schedule_In_Future = true;

		// To check text limit after button text change.
		$('#twit-tweet').keypress();
	}
	else
	// Past Time
	{
		alert("Please select Date/Time in future.");
	}
}

/**
 * Gets Scheduled Updates count fron DB and show or hide button which links to
 * scheduled updates page.
 */
function checkScheduledUpdates()
{
	// Get scheduled updates count
	$.getJSON("/core/scheduledupdate/getscheduledupdatescount", function(data)
	{
		console.log("data after fetching scheduled updates from db");
		console.log(data);

		if (data != 0)
			$("#show_scheduled_updates").show();

	}).error(function(jqXHR, textStatus, errorThrown)
	{
		$("#show_scheduled_updates").hide();
		console.log("Error occured in scheduled updates search.");
	});
}
