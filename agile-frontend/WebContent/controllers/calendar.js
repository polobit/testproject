/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */

var eventCollectionView;
var googleEventCollectionView;
var googleNextPageToken;
var CalendarRouter = Backbone.Router.extend({

				routes : {
				/* Shows fullCalendar page */
				"calendar" : "calendar", "tasks" : "tasks_new", "tasks-new" : "tasks_new" },
				/**
				 * Activates the calendar menu and loads minified fullcalendar and jquery-ui
				 * to show calendar view. Also shows tasks list in separate section.
				 */
				calendar : function()
				{
								// read cookie for view if list_view is there then rendar list view else
								// rendar default view
								// var view = readCookie("agile_calendar_view");
								$('#content').html(getTemplate("calendar", {}));
								buildEventFilters();
								var view = readCookie("agile_calendar_view");
								
								if (view)
								{

												loadGoogleEvents();
												loadAgileEvents();
								}
								else
								{

												$(".active").removeClass("active");
												$("#calendarmenu").addClass("active");
												$('#agile_event_list').addClass('hide');

												// Typahead also uses jqueryui - if you are changing the version
												// here,
												// change it there too
												head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
												{
														showCalendar();

												});

												$('#grp_filter').css('display', 'none');
												$('#event_tab').css('display', 'none');

								}

								this.tasksListView = new Base_Collection_View({ url : '/core/api/tasks', restKey : "task", templateKey : "tasks", individual_tag_name : 'tr',
												postRenderCallback : function(el)
												{
																head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
																{
																				$(".task-due-time", el).timeago();
																});

												} });

								// Tasks has its own appendItem function to show the status
								// (overdue,
								// today, tomorrow and next-week)
								this.tasksListView.appendItem = append_tasks;
								this.tasksListView.collection.fetch();

								$('#tasks').html(this.tasksListView.el);
								$('#event-list-filters').html(getTemplate('event-filter'));

				},

				/* Show tasks list when All Tasks clicked under calendar page. */
				tasks : function()
				{

								$('#content').html(getTemplate("tasks-list-header", {}));

								fillSelect("owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
								{

												$('#content').find("#owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
												$('#content').find("#owner-tasks").append("<li><a href='my-pending-tasks'>My Pending Tasks</a></li>");

												// To Updated task list based on user selection of type and owner
												initOwnerslist();
								}, "<li><a href='{{id}}'>My Tasks</a></li>", true);

								$(".active").removeClass("active");
								$("#calendarmenu").addClass("active");
				},

				/* Show new view of tasks. */
				tasks_new : function()
				{
								$('#content').html(getTemplate("new-tasks-list-header", {}));

								fillSelect("new-owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
								{
												$('#content').find("#new-owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
												$('#content').find("#new-owner-tasks").append("<li><a href='all-pending-tasks' class='hide-on-status'>All Pending Tasks</a></li>");
												$('#content').find("#new-owner-tasks").append("<li><a href='my-pending-tasks' class='hide-on-owner hide-on-status'>My Pending Tasks</a></li>");

												// Read stored selections from cookie and Creates nested collection
												readDetailsFromCookie();
												// Bind dropdown events
												bindDropdownEvents();

								}, "<li><a href='{{id}}' class='hide-on-owner'>My Tasks</a></li>", true);

								$('.loading').remove();

								$(".active").removeClass("active");
								$("#calendarmenu").addClass("active");

								// Hide owner's and status task selection options from dropdown
								$(".hide-on-pending").hide();

				},

// list view of event

});

$(function()
{

				$("body").off().on('click','.c_list',  function(e)
				{
								e.preventDefault();
								// Creates the cookie

								if (readCookie('event-filters') && JSON.parse(readCookie('event-filters')).time == 'future')
												createCookie("agile_calendar_view", "calendar_list_view_future");
								else
												createCookie("agile_calendar_view", "calendar_list_view");

								// Loads the calendar
								App_Calendar.calendar();
				});

				$("body").off().on('click','.c_cal',  function(e)
				{
								e.preventDefault();
								// Erases the cookie
								eraseCookie("agile_calendar_view");
							
								// Loads the calendar
								App_Calendar.calendar();
				});

				$("body").off().on('click','.c_list_view_future',  function(e)
				{
								e.preventDefault();
								// Creates the cookie
								createCookie("agile_calendar_view", "calendar_list_view_future");

								// Loads the calendar
								App_Calendar.calendar();
				});

				if (readCookie("agile_calendar_view"))
				{
								$('#grp_filter').removeClass('hide');
				}

				// intialize event tab
				$('#event_tab').tab();

				if(!readCookie("agile_calendar_view"))
								$('#agile_event_list').addClass('hide');
				else{
								if($('#agile_event_list').hasClass('hide'))
												$('#agile_event_list').removeClass('hide')
				}

				$('#taskDetailsTab').tab();

});

$(function()
{
				$("body").off().on('click','.c_list',  function(e)
				{
								e.preventDefault();
								// Creates the cookie
								if (readCookie('event-filters') && JSON.parse(readCookie('event-filters')).time == 'future')
												createCookie("agile_calendar_view", "calendar_list_view_future");
								else
												createCookie("agile_calendar_view", "calendar_list_view");

								// Loads the calendar
								App_Calendar.calendar();
				});
				
				$("body").off().on('click','.c_cal',  function(e)
				{
								e.preventDefault();
								// Erases the cookie
								eraseCookie("agile_calendar_view");

								// Loads the calendar
								App_Calendar.calendar();
				});
				
				$("body").off().on('click','.c_list_view_future',  function(e)
				{
								e.preventDefault();
								// Creates the cookie
								createCookie("agile_calendar_view", "calendar_list_view_future");

								// Loads the calendar
								App_Calendar.calendar();
				});

				// intialize event tab
				$('#event_tab').tab();

				$(window).scroll(function()
				{
								if ($('#google').hasClass('active'))
								{

												if ($(window).scrollTop() + $(window).height() == $(document).height())
												{
																loadMoreEventsFromGoogle();
												}
								}

				})

});

// append events in category base
function appendItem1(base_model)
{
				var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

				// add to the right box - overdue, today, tomorrow etc.
				console.log(base_model.get('title'));
				var createdtime = get_activity_created_time(base_model.get('start'));

				// Today
				// Today
				if (createdtime == 0)
				{

								var heading = $('#today-heading', this.el);

								$('#today-event', this.el).append(itemView.render().el);
								$('#today-event', this.el).parent('table').css("display", "block");
								$('#today-event', this.el).show();
								$('#today-heading', this.el).show();
				}
				// if create time is 1 then that events belongs to tomarrow
				else if (createdtime == 1)
				{

								var heading = $('#tomorrow-heading', this.el);

								$('#tomorrow-event', this.el).append(itemView.render().el);
								$('#tomorrow-event', this.el).parent('table').css("display", "block");
								$('#tomorrow-event', this.el).show();
								$('#tomorrow-heading', this.el).show();
				}
				else if (createdtime > 1)
				{

								var heading = $('#next-week-heading', this.el);

								$('#next-week-event', this.el).append(itemView.render().el);
								$('#next-week-event', this.el).parent('table').css("display", "block");
								$('#next-week-event', this.el).show();
								if ($('#tomorrow-event').children().length > 0 || $('#today-event').children().length > 0)
								{
												$('#next-week-heading', this.el).show();

								}
				}

				var jsonObject = $.parseJSON(readCookie('event-filters'));
				var owner = jsonObject.owner_id;
				// if no owner then its all
				if (owner != "")
				{
								$('.e_owner').addClass('hide');
				}
				else
				{
								if ($('.e_owner').hasClass('hide'))
												$('.e_owner').removeClass('hide');
				}

				$('.contact_text').children().last().text($('.contact_text').children().last().text().replace(",", "").trim());
}

// append all events
function appendItem2(base_model)
{
				var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

				// add to the right box - overdue, today, tomorrow etc.

				var heading = $('#event-heading', this.el);

				$('#eventAll', this.el).append(itemView.render().el);
				$('#eventAll', this.el).parent('table').css("display", "block");
				$('#eventAll', this.el).show();
				$('#event-heading', this.el).show();

				// check for all selected
				// on landing of page

				var jsonObject = $.parseJSON(readCookie('event-filters'));
				var owner = jsonObject.owner_id;
				// if no owner then its all
				if (owner != "")
				{
								$('.e_owner').addClass('hide');
				}
				else
				{
								if ($('.e_owner').hasClass('hide'))
												$('.e_owner').removeClass('hide');
				}

				$('.contact_text').children().last().text($('.contact_text').children().last().text().replace(",", "").trim());

}

// append all google events
function appendGoogleEvent(base_model)
{
				var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

				// add to the right box - overdue, today, tomorrow etc.

				$('#google_event', this.el).append(itemView.render().el);
				$('#google_event', this.el).parent('table').css("display", "block");
				$('#google_event', this.el).show();
				$('.contact_text').children().last().text($('.contact_text').children().last().text().replace(",", "").trim());

}

function appendGoogleEventCategorization(base_model)
{
				var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

				// add to the right box - overdue, today, tomorrow etc.
				console.log(base_model.get('title'));
				var eventStartDate = base_model.get('start');
				var d = new Date(eventStartDate);
				var createdtime = get_activity_created_time(d.getTime() / 1000);

				// Today
				// Today
				if (createdtime == 0)
				{
								$('#today-event', this.el).append(itemView.render().el);
								$('#today-event', this.el).parent('table').css("display", "block");
								$('#today-event', this.el).show();
								$('#today-heading', this.el).show();
				}
				// if create time is 1 then that events belongs to tomarrow
				else if (createdtime == 1)
				{

								$('#tomorrow-event', this.el).append(itemView.render().el);
								$('#tomorrow-event', this.el).parent('table').css("display", "block");
								$('#tomorrow-event', this.el).show();
								$('#tomorrow-heading', this.el).show();
				}
				else if (createdtime > 1)
				{

								$('#next-week-event', this.el).append(itemView.render().el);
								$('#next-week-event', this.el).parent('table').css("display", "block");
								$('#next-week-event', this.el).show();
								if ($('#tomorrow-event', this.el).children().length > 0 || $('#today-event', this.el).children().length > 0)
								{
												$('#next-week-heading', this.el).show();

								}
				}
				$('.contact_text').children().last().text($('.contact_text').children().last().text().replace(",", "").trim());

}

function show_model(id)
{

				if ($(window.event.target).is('a'))
				{
								window.event.stopPropagation();
				}
				else
				{
								$('#updateActivityModal').modal('show');

								var event = eventCollectionView.collection.get(id).toJSON();
								console.log("clicked event " + event);

								var contactList = event.contacts;
								for (var i = 0; i < contactList.length; i++)

								{
												if (contactList[i].type == "COMPANY")
												{

																$('#updateActivityModal')
																								.find("ul[name='contacts']")
																								.append(
																																'<li class="tag" data="' + contactList[i].id + '" style="display: inline-block; "><a href="#contact/' + contactList[i].id + '">' + getCompanyName(contactList[i].properties) + '</a><a class="close" id="remove_tag">x</a></li>');

												}
												else
												{
																$('#updateActivityModal')
																								.find("ul[name='contacts']")
																								.append(
																																'<li class="tag" data="' + contactList[i].id + '" style="display: inline-block; "><a href="#contact/' + contactList[i].id + '">' + getName(contactList[i].properties) + '</a><a class="close" id="remove_tag">x</a></li>');
												}
								}

								var priority = event.color;

								$('#updateActivityModal').find("select").children().each(function()
								{
												if (this.value == priority)
																$(this).attr('selected', 'selected');
								});

								if (event.allDay)
								{
												$('#updateActivityModal').find("input[name='allDay']").attr('checked', 'checked');
								}
								else
								{
												$('#updateActivityModal').find("input[name='allDay']").removeAttr("checked");
								}
								$('#updateActivityModal').find("input[name='title']").val(event.title);
								highlight_event();

								start = getDate(event.start);
								end = getDate(event.end);
								// Set Date for Event

								$("#update-event-date-1").val(getFormattedDate(event.start));
								$("#update-event-date-2").val(getFormattedDate(event.end));

								// Set Time for Event
								if ((start.getHours() == 00) && (end.getHours() == 00) && (end.getMinutes() == 00))
								{
												$('#update-event-time-1').val('');
												$('#update-event-time-2').val('');
								}
								else
								{
												$('#update-event-time-1').val(
																				(start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
												$('#update-event-time-2').val((end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
								}

								$('#updateActivityModal').find("input[name='id']").val(id);
								$('#updateActivityModal').find("input[name='type']").val(event.type);
								
								// Fills owner select element 
								populateUsersInUpdateActivityModal(event);
				}
}

function getFormattedDate(date)
{
				var dateFormat = 'mm/dd/yyyy';
				if ((date / 100000000000) > 1)
				{
								var d = new Date(parseInt(date));
								return d.format(dateFormat);
				}
				else
				{
								var d = new Date(parseInt(date) * 1000);
								return d.format(dateFormat);
				}
}

function getDate(date)
{

				if ((date / 100000000000) > 1)
				{
								return new Date(parseInt(date));
				}
				else
				{
								return new Date(parseInt(date) * 1000);
				}
}

function getName(properties)
{
				var name;
				var firstName;
				var lastName;
				for (var i = 0; i < properties.length; i++)
				{
								if (properties[i].name == 'first_name')
												firstName = properties[i].value;
								if (properties[i].name == 'last_name')
												lastName = properties[i].value;

				}
				name = firstName + " " + lastName;

				return name.replace("undefined", "").trim();
}

function getCompanyName(properties)
{

				var name;
				for (var i = 0; i < properties.length; i++)
				{
								if (properties[i].name == 'name')
												name = properties[i].value;
				}
				return name;
}
function loadAgileEvents()
{
				var calEnable = false;

				$.ajax({ url : 'core/api/calendar-prefs/get', async : false, success : function(response)
				{
								if (response)
												calEnable = true;

				} });
				var jsonObject = $.parseJSON(readCookie('event-filters'));
				var ownerId = jsonObject.owner_id;

				var view = readCookie("agile_calendar_view");
				if (view == "calendar_list_view")
				{
								eventCollectionView = new Base_Collection_View({ url : 'core/api/events/list?ownerId=' + ownerId + '', templateKey : "events",
												individual_tag_name : 'tr', sort_collection : true, sortKey : 'start', descending : false, cursor : true, page_size : 25 });
								eventCollectionView.appendItem = appendItem2;
								eventCollectionView.collection.fetch();
								if(calEnable){
												$('#agile').html(this.eventCollectionView.render().el);
												$('#agile_event_list').addClass('hide');
								}
								else
												$('#agile_event').html(this.eventCollectionView.render().el);

				}
				else if (view == "calendar_list_view_future")
				{
								eventCollectionView = new Base_Collection_View({ url : 'core/api/events/future/list?ownerId=' + ownerId + '', templateKey : "future",
												individual_tag_name : 'tr', sort_collection : true, sortKey : 'start', descending : false, cursor : true, page_size : 25 });
								eventCollectionView.appendItem = appendItem1;
								eventCollectionView.collection.fetch();
								if(calEnable){
												$('#agile').html(this.eventCollectionView.render().el);
												$('#agile_event_list').addClass('hide');
								}
								else
												$('#agile_event').html(this.eventCollectionView.render().el);
				}
}

function loadGoogleEvents()
{

				$.getJSON('core/api/calendar-prefs/get', function(response)
				{
								console.log(response);
								if (response)
								{
												createCookie('google_event_token', response.access_token);

												head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js', function()
												{
																setupGC(function()
																{

																				gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

																				// Retrieve the events from primary
																				var view = readCookie("agile_calendar_view");
																				if (view == "calendar_list_view")
																				{
																								var request = gapi.client.calendar.events
																																.list({ 'calendarId' : 'primary', maxResults : 25, singleEvents : true, orderBy : 'startTime' });
																								request.execute(function(resp)
																								{
																												var events = new Array();
																												console.log(resp);
																												for (var i = 0; i < resp.items.length; i++)
																												{
																																var fc_event = google2fcEvent(resp.items[i]);
																																console.log(fc_event);
																																events.push(fc_event);

																												}
																												googleNextPageToken = resp.nextPageToken;
																												googleEventCollectionView = new Base_Collection_View({ data : events, templateKey : "google-event", individual_tag_name : 'tr',
																																sort_collection : true, sortKey : 'start', descending : false });
																												googleEventCollectionView.appendItem = appendGoogleEvent;
																												$('#google').html(googleEventCollectionView.render(true).el);

																								});

																				}
																				else
																				{
																								var startDate = new Date();
																								var gDate = startDate.toISOString();
																								var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary', maxResults : 25, singleEvents : true, timeMin : gDate });
																								request.execute(function(resp)
																								{
																												var events = new Array();
																												console.log(resp);
																												for (var i = 0; i < resp.items.length; i++)
																												{
																																var fc_event = google2fcEvent(resp.items[i]);
																																console.log(fc_event);
																																events.push(fc_event);

																												}
																												googleEventCollectionView = new Base_Collection_View({ data : events, templateKey : "googleEventCategorization",
																																individual_tag_name : 'tr', sort_collection : true, sortKey : 'start', descending : false });
																												googleEventCollectionView.appendItem = appendGoogleEventCategorization;
																												$('#google').html(googleEventCollectionView.render(true).el);

																								});

																				}

																});
																return;
												});
								}
								else
								{
												$('#event_tab').addClass('hide');
												$('#agile_event').removeClass('hide');
								}

				});
}

function loadMoreEventsFromGoogle()
{
				var accessToken = readCookie('google_event_token');
				if (googleNextPageToken)
				{
								if (accessToken)
								{

												gapi.auth.setToken({ access_token : accessToken, state : "https://www.googleapis.com/auth/calendar" });

												// Retrieve the events from primary
												var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary', maxResults : 20, singleEvents : true, pageToken : googleNextPageToken,
																orderBy : 'startTime' });

												request.execute(function(resp)
												{
																var events = new Array();
																console.log(resp);
																for (var i = 0; i < resp.items.length; i++)
																{
																				var fc_event = google2fcEvent(resp.items[i]);
																				console.log(fc_event);
																				events.push(fc_event);

																}
																googleNextPageToken = resp.nextPageToken;
																var view = readCookie("agile_calendar_view");
																if (view == "calendar_list_view")
																{
																				googleEventCollectionView.collection.add(events);
																				googleEventCollectionView.collection.sort();
																}
																else
																{
																				googleEventCollectionView.collection.add(events);
																				googleEventCollectionView.collection.sort();
																}

												})

								}
								else
								{

												$.getJSON('core/api/calendar-prefs/get', function(response)
												{

																gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

																// Retrieve the events from primary
																var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary', maxResults : 1000, singleEvents : true,
																				pageToken : googleNextPageToken });

																request.execute(function(resp)
																{
																				var events = new Array();
																				console.log(resp);
																				for (var i = 0; i < resp.items.length; i++)
																				{
																								var fc_event = google2fcEvent(resp.items[i]);
																								console.log(fc_event);
																								events.push(fc_event);

																				}
																				googleNextPageToken = resp.nextSyncToken;
																				var view = readCookie("agile_calendar_view");
																				if (view == "calendar_list_view")
																				{
																								googleEventCollectionView.collection.add(events);
																								googleEventCollectionView.collection.sort();
																				}
																				else
																				{
																								googleEventCollectionView.collection.add(events);
																								googleEventCollectionView.collection.sort();
																				}

																});
												});
								}
				}
}
