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
    $("#activityModal", "#updateActivityModal").on('click', '.bcp-select', function(){
         if($(this).children().hasClass('bcp-selected')){
         	$(this).children().removeClass('bcp-selected');
         	$("#backgroundColor").val("");
         }
         else{
         	var id = $(this).attr('id');
         	$(".bcp-select").children().removeClass('bcp-selected');
         	$(this).children().addClass('bcp-selected');
         	$("#backgroundColor").val(id);
         }

    });

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
		var currentDiv = $('#updateActivityModal').find("#current_div").val();
		save_event('updateActivityForm', 'updateActivityModal', true, this,currentDiv, function(data)
		{
			console.log(data);
			if(eventCollectionView && eventCollectionView.collection){
				var eventModel = eventCollectionView.collection.get(eventId);
				eventModel.set(data.toJSON(), { merge : true });
				eventCollectionView.render(true);
			}
		});

	});



$("#updateActivityModal").on('click', '#delete_web_event', function(e)
	{
		e.preventDefault();

		if(hasScope("DELETE_CALENDAR"))
		{
			var event_id = $('#updateActivityForm input[name=id]').val();
			$("#updateActivityModal").modal('hide');
			$("#webEventCancelModel").modal('show');
			$("#cancel_event_title").html("{{agile_lng_translate 'events' 'delete-event'}} &#39" + web_event_title + "&#39?");
			$("#event_id_hidden").html("<input type='hidden' name='event_id' id='event_id' value='" + event_id + "'/>");
		}
		else
		{
			$("#updateActivityModal").find('span.error-status').html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>{{agile_lng_translate "tasks" "you-do-not-have-permission-to-delete-this-event"}}</i></p></div>');
			setTimeout(function()
			{
				$("#updateActivityModal").find('span.error-status').html('');
			}, 2000);
		}

	});


$("#updateActivityModal").on(
					'click',
					'#event_delete',
					function(e)
					{
						e.preventDefault();

						if ($(this).attr('disabled') == 'disabled')
							return;
						var save_button = $(this);
						/**
						 * Confirmation alert to delete an event
						 */
						showAlertModal("delete_event", "confirm", function(){
							var event_id = $('#updateActivityForm input[name=id]').val();
							

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
											if (App_Portlets.currentPosition && App_Portlets.todayEventsCollection && App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)])
											{
												App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection
														.remove(App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.get(event_id));

												App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].render(true);

											}	
											else if (App_Portlets.currentPortletName && App_Portlets.currentPortletName == 'Mini Calendar')
										      {
													var a=new Date(parseInt($('.minical-portlet-event').attr('data-date')));	
													a.setHours(0,0,0,0);
													_agile_set_prefs("current_date_calendar",a);
											       $('.portlet_body_calendar').each(function(){
											       	var that=$(this);
											       	if(that.parents('.gs-w').attr('data-col')+that.parents('.gs-w').attr('data-row')==App_Portlets.currentPosition){
											       	 App_Portlets.eventCalendar=that;
											       	$('#calendar_container',that).fullCalendar( 'refetchEvents' );

											       App_Portlets.refetchEvents = true;
											   }
											       });
											       
											       //_agile_delete_prefs('current_date_calendar');
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
											else if ((App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id')) || 
												App_Leads.leadDetailView && Current_Route == "lead/" + App_Leads.leadDetailView.model.get('id'))
											{
												if (eventsView && eventsView.collection)
												{
													if (eventsView.collection.get(event_id))
													{
														eventsView.collection.remove(event_id);
														eventsView.render(true);
													}
												}
											}

											// $('#updateActivityModal').find('span.save-status
											// img').remove();
											enable_save_button(save_button);
											$("#updateActivityModal").modal('hide');

											var eventId = $('#updateActivityModal').find("input[type='hidden']").val();
											$('#calendar_event').fullCalendar('removeEvents', eventId);
										}, error : function(err)
										{
											enable_save_button(save_button);
											$('#updateActivityModal').find('span.error-status').html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>'+err.responseText+'</i></p></div>');
											setTimeout(function()
											{
												$('#updateActivityModal').find('span.error-status').html('');
											}, 2000);
											console.log('-----------------', err.responseText);
										} });
							if (_agile_get_prefs("agile_calendar_view"))
							{
								var eventModel = eventCollectionView.collection.get(event_id);
								eventModel.set(eventModel, { remove : true });
								document.location.reload();

							}
						});

						

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
										if (App_Portlets.currentPosition && App_Portlets.todayEventsCollection && App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)])
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
						if (_agile_get_prefs("agile_calendar_view"))
						{
							var eventModel = eventCollectionView.collection.get(event_id);
							eventModel.set(eventModel, { remove : true });
							document.location.reload();

						}

					});


	

});


function initializeEventListners(el)
{

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

		$('#activityModal').html(getTemplate("new-event-modal")).modal('show');

		agile_type_ahead("event_relates_to_deals", $('#activityModal'), deals_typeahead, false,null,null,"core/api/search/deals",false, true);
		highlight_event();
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

		if(calendar == 'google'){
			if (this.checked == true){
				//_init_gcal_options();
				addGoogleCalendarEvents();
			}else{
				removeGoogleEventSource();
			}
		}	

		if(calendar == 'office'){
			if(this.checked == true){
				addOffice365CalendarEvents();
			}else{
				removeEventSource('office');
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
	
	  $("body").on('click', '#show-activity', function(e) { 
	  		e.preventDefault();

	  		$('#activityModal').html(getTemplate("new-event-modal")).modal('show');
	 		highlight_event();
	  		
	  });
	 

	 function loadModalsDateandTimepickers(el){
	 	agile_type_ahead("event_related_to", el, contacts_typeahead);

		agile_type_ahead("event_relates_to_deals", el, deals_typeahead, false,null,null,"core/api/search/deals",false, true);
		var d1 = new Date ();
		var d2 = new Date ( d1 );
		d2.setHours(d1.getHours()+3);

		head.js(CSS_PATH + 'css/businesshours/jquerytimepicker.css',
				LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
				function(){
		 			$('.new-task-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
		 		}
		);

		$('.new-task-timepicker').focus(function(){
			$('#activityTaskModal').css("overflow", "hidden");
		});
		
		$('.new-task-timepicker').blur(function(){
			$('#activityTaskModal').css("overflow", "auto");
		});

			// sets the time in time picker if it is empty
		if ($('.new-task-timepicker', el).val() == '')
			$('.new-task-timepicker', el).val(get_hh_mm());

		$('#task-date-1', el).datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY, autoclose: true});
		$('#task-date-1', el).datepicker('update');		
	 }


	/**
	 * Sets the start time with current time and end time half an hour more than
	 * start time, when they have no values by the time the modal is shown.
	 */
	$('#activityModal, #activityTaskModal').on('shown.bs.modal', function()
	{		
		// Show related to contacts list
		var el = $("#activityForm");
		loadModalsDateandTimepickers(el);
		el = $('#taskForm');
		loadModalsDateandTimepickers(el);	

		
		// $('.new-task-timepicker').timepicker({ defaultTime : d2.format("HH:MM") , showMeridian : false });
		// $('.new-task-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.new-task-timepicker').prop('value') != "" && $('.new-task-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.new-task-timepicker').prop('value').split(":")[0];
		// 		if ($('.new-task-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.new-task-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

		activateSliderAndTimerToTaskModal(el);

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

		if ($('#allDay', el).is(':checked'))
		{
			$('#update-event-time-1', el).closest('.control-group').hide();
			$('#update-event-date-2', el).closest('.row').hide();
		}

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');

		// $("input.date", el).datepicker('update');

	});

	$('#activityModal, #activityTaskModal, #updateActivityModal').on('shown.bs.modal', function(e)
	{
		if($(e.target).hasClass("date"))
			   return;

		// Update will highlight the date of in date picker
		$("input.date").each(function(index, ele){$(ele).datepicker('update');});

	});
		
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#activityModal, #activityTaskModal, #updateActivityModal').on('show.bs.modal', function(e)
	{
		if($(e.target).hasClass("date"))
			   return;

		$(".event_discription").addClass("hide");
		$("textarea#description").val('');
		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');

		if($("#activityForm").length  > 0){
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
		}
		
		/**
		 * Activates the date picker to the corresponding fields in activity modal
		 * and activity-update modal
		 */

		var eventDate = $('#event-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose: true }).on('changeDate', function(ev)
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


		$('#event-date-2').datepicker({ format : CURRENT_USER_PREFS.dateFormat , weekStart : CALENDAR_WEEK_START_DAY, autoclose: true});
		$('#update-event-date-1').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose: true }).on('changeDate', function(ev)

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

		$('#update-event-date-2').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose: true });

		head.js(CSS_PATH + 'css/businesshours/jquerytimepicker.css',
				LIB_PATH + 'lib/businesshours/jquerytimepicker.js',
				function(){
					$('.start-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
					$('.end-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
					$('.update-start-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });
					$('.update-end-timepicker').timepicker({ 'timeFormat' : 'H:i', 'step' : 15 });					
		 			
		 			$('.start-timepicker').blur(function(){
		 				$('#activityModal').css("overflow", "auto");
		 			});

		 			$('.start-timepicker').focus(function(){
		 				$('#activityModal').css("overflow", "hidden");
		 			});
		 			
		 			$('.end-timepicker').blur(function(){
		 				$('#activityModal').css("overflow", "auto");
		 			});

		 			$('.end-timepicker').focus(function(){
		 				$('#activityModal').css("overflow", "hidden");
		 			});
		 			
		 			$('.update-start-timepicker').blur(function(){
		 				$('#activityModal').css("overflow", "auto");
		 			});

		 			$('.update-start-timepicker').focus(function(){
		 				$('#activityModal').css("overflow", "hidden");
		 			});
		 			
		 			$('.update-end-timepicker').blur(function(){
		 				$('#activityModal').css("overflow", "auto");
		 			});

		 			$('.update-end-timepicker').focus(function(){
		 				$('#activityModal').css("overflow", "hidden");
		 			});
				}
		);

		/**
		 * Fills current time only when there is no time in the fields
		 */
		if ($('.start-timepicker').val() == '')
			$('.start-timepicker').val(get_hh_mm());

		if ($('.end-timepicker').val() == '')
			$('.end-timepicker').val(get_hh_mm(true));

		if ($('.update-start-timepicker').val() == '')
			$('.update-start-timepicker').val(get_hh_mm());

		if ($('.update-end-timepicker').val() == '')
			$('.update-end-timepicker').val(get_hh_mm(true));

		/**
		 * Activates time picker for start time to the fields with class
		 * start-timepicker
		 */

		// $('.start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false }).on('hide.timepicker', function(e)
		// {
		// 	if ($('#activityModal #allDay').is(':checked'))
		// 	{
		// 		$('#event-time-1').closest('.control-group').hide();
		// 		$('#event-date-2').closest('.row').hide();
		// 	}

		// 	// ChangeTime event is not working, so need to invoke user method.
		// 	var endTime = changeEndTime($('.start-timepicker').val().split(":"), $('.end-timepicker').val().split(":"));
		// 	$('.end-timepicker').val(endTime);

		// 	e.stopImmediatePropagation();
		// 	return false;
		// });

		// $('.start-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.start-timepicker').prop('value') != "" && $('.start-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.start-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.start-timepicker').prop('value').split(":")[0];
		// 		if ($('.start-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.start-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

		/**
		 * Activates time picker for end time to the fields with class
		 * end-timepicker
		 */
		// $('.end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
		// console.log(get_hh_mm(true));
		// $('.end-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.end-timepicker').prop('value') != "" && $('.end-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.end-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.end-timepicker').prop('value').split(":")[0];
		// 		if ($('.end-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.end-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

		// /**
		//  * Activates time picker for start time to the fields with class
		//  * update-start-timepicker
		//  */
		// $('.update-start-timepicker').timepicker({ defaultTime : 'current', showMeridian : false }).on('hide.timepicker', function(e)
		// {
		// 	// ChangeTime event is not working, so need to invoke user method.
		// 	var endTime = changeEndTime($('.update-start-timepicker').val().split(":"), $('.update-end-timepicker').val().split(":"));
		// 	$('.update-end-timepicker').val(endTime); 
		// });

		// $('.update-start-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.update-start-timepicker').prop('value') != "" && $('.update-start-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.update-start-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.update-start-timepicker').prop('value').split(":")[0];
		// 		if ($('.update-start-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.update-start-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

		// /**
		//  * Activates time picker for end time to the fields with class
		//  * update-end-timepicker
		//  */
		// $('.update-end-timepicker').timepicker({ defaultTime : get_hh_mm(true), showMeridian : false });
		// $('.update-end-timepicker').timepicker().on('show.timepicker', function(e)
		// {
		// 	if ($('.update-end-timepicker').prop('value') != "" && $('.update-end-timepicker').prop('value') != undefined)
		// 	{
		// 		if ($('.update-end-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.hours = $('.update-end-timepicker').prop('value').split(":")[0];
		// 		if ($('.update-end-timepicker').prop('value').split(":")[0] != undefined)
		// 			e.time.minutes = $('.update-end-timepicker').prop('value').split(":")[1];
		// 	}
		// 	$('.bootstrap-timepicker-hour').val(e.time.hours);
		// 	$('.bootstrap-timepicker-minute').val(e.time.minutes);
		// });

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

	$('#activityTaskModal').on('hidden.bs.modal', function()
	 {	
	 	 $("#taskForm").find("ul").remove();
	 	
        remove_validation_errors("activityTaskModal");
       
	 });
	$('#activityModal').on('hidden.bs.modal', function()
	 {
	 	
	 	 $("#activityForm").find("ul").remove();
        remove_validation_errors("activityModal"); 	
       
	 });
	
	$('#webEventCancelModel').on('hidden.bs.modal', function()
	{
		$("#webEventCancelForm").each(function()
		{
			this.reset();
		});
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
						'<div class="alert alert-danger m-t-sm" style="margin-bottom:5px;"><a class="close" data-dismiss="alert" href="#">&times</a>{{agile_lng_translate "events" "start-date-error"}}</div>');

		return false;
	}
	else if (parseInt(startTime[0]) > parseInt(endTime[0]))
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-danger m-t-sm" style="margin-bottom:5px;"><a class="close" data-dismiss="alert" href="#">&times</a>{{agile_lng_translate "events" "start-time-error"}}</div>');

		return false;
	}
	else if (parseInt(startTime[0]) == parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1]))
	{
		$('#' + modalName)
				.find(".invalid-range")
				.html(
						'<div class="alert alert-danger m-t-sm" style="margin-bottom:5px;"><a class="close" data-dismiss="alert" href="#">&times</a>{{agile_lng_translate "events" "start-time-equals-error"}}</div>');

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
function save_event(formId, modalName, isUpdate, saveBtn, el,callback)
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
						if (App_Portlets.currentPortletName && App_Portlets.currentPortletName == 'Mini Calendar' && el == "Mini Calendar")
					      {
							
						$('.portlet_body_calendar').each(function(){
										       	var that=$(this);
										       	if(that.parents('.gs-w').attr('data-col')+that.parents('.gs-w').attr('data-row')==App_Portlets.currentPosition){
										       	if($('.minical-portlet-event',that).attr('data-date')!=undefined){
								var a=new Date(parseInt($('.minical-portlet-event',that).attr('data-date')));	
								a.setHours(0,0,0,0);
								_agile_set_prefs("current_date_calendar",a);
							}
							else{
								var a=new Date(parseInt($('.minical-portlet-event-add',that).attr('data-date')));	
								a.setHours(0,0,0,0);
								_agile_set_prefs("current_date_calendar",a);
							}
										       	 App_Portlets.eventCalendar=that;
										       	$('#calendar_container',that).fullCalendar( 'refetchEvents' );
										       App_Portlets.refetchEvents = true;
										   }
										       });
					      }

					      else if (App_Portlets.currentPosition && App_Portlets.todayEventsCollection && App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)] && el == "Events Dashlet")
						{
							if (isUpdate)
								App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.remove(json);

							// Updates events list view
							App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].collection.add(data);

							App_Portlets.todayEventsCollection[parseInt(App_Portlets.currentPosition)].render(true);

						}
						else if (Current_Route == 'calendar' && !_agile_get_prefs("agile_calendar_view"))
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
						else if ((App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id')) || 
							(App_Leads.leadDetailView && Current_Route == "lead/" + App_Leads.leadDetailView.model.get('id')))
						{
							var contactId;
							if(App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
							{
								contactId = App_Contacts.contactDetailView.model.get('id');
							}
							else
							{
								contactId = App_Leads.leadDetailView.model.get('id');
							}
							/*
							 * Verifies whether the added task is related to the
							 * contact in contact detail view or not
							 */
							$.each(event.contacts, function(index, contact)
							{
								if (contact.id == contactId)
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
										var owner = data.get("owner_id");

									  	if(!owner){
									  		owner = data.get("owner").id;
									  	}

										if (eventsView.collection.get(data.id))
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												eventsView.collection.get(data.id).set(new BaseModel(data));
											}
											
										}
										else
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												eventsView.collection.add(new BaseModel(data), { sort : false });
												eventsView.collection.sort();
											}
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
						else if (App_Companies.companyDetailView && Current_Route == "company/" + App_Companies.companyDetailView.model.get('id'))
						{

							/*
							 * Verifies whether the added task is related to the
							 * company in company detail view or not
							 */
							$.each(event.contacts, function(index, contact)
							{
								if (contact.id == App_Companies.companyDetailView.model.get('id'))
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
										var owner = data.get("owner_id");

									  	if(!owner){
									  		owner = data.get("owner").id;
									  	}

										if (eventsView.collection.get(data.id))
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												eventsView.collection.get(data.id).set(new BaseModel(data));
											}
											
										}
										else
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												eventsView.collection.add(new BaseModel(data), { sort : false });
												eventsView.collection.sort();
											}
										}
										eventsView.render(true);
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
								_agile_set_prefs("current_date_calendar",a);
							}
							else{
								var a=new Date(parseInt($('.minical-portlet-event-add').attr('data-date')));	
								a.setHours(0,0,0,0);
								_agile_set_prefs("current_date_calendar",a);
							}
							$('#calendar_container').fullCalendar( 'refetchEvents' );
						       App_Portlets.refetchEvents = true;
						       //_agile_delete_prefs('current_date_calendar');
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
										var owner = data.get("owner_id");

									  	if(!owner){
									  		owner = data.get("owner").id;
									  	}

										if (dealEventsView.collection.get(data.id))
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												dealEventsView.collection.get(data.id).set(new BaseModel(data));
											}
										}
										else
										{
											if(hasScope("VIEW_CALENDAR") || CURRENT_DOMAIN_USER.id == owner){
												dealEventsView.collection.add(new BaseModel(data), { sort : false });
												dealEventsView.collection.sort();
											}
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
					}, error : function(model, err)
					{
						enable_save_button($(saveBtn));
						$('#' + modalName).find('span.error-status').html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>'+err.responseText+'</i></p></div>');
						setTimeout(function()
						{
							$('#' + modalName).find('span.error-status').html('');
						}, 2000);
						console.log('-----------------', err.responseText);
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
	// var s0 = startTime[0];
 //    var s1=startTime[1];
    var reg = /[a-zA-Z]/;
   
  for(var i=0;i<startTime.length;i++)
  {
     if (reg.test(startTime[i])) {
   startTime[i]=00;
	}
	else if(!reg.test(startTime[i])){
		startTime[i] = startTime[i].substring(0,2);
	}


  }

   /*if (reg.test(s1)) {
   startTime[1]=00;
	}
	else if(!reg.test(s1)){
		startTime[1] = s1.substring(0,2);
	}*/

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
