// Check valid scheduled.
function scheduledRangeCheck(scheduledDate, scheduledTime)
{
	console.log(scheduledDate + " " + scheduledTime);

	var today = new Date().format('mm/dd/yyyy');
	var now = new Date();

	var min = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

	now = now.getHours() + ':' + min;

	console.log("current date is : " + today + " current time is : " + now);

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
		return true;
	else
	// Past Time
	{
		alert("Please select Date/Time in future.");
		return false;
	}
}

/**
 * Gets Scheduled Updates fron DB and show button or hide it.
 */
function checkScheduledUpdates()
{
	$.getJSON("/core/scheduledupdate/getscheduledupdates", function(data)
	{
		console.log("data after fetching scheduled updates from db");
		console.log(data);

		if (data.length != 0)
			$("#show_scheduled_updates").show();
		else
			$("#show_scheduled_updates").hide();
	}).error(function(jqXHR, textStatus, errorThrown)
	{
		$("#show_scheduled_updates").hide();
		console.log("Error occured in scheduled updates search.");
	});
}

/**
 * Adds newly added Scheduled Update In Stream.
 */
function addScheduledUpdateInStream(scheduledUpdate)
{
	console.log(scheduledUpdate);

	if (Scheduled_Edit == true)
	{
		// Get scheduled update from collection.
		var newScheduledUpdate = Scheduled_Updates_View.collection.get(scheduledUpdate.id);

		// Set new data.
		newScheduledUpdate.set("message", scheduledUpdate.message);
		newScheduledUpdate.set("schedule", scheduledUpdate.schedule);
		newScheduledUpdate.set("scheduled_date", scheduledUpdate.scheduled_date);
		newScheduledUpdate.set("scheduled_time", scheduledUpdate.scheduled_time);

		// Add back to stream.
		Scheduled_Updates_View.collection.add(newScheduledUpdate);
		$('#socialsuite-scheduled-updates-content').append(Scheduled_Updates_View.render(true).el);

		Scheduled_Edit = false;
	}
	else
	{
		// Add scheduled update in collection.
		if (Current_Route == "scheduledmessages")
			Scheduled_Updates_View.collection.add(scheduledUpdate);
	}
}
