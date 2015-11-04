/**
 * 
 * Describes the given object is an array or not
 * 
 * @param {Object}
 *            a to verify array or not
 * @returns {Boolean} true if given param is array else false
 */
function isArray(a)
{
	return Object.prototype.toString.apply(a) === '[object Array]';
}

/**
 * Loads events from google calendar using tokens either from cookies or token
 * from backend when token in cookie is epired
 * 
 * @param callback
 */
function load_events_from_google(callback)
{

	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
	var agile_event = false;
	if (eventFilters)
	{
		var type_of_cal = eventFilters.cal_type;
		var owners = eventFilters.owner_ids;
		if (owners && owners.length > 0)
		{
			$.each(owners, function(index, value)
			{
				if (value)
				{
					if (value.id == CURRENT_AGILE_USER.id)
						agile_event = true;
				}
			});
		}
		if(type_of_cal){
			var typelength = type_of_cal.length;										
			if(typelength > 0){
				//Google
				var inArray = type_of_cal.indexOf("google");
				if(inArray >= 0){
					//continue
				}else{
					return;
				}
			}
			else{
				return;
			}
		}
		else{
				return;
			}
//		if ((type_of_cal && type_of_cal.length != 2 && type_of_cal[0] == 'agile') || type_of_cal.length == 0)
//		{
//			return;
//		}
	}

	// Name of the cookie to store/ calendar prefs. Current user id is set
	// in cookie name to avoid
	// showing tasks in different users calendar if logged in same browser
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;

	// Reads existing cookie
	var _agile_calendar_prefs_cookie = readCookie(google_calendar_cookie_name);

	// If cookie is not null, then it check it token is still valid; checks
	// based on expiry time.
	if (_agile_calendar_prefs_cookie && _agile_calendar_prefs_cookie != "null")
	{
		var prefs = JSON.parse(_agile_calendar_prefs_cookie);

		// Checks if token expired. It considers expire before 2 minutes window
		// of actual expiry time.
		if (prefs.expires_at - (2 * 60 * 1000) >= new Date().getTime())
		{
			// Returns token to the callback accoring to specification of gcal
			return get_google_calendar_event_source(prefs, callback);
			
		}

		// Erases cookie if token is expired and sends request to backend to
		// acquire new token
		erase_google_calendar_prefs_cookie()

	}

	// Fetch new token from backen, saves in cookie, and token is returned to
	// gcal
	$.getJSON('/core/api/calendar-prefs/refresh-token', function(prefs)
	{
		if (!prefs)
			return;

		// Creates cookie
		createCookie(google_calendar_cookie_name, JSON.stringify(prefs));
		return get_google_calendar_event_source(prefs, callback);
	});
}

/**
 * Erases calendar cookie
 */
function erase_google_calendar_prefs_cookie()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;
	eraseCookie(google_calendar_cookie_name);
}

// Returns token in to gcal callback in specified format
function get_google_calendar_event_source(data, callback)
{

	if (callback && typeof (callback) === "function")
		callback({ token : data.access_token, dataType : 'agile-gcal', className : "agile-gcal" });
	return true;
}

/**
 * Shows the calendar
 */
var fullCal;
function showCalendar(users)
{

	_init_gcal_options(users);
	putGoogleCalendarLink();
	putOfficeCalendarLink();
	
	var calendarView = (!readCookie('calendarDefaultView')) ? 'month' : readCookie('calendarDefaultView');
	$('#' + calendarView).addClass('bg-light');
	var contentHeight = 400;
	if (calendarView == "agendaDay" || calendarView == "agendaWeek")
	{
		contentHeight = 575;
	}
	fullCal = $('#calendar_event')
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

						eventSources : [
								{ 	
									events : function(start, end, callback)
								{

									var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
									var agile_event_owners = '';
									if (eventFilters)
									{
										var type_of_cal = eventFilters.cal_type;
										var owners = eventFilters.owner_ids;

										$.each(type_of_cal, function(index, value)
										{
											if (value == 'agile')
												owners.push(CURRENT_AGILE_USER.id);
										});

										if (owners && owners.length > 0)
										{
											$.each(owners, function(index, value)
											{

												if (index >= 1)
													agile_event_owners += ",";
												agile_event_owners += value;
											});
										}
											
										var typelength = type_of_cal.length;										
										if(typelength > 0){
											//Google
											var inArray = type_of_cal.indexOf("google");
											if(inArray >= 0){
												//contiune
											}
											
											//Office
											var inArray = type_of_cal.indexOf("office");
											if(inArray >= 0){
												loadOfficeEvents(start.getTime(), end.getTime());
											}
											
											$("#loading_calendar_events").hide();
											
											//Agile
											var inArray = type_of_cal.indexOf("agile");
											if(inArray >= 0){
												//continue
											}else{
												callback([]);
												return;
											}
										}
										
										

//										if ((type_of_cal.length == 1 && type_of_cal[0] == 'google' && owners.length == 1 && owners[0] == CURRENT_AGILE_USER.id) || type_of_cal.length == 0 && owners.length == 0)
//										{
//											$("#loading_calendar_events").hide();
//											return;
//										}
									}

									/*
									 * if (readCookie('event-filters') &&
									 * eventFilters.type == 'google') {
									 * $("#loading_calendar_events").hide();
									 * return; }
									 */
									var start_end_array = {};
									start_end_array.startTime = start.getTime() / 1000;
									start_end_array.endTime = end.getTime() / 1000;
									console.log(start_end_array.startTime+" : "+start_end_array.endTime);
									createCookie('fullcalendar_start_end_time', JSON.stringify(start_end_array));

									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;
									

									eventsURL += '&owner_id=' + agile_event_owners;
									console.log('-----------------', eventsURL);
									callback([]);
									return eventsURL

								//		return true;

								},
								dataType: 'agile-events'

								},
								{
									dataType : 'agile-gcal'
								},
								
							
						],
						header : { left : 'prev', center : 'title', right : 'next' },
						defaultView : calendarView,
						slotEventOverlap : false,
						viewDisplay : function(view)
						{
							createCookie('calendarDefaultView', view.name, 90);
							$(".fc-agenda-axis").addClass('bg-light lter');
						},
						loading : function(bool)
						{
							if (bool)
							{

								$("#loading_calendar_events").remove();
								$('.fc-header-left')
										.append(
												'<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle;padding-top: 5px;position: absolute;">loading...</span>')
										.show();
								$('.fc-header-left').show();

							}
							else
							{
								// $('#loading').hide();
								$("#loading_calendar_events").hide();
								start_tour('calendar');
							}
							$(".fc-agenda-axis").addClass('bg-light lter');
							$(".ui-resizable-handle").hide();
						},
						selectable : true,
						selectHelper : true,
						editable : true,
						theme : false,
						contentHeight : contentHeight,
						firstDay : CALENDAR_WEEK_START_DAY,
						firstHour : 7,
						themeButtonIcons : { prev : 'fc-icon-left-single-arrow', next : 'fc-icon-right-single-arrow' },
						eventMouseover : function(event, jsEvent, view)
						{

							calendarView = (!readCookie('calendarDefaultView')) ? 'month' : readCookie('calendarDefaultView');
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
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.owner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
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
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.owner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
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
											var popoverElement = '<div class="fc-overlayw ' + leftorright + '" style="width:100%;min-width:' + popover_min_width + 'px;max-width:' + popover_min_width + 'px;left:' + left + 'px;top:' + top + 'px;position:absolute;z-index:10;display:none;">' + '<div class="panel bg-white b-a pos-rlt p-sm">' + '<span class="arrow ' + leftorright + ' ' + pullupornot + '" style="top:11px;"></span>' + '<div class="h4 font-thin m-b-sm"><div class="pull-left text-ellipsis p-b-xs" style="width:100%;">' + event.title + '</div></div>' + '<div class="line b-b b-light"></div>' + '<div><i class="icon-clock text-muted m-r-xs"></i>' + event.start
													.format('dd-mmm-yyyy HH:MM') + '<div class="pull-right" style="width:10%;"><img class="r-2x" src="' + event.ownerPic + '" height="20px" width="20px" title="' + event.owner.name + '"/></div></div>' + '<div class="text-ellipsis">' + reletedContacts + '</div>' + '<div class="text-ellipsis">' + meeting_type + '</div>' + '</div>' + '</div>';
											$(this).after(popoverElement);
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
							
							if(event.type == "officeCalendar"){
								$(element).height('');
							}
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
							// Show a new event
							$('#activityModal').modal('show');
							highlight_event();

							// Set Date for Event
							//var dateFormat = 'mm/dd/yyyy';
							$('#task-date-1').val(getDateInFormat(start));
							$("#event-date-1").val(getDateInFormat(start));
							$("#event-date-2").val(getDateInFormat(end));

							// Set Time for Event
							if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00))
							{
								$('#event-time-1').val('');
								$('#event-time-2').val('');
							}
							else
							{
								$('#event-time-1')
										.val(
												(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start
														.getMinutes());
								$('#event-time-2').val(
										(end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
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
						eventDrop : function(event1, dayDelta, minuteDelta, allDay, revertFunc)
						{

							// Confirm from the user about the change
							if (!confirm("Are you sure about this change?"))
							{
								revertFunc();
								return;
							}
							event1 = revertEventColorBasedOnPriority(event1);
							var event = $.extend(true, {}, event1);

							// Update event if the user changes it in the
							// calendar
							event.start = new Date(event.start).getTime() / 1000;
							event.end = new Date(event.end).getTime() / 1000;
							if (event.end == null || event.end == 0)
								event.end = event.start;

							var jsoncontacts = event.contacts;
							var _contacts = [];
							for ( var i in jsoncontacts)
							{
								_contacts.push(jsoncontacts[i].id);

							}
							delete event.contacts;
							delete event.owner;
							event.contacts = _contacts;
							var eventModel = new Backbone.Model();
							eventModel.url = 'core/api/events';

							eventModel.save(event);
						},
						/**
						 * Updates or deletes an event by clicking on it
						 * 
						 * @method eventClick
						 * @param {Object}
						 *            event to update or delete
						 */
						eventClick : function(event)
						{
							event = revertEventColorBasedOnPriority(event);

							if (isNaN(event.id))
								return;
							// Deserialize
							deserializeForm(event, $("#updateActivityForm"));

							// Set time for update Event
							$('#update-event-time-1')
									.val(
											(event.start.getHours() < 10 ? "0" : "") + event.start.getHours() + ":" + (event.start.getMinutes() < 10 ? "0" : "") + event.start
													.getMinutes());
							$('#update-event-time-2').val(
									(event.end.getHours() < 10 ? "0" : "") + event.end.getHours() + ":" + (event.end.getMinutes() < 10 ? "0" : "") + event.end
											.getMinutes());

							// Set date for update Event
							var dateFormat = 'mm/dd/yyyy';
							$("#update-event-date-1").val(getDateInFormat(event.start));
							$("#update-event-date-2").val(getDateInFormat(event.end));

							// hide end date & time for all day events
							if (event.allDay)
							{
								$("#update-event-date-2").closest('.row').hide();
								$('#update-event-time-1').closest('.control-group').hide();
							}
							else
							{
								$('#update-event-time-1').closest('.control-group').show();
								$("#update-event-date-2").closest('.row').show();
							}

							if (event.type == "WEB_APPOINTMENT" && parseInt(new Date(event.start).getTime() / 1000) > parseInt(new Date().getTime() / 1000))
							{
								$("[id='event_delete']").attr("id", "delete_web_event");
								web_event_title = event.title;
								if (event.contacts.length > 0)
								{
									var firstname = getPropertyValue(event.contacts[0].properties, "first_name");
									if (firstname == undefined)
										firstname = "";
									var lastname = getPropertyValue(event.contacts[0].properties, "last_name");
									if (lastname == undefined)
										lastname = "";
									web_event_contact_name = firstname + " " + lastname;
								}
							}
							else
							{
								$("[id='delete_web_event']").attr("id", "event_delete");
							}
							if (event.description)
							{
								var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
								$("#event_desc").html(description);
								$("textarea#description").val(event.description);
							}
							else
							{
								var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none " id="addEventDescription">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
								$("#event_desc").html(desc);
							}
							// Show edit modal for the event
							$("#updateActivityModal").modal('show');
							
							agile_type_ahead("event_relates_to_deals", $('#updateActivityModal'), deals_typeahead, false,null,null,"core/api/search/deals",false, true);

							// Fills owner select element
							populateUsersInUpdateActivityModal(event);

							// initializeEventModelEvents();
							return false;
						}

					});
}

function showEventFilters()
{
	$('#filter_options').show();

	if (readCookie("agile_calendar_view"))
		$('#filter_options .calendar-view').hide();
	else
		$('#filter_options .list-view').hide();

	if (readCookie('event-filters'))
	{
		var eventFilters = JSON.parse(readCookie('event-filters'));
		$('#event-owner').val(eventFilters.owner_id);
		$('#event_type').val(eventFilters.type);
	}

}

function buildEventFilters()
{
	$.getJSON('/core/api/users/agileusers', function(users)
	{
		var html = '', html1 = '';
		if (users)
		{
			$.each(users, function(i, user)
			{
				if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
					html1 = '<option value=' + user.id + '>Me</option>';
				else
				{
					if (user.domainUser)
						html += '<option value=' + user.id + '>' + user.domainUser.name + '</option>';
				}
			});
			html += '<option value="">Any</option>';
		}
		$('#event-owner').html(html1 + html);
	});
}

function loadDefaultFilters(callback)
{
	// Create a cookie with default option, if there is no cookie related to
	// event filter.
	if (!readCookie('event-filters'))
	{
		$.getJSON('/core/api/users/agileusers', function(users)
		{
			if (users)
			{
				$.each(users, function(i, user)
				{
					if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
					{
						var json = {};
						json.owner_id = user.id.toString();
						json.type = '';
						createCookie('event-filters', JSON.stringify(json));
					}
				});
			}

			if (callback)
				callback();
		});
	}
}

$(function(){
	/**
	 * Hide the filters window when click on out side of the filters pop up.
	 */
	$(document).mouseup(function(e)
	{
		var container = $("#filter_options");

		if (!container.is(e.target) // if the target of the click isn't the
				// container...
				&& container.has(e.target).length === 0) // ... nor a
		// descendant of the
		// container
		{
			container.hide();
		}
	});

	// loadDefaultFilters();
	
});
function changeView(view)
{
	currentView = view;
	fullCal.fullCalendar('changeView', view);
};
function today()
{
	fullCal.fullCalendar('today');
}


/**
 * gets the agileusers to build calendar filters
 * @returns {Array}
 */
function getCalendarUsersDetails(callback)
{

	accessUrlUsingAjax('/core/api/users/agileusers', function(data){

		if(!data)
			 return callback(data);

		var json_users = [];
		$.each(data, function(i, user)
		{

			if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
			{
				CURRENT_AGILE_USER = user;
				return;
			}
			
			if (user.domainUser)
			{
				var json_user = {};
				json_user.id = user.id;
				json_user.name = user.domainUser.name;
				json_user.domain_user_id = user.domainUser.id;
				json_users.push(json_user);
			}
		});
		return callback(json_users);

	});
}
