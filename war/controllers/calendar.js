/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
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
								var view = readCookie("agile_calendar_view");
								if (view)
								{

												if (readCookie('event-filters') && JSON.parse(readCookie('event-filters')).type == 'agile')
												{
																// changing tab

																$($('#event_tab').children()[1]).addClass("hide");
																$($('#event_tab').children()[0]).removeClass("hide");
																$($('#event_tab').children()[0]).addClass("active");

																loadAgileEvents();

												}
												else if (readCookie('event-filters') && JSON.parse(readCookie('event-filters')).type == 'google')
												{
																// activate google tab
																$($('#event_tab').children()[0]).addClass("hide");
																$($('#event_tab').children()[1]).removeClass("hide");
																$($('#event_tab').children()[1]).addClass("active");
																// display google events
																// retrieve google Calendar prefs and pass to function
																loadGoogleEvents();
												}
												else
												{
																if ($($('#event_tab').children()[0]).hasClass("hide"))
																{

																				$($('#event_tab').children()[0]).removeClass("hide");
																				$($('#event_tab').children()[0]).addClass("active");
																}
																if ($($('#event_tab').children()[1]).hasClass("hide"))
																{
																				$($('#event_tab').children()[1]).removeClass("hide");
																}

																loadGoogleEvents();
																loadAgileEvents();

																if (!$('#agile').hasClass("active"))
																{
																				$('#agile').addClass("active");
																}

																if ($('#google').hasClass("active"))
																{
																				$('#google').removeClass("active");
																}

												}
								}
								else
								{

												$(".active").removeClass("active");
												$("#calendarmenu").addClass("active");

												// Typahead also uses jqueryui - if you are changing the version
												// here,
												// change it there too
												head.js(LIB_PATH + 'lib/jquery-ui.min.js', 'lib/fullcalendar.min.js', function()
												{
																showCalendar();

												});

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

								}, "<li><a href='{{id}}' class='hide-on-owner'>My Tasks</a></li>", true);

								$('.loading').remove();

								$(".active").removeClass("active");
								$("#calendarmenu").addClass("active");

								// Hide owner's and status task selection options from dropdown
								$(".hide-on-pending").hide();

								// To set events and css of dropdown's sub menu
								$('.dropdown-submenu > a').submenupicker();
				},

// list view of event

});

$(function()
{

				$(".c_list_view").die().live('click', function(e)
				{
								e.preventDefault();
								// Creates the cookie
								createCookie("agile_calendar_view", "calendar_list_view");

								// Loads the calendar
								App_Calendar.calendar();
				});

				$(".c_view").die().live('click', function(e)
				{
								e.preventDefault();
								// Erases the cookie
								eraseCookie("agile_calendar_view");

								// Loads the calendar
								App_Calendar.calendar();
				});

				$(".c_list_view_future").die().live('click', function(e)
				{
								e.preventDefault();
								// Creates the cookie
								createCookie("agile_calendar_view", "calendar_list_view_future");

								// Loads the calendar
								App_Calendar.calendar();
				});

				// intialize event tab
				$('#event_tab').tab();

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
								if ($('#tomorrow-event').children().length > 0)
								{
												$('#next-week-heading', this.el).show();

								}
				}

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

}

// append all google events
function appendGoogleEvent(base_model)
{
				var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model", tagName : 'tr', });

				// add to the right box - overdue, today, tomorrow etc.

				$('#google_event', this.el).append(itemView.render().el);
				$('#google_event', this.el).parent('table').css("display", "block");
				$('#google_event', this.el).show();

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
								if ($('#tomorrow-event', this.el).children().length > 0)
								{
												$('#next-week-heading', this.el).show();

								}
				}

}

function show_model(id)
{

				$('#updateActivityModal').modal('show');

				var event = App_Calendar.eventCollectionView.collection.get(id).toJSON();
				console.log("clicked event " + event);

				var contactList = event.contacts;
				for (var i = 0; i < contactList.length; i++)

				{
								if (contactList[i].type == "COMPANY")
								{

												$('#updateActivityModal')
																				.find("ul[name='contacts']")
																				.append(

																												'<li class="tag" data="' + contactList[i].id + '" style="display: inline-block; "><a href="#contact/' + contactList[i].id + '">' + getCompanyName(contactList[i].properties) + '</a><a class="close" id="remove_tag">�</a></li>');

								}
								else
								{
												$('#updateActivityModal')
																				.find("ul[name='contacts']")
																				.append(
																												'<li class="tag" data="' + contactList[i].id + '" style="display: inline-block; "><a href="#contact/' + contactList[i].id + '">' + getName(contactList[i].properties) + '</a><a class="close" id="remove_tag">�</a></li>');
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
								$('#update-event-time-1').val((start.getHours() < 10 ? "0" : "") + start.getHours() + ":" + (start.getMinutes() < 10 ? "0" : "") + start.getMinutes());
								$('#update-event-time-2').val((end.getHours() < 10 ? "0" : "") + end.getHours() + ":" + (end.getMinutes() < 10 ? "0" : "") + end.getMinutes());
				}

				$('#updateActivityModal').find("input[type='hidden']").val(id);

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
				for (var i = 0; i < properties.length; i++)
				{
								if (properties[i].name == 'first_name')
												name = properties[i].value;
								if (properties[i].name == 'last_name')
												name = name + " " + properties[i].value;
				}
				return name;
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

				if (!$('#agile').hasClass("active"))
				{
								$('#agile').addClass("active");
				}
				if ($('#google').hasClass("active"))
				{
								$('#google').removeClass("active");
				}

				var view = readCookie("agile_calendar_view");
				if (view == "calendar_list_view")
				{
								this.eventCollectionView = new Base_Collection_View({ url : 'core/api/events/list', templateKey : "events", individual_tag_name : 'tr',
												sort_collection : false, cursor : true, page_size : 25, });
								this.eventCollectionView.appendItem = appendItem1;
								this.eventCollectionView.collection.fetch();

								$('#agile').html(this.eventCollectionView.render().el);
				}
				else if (view == "calendar_list_view_future")
				{
								this.eventCollectionView = new Base_Collection_View({ url : 'core/api/events/future/list', templateKey : "future", individual_tag_name : 'tr',
												sort_collection : false, cursor : true, page_size : 25, });
								this.eventCollectionView.appendItem = appendItem2;
								this.eventCollectionView.collection.fetch();

								$('#agile').html(this.eventCollectionView.render().el);
				}
}

function loadGoogleEvents()
{

				$.getJSON('core/api/calendar-prefs/get', function(response)
				{
								console.log(response);

								head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js', function()
								{
												setupGC(function()
												{

																gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

																// Retrieve the events from primary
																var request = gapi.client.calendar.events.list({ 'calendarId' : 'primary' });

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
																				var view = readCookie("agile_calendar_view");
																				if (view == "calendar_list_view")
																				{
																								var eventCollectionView = new Base_Collection_View({ data : events, templateKey : "googleEventCategorization",
																												individual_tag_name : 'tr' });
																								eventCollectionView.appendItem = appendGoogleEventCategorization;
																								$('#google').html(eventCollectionView.render(true).el);
																				}
																				else
																				{
																								var eventCollectionView = new Base_Collection_View({ data : events, templateKey : "google-event", individual_tag_name : 'tr' });
																								eventCollectionView.appendItem = appendGoogleEvent;
																								$('#google').html(eventCollectionView.render(true).el);
																				}

																				if ((readCookie('event-filters') && JSON.parse(readCookie('event-filters')).type != 'agile') && (readCookie('event-filters') && JSON
																												.parse(readCookie('event-filters')).type != 'google'))
																				{

																								if ($('#google').hasClass("active"))
																								{
																												$('#google').removeClass("active");
																								}
																								if (!$('#agile').hasClass("active"))
																								{
																												$('#agile').addClass("active");
																								}
																				}
																				else
																				{
																								if (!$('#google').hasClass("active"))
																								{
																												$('#google').addClass("active");
																								}
																								if ($('#agile').hasClass("active"))
																								{
																												$('#agile').removeClass("active");
																								}
																				}

																});

												});
												return;
								});

				});
}
