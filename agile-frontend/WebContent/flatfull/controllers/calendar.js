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
 * Activates the calendar menu and loads minified fullcalendar and jquery-ui to
 * show calendar view. Also shows tasks list in separate section.
 */
calendar : function()
{
	_agile_delete_prefs("agile_calendar_view");
	// read cookie for view if list_view is there then rendar list view else
	// rendar default view
	

		$('#content').html("<div id='calendar-listers'>&nbsp;</div>");
		$('#calendar-listers').html(LOADING_ON_CURSOR);
		getTemplate("calendar", {}, undefined, function(template_ui){

		if(!template_ui)
			  return;

		getCalendarUsersDetails(function(users){

		$('#calendar-listers').html($(template_ui));

				getTemplate("event-left-filter", users, undefined, function(template_ui1){
					
						$('#calendar-listers').find("#calendar-filters").html($(template_ui1));

						buildCalendarLhsFilters();
						createRequestUrlBasedOnFilter();
						var view = _agile_get_prefs("agile_calendar_view");

						if (view)
						{
							$("#list_event_time").removeClass('hide');
							$("#user_calendars").hide();
							loadGoogleEvents();
							loadAgileEvents();
							return;
						}
						
						$("#list_event_time").addClass('hide');
						$("#user_calendars").show();
						$('#calendar-view-button').show();

						$(".active").removeClass("active");
						$("#calendarmenu").addClass("active");
						$('#agile_event_list').addClass('hide');

						// Typahead also uses jqueryui - if you are changing the version
						// here,
						// change it there too
						head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/fullcalendar.min.js', function()
						{
							showCalendar(users);
							hideTransitionBar();
							initializeEventListners();
						});

						$('#grp_filter').css('display', 'none');
						$('#event_tab').css('display', 'none');
					
						 $("[data-toggle=tooltip").tooltip();
						 
					}, $('#calendar-listers').find("#calendar-filters"));
					

		});	
			loadPortlets('Events');
	}, "#calendar-listers");


	
},

/* Show tasks list when All Tasks clicked under calendar page. */
tasks : function()
{

	getTemplate("tasks-list-header", {}, undefined, function(template_ui){
		if(!template_ui)
			  return;
		$('#content').html($(template_ui));	

		fillSelect("owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
		{

			$('#content').find("#owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
			$('#content').find("#owner-tasks").append("<li><a href='my-pending-tasks'>My Pending Tasks</a></li>");

			// To Updated task list based on user selection of type and owner
			initOwnerslist();
		}, "<li><a href='{{id}}'>My Tasks</a></li>", true);

		$(".active").removeClass("active");
		$("#calendarmenu").addClass("active");

	}, "#content");
},

/* Show new view of tasks. */
tasks_new : function()
{
	console.log("tasks_new");
	
	$('#content').html("<div id='tasks-list-template'>&nbsp;</div>");

	getTemplate("new-tasks-list-header", {}, undefined, function(template_ui){
		if(!template_ui)
			  return;
		$('#tasks-list-template').html($(template_ui));

		fillSelect("new-owner-tasks", '/core/api/users/current-user', 'domainUser', function fillOwner()
		{
			$('#tasks-list-template').find("#new-owner-tasks").prepend("<li><a href=''>All Tasks</a></li>");
			$('#tasks-list-template').find("#new-owner-tasks").append("<li><a href='all-pending-tasks' class='hide-on-status'>All Pending Tasks</a></li>");
			$('#tasks-list-template').find("#new-owner-tasks").append("<li><a href='my-pending-tasks' class='hide-on-owner hide-on-status'>My Pending Tasks</a></li>");
			initializeTasksListeners();
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
		loadPortlets('Tasks');

	}, "#tasks-list-template");

},

// list view of event

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
		$('#today-event', this.el).parent('table').removeClass('hide');
		$('#today-event', this.el).show();
		$('#today-heading', this.el).show();
	}
	// if create time is 1 then that events belongs to tomarrow
	else if (createdtime == 1)
	{

		var heading = $('#tomorrow-heading', this.el);

		$('#tomorrow-event', this.el).append(itemView.render().el);
		$('#tomorrow-event', this.el).parent('table').css("display", "block");
		$('#tomorrow-event', this.el).parent('table').removeClass('hide');
		$('#tomorrow-event', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}
	else if (createdtime > 1)
	{

		var heading = $('#next-week-heading', this.el);

		$('#next-week-event', this.el).append(itemView.render().el);
		$('#next-week-event', this.el).parent('table').css("display", "block");
		$('#next-week-event', this.el).parent('table').removeClass('hide');
		$('#next-week-event', this.el).show();
		if ($('#tomorrow-event').children().length > 0 || $('#today-event').children().length > 0)
		{
			$('#next-week-heading', this.el).show();

		}
	}

	var jsonObject = $.parseJSON(_agile_get_prefs('event-lhs-filters'));
	jsonObject = jsonObject[CURRENT_AGILE_USER.id];

	var owner = jsonObject ? jsonObject.owner_ids : null;// if no owner then
	// its all
	if (owner && owner.length == 1 && owner[0] == CURRENT_AGILE_USER.id)
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

	var jsonObject = $.parseJSON(_agile_get_prefs('event-lhs-filters'));
	jsonObject = jsonObject[CURRENT_AGILE_USER.id];

	var owner = jsonObject ? jsonObject.owner_ids : null; // if no owner then
	// its all
	if (owner && owner.length == 1 && owner[0] == CURRENT_AGILE_USER.id)
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
		$('#today-event', this.el).parent('table').removeClass('hide');
		$('#today-event', this.el).show();
		$('#today-heading', this.el).show();
	}
	// if create time is 1 then that events belongs to tomarrow
	else if (createdtime == 1)
	{

		$('#tomorrow-event', this.el).append(itemView.render().el);
		$('#tomorrow-event', this.el).parent('table').css("display", "block");
		$('#tomorrow-event', this.el).parent('table').removeClass('hide');
		$('#tomorrow-event', this.el).show();
		$('#tomorrow-heading', this.el).show();
	}
	else if (createdtime > 1)
	{

		$('#next-week-event', this.el).append(itemView.render().el);
		$('#next-week-event', this.el).parent('table').css("display", "block");
		$('#next-week-event', this.el).parent('table').removeClass('hide');
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
		$("#updateActivityModal").html(getTemplate("update-activity-modal")).modal('show');

		var event = eventCollectionView.collection.get(id).toJSON();
		console.log("clicked event " + event);

		var contactList = event.contacts;
		for (var i = 0; i < contactList.length; i++)

		{
			var template = Handlebars.compile('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="{{id}}"><a href="#contact/{{id}}" class="text-white v-middle">{{name}}</a><a class="close m-l-xs" id="remove_tag">&times</a></li>');
			var json = {};
		 	// Adds contact name to tags ul as li element
		 	fel.append();

			if (contactList[i].type == "COMPANY")
			{   
				json = {name : getCompanyName(contactList[i].properties), id : contactList[i].id};
			}
			else
			{
				json = {name : getName(contactList[i].properties), id : contactList[i].id};
			}

			$('#updateActivityModal')
						.find("ul[name='contacts']")
						.append(template(json));
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

		$("#update-event-date-1").val(getDateInFormatFromEpoc(event.start));
		$("#update-event-date-2").val(getDateInFormatFromEpoc(event.end));

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
		if (event.meeting_type)
			$('#updateActivityModal').find("input[name='meeting_type']").val(event.meeting_type);
		else
			$('#updateActivityModal').find("input[name='meeting_type']").val('');

		if (event.type == "WEB_APPOINTMENT" && parseInt(event.start) > parseInt(new Date().getTime() / 1000))
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
			var desc = '<div class="row-fluid">' + '<div class="control-group form-group m-b-none">' + '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>' + '<div class="controls event_discription hide">' + '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>' + '</div></div></div>'
			$("#event_desc").html(desc);
		}
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

	accessUrlUsingAjax('core/api/calendar-prefs/get', function(response)
	{
		if (response)
			calEnable = true;

		var jsonObject = $.parseJSON(_agile_get_prefs('event-lhs-filters'));
		jsonObject = jsonObject[CURRENT_AGILE_USER.id];

		var agile_event_owners = '';
		if (jsonObject)
		{
			var owners = jsonObject.owner_ids;
			if (owners && owners.length > 0)
			{
				$.each(owners, function(index, value)
				{
					if (index >= 1)
						agile_event_owners += ",";
					agile_event_owners += value;
				});
			}
		}
		var view = _agile_get_prefs("agile_calendar_view");
		if (view == "calendar_list_view")
		{
			eventCollectionView = new Base_Collection_View({ url : 'core/api/events/list?ownerId=' + agile_event_owners + '', templateKey : "events",
				individual_tag_name : 'tr', sort_collection : true, sortKey : 'start', descending : false, cursor : true, page_size : 25 });
			eventCollectionView.appendItem = appendItem2;
			eventCollectionView.collection.fetch();
			if (calEnable)
			{
				$('#agile').html(this.eventCollectionView.render().el);
				$('#agile_event_list').addClass('hide');
			}
			else
				$('#agile_event').html(this.eventCollectionView.render().el);

		}
		else if (view == "calendar_list_view_future")
		{
			eventCollectionView = new Base_Collection_View({ url : 'core/api/events/future/list?ownerId=' + agile_event_owners, templateKey : "future",
				individual_tag_name : 'tr', sort_collection : true, sortKey : 'start', descending : false, cursor : true, page_size : 25 });
			eventCollectionView.appendItem = appendItem1;
			eventCollectionView.collection.fetch();
			if (calEnable)
			{
				$('#agile').html(this.eventCollectionView.render().el);
				$('#agile_event_list').addClass('hide');
			}
			else
				$('#agile_event').html(this.eventCollectionView.render().el);
		}

	 });
}

function loadGoogleEvents()
{

	$.getJSON('core/api/calendar-prefs/get', function(response)
	{
		console.log(response);
		if (response)
		{
			_agile_set_prefs('google_event_token', response.access_token);

			head.js('https://apis.google.com/js/client.js', '/lib/calendar/gapi-helper.js?t=25', function()
			{
				setupGC(function()
				{

					gapi.auth.setToken({ access_token : response.access_token, state : "https://www.googleapis.com/auth/calendar" });

					// Retrieve the events from primary
					var view = _agile_get_prefs("agile_calendar_view");
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
			$('#agile_event_list').addClass('hide');
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
	var accessToken = _agile_get_prefs('google_event_token');
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
				var view = _agile_get_prefs("agile_calendar_view");
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
					var view = _agile_get_prefs("agile_calendar_view");
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

function loadOfficeEvents(calStartDateObj, calEndDateObj){

	showLoadingOnCalendar(true);

	var url = "core/api/officecalendar/office365-appointments?startDate="+ calStartDateObj.getTime() +"&endDate="+ calEndDateObj.getTime();
	$.getJSON(url, function(response){
		if(response){
			var jsonArray = [];
			for (var i=0; i<response.length; i++){		
				var obj = response[i];
				//Start Date
				var startDate = Math.round((new Date(obj.start).getTime()) / 1000);
				obj.start = startDate;
				//End Date
				var endDate = Math.round((new Date(obj.end).getTime()) / 1000);
				obj.end = endDate;
				jsonArray.push(obj);		
			}	
			addEventSourceToCalendar('office', jsonArray);
			showLoadingOnCalendar(false);	
		}else{			
			showLoadingOnCalendar(false);	
		}
	});	
}
