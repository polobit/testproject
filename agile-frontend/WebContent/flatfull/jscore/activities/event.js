/**
 * 
 * event.js is a script file to deal with the actions like creation, update and
 * deletion of events from client side.
 * 
 * @module Activities
 * 
 * author: Rammohan
 */

$(function(){

/**
	 * shows description field in new event model
	 */
	$("#updateActivityModal").on('click', '#add_event_desctiption', function(e)
	{
		e.preventDefault();
		$(".event_discription").removeClass("hide");
		$(this).hide();
		return;
	});


	$("#activityModal").on('click', '#add_event_desctiption', function(e)
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
	$("#updateActivityModal").on('click', '#update_event_validate', function(e)
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



$("#updateActivityModal").on('click', '#delete_web_event', function(e)
	{
		e.preventDefault();

		var event_id = $('#updateActivityForm input[name=id]').val();
		$("#updateActivityModal").modal('hide');
		$("#webEventCancelModel").modal('show');
		$("#cancel_event_title").html("Delete event &#39" + web_event_title + "&#39?");
		$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + event_id + "'/>");

	});


$("#updateActivityModal").on(
					'click',
					'#event_delete',
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
										else if (App_Portlets.currentPortletName && App_Portlets.currentPortletName == 'Mini Calendar')
									      {
												var a=new Date(parseInt($('.minical-portlet-event').attr('data-date')));	
												a.setHours(0,0,0,0);
												createCookie("current_date_calendar",a);
										       $('#calendar_container').fullCalendar( 'refetchEvents' );
										       App_Portlets.refetchEvents = true;
										       //eraseCookie('current_date_calendar');
									      }
										else if (App_Deal_Details.dealDetailView && Current_Route == "deal/" + App_Deal_Details.dealDetailView.model.get('id'))
										{

											if (dealEventsView && dealEventsView.collection)
											{
												if (dealEventsView.collection.get(event_id))
												{
													dealEventsView.collection.remove(event_id);
													dealEventsView.render(true);
												}
											}
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
	 * Highlights the event features (Shows event form and hides task form,
	 * changing color and font-weight)
	 */
		/**
	 * when web appointment event is deleted this event will be fired out
	 */
	$("#webEventCancelModel")
			.on(
					'click',
					'#cancel_delete',
					function(e)
					{
						e.preventDefault();

						var event_id = $('#webEventCancelForm input[name=event_id]').val();

						var parameter_value = $(this).attr("action_parameter");

						if (parameter_value == "donotdelete")
						{
							$("#webEventCancelModel").modal('hide');
							return;
						}
						var cancel_reason = $('#webEventCancelForm textarea[name=appointment_cancel_reason]').val();
						// variable
						var save_button = $(this);

						disable_save_button(save_button);
						$
								.ajax({
									url : 'core/api/events/cancelwebevent/?eventid=' + event_id + '&cancelreason=' + cancel_reason + '&action_parameter=' + parameter_value,
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
										else if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
										{
											var eventModel = eventsView.collection.get(event_id);
											eventsView.collection.remove(eventModel);
											enable_save_button(save_button);

											$("#webEventCancelModel").modal('hide');
											contact_details_tab.load_events();
											return;
										}

										// $('#updateActivityModal').find('span.save-status
										// img').remove();
										enable_save_button(save_button);

										$("#webEventCancelModel").modal('hide');

										$('#calendar_event').fullCalendar('removeEvents', event_id);
									} });
						if (readCookie("agile_calendar_view"))
						{
							var eventModel = eventCollectionView.collection.get(event_id);
							eventModel.set(eventModel, { remove : true });
							document.location.reload();

						}

					});


	

});


function initializeEventListners(el)
{


/*$("#ical_appointment_links").on('click', '#subscribe-ical', function(event)
{
	event.preventDefault();
	set_api_key();
});*/


/**
 * When Send Mail is clicked from Ical Modal, it hides the ical modal and shows
 * the ical-send email modal.
 */
$("#icalModal").off('click');
$("#icalModal").on('click', '#send-ical-email', function(event)
{
	event.preventDefault();

	$("#icalModal").modal('hide');


	// Removes previous modals if exist.
	if ($('#share-ical-by-email').size() != 0)
		$('#share-ical-by-email').remove();

	// Gets current user
	var CurrentuserModel = Backbone.Model.extend({ url : '/core/api/users/current-user', restKey : "domainUser" });

	var currentuserModel = new CurrentuserModel();

	currentuserModel.fetch({ success : function(data)
	{

		var model = data.toJSON();

		// Insert ical-url into model
		var icalURL = $('#icalModal').find('#ical-feed').text();
		model.ical_url = icalURL;

		getTemplate("share-ical-by-email", model, undefined, function(template_ui){
			if(!template_ui)
				  return;
			
			var emailModal = $(template_ui);
			var description = $(emailModal).find('textarea').val();
			description = description.replace(/<br\/>/g, "\r\n");
			$(emailModal).find('textarea').val(description);
			emailModal.modal('show');

			// Send ical info email
			send_ical_info_email(emailModal);
		}, null);

	} });
});


$("#calendar-listers").on('click', '.agendaDayWeekMonth', function()
{
	currentView = $(this).attr('id');
	fullCal.fullCalendar('changeView', currentView);
	$(this).parent().find('button').each(function()
	{
		if ($(this).attr('id') == currentView)
			$(this).addClass('bg-light');
		else
			$(this).removeClass('bg-light');
	});
	if (currentView == "agendaDay" || currentView == "agendaWeek")
	{
		fullCal.fullCalendar('option', 'contentHeight', 575);
	}
	else
	{
		fullCal.fullCalendar('option', 'contentHeight', 400);
	}

});

	$('#calendar-listers').on('click', '.agendaDayWeekMonth', function()
	{
		currentView = $(this).attr('id');
		fullCal.fullCalendar('changeView', currentView);
		$(this).parent().find('button').each(function()
		{
			if ($(this).attr('id') == currentView)
				$(this).addClass('bg-light');
			else
				$(this).removeClass('bg-light');
		});

	});

	/**
	 * Shows the event form fields in activity modal
	 */
	$("#calendar-listers").on('click', '.add-event', function(e)
	{
		e.preventDefault();

		$('#activityModal').modal('show');
		agile_type_ahead("event_relates_to_deals", $('#activityModal'), deals_typeahead, false,null,null,"core/api/search/deals",false, true);
		highlight_event();

		/*
		 * $('#task-date-1').val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-1").val(new Date().format('mm/dd/yyyy'));
		 * $("#event-date-2").val(new Date().format('mm/dd/yyyy'));
		 */

		return;
	});

	
	

	// evnet filters

	$("#calendar-listers").on('click', '.calendar_check', function(e)
	{
		createRequestUrlBasedOnFilter();
		var calendar = $(this).val();
		var ownerids = '';
		if (calendar == "agile")
		{
			if (this.checked == true)
			{
				ownerids = getOwnerIdsFromCookie(true);
				renderFullCalenarEvents(ownerids);
			}

			else
			{
				removeFullCalendarEvents(CURRENT_DOMAIN_USER.id);
			}

		}
		if(calendar == 'google')
		{
			if (this.checked == true)
			{
				//_init_gcal_options();
				addGoogleCalendarEvents();
			}
			else
			{
				
				removeGoogleEventSource();
			}
		}	
	});

	$("#calendar-listers").on('click', '.calendar_user_check', function(e)
	{
		// checkBothCalWhenNoCalSelected();
		createRequestUrlBasedOnFilter();
		// loadFullCalednarOrListView();
		var user_id = $(this).val();
		var domain_user_id = $(this).attr('data');
		if (this.checked == true)
		{
			renderFullCalenarEvents(user_id);
		}
		else
		{
			removeFullCalendarEvents(domain_user_id);
		}

		// $('.select_all_users').removeAttr("checked");

	});

	$("#calendar-listers").on('click', '.select_all_users', function(event)
	{ // on click
		if (this.checked)
		{ // check select status
			$('.calendar_user_check').each(function()
			{
				this.checked = true;
			});
		}
		else
		{
			$('.calendar_user_check').each(function()
			{ // loop through each checkbox
				if ($(this).val() != CURRENT_AGILE_USER.id)
					this.checked = false;
			});
		}
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	});




}






$(function()
{
	/**
	 * Shows activity modal, and highlights the event form features (Shows event
	 * form and hides task form, changes color and font-weight)
	 * 
	 */
	
	  $("body").on('click', '#show-activity', function(e) { e.preventDefault();
	  highlight_event();
	  
	  $("#activityModal").modal('show'); });
	 

	/**
	 * Activates the date picker to the corresponding fields in activity modal
	 * and activity-update modal
	 */

	var eventDate = $('#event-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY }).on('changeDate', function(ev)
	{
		// If event start date is changed and end date is less than start date,
		// change the value of the end date to start date.
		var eventDate2;
		if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1)
			eventDate2 = new Date(convertDateFromUKtoUS($('#event-date-2').val()));
		else
		 	eventDate2 = new Date($('#event-date-2').val());
		if (ev.date.valueOf() > eventDate2.valueOf())
		{
			$('#event-date-2').val($('#event-date-1').val());
		}

	});


	$('#event-date-2').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY});
	$('#update-event-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY }).on('changeDate', function(ev)

	{
		// If event start date is changed and end date is less than start date,
		// change the value of the end date to start date.
		var eventDate2;
		if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1)
			eventDate2 = new Date(convertDateFromUKtoUS($('#update-event-date-2').val()));
		else
		 	eventDate2 = new Date($('#update-event-date-2').val());
		if (ev.date.valueOf() > eventDate2.valueOf())
		{
			$('#update-event-date-2').val($('#update-event-date-1').val());
		}

	});

	$('#update-event-date-2').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY });


	/**
	 * Activates time picker for start time to the fields with class
	 * start-timepicker
	 */
	$('.start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false }).on('hide.timepicker', function(e)
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
	$('.start-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.start-timepicker').prop('value') != "" && $('.start-timepicker').prop('value') != undefined)
		{
			if ($('.start-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.start-timepicker').prop('value').split(":")[0];
			if ($('.start-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.start-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});

	/**
	 * Activates time picker for end time to the fields with class
	 * end-timepicker
	 */
	$('.end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
	console.log(get_hh_mm(true));
	$('.end-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.end-timepicker').prop('value') != "" && $('.end-timepicker').prop('value') != undefined)
		{
			if ($('.end-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.end-timepicker').prop('value').split(":")[0];
			if ($('.end-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.end-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});

	/**
	 * Activates time picker for start time to the fields with class
	 * update-start-timepicker
	 */
	$('.update-start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false }).on('hide.timepicker', function(e)
	{
		// ChangeTime event is not working, so need to invoke user method.
		var endTime = changeEndTime($('.update-start-timepicker').val().split(":"), $('.update-end-timepicker').val().split(":"));
		$('.update-end-timepicker').val(endTime); 
	});
	$('.update-start-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.update-start-timepicker').prop('value') != "" && $('.update-start-timepicker').prop('value') != undefined)
		{
			if ($('.update-start-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.update-start-timepicker').prop('value').split(":")[0];
			if ($('.update-start-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.update-start-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});

	/**
	 * Activates time picker for end time to the fields with class
	 * update-end-timepicker
	 */
	$('.update-end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
	$('.update-end-timepicker').timepicker().on('show.timepicker', function(e)
	{
		if ($('.update-end-timepicker').prop('value') != "" && $('.update-end-timepicker').prop('value') != undefined)
		{
			if ($('.update-end-timepicker').prop('value').split(":")[0] != undefined)
				e.time.hours = $('.update-end-timepicker').prop('value').split(":")[0];
			if ($('.update-end-timepicker').prop('value').split(":")[0] != undefined)
				e.time.minutes = $('.update-end-timepicker').prop('value').split(":")[1];
		}
		$('.bootstrap-timepicker-hour').val(e.time.hours);
		$('.bootstrap-timepicker-minute').val(e.time.minutes);
	});

	/**
	 * Sets the start time with current time and end time half an hour more than
	 * start time, when they have no values by the time the modal is shown.
	 */
	$('#activityModal, #activityTaskModal').on('shown.bs.modal', function()
	{
		// Show related to contacts list
		var el = $("#activityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);

		agile_type_ahead("event_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

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

		/*if($('#activityTaskModal').find('.new-task-related-contacts-input').find('ul').find('li').length>0)
		{
			$('#activityTaskModal').find('#new-task-related-contacts-label').parent().addClass('hide');
			$('#activityTaskModal').find('.new-task-related-contacts-input').removeClass('hide');
			$('#activityTaskModal').find('.new-task-related-contacts-label').removeClass('hide');
		}
		else
		{
			$('#activityTaskModal').find('#new-task-related-contacts-label').parent().removeClass('hide');
			$('#activityTaskModal').find('.new-task-related-contacts-input').addClass('hide');
			$('#activityTaskModal').find('.new-task-related-contacts-label').addClass('hide');
		}
		if($('#activityTaskModal').find('.new-task-related-deals-input').find('ul').find('li').length>0)
		{
			$('#activityTaskModal').find('#new-task-related-deals-label').parent().addClass('hide');
			$('#activityTaskModal').find('.new-task-related-deals-input').removeClass('hide');
			$('#activityTaskModal').find('.new-task-related-deals-label').removeClass('hide');
		}
		else
		{
			$('#activityTaskModal').find('#new-task-related-deals-label').parent().removeClass('hide');
			$('#activityTaskModal').find('.new-task-related-deals-input').addClass('hide');
			$('#activityTaskModal').find('.new-task-related-deals-label').addClass('hide');
		}

		if($('#activityModal').find('.new-event-related-contacts-input').find('ul').find('li').length>0)
		{
			$('#activityModal').find('#new-event-related-contacts-label').parent().addClass('hide');
			$('#activityModal').find('.new-event-related-contacts-input').removeClass('hide');
			$('#activityModal').find('.new-event-related-contacts-label').removeClass('hide');
		}
		else
		{
			$('#activityModal').find('#new-event-related-contacts-label').parent().removeClass('hide');
			$('#activityModal').find('.new-event-related-contacts-input').addClass('hide');
			$('#activityModal').find('.new-event-related-contacts-label').addClass('hide');
		}
		if($('#activityModal').find('.new-event-related-deals-input').find('ul').find('li').length>0)
		{
			$('#activityModal').find('#new-event-related-deals-label').parent().addClass('hide');
			$('#activityModal').find('.new-event-related-deals-input').removeClass('hide');
			$('#activityModal').find('.new-event-related-deals-label').removeClass('hide');
		}
		else
		{
			$('#activityModal').find('#new-event-related-deals-label').parent().removeClass('hide');
			$('#activityModal').find('.new-event-related-deals-input').addClass('hide');
			$('#activityModal').find('.new-event-related-deals-label').addClass('hide');
		}*/

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#updateActivityModal').on('show.bs.modal', function()
	{
		// Show related to contacts list
		var el = $("#updateActivityForm");
		agile_type_ahead("event_related_to", el, contacts_typeahead);
		
		agile_type_ahead("event_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);

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

		/*if($('#updateActivityModal').find('.update-event-related-contacts-input').find('ul').find('li').length>0)
		{
			$('#updateActivityModal').find('#update-event-related-contacts-label').parent().addClass('hide');
			$('#updateActivityModal').find('.update-event-related-contacts-input').removeClass('hide');
			$('#updateActivityModal').find('.update-event-related-contacts-label').removeClass('hide');
		}
		else
		{
			$('#updateActivityModal').find('#update-event-related-contacts-label').parent().removeClass('hide');
			$('#updateActivityModal').find('.update-event-related-contacts-input').addClass('hide');
			$('#updateActivityModal').find('.update-event-related-contacts-label').addClass('hide');
		}
		if($('#updateActivityModal').find('.update-event-related-deals-input').find('ul').find('li').length>0)
		{
			$('#updateActivityModal').find('#update-event-related-deals-label').parent().addClass('hide');
			$('#updateActivityModal').find('.update-event-related-deals-input').removeClass('hide');
			$('#updateActivityModal').find('.update-event-related-deals-label').removeClass('hide');
		}
		else
		{
			$('#updateActivityModal').find('#update-event-related-deals-label').parent().removeClass('hide');
			$('#updateActivityModal').find('.update-event-related-deals-input').addClass('hide');
			$('#updateActivityModal').find('.update-event-related-deals-label').addClass('hide');
		}*/

	});

	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#activityModal, #activityTaskModal').on('show.bs.modal', function(e)
	{
		$(".event_discription").addClass("hide");
		$("textarea#description").val('');
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
	$('#updateActivityModal').on('hidden.bs.modal', function()
	{

		if ($(this).hasClass('in'))
		{
			return;
		}

		$("#updateActivityForm").each(function()
		{
			this.reset();
		});

		$("#updateActivityForm").find("li").remove();
		$('#update-event-time-1').closest('.control-group').show();
		$('#update-event-date-2').closest('.row').show();
	});
	$('#activityModal').on('hidden.bs.modal', function()
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

		/*$('#activityModal').find('#new-event-related-contacts-label').parent().removeClass('hide');
		$('#activityModal').find('.new-event-related-contacts-input').addClass('hide');
		$('#activityModal').find('.new-event-related-contacts-label').addClass('hide');
		$('#activityModal').find('#new-event-related-deals-label').parent().removeClass('hide');
		$('#activityModal').find('.new-event-related-deals-input').addClass('hide');
		$('#activityModal').find('.new-event-related-deals-label').addClass('hide');*/
	});

	$('#webEventCancelModel').on('hidden.bs.modal', function()
	{
		$("#webEventCancelForm").each(function()
		{
			this.reset();
		});
	});

	/*$('#activityModal').on('click', '#new-event-related-contacts-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.new-event-related-contacts-input').removeClass('hide');
		$(this).parent().parent().find('.new-event-related-contacts-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#activityModal').on('click', '#new-event-related-deals-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.new-event-related-deals-input').removeClass('hide');
		$(this).parent().parent().find('.new-event-related-deals-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#updateActivityModal').on('click', '#update-event-related-contacts-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.update-event-related-contacts-input').removeClass('hide');
		$(this).parent().parent().find('.update-event-related-contacts-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});

	$('#updateActivityModal').on('click', '#update-event-related-deals-label', function(e){
		e.preventDefault();
		$(this).parent().parent().find('.update-event-related-deals-input').removeClass('hide');
		$(this).parent().parent().find('.update-event-related-deals-label').removeClass('hide');
		$(this).parent().addClass('hide');
	});*/

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
	$('input.date').val(getDateInFormat(new Date()));
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
						'<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times</a>Start date should not be greater than end date. Please change.</div>');

		return false;
	}
	else if (parseInt(startTime[0]) > parseInt(endTime[0]))
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater than end time. Please change.</div>');

		return false;
	}
	else if (parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1]))
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times</a>Start time should not be greater or equal to end time. Please change.</div>');

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
						event = renderEventBasedOnOwner(event);
						if (Current_Route == 'calendar' && !readCookie("agile_calendar_view"))
						{

							// When updating an event remove the old event from
							// fullCalendar
							if (isUpdate)

								$('#calendar_event').fullCalendar('removeEvents', json.id);

							// renders Event to full calendar based on Owner
							// checked or unchecked
							renderAddedEventToFullCalenarBasedOnCookie(event);
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
						else if (App_Portlets.currentPortletName && App_Portlets.currentPortletName == 'Mini Calendar')
					      {
							if($('.minical-portlet-event').attr('data-date')!=undefined){
								var a=new Date(parseInt($('.minical-portlet-event').attr('data-date')));	
								a.setHours(0,0,0,0);
								createCookie("current_date_calendar",a);
							}
							else{
								var a=new Date(parseInt($('.minical-portlet-event-add').attr('data-date')));	
								a.setHours(0,0,0,0);
								createCookie("current_date_calendar",a);
							}
							$('#calendar_container').fullCalendar( 'refetchEvents' );
						       App_Portlets.refetchEvents = true;
						       //eraseCookie('current_date_calendar');
					      }
						else if (App_Deal_Details.dealDetailView && Current_Route == "deal/" + App_Deal_Details.dealDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * contact in contact detail view or not
							 */
							$.each(event.deal_ids, function(index, deal_id)
							{
								if (deal_id == App_Deal_Details.dealDetailView.model.get('id'))
								{

									// Add model to collection. Disabled sort
									// while adding and
									// called
									// sort explicitly, as sort is not working
									// when it is called
									// by add
									// function
									if (dealEventsView && dealEventsView.collection)
									{
										if (dealEventsView.collection.get(data.id))
										{
											dealEventsView.collection.get(data.id).set(new BaseModel(data));
										}
										else
										{
											dealEventsView.collection.add(new BaseModel(data), { sort : false });
											dealEventsView.collection.sort();
										}
									}
									dealEventsView.render(true);
									return false;
								}

							});
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
