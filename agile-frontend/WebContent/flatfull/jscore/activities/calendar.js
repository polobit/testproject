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
	var eventFilters;
	var eventData = JSON.parse(_agile_get_prefs('event-lhs-filters'));	

	if(eventData){
		eventFilters = eventData[CURRENT_AGILE_USER.id];
	}

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

	get_google_calendar_prefs(callback);

}

function get_google_calendar_prefs(callback)
{
		// Name of the cookie to store/ calendar prefs. Current user id is set
	// in cookie name to avoid
	// showing tasks in different users calendar if logged in same browser
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;

	// Reads existing cookie
	var _agile_calendar_prefs_cookie = _agile_get_prefs(google_calendar_cookie_name);

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
		_agile_set_prefs(google_calendar_cookie_name, JSON.stringify(prefs));
		return get_google_calendar_event_source(prefs, callback);
	});
}

/**
 * Erases calendar cookie
 */
function erase_google_calendar_prefs_cookie()
{
	var google_calendar_cookie_name = "_agile_google_calendar_prefs_" + CURRENT_DOMAIN_USER.id;
	_agile_delete_prefs(google_calendar_cookie_name);
	_agile_delete_prefs(google_calendar_cookie_name);
}

function get_calendar_ids_form_prefs(data)
{

		if(!data)
			return;

		var calendar_ids = ["primary"];

		if(data.prefs)
		{
			

			try
			{
				var prefs;
				if(typeof data.prefs != 'object')
					prefs = JSON.parse(data.prefs);
				else
					prefs = data.prefs;

				if(prefs.fields != null)
				calendar_ids = prefs.fields;		
			}
			catch (err)
			{
				console.log(err);
			}
		}

		return calendar_ids;
}

// Returns token in to gcal callback in specified format
function get_google_calendar_event_source(data, callback)
{

	if (callback && typeof (callback) === "function")
	{
		callback({ token : data.access_token, dataType : 'agile-gcal', className : "agile-gcal", calendarIds : get_calendar_ids_form_prefs(data)});
	}
	return true;
}

/**
 * Shows the calendar
 */
var fullCal;
function showCalendar(users)
{

	_init_gcal_options(users);
	put_thirdparty_calendar_links();
	
	var calendarView = (!_agile_get_prefs('calendarDefaultView')) ? 'month' : _agile_get_prefs('calendarDefaultView');
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
									var eventFilters;
									var eventData = JSON.parse(_agile_get_prefs('event-lhs-filters'));	
	
									if(eventData){
										eventFilters = eventData[CURRENT_AGILE_USER.id];
									}																		
									
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
												addOffice365CalendarEvents();
											}
											
											//Agile
											var inArray = type_of_cal.indexOf("agile");
											if(inArray >= 0 ||( owners && owners.length > 0)){
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
									 * if (_agile_get_prefs('event-filters') &&
									 * eventFilters.type == 'google') {
									 * $("#loading_calendar_events").hide();
									 * return; }
									 */
									var start_end_array = {};
									start_end_array.startTime = start.getTime() / 1000;
									start_end_array.endTime = end.getTime() / 1000;
									console.log(start_end_array.startTime+" : "+start_end_array.endTime);
									_agile_set_prefs('fullcalendar_start_end_time', JSON.stringify(start_end_array));

									var eventsURL = '/core/api/events?start=' + start.getTime() / 1000 + "&end=" + end.getTime() / 1000;
									

									eventsURL += '&owner_id=' + agile_event_owners;
									console.log('-----------------', eventsURL);
									//callback([]);
									return eventsURL

								//		return true;

								},
								dataType: 'agile-events'

								},
								{
									dataType : 'agile-gcal',
									
								},
								
							
						],
						header : { left : 'prev', center : 'title', right : 'next' },
						defaultView : calendarView,
						slotEventOverlap : false,
						viewDisplay : function(view)
						{
							_agile_set_prefs('calendarDefaultView', view.name, 90);
							$(".fc-agenda-axis").addClass('bg-light lter');
						},
						loading : function(bool)
						{
							if (bool)
							{
								pushLoading();
								$("#loading_calendar_events").remove();
								$('.fc-header-left','#calendar_event')
										.append(
												'<span id="loading_calendar_events" style="margin-left:5px;vertical-align:middle;padding-top: 5px;position: absolute;">loading...</span>')
										.show();
								$('.fc-header-left','#calendar_event').show();

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
						contentHeight : contentHeight,
						firstDay : CALENDAR_WEEK_START_DAY,
						firstHour : 7,
						themeButtonIcons : { prev : 'fc-icon-left-single-arrow', next : 'fc-icon-right-single-arrow' },
						eventMouseover : function(event, jsEvent, view)
						{

							calendarView = (!_agile_get_prefs('calendarDefaultView')) ? 'month' : _agile_get_prefs('calendarDefaultView');
							var reletedContacts = '';
							var meeting_type = '';
							 	
								
								
								var leftorright = 'left';	
								var pullupornot = '';
								var popoverElement = '';
								var popover_min_width = 300;
								var that = $(this);	
								var that_event = jsEvent.currentTarget;
								if(that.data("data_fetched"))
								{
									event.contacts=that.data("data_fetched");
									calendar_Popover(event,calendarView,that,popover_min_width,that_event,leftorright,pullupornot,popoverElement,reletedContacts,meeting_type)
									return;
								}
								if(event.id!=undefined){
								accessUrlUsingAjax("/core/api/events/contacts-related?id="+event.id,function(data){
											console.log(data);
											that.data("data_fetched",data);
											event.contacts=data;
												calendar_Popover(event,calendarView,that,popover_min_width,that_event,leftorright,pullupornot,popoverElement,reletedContacts,meeting_type)
											
							});
						}
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
							$('#activityModal').html(getTemplate("new-event-modal")).modal('show');
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
							
							if(!hasScope("MANAGE_CALENDAR") && (CURRENT_DOMAIN_USER.id != event1.owner.id)){
								revertFunc();
								$("#moveEventErrorModal").html(getTemplate("move-event-error-modal")).modal('show');
								return;
							}

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
							if(event.owner)
							event.owner_id = event.owner.id;
							delete event.contacts;
							delete event.owner;
							event
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

							// Show edit modal for the event
							$("#updateActivityModal").html(getTemplate("update-activity-modal")).modal("show");


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
							
							App_Calendar.current_event = event;
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

	if (_agile_get_prefs("agile_calendar_view"))
		$('#filter_options .calendar-view').hide();
	else
		$('#filter_options .list-view').hide();

	if (_agile_get_prefs('event-filters'))
	{
		var eventFilters = JSON.parse(_agile_get_prefs('event-filters'));
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
	if (!_agile_get_prefs('event-filters'))
	{
		$.getJSON('/core/api/users/current-agile-user', function(user)
		{
			if (CURRENT_DOMAIN_USER.id == user.domain_user_id)
			{
				var json = {};
				json.owner_id = user.id.toString();
				json.type = '';
				_agile_set_prefs('event-filters', JSON.stringify(json));
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
function refreshcal(){
	fullCal.fullCalendar('refetchEvents');
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
				if (hasScope("VIEW_CALENDAR")) {
					json_users.push(json_user);
				}
			}
		});
		return callback(json_users);

	});
}

/*
function multiple_property_list(item,propertyName)
{
	

	// Gets properties list field from contact
	var properties = item;
	var property_list = [];

	
	 * Iterates through each property in contact properties and checks for the
	 * match in it for the given property name and retrieves value of the
	 * property if it matches
	 
	$.each(properties, function(index, property)
	{
		if (property.name == propertyName)
		{
			property_list.push(property);
		}
	});

	// If property is defined then return property value list
	return property_list;
}*/

function setUpStarRating(value){


		var element = "";
		for (var i = 0; i < 5; i++)
		{
			if (i < parseInt(value))
			{
				element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-on.png")+'" alt="' + i + '"></li>');
				continue;
			}
			element = element.concat('<li style="display: inline;"><img src="'+updateImageS3Path("img/star-off.png")+'" alt="' + i + '"></li>');
		}
		return element;
}

function calendar_Popover(event,calendarView,that,popover_min_width,that_event,leftorright,pullupornot,popoverElement,reletedContacts,meeting_type){
									if (calendarView == "month")
									{
										console.log("month");

										popover_min_width = that.parents('.fc-view-month').find('.fc-widget-content').eq(0).width() * 2;
										var left =that_event.offsetLeft + that_event.offsetWidth + 10;
										var top = that_event.offsetTop;
										if (that.parents('.fc-view-month').find('.fc-border-separate:visible').width() - left < popover_min_width)
										{
											left = that_event.offsetLeft - popover_min_width - 10;
											leftorright = 'right';
										}
										if (that.parents('.fc-view-month').find('.fc-border-separate:visible').width() - popover_min_width - 20 < that_event.offsetWidth)
										{
											left = ((that_event.offsetLeft + that_event.offsetWidth + 10) / 2) - (popover_min_width / 2);
											top = that_event.offsetTop + that_event.offsetHeight + 10;
											leftorright = 'top';
										}

										var eventJSON = {};
										
										eventJSON.leftorright = leftorright;eventJSON.popover_min_width = popover_min_width;
										eventJSON.popover_min_width = popover_min_width;eventJSON.left = left;eventJSON.top = top;
										eventJSON.pullupornot = pullupornot;eventJSON.event = event;
										
							  

										if(event.type == "officeCalendar"){
											that.after($(getTemplate("office-calendar-mouseover-popover", eventJSON)));
										}else{
											that.after($(getTemplate("calendar-mouseover-popover", eventJSON)));
										}
										
										if (that.parents('.fc-view-month').find('.fc-border-separate:visible').height() - that_event.offsetTop < that.parent().find('.fc-overlayw')
												.height())
										{
											that.parent().find('.fc-overlayw').css("top",
													top - that.parent().find('.fc-overlayw').height() + that_event.offsetHeight + 20 + "px");
											that.parent().find('.fc-overlayw').find('.arrow').css("top", that.parent().find('.fc-overlayw').height() - 31 + "px");
										}
										if (that.parents('.fc-view-month').find('.fc-border-separate:visible').width() - popover_min_width - 20 < that_event.offsetWidth)
										{
											that.parent().find('.fc-overlayw').find('.arrow').css("top", "-9px");
										}
										if ((that.parents('.fc-view-month').find('.fc-border-separate:visible').height() - that_event.offsetTop - that_event.offsetHeight - 10 < that
										.parent().find('.fc-overlayw').height() + 10) && (that.parents('.fc-view-month').find('.fc-border-separate:visible').width() - popover_min_width - 20 < that_event.offsetWidth))
										{
											that.parent().find('.fc-overlayw').find('.arrow').removeClass('top').addClass('bottom');
											left = ((that_event.offsetLeft + that_event.offsetWidth + 10) / 2) - (popover_min_width / 2);
											top = that_event.offsetTop - that.parent().find('.fc-overlayw').height() + 10;
											that.parent().find('.fc-overlayw').css({ "top" : top + "px", "lef" : left + "px" });
											that.parent().find('.fc-overlayw').find('.arrow').css("top",that.parent().find('.fc-overlayw').height() - 22 + "px");
										}
										
									}
									else if (calendarView == "agendaWeek")
									{
										console.log("agendaWeek");
										popover_min_width = $('.fc-view-agendaWeek').find('.fc-widget-content').eq(0).width() * 2;
										var left = that_event.offsetLeft + that_event.offsetWidth + 10;
										var top = that_event.offsetTop;
										if ($('.fc-agenda-slots:visible').width() - left < popover_min_width)
										{
											left = that_event.offsetLeft - popover_min_width - 10;
											leftorright = 'right';
										}

										var eventJSON = {};
										eventJSON.leftorright = leftorright;eventJSON.popover_min_width = popover_min_width;
										eventJSON.left = left;eventJSON.top = top;
										eventJSON.pullupornot = pullupornot;eventJSON.event = event;
										
										if(event.type == "officeCalendar"){
											that.after(getTemplate("week-office-calendar-mouseover-popover", eventJSON));
										}else{
											that.after(getTemplate("week-calendar-mouseover-popover", eventJSON));
										}
										
										if ($('.fc-agenda-slots:visible').height() - that_event.offsetTop < that.parent().find('.fc-overlayw').height())
										{
											that.parent().find('.fc-overlayw').css("top",
													top - that.parent().find('.fc-overlayw').height() + that_event.offsetHeight + 20 + "px");
											that.parent().find('.fc-overlayw').find('.arrow').css("top", that.parent().find('.fc-overlayw').height() - 31 + "px");
										}
									}
									else if (calendarView == "agendaDay")
									{
										console.log("agendaDay");
										var left = that_event.offsetLeft;
										var top = that_event.offsetTop + that_event.offsetHeight + 10;
										leftorright = 'top';
										if ($('.fc-agenda-slots:visible').width() - that_event.offsetLeft < popover_min_width)
										{
											left = that_event.offsetLeft - that_event.offsetWidth - ($('.fc-agenda-slots:visible').width() - that_event.offsetLeft - that_event.offsetWidth);
										}
										
										var eventJSON = {};
										eventJSON.leftorright = leftorright;eventJSON.popover_min_width = popover_min_width;
										eventJSON.left = left;eventJSON.top = top;
										eventJSON.pullupornot = pullupornot;eventJSON.event = event;
										if(event.type == "officeCalendar"){
											that.after(getTemplate("day-office-calendar-mouseover-popover", eventJSON));
										}else{
											try{
												that.after(getTemplate("day-calendar-mouseover-popover", eventJSON));
											}catch(e){}
										}
										
										that.parent().find('.fc-overlayw').find('.arrow').css({ "top" : "-9px", "left" : "11px" });
										if ($('.fc-agenda-slots:visible').width() - that_event.offsetLeft < popover_min_width)
										{
											that.parent().find('.fc-overlayw').find('.arrow').css({ "top" : "-9px", "left" : popover_min_width - 15 + "px" });
										}
										if ((that_event.offsetTop < that.parent().find('.fc-overlayw').height() + 10) && ($('.fc-agenda-slots:visible')
												.height() - that_event.offsetHeight < that.parent().find('.fc-overlayw').height() + 10))
										{
											that.parent().find('.fc-overlayw').css("top", that_event.offsetTop + 40 + "px");
										}
										if ((that_event.offsetTop > that.parent().find('.fc-overlayw').height() + 10) && ($('.fc-agenda-slots:visible')
												.height() - (that_event.offsetHeight + that_event.offsetTop) < that.parent().find(
												'.fc-overlayw').height() + 10))
										{
											that.parent().find('.fc-overlayw').find('.arrow').removeClass('top').addClass('bottom');
											that.parent().find('.fc-overlayw').find('.arrow').css("top", $(this).parent().find('.fc-overlayw').height() - 22 + "px");
											that.parent().find('.fc-overlayw').css(
													"top",
													$('.fc-agenda-slots:visible').height() - that_event.offsetHeight -that.parent().find('.fc-overlayw')
															.height() + 7 + "px");
											if ($('.fc-agenda-slots:visible').width() - that_event.offsetLeft < popover_min_width)
											{
												that.parent().find('.fc-overlayw')
														.css(
																"left",
																that_event.offsetLeft - that_event.offsetWidth - ($('.fc-agenda-slots:visible')
																		.width() - that_event.offsetLeft - that_event.offsetWidth) + "px");
											}
										}
									}
							$(that_event).css('z-index', 9);
							if (event.allDay){
								$(that_event.parentElement).css('z-index', 9);
							}
							that.parent().find('.fc-overlayw').show();
							that.find(".ui-resizable-handle").show();
}