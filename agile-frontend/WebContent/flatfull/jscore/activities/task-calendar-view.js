function getCalendarView() {
	App_Calendar.allTasksCalendarView = {};
	var calendarView = (!_agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id)) ? 'month' : _agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id);
	fullCalTasks = $('#task-calendar-based-condition')
			.fullCalendar(
					{

						/**
						 * Renders the events displaying currently on
						 * fullCalendar
						 * 
						 * @method events
						 * @param {Object}
						 *            start fullCalendar current section start
						 *            day date object
						 * @param {Object}
						 *            end fullCalendar current section end day
						 *            date object
						 * @param {function}
						 *            callback displays the events on
						 *            fullCalendar
						 * 
						 */

						events : function(start, end, callback)
						{
							var tasksURL = "core/api/tasks/calendar/"
							tasksURL += getParamsNew();
							tasksURL += '&start_time='+start.getTime() / 1000+'&end_time='+end.getTime() / 1000;
							$.ajax({
					            url: tasksURL,
					            dataType: 'json',
					            success: function(doc) {
					            	if(doc){
					            		var events = [];
						                $.each(doc, function(index, data) {
						                	setCalendarTaskColors(data);
			            				   	events.push(data);
						                });
										App_Calendar.allTasksCalendarView = new Base_Collection_View( { data: events });
						                callback(App_Calendar.allTasksCalendarView.collection.toJSON());
					            	}
					                hideTransitionBar();
					            }
					        });
						},
						header : { left : 'prev', center : 'title', right : 'next' },
						defaultView : calendarView,
						slotEventOverlap : false,
						viewDisplay : function(view)
						{
							_agile_set_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id, view.name, 90);
							$(".fc-agenda-axis").addClass('bg-light lter');
						},
						loading : function(bool)
						{
							if (bool)
							{
								pushLoading();
								$("#loading_calendar_events").remove();
								$('.fc-header-left')
										.append(
												'<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle;padding-top: 5px;position: absolute;">loading...</span>')
										.show();
								$('.fc-header-left').show();

							}
							else
							{
								if(popLoading() <= 0)
								{
									// $('#loading').hide();
									$("#loading_calendar_events").hide();
									start_tour('calendar');	
								}
								
							}
							$(".fc-agenda-axis").addClass('bg-light lter');
							$(".ui-resizable-handle").hide();
						},
						selectable : true,
						selectHelper : true,
						editable : true,
						theme : false,
						contentHeight : 400,
						firstDay : CALENDAR_WEEK_START_DAY,
						firstHour : 7,
						themeButtonIcons : { prev : 'fc-icon-left-single-arrow', next : 'fc-icon-right-single-arrow' },
						eventMouseover : function(event, jsEvent, view)
						{

							calendarView = (!_agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id)) ? 'month' : _agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id);
							var reletedContacts = '';
							var meeting_type = '';
							 	
								if(event.contacts != null){
									if (event.contacts.length > 0){
										reletedContacts += '<i class="icon-user text-muted m-r-xs"></i>';
									}
									for (var i = 0; i < event.contacts.length; i++)
									{
										if (event.contacts[i].entity_type == "contact_entity")
										{
											var last_name = getPropertyValue(event.contacts[i].properties, "last_name");
											if (last_name == undefined)
												last_name = "";
											if(event.contacts[i].type == 'COMPANY')
												reletedContacts += '<a class="text-info" href="#company/' + event.contacts[i].id + '">' + getPropertyValue(
													event.contacts[i].properties, "name") + '</a>';
											else
												reletedContacts += '<a class="text-info" href="#contact/' + event.contacts[i].id + '">' + getPropertyValue(
														event.contacts[i].properties, "first_name") + ' ' + last_name + '</a>';
										}else{
											reletedContacts += '<a class="text-info" href="#contact/' + event.contacts[i].id + '">' + getPropertyValue(
													event.contacts[i].properties, "name") + '</a>';
										}
										if (i != event.contacts.length - 1){
											reletedContacts += ', ';
										}
									}
								}
								
								var leftorright = 'left';	
								var pullupornot = '';
								var popoverElement = '';
								var popover_min_width = 300;
									
									if (event.meeting_type && event.description){
										meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span>Meeting Type - ' + event.meeting_type + '</span><br/><span title=' + event.description + '>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + addDotsAtEnd(event.description) + '</span>';
									}else if (event.description){
										meeting_type = '<i class="icon-comment-alt text-muted m-r-xs"></i><span title=' + event.description + '>' + addDotsAtEnd(event.description) + '</span>';
									}
											
									if (calendarView == "month")
									{
										popover_min_width = $('.fc-view-month').find('.fc-widget-content').eq(0).width() * 2;
										var left = jsEvent.currentTarget.offsetLeft + jsEvent.currentTarget.offsetWidth + 10;
										var top = jsEvent.currentTarget.offsetTop;
										if ($('.fc-border-separate:visible').width() - left < popover_min_width)
										{
											left = jsEvent.currentTarget.offsetLeft - popover_min_width - 10;
											leftorright = 'right';
										}
										if ($('.fc-border-separate:visible').width() - popover_min_width - 20 < jsEvent.currentTarget.offsetWidth)
										{
											left = ((jsEvent.currentTarget.offsetLeft + jsEvent.currentTarget.offsetWidth + 10) / 2) - (popover_min_width / 2);
											top = jsEvent.currentTarget.offsetTop + jsEvent.currentTarget.offsetHeight + 10;
											leftorright = 'top';
										}
										if(event.type == "officeCalendar"){
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + 
																 '<div class="panel bg-white b-a pos-rlt p-sm">' + 
																 '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + 
																 '<div class="m-b-sm"><div class="pull-left text-flow-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' +
																 '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start.format('dd-mmm-yyyy HH:MM') + '</div>' + 
																 '<div class="text-ellipsis">' + reletedContacts + '</div>' + 
																 '<div class="text-ellipsis">' + meeting_type + '</div>' + 
																 '</div>' + '</div>';
											$(this).after(popoverElement);
										}else{
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="width:100%;min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.taskOwner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
											$(this).after(popoverElement);
										}
										
										if ($('.fc-border-separate:visible').height() - jsEvent.currentTarget.offsetTop < $(this).parent().find('.fc-overlayw')
												.height())
										{
											$(this).parent().find('.fc-overlayw').css("top",
													top - $(this).parent().find('.fc-overlayw').height() + jsEvent.currentTarget.offsetHeight + 20 + "px");
											$(this).parent().find('.fc-overlayw').find('.arrow').css("top", $(this).parent().find('.fc-overlayw').height() - 31 + "px");
										}
										if ($('.fc-border-separate:visible').width() - popover_min_width - 20 < jsEvent.currentTarget.offsetWidth)
										{
											$(this).parent().find('.fc-overlayw').find('.arrow').css("top", "-9px");
										}
										if (($('.fc-border-separate:visible').height() - jsEvent.currentTarget.offsetTop - jsEvent.currentTarget.offsetHeight - 10 < $(
												this).parent().find('.fc-overlayw').height() + 10) && ($('.fc-border-separate:visible').width() - popover_min_width - 20 < jsEvent.currentTarget.offsetWidth))
										{
											$(this).parent().find('.fc-overlayw').find('.arrow').removeClass('top').addClass('bottom');
											left = ((jsEvent.currentTarget.offsetLeft + jsEvent.currentTarget.offsetWidth + 10) / 2) - (popover_min_width / 2);
											top = jsEvent.currentTarget.offsetTop - $(this).parent().find('.fc-overlayw').height() + 10;
											$(this).parent().find('.fc-overlayw').css({ "top" : top + "px", "lef" : left + "px" });
											$(this).parent().find('.fc-overlayw').find('.arrow').css("top", $(this).parent().find('.fc-overlayw').height() - 22 + "px");
										}
									}
									else if (calendarView == "agendaWeek")
									{
										popover_min_width = $('.fc-view-agendaWeek').find('.fc-widget-content').eq(0).width() * 2;
										var left = jsEvent.currentTarget.offsetLeft + jsEvent.currentTarget.offsetWidth + 10;
										var top = jsEvent.currentTarget.offsetTop;
										if ($('.fc-agenda-slots:visible').width() - left < popover_min_width)
										{
											left = jsEvent.currentTarget.offsetLeft - popover_min_width - 10;
											leftorright = 'right';
										}
										
										if(event.type == "officeCalendar"){
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + 
																 '<div class="panel bg-white b-a pos-rlt p-sm">' + 
																 '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + 
																 '<div class="m-b-sm"><div class="pull-left text-flow-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' +
																 '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start.format('dd-mmm-yyyy HH:MM') + '</div>' + 
																 '<div class="text-ellipsis">' + reletedContacts + '</div>' + 
																 '<div class="text-ellipsis">' + meeting_type + '</div>' + 
																 '</div>' + '</div>';
											$(this).after(popoverElement);
										}else{
											// var event_width =
											// jsEvent.currentTarget.offsetWidth;
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="width:100%;min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.taskOwner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
											$(this).after(popoverElement);									
										}
										
										if ($('.fc-agenda-slots:visible').height() - jsEvent.currentTarget.offsetTop < $(this).parent().find('.fc-overlayw').height())
										{
											$(this).parent().find('.fc-overlayw').css("top",
													top - $(this).parent().find('.fc-overlayw').height() + jsEvent.currentTarget.offsetHeight + 20 + "px");
											$(this).parent().find('.fc-overlayw').find('.arrow').css("top", $(this).parent().find('.fc-overlayw').height() - 31 + "px");
										}
									}
									else if (calendarView == "agendaDay")
									{
										var left = jsEvent.currentTarget.offsetLeft;
										var top = jsEvent.currentTarget.offsetTop + jsEvent.currentTarget.offsetHeight + 10;
										leftorright = 'top';
										if ($('.fc-agenda-slots:visible').width() - jsEvent.currentTarget.offsetLeft < popover_min_width)
										{
											left = jsEvent.currentTarget.offsetLeft - jsEvent.currentTarget.offsetWidth - ($('.fc-agenda-slots:visible').width() - jsEvent.currentTarget.offsetLeft - jsEvent.currentTarget.offsetWidth);
										}
										
										if(event.type == "officeCalendar"){
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + 
																 '<div class="panel bg-white b-a pos-rlt p-sm">' + 
																 '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + 
																 '<div class="m-b-sm"><div class="pull-left text-flow-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' +
																 '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start.format('dd-mmm-yyyy HH:MM') + '</div>' + 
																 '<div class="text-ellipsis">' + reletedContacts + '</div>' + 
																 '<div class="text-ellipsis">' + meeting_type + '</div>' + 
																 '</div>' + '</div>';
											$(this).after(popoverElement);
										}else{
											try{	
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="width:100%;min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.taskOwner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
											$(this).after(popoverElement);
											}catch(e){}
										}
										
										$(this).parent().find('.fc-overlayw').find('.arrow').css({ "top" : "-9px", "left" : "11px" });
										if ($('.fc-agenda-slots:visible').width() - jsEvent.currentTarget.offsetLeft < popover_min_width)
										{
											$(this).parent().find('.fc-overlayw').find('.arrow').css({ "top" : "-9px", "left" : popover_min_width - 15 + "px" });
										}
										if ((jsEvent.currentTarget.offsetTop < $(this).parent().find('.fc-overlayw').height() + 10) && ($('.fc-agenda-slots:visible')
												.height() - jsEvent.currentTarget.offsetHeight < $(this).parent().find('.fc-overlayw').height() + 10))
										{
											$(this).parent().find('.fc-overlayw').css("top", jsEvent.currentTarget.offsetTop + 40 + "px");
										}
										if ((jsEvent.currentTarget.offsetTop > $(this).parent().find('.fc-overlayw').height() + 10) && ($('.fc-agenda-slots:visible')
												.height() - (jsEvent.currentTarget.offsetHeight + jsEvent.currentTarget.offsetTop) < $(this).parent().find(
												'.fc-overlayw').height() + 10))
										{
											$(this).parent().find('.fc-overlayw').find('.arrow').removeClass('top').addClass('bottom');
											$(this).parent().find('.fc-overlayw').find('.arrow').css("top", $(this).parent().find('.fc-overlayw').height() - 22 + "px");
											$(this).parent().find('.fc-overlayw').css(
													"top",
													$('.fc-agenda-slots:visible').height() - jsEvent.currentTarget.offsetHeight - $(this).parent().find('.fc-overlayw')
															.height() + 7 + "px");
											if ($('.fc-agenda-slots:visible').width() - jsEvent.currentTarget.offsetLeft < popover_min_width)
											{
												$(this).parent().find('.fc-overlayw')
														.css(
																"left",
																jsEvent.currentTarget.offsetLeft - jsEvent.currentTarget.offsetWidth - ($('.fc-agenda-slots:visible')
																		.width() - jsEvent.currentTarget.offsetLeft - jsEvent.currentTarget.offsetWidth) + "px");
											}
										}
									}
							$(jsEvent.currentTarget).css('z-index', 9);
							if (event.allDay){
								$(jsEvent.currentTarget.parentElement).css('z-index', 9);
							}
							$(this).parent().find('.fc-overlayw').show();
							$(this).find(".ui-resizable-handle").show();
						},
						eventMouseout : function(event, jsEvent, view)
						{
							$(this).parent().find('.fc-overlayw').hide();
							$(this).parent().find('.fc-overlayw').remove();
							$(this).find(".ui-resizable-handle").hide();
							$(jsEvent.currentTarget).css('z-index', 8);
							if (event.allDay)
							{
								$(jsEvent.currentTarget.parentElement).css('z-index', 8);
							}
						},
						eventAfterRender : function(event, element, view)
						{
							$(".ui-resizable-handle").hide();
							event = renderEventBasedOnOwner(event);
							var start_event = new Date(event.start).getTime() / 1000;
							var end_event = new Date(event.end).getTime() / 1000;
							if (end_event - start_event == 3600)
							{
								$(element).height('');
							}
							$(element).find('.fc-event-bg').hide();
						},

						/**
						 * Shows event pop-up modal with pre-filled date and
						 * time values, when we select a day or multiple days of
						 * the fullCalendar
						 * 
						 * @method select
						 * @param {Object}
						 *            start start-date of the event
						 * @param {Object}
						 *            end end-date of the event
						 * @param {Boolean}
						 *            allDay
						 */
						select : function(start, end, allDay)
						{
							calendarView = (!_agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id)) ? 'month' : _agile_get_prefs('taskCalendarDefaultView_'+CURRENT_DOMAIN_USER.id);
							showTaskModal(this);
							$('#task-date-1').val(getDateInFormatFromEpoc(start.getTime()));
							if(calendarView == 'agendaDay')
							{
								$('.new-task-timepicker').timepicker({ defaultTime : start.getHours()+':'+start.getMinutes(), showMeridian : false });
							}
						},
						/**
						 * Updates the event by changing start and end date,
						 * when it is dragged to another location on
						 * fullCalendar.
						 * 
						 * @method eventDrop
						 * @param {Object}
						 *            event1 event with new start and end date
						 * @param {Number}
						 *            dayDelta holds the number of days the
						 *            event was moved forward
						 * @param {Number}
						 *            minuteDelta holds the number of minutes
						 *            the event was moved forward
						 * @param {Boolean}
						 *            allDay weather the event has been dropped
						 *            on a day in month view or not
						 * @param {Function}
						 *            revertFunc sets the event back to it's
						 *            original position
						 */
						eventDrop : function(task1, dayDelta, minuteDelta, allDay, revertFunc)
						{

							// Confirm from the user about the change
							if (!confirm("Are you sure about this change?"))
							{
								revertFunc();
								return;
							}
							var task = $.extend(true, {}, task1);

							// Update task if the user changes it in the
							// calendar
							task.due = new Date(task.start).getTime() / 1000;
							var jsoncontacts = task.contacts;
							var _contacts = [];
							for ( var i in jsoncontacts)
							{
								_contacts.push(jsoncontacts[i].id);

							}
							if(task.taskOwner)
							task.owner_id = task.taskOwner.id;
							task.contacts = _contacts;
							var taskModel = new Backbone.Model();
							taskModel.url = 'core/api/tasks';

							taskModel.save(task);
						},
						/**
						 * Updates or deletes a task by clicking on it
						 * 
						 * @method eventClick
						 * @param {Object}
						 *            taskJson to update or delete
						 */
						eventClick : function(taskJson)
						{
							if (isNaN(taskJson.id))
								return;

							// Show edit modal for the event
							$("#updateTaskModal").html(getTemplate("task-update-modal")).modal("show");

							loadProgressSlider($("#updateTaskForm"), function(el){
								// Fill form
								deserializeForm(taskJson, $("#updateTaskForm"));
								$('.update-task-timepicker').val(fillTimePicker(taskJson.due));

								categories.getCategoriesHtml(taskJson,function(catsHtml){
									$('#type',$("#updateTaskForm")).html(catsHtml);
									// Fills owner select element
									populateUsers("owners-list", $("#updateTaskForm"), taskJson, 'taskOwner', function(data)
									{
										$("#updateTaskForm").find("#owners-list").html(data);
										if (taskJson.taskOwner)
										{
											$("#owners-list", $("#updateTaskForm")).find('option[value=' + taskJson['taskOwner'].id + ']').attr("selected", "selected");
										}
								
										$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
									});
								});

								showNoteOnForm("updateTaskForm", taskJson.notes);

								// Creates normal time.
								displayTimeAgo($(".task-trello-list"));
							});
						}

					});
}

function initilizeTasksCalendarViewListeners()
{
	$("#content").on('click', '.taskDayWeekMonth', function()
	{
		currentView = $(this).attr('id');
		fullCalTasks.fullCalendar('changeView', currentView);
		$(this).parent().find('button').each(function()
		{
			if ($(this).attr('id') == currentView)
				$(this).addClass('bg-light');
			else
				$(this).removeClass('bg-light');
		});
		if (currentView == "agendaDay" || currentView == "agendaWeek")
		{
			fullCalTasks.fullCalendar('option', 'contentHeight', 575);
		}
		else
		{
			fullCalTasks.fullCalendar('option', 'contentHeight', 400);
		}

	});
}
function setCalendarTaskColors(data)
{
	data["title"] = data["subject"];
	data["start"] = data["due"];
	data["end"] = data["due"]+1800;
	data["allDay"] = false;
	if (data.priority_type == 'HIGH'){
		data.className = 'fc-b-l fc-b-2x fc-b-danger fc-border-height fc-event-month';
	}
   	else if (data.priority_type == 'NORMAL'){
   		data.className = 'fc-b-l fc-b-2x fc-b-info fc-border-height fc-event-month';
   	}
   	else if (data.priority_type == 'LOW'){
   		data.className = 'fc-b-l fc-b-2x fc-b-warning fc-border-height fc-event-month';
   	}
   	if(data["is_complete"] == true || data["is_complete"] == "true"){
   		data.backgroundColor = '#fff';
   	}
   	/*else if(data["due"] <= (getGMTEpochFromDate(new Date()) / 1000)){
   		data.backgroundColor = '#f05050';
   	}*/
   	else{
   		data.backgroundColor = '#ff6666';
   	}
   	data.color = '';
}
function taskCalendarToday()
{
	fullCalTasks.fullCalendar('today');
}