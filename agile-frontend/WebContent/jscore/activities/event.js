/**
 * 
 * event.js is a script file to deal with the actions like creation, update and
 * deletion of events from client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function()
{
	/**
	 * Shows activity modal, and highlights the event form features (Shows event
	 * form and hides task form, changes color and font-weight)
	 * 
	 */
	$('#show-activity').live('click', function(e)
	{
		e.preventDefault();
		highlight_event();

		$("#activityModal").modal('show');
	});

	/**
	 * Shows the event form fields in activity modal
	 */
	$(".add-event").live('click', function(e)
	{
		e.preventDefault();

		$('#activityModal').modal('show');
		highlight_event();

		/*
		 * $('#task-date-1').val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-1").val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-2").val(new Date().format('mm/dd/yyyy'));
		 */

		return;
	});

	$("#add_event_desctiption").live('click', function(e)
	{
		e.preventDefault();
		$(".event_discription").removeClass("hide");
		$(this).hide();
		return;
	});

	/**
	 * When clicked on update button of event-update-modal, the event will get
	 * updated by calling save_event function
	 * 
	 */
	$('#update_event_validate').die().live('click', function(e)
	{
		e.preventDefault();
		var eventId = $('#updateActivityModal').find("input[type='hidden']").val();
		save_event('updateActivityForm', 'updateActivityModal', true, this, function(data)
		{
			console.log(data);
			var eventModel = eventCollectionView.collection.get(eventId);
			eventModel.set(data.toJSON(), { merge : true });
			eventCollectionView.render(true);
		});

	});

	/**
	 * Deletes an event from calendar by calling ajax DELETE request with an
	 * appropriate url
	 */
	$('#event_delete')
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						if ($(this).attr('disabled') == 'disabled')
							return;

						/**
						 * Confirmation alert to delete an event
						 */
						if (!confirm("Are you sure you want to delete?"))
							return;

						var event_id = $('#updateActivityForm input[name=id]').val();
						var save_button = $(this);

						disable_save_button(save_button);
						/**
						 * Shows loading symbol until model get saved
						 */
						// $('#updateActivityModal').find('span.save-status').html(getRandomLoadingImg());
						$
								.ajax({
									url : 'core/api/events/' + event_id,
									type : 'DELETE',
									success : function()
									{
										// if event deleted from today events
										// portlet, we removed that event from
										// portlet events collection
										if (App_Portlets.currentPosition && App_Portlets.todayEventsCollection && App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)] && (Current_Route == undefined || Current_Route == 'dashboard'))
										{
											App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection
													.remove(App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.get(event_id));

											App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].render(true);

										}

										// $('#updateActivityModal').find('span.save-status
										// img').remove();
										enable_save_button(save_button);
										$("#updateActivityModal").modal('hide');

										var eventId = $('#updateActivityModal').find("input[type='hidden']").val();
										$('#calendar_event').fullCalendar('removeEvents', eventId);
									} });
						if (readCookie("agile_calendar_view"))
						{
							var eventModel = eventCollectionView.collection.get(event_id);
							eventModel.set(eventModel, { remove : true });
							document.location.reload();

						}

					});

	/**
	 * Activates the date picker to the corresponding fields in activity modal
	 * and activity-update modal
	 */
	var eventDate = $('#event-date-1').datepicker({ format : 'mm/dd/yyyy' }).on('changeDate', function(ev)
	{
		// If event start date is changed and end date is less than start date,
		// change the value of the end date to start date.
		var eventDate2 = new Date($('#event-date-2').val());
		if (ev.date.valueOf() > eventDate2.valueOf())
		{
			$('#event-date-2').val($('#event-date-1').val());
		}

	});

	$('#event-date-2').datepicker({ format : 'mm/dd/yyyy' });
	$('#update-event-date-1').datepicker({ format : 'mm/dd/yyyy' }).on('changeDate', function(ev)
	{
		// If event start date is changed and end date is less than start date,
		// change the value of the end date to start date.
		var eventDate2 = new Date($('#update-event-date-2').val());
		if (ev.date.valueOf() > eventDate2.valueOf())
		{
			$('#update-event-date-2').val($('#update-event-date-1').val());
		}

	});
	$('#update-event-date-2').datepicker({ format : 'mm/dd/yyyy' });

	/**
	 * Activates time picker for start time to the fields with class
	 * start-timepicker
	 */
	$('.start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false, template : 'modal' }).on('hide.timepicker', function(e)
	{
		if ($('#activityModal #allDay').is(':checked'))
		{
			$('#event-time-1').closest('.control-group').hide();
			$('#event-date-2').closest('.row').hide();
		}

		// ChangeTime event is not working, so need to invoke user method.
		var endTime = changeEndTime($('.start-timepicker').val().split(":"), $('.end-timepicker').val().split(":"));
		$('.end-timepicker').val(endTime);

		e.stopImmediatePropagation();
		return false;
	});

	/**
	 * Activates time picker for end time to the fields with class
	 * end-timepicker
	 */
	$('.end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false, template : 'modal' });

	/**
	 * Activates time picker for start time to the fields with class
	 * update-start-timepicker
	 */
	$('.update-start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false, template : 'modal' }).on('hide.timepicker', function(e)
	{
		// ChangeTime event is not working, so need to invoke user method.
		var endTime = changeEndTime($('.update-start-timepicker').val().split(":"), $('.update-end-timepicker').val().split(":"));
		$('.update-end-timepicker').val(endTime);
	});

	/**
	 * Activates time picker for end time to the fields with class
	 * update-end-timepicker
	 */
	$('.update-end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false, template : 'modal' });

	/**
	 * Sets the start time with current time and end time half an hour more than
	 * start time, when they have no values by the time the modal is shown.
	 */
	$('#activityModal, #activityTaskModal').on('shown', function()
	{
		// Show related to contacts list
		var el = $("#activityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);

		/**
		 * Fills current time only when there is no time in the fields
		 */
		if ($('.start-timepicker').val() == '')
			$('.start-timepicker').val(get_hh_mm());

		if ($('.end-timepicker').val() == '')
			$('.end-timepicker').val(get_hh_mm(true));
		// sets the time in time picker if it is empty
		if ($('.new-task-timepicker').val() == '')
			$('.new-task-timepicker').val("12:00");
		// Update will highlight the date of in date picker
		$("input.date").datepicker('update');

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#updateActivityModal').on('show', function()
	{
		// Show related to contacts list
		var el = $("#updateActivityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);

		if ($('#updateActivityModal #allDay').is(':checked'))
		{
			$('#update-event-time-1').closest('.control-group').hide();
			$('#update-event-date-2').closest('.row').hide();
		}

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');

		$("input.date").datepicker('update');

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#activityModal, #activityTaskModal').on('show', function(e)
	{

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');

		var isOwnerListUploded = $("#event-owners-list", $("#activityForm")).val();
		if (isOwnerListUploded == null)
		{
			// Fills owner select element
			populateUsers("event-owners-list", $("#activityForm"), undefined, undefined, function(data)
			{
				$("#activityForm").find("#event-owners-list").html(data);
				$("#event-owners-list", $("#activityForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
				$("#event-owners-list", $("#activityForm")).closest('div').find('.loading-img').hide();
			});
		}

	});

	/**
	 * Hide event of update task modal. Removes the relatedTo field elements if
	 * any, when the modal is hidden in order to not to show them again when the
	 * modal is shown next
	 * 
	 */
	$('#updateActivityModal').on('hidden', function()
	{
		if ($(this).hasClass('in'))
		{
			return;
		}

		$("#updateActivityForm").find("li").remove();
		$('#update-event-time-1').closest('.control-group').show();
		$('#update-event-date-2').closest('.row').show();
	});
	$('#activityModal').on('hidden', function()
	{
		$("#add_event_desctiption").show();

		$(".event_discription").addClass("hide");
		if ($(this).hasClass('in'))
		{
			return;
		}

		// Remove validation error messages
		remove_validation_errors('activityModal');

		$("#activityForm").find("li").remove();
		$('#event-time-1').closest('.control-group').show();
		$('#event-date-2').closest('.row').show();

	});

	/**
	 * Highlights the event features (Shows event form and hides task form,
	 * changing color and font-weight)
	 */
	$("#event").live('click', function(e)
	{
		e.preventDefault();
		highlight_event();
	});
});

/**
 * Highlights the event portion of activity modal (Shows event form and hides
 * task form, changes color and font-weight)
 */
function highlight_event()
{
	$("#hiddentask").val("event");
	$("#event").css({ "color" : "black" });
	$("#task").css({ "color" : "red" });
	$("#relatedTask").css("display", "none");
	$("#relatedEvent").css("display", "block");

	if ($("#taskForm").find("#task_related_to").closest(".controls").find("ul").children())
		$("#activityForm").find("#event_related_to").closest(".controls").find("ul").html(
				$("#taskForm").find("#task_related_to").closest(".controls").find("ul").children());

	// Date().format('mm/dd/yyyy'));
	$('input.date').val(new Date().format('mm/dd/yyyy'));
}

/**
 * 
 * Validates the start time and end time of an event (start time should be less
 * than end time)
 * 
 * @method is_valid_range
 * @param {Number}
 *            startDate start date of an event
 * @param {Number}
 *            endDate end date of an event
 * @param {Number}
 *            startTime start time of an event
 * @param {Number}
 *            endTime end time of an event
 * @param {String}
 *            modalId the unique id for the modal to identify it
 */
function is_valid_range(startDate, endDate, startTime, endTime, modalName)
{
	if (endDate - startDate >= 86400000)
	{
		return true;
	}
	else if (startDate > endDate)
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start date should not be greater than end date. Please change.</div>');

		return false;
	}
	else if (startTime[0] > endTime[0])
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater than end time. Please change.</div>');

		return false;
	}
	else if (startTime[0] == endTime[0] && startTime[1] >= endTime[1])
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater or equal to end time. Please change.</div>');

		return false;
	}
	else
		return true;
}

// Save event

/**
 * Creates or updates an event and renders the saved object by verifying if the
 * event is updated or saved as new one.
 * 
 * @method save_event
 * @param {String}
 *            formId the unique id for the form to identify it
 * @param {String}
 *            modalId the unique id for the modal to identify it
 * @param {Boolean}
 *            isUpdate the boolean value to identify weather saving the new one
 *            or updating the existing one
 * 
 */
function save_event(formId, modalName, isUpdate, saveBtn, callback)
{

	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));

	// Save functionality for event
	if (!isValidForm('#' + formId))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));
		return false;

	}

	var json = serializeForm(formId);

	if (json.allDay)
	{
		json.end = json.start;
		json.start_time = "00:00";
		json.end_time = "23:45";
	}// for all day, assume ending in last of that day.

	// For validation
	if (!is_valid_range(json.start * 1000, json.end * 1000, (json.start_time).split(":"), (json.end_time).split(":"), modalName))
	{

		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));
		return;
	}

	// Show loading symbol until model get saved
	// $('#' + modalName).find('span.save-status').html(getRandomLoadingImg());

	// Appending start time to start date
	var startarray = (json.start_time).split(":");
	json.start = new Date(json.start * 1000).setHours(startarray[0], startarray[1]) / 1000.0;

	// Appending end time to end date
	var endarray = (json.end_time).split(":");
	json.end = new Date(json.end * 1000).setHours(endarray[0], endarray[1]) / 1000.0;

	$('#' + modalName).modal('hide');

	$('#' + formId).each(function()
	{
		this.reset();
	});

	// Deleting start_time and end_time from json
	delete json.start_time;
	delete json.end_time;

	var eventModel = new Backbone.Model();
	eventModel.url = 'core/api/events';
	eventModel
			.save(
					json,
					{ success : function(data)
					{

						// Removes disabled attribute of save button
						enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

						$('#' + formId).each(function()
						{
							this.reset();
						});

						// $('#' + modalName).find('span.save-status
						// img').remove();
						$('#' + modalName).modal('hide');

						// $('#calendar').fullCalendar( 'refetchEvents' );
						var event = data.toJSON();
						if (Current_Route == 'calendar' && !readCookie("agile_calendar_view"))
						{

							// When updating an event remove the old event from
							// fullCalendar
							if (isUpdate)

								$('#calendar_event').fullCalendar('removeEvents', json.id);

							$('#calendar_event').fullCalendar('renderEvent', data.toJSON());
						}
						// Updates data to temeline
						else if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * contact in contact detail view or not
							 */
							$.each(event.contacts, function(index, contact)
							{
								if (contact.id == App_Contacts.contactDetailView.model.get('id'))
								{

									// Add model to collection. Disabled sort
									// while adding and
									// called
									// sort explicitly, as sort is not working
									// when it is called
									// by add
									// function
									if (eventsView && eventsView.collection)
									{
										if (eventsView.collection.get(data.id))
										{
											eventsView.collection.get(data.id).set(new BaseModel(data));
										}
										else
										{
											eventsView.collection.add(new BaseModel(data), { sort : false });
											eventsView.collection.sort();
										}
									}

									// Activates "Timeline" tab and its tab
									// content in
									// contact detail view
									// activate_timeline_tab();
									// add_entity_to_timeline(data);

									return false;
								}

							});
						}
						else if (App_Portlets.currentPosition && App_Portlets.todayEventsCollection && App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)] && (Current_Route == undefined || Current_Route == 'dashboard'))
						{
							if (isUpdate)
								App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.remove(json);

							// Updates events list view
							App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.add(data);

							App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].render(true);

						}
						else
							App_Calendar.navigate("calendar", { trigger : true });

						if (callback && typeof callback === 'function')
							callback(data);
					} });
}

/**
 * Get Hours and Minutes for the current time. It will be padded for 15 minutes
 * 
 * @method get_hh_mm
 * @param {Boolean}
 *            end_time to make end time 30 minutes more than start time
 * 
 */
function get_hh_mm(end_time, editFromContactPage)
{

	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();

	if (minutes % 15 != 0)
		minutes = minutes - (minutes % 15);

	// Make end time 30 minutes more than start time
	if (end_time)
	{
		if (minutes == "30")
		{
			hours = hours + 1;
			minutes = 0;
		}
		else if (minutes == "45")
		{
			hours = hours + 1;
			minutes = 15;
		}
		else
			minutes = minutes + 30;
	}

	if (hours < 10)
	{
		hours = "0" + hours;
	}
	if (minutes < 10)
	{
		minutes = "0" + minutes;
	}

	return hours + ':' + minutes;
}

function fillTimePicker(end_time)
{
	if (end_time)
	{
		var hours = new Date(end_time * 1000).getHours();
		var minutes = new Date(end_time * 1000).getMinutes();
		if (hours < 10)
		{
			hours = "0" + hours;
		}
		if (minutes < 10)
		{
			minutes = "0" + minutes;
		}

		return hours + ':' + minutes;
	}
}

// Fills owner select element in update activity modal form
function populateUsersInUpdateActivityModal(event)
{
	// Fills owner select element
	populateUsers("event-owners-list", $("#updateActivityForm"), event, 'eventOwner', function(data)
	{
		$("#updateActivityForm").find("#event-owners-list").html(data);
		if (event.owner)
		{
			$("#event-owners-list", $("#updateActivityForm")).find('option[value="' + event['owner'].id + '"]').attr("selected", "selected");
		}
		$("#event-owners-list", $("#updateActivityForm")).closest('div').find('.loading-img').hide();
	});
}

// Checks start time > end time and will update end time. Adds 30min to end time
// if its < start time.
function changeEndTime(startTime, endTime)
{
	console.log("In changeEndTime");
	console.log(startTime);
	console.log(endTime);

	if (startTime[0] > endTime[0] || (startTime[0] == endTime[0] && startTime[1] >= endTime[1]))
	{
		var hours = Number(startTime[0]);
		var minutes = Number(startTime[1]);

		if (minutes % 15 != 0)
			minutes = minutes - (minutes % 15);

		// Make end time 30 minutes more than start time
		if (minutes == "30")
		{
			if (hours == 23)
				hours = 0;
			else
				hours = hours + 1;
			minutes = 0;
		}
		else if (minutes == "45")
		{
			if (hours == 23)
				hours = 0;
			else
				hours = hours + 1;
			minutes = 15;
		}
		else
			minutes = minutes + 30;

		if (hours < 10)
		{
			hours = "0" + hours;
		}
		if (minutes < 10)
		{
			minutes = "0" + minutes;
		}

		console.log(hours + ':' + minutes);
		return hours + ':' + minutes;
	}
	else
		return endTime[0] + ':' + endTime[1];
}
