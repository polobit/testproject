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
		$("#send_tweet").attr("disabled", "disable");
		Schedule_In_Future = false;
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

/**
 * On click of scheduled update it will open message modal. And on click of
 * schedule it will save modified scheduled update.
 */
function scheduledmessagesEdit(id)
{
	console.log("scheduledmessages Edit: " + id);	

	// Gets the update from its collection
	var selectedUpdate = Scheduled_Updates_View.collection.get(id);
	console.log(selectedUpdate);

	Scheduled_Edit = true;

	Message_Model = new Base_Model_View({ url : '/core/scheduledupdate', model : selectedUpdate, template : "socialsuite-twitter-message",
		modal : '#socialsuite_twitter_messageModal', window : 'scheduledmessages', postRenderCallback : function(el)
		{
			$('.modal-backdrop').remove();
			$('#socialsuite_twitter_messageModal', el).modal('show');
		}, saveCallback : function(data)
		{
			console.log('Message_Model save callback');
			console.log(data);
			
			// Hide message modal.
			$('#socialsuite_twitter_messageModal').modal('hide');
			$('#socialsuite_twitter_messageModal').remove();
			$('.modal-backdrop').remove();
			Scheduled_Edit = false;
			
			// Set new model in collection after edit. 
			Scheduled_Updates_View.collection.get(data.id).set(new BaseModel(data));
			
			// Update UI.
			$('#socialsuite-scheduled-updates-content').append(Scheduled_Updates_View.render(true).el);
			
		} });

	// Add modal in this Div on same page.
	$('#schedule-edit-modal').append(Message_Model.render().el);

	/*
	 * Shows scheduling clock icon on message modal with selected scheduled with
	 * disabled click event, so user only can schedule message.
	 */
	$("#tweet_scheduling").click();

	// Set already selected date in message modal.
	$('input.date', $('#schedule_controls')).val((new Date(selectedUpdate.toJSON().scheduled_date * 1000)).toLocaleDateString());

	// Enables schedule button if selected scheduled update having future schedule.
	isPastSchedule();
} // scheduledmessagesEdit end

