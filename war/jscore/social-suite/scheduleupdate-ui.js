/**
 * This file contains all event related actions on Scheduled updates, Like add
 * scheduled update, edit scheduled update, delete, etc.
 */

$(function()
{
	/* Show calender and time for selection on message modal. */
	$("#tweet_scheduling").die().live(
			"click",
			function(e)
			{
				if (!Scheduled_Edit)
				{
					$("#schedule").toggle();
					$("#send_tweet").toggle();
					$("#schedule_tweet").toggle();

					if ($("#schedule").css("display") == "block")
					{
						this.className = "tweet-scheduling tweet-scheduling-active";
						$('input.date').val(new Date().format('mm/dd/yyyy'));
						$('#scheduled_date').datepicker({ startDate : "today", autoclose : true, todayHighlight : true, format : 'mm/dd/yyyy' }).on(
								'changeDate', function(ev)
								{
									// this is date change
									var dateData = new Date(ev.date);
									console.log(dateData);
								});
						$('#scheduled_time').timepicker({ template : 'modal', showMeridian : false, defaultTime : 'current' }).on('changeTime.timepicker',
								function(e)
								{
									console.log(e.time.value);
								});
					}
					else
					{
						this.className = "tweet-scheduling";
						// $('input.date').val()='';
						$('#scheduled_time').attr("value", '');
					}
				}
			});

	/* Show calender and time for selection on RT modal. */
	$("#RT_scheduling").die().live("click", function(e)
	{
		$("#RT_schedule").toggle();
		$("#send_edit_tweet").toggle();
		$("#schedule_RT").toggle();

		if ($("#RT_schedule").css("display") == "block")
		{
			this.className = "tweet-scheduling tweet-scheduling-active";
			$('input.date').val(new Date().format('mm/dd/yyyy'));
			$('#RT_scheduled_date').datepicker({ startDate : "today", autoclose : true, todayHighlight : true, format : 'mm/dd/yyyy' });
			$('#RT_scheduled_time').timepicker({ template : 'modal', showMeridian : false, defaultTime : 'current' });
		}
		else
		{
			this.className = "tweet-scheduling";
			// $('input.date').val()='';
			$('#RT_scheduled_time').attr("value", '');
		}
	});

	/* Adds scheduledUpdate in DB and adds into Stream. */
	$(".schedule-tweet").die().live("click", function(e)
	{
		e.preventDefault();
		var formName = null;
		var modalName = null;
		var formData = null;

		if (this.id == "schedule_tweet")
		{
			// Check Send button is not enable
			if ($("#schedule_tweet").hasClass('disabled'))
				return;
			formName = "socialsuite_twitter_messageForm";
			modalName = "socialsuite_twitter_messageModal";

			// Get data from form elements
			formData = jQuery(socialsuite_twitter_messageForm).serializeArray();
		}
		else if (this.id == "schedule_RT")
		{
			// Check Send button is not enable
			if ($("#schedule_RT").hasClass('disabled'))
				return;
			formName = "socialsuite_twitter_RTForm";
			modalName = "socialsuite_twitter_RTModal";

			// Get data from form elements
			formData = jQuery(socialsuite_twitter_RTForm).serializeArray();
		}

		// Checks whether all the input fields are filled
		if (!isValidForm($("#" + formName)))
			return;

		var json = {};

		// Convert into JSON
		jQuery.each(formData, function()
		{
			json[this.name] = this.value || '';
		});

		if (!scheduledRangeCheck(json.scheduled_date, json.scheduled_time))
			return;

		$('#schedule_tweet').addClass('disabled');
		$('#schedule_RT').addClass('disabled');
		$("#spinner-modal").show();

		if (json.streamId != "/")
		{
			// Get stream from collection.
			var stream = Streams_List_View.collection.get(json.streamId).toJSON();

			json["domain_user_id"] = stream.domain_user_id;
			json["screen_name"] = stream.screen_name;
			json["network_type"] = stream.network_type;
			json["token"] = stream.token;
			json["secret"] = stream.secret;
		}

		delete json.streamId;

		// Appending schedule.
		var schedulearray = (json.scheduled_time).split(":");
		var sdate = new Date(json.scheduled_date);
		sdate = sdate.setHours(schedulearray[0], schedulearray[1]) / 1000.0;
		json.schedule = sdate;

		var myDate = new Date(json.schedule * 1000);
		console.log(myDate.toGMTString() + "   " + myDate.toLocaleString());

		// Create new scheduledUpdate
		var newUpdate = new Backbone.Model();
		newUpdate.url = '/core/scheduledupdate';
		newUpdate.save(json, { success : function(scheduledUpdate)
		{
			$("#spinner-modal").hide();

			if (scheduledUpdate != null)
			{
				// On success, shows the status as sent
				$('#' + formName).find('span.save-status').html("Saved");
				// showNotyPopUp('information', "Your Tweet has been
				// scheduled!", "top", 5000);

				// Hides the modal after 2 seconds after the sent is shown
				hideModal(modalName);

				console.log(Scheduled_Edit);

				scheduledUpdate = scheduledUpdate.toJSON();

				// Add scheduled in collection.
				addScheduledUpdateInStream(scheduledUpdate);

				// scheduled updates available.
				$("#show_scheduled_updates").show();
			}
		}, error : function(data)
		{
			// Displays Error Notification.
			displayError(modalName, data);
		}, });
	});

	/**
	 * Sends delete request to DB and delete scheduled update.
	 */
	$(".delete-scheduled").die().live("click", function(e)
	{
		// Ask confirmation to user.
		if (!confirm("Are you sure you want to delete this tweet?"))
			return;

		// Details to pass on to method.
		var tweetId = ($(this).closest('article').attr('id'));

		// Call method with details of tweet to be deleted.
		$.get("/core/scheduledupdate/" + tweetId, function(data)
		{
			if (data == "Successful")
			{
				var scheduledUpdate = Scheduled_Updates_View.collection.get(tweetId);

				// Delete scheduled update from ui.
				Scheduled_Updates_View.collection.remove(scheduledUpdate);

				showNotyPopUp('information', "Your tweet has been deleted.", "top", 5000);
			}
			else if (data == "Unsuccessful")
			{
				showNotyPopUp('information', "Retry after sometime.", "top", 5000);
			}
		}).error(function(data)
		{
			// Error message is shown if error occurs
			displayError(null, data);
		});
	});

	/**
	 * Edit scheduled update and save modified.
	 */
	$(".edit-scheduled").die().live("click", function(e)
	{
		// Ask confirmation to user.
		// if(!confirm("Are you sure you want to edit this scheduled update?"))
		// return;

		// Details to pass on to method.
		var tweetId = ($(this).attr('data'));

		// Get scheduled update from collection.
		var scheduledUpdate = Scheduled_Updates_View.collection.get(tweetId).toJSON();

		// Information to be shown in the modal to the user while
		// sending/scheduling message
		if (scheduledUpdate.headline == "Tweet")
		{
			scheduledUpdate["info"] = "Status from " + scheduledUpdate.screen_name;
			scheduledUpdate["description"] = "What's happening?";
		}
		else if (scheduledUpdate.headline == "Reply")
		{
			scheduledUpdate["info"] = "Reply " + "@" + scheduledUpdate.tweetOwner + " from " + scheduledUpdate.screen_name;
			scheduledUpdate["description"] = "@" + scheduledUpdate.tweetOwner;
			scheduledUpdate["headline"] = "Reply Tweet";
		}
		else if (scheduledUpdate.headline == "Direct")
		{
			scheduledUpdate["info"] = "Direct message from " + scheduledUpdate.screen_name + " to " + scheduledUpdate.tweetOwner;
			scheduledUpdate["description"] = "Tip: you can send a message to anyone who follows you."
			scheduledUpdate["headline"] = "Direct Message";
		}
		else if (scheduledUpdate.headline == "Retweet")
		{
			scheduledUpdate["info"] = "Status of @" + scheduledUpdate.tweetOwner;
			scheduledUpdate["headline"] = "Retweet";
		}

		// Display Modal
		displayModal("socialsuite_twitter_messageModal", "socialsuite-twitter-message", scheduledUpdate, "twitter-counter", "twit-tweet");

		// Modal with Details for modifications.
		Scheduled_Edit = true;

		$("#schedule").show();
		$("#send_tweet").hide();
		$("#schedule_tweet").show();

		$("#tweet_scheduling").className = "tweet-scheduling tweet-scheduling-active";
		$('input.date', $('#schedule')).val(scheduledUpdate.scheduled_date);
		$("#scheduled_date", $('#schedule')).datepicker({ format : 'mm/dd/yyyy' });
		$("#scheduled_time", $('#schedule')).timepicker({ template : 'modal', showMeridian : false, defaultTime : scheduledUpdate.scheduled_time });

		// In compose message text limit is crossed so disable send button.
		$('#twit-tweet').on('cross', function()
		{
			$('#send_tweet').addClass('disabled');
			$('#schedule_tweet').addClass('disabled');
		});

		// In compose message text limit is uncrossed so enable send button.
		$('#twit-tweet').on('uncross', function()
		{
			$('#send_tweet').removeClass('disabled');
			$('#schedule_tweet').removeClass('disabled');
		});
	});
});
