$(function()
{
	$(".calendar_check").die().live('click', function(e)
	{
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	});

	$(".calendar_user_check").die().live('click', function(e)
	{
		checkBothCalWhenNoCalSelected();
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();

		// $('.select_all_users').removeAttr("checked");

	});

	$('.select_all_users').die().live('click', function(event)
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

	$('#event_time').die().live('change', function(event)
	{ // on click
		if ($("#event_time").val() == "future")
			createCookie("agile_calendar_view", "calendar_list_view_future");
		else
			createCookie("agile_calendar_view", "calendar_list_view");
		createRequestUrlBasedOnFilter();
		loadFullCalednarOrListView();
	});

});

function createRequestUrlBasedOnFilter()
{
	var calendars_val = [];
	var calendars_user_val = [];
	var event_list_type = '';

	try
	{
		calendars_user_val.push(CURRENT_AGILE_USER.id);
	}
	catch (err)
	{
		console.log("error in create request URL");
	}
	$('.calendar_check').each(function()
	{
		if (this.checked)
			calendars_val.push($(this).val());

	});

	$('.calendar_user_check').each(function()
	{
		if (this.checked)
			calendars_user_val.push($(this).val());

	});
	if (readCookie("agile_calendar_view"))
	{

		event_list_type = $("#event_time").val();
	}
	var json_obj = {};
	json_obj.cal_type = calendars_val;
	json_obj.owner_ids = calendars_user_val;
	if (event_list_type)
		json_obj.event_type = event_list_type;

	createCookie('event-lhs-filters', JSON.stringify(json_obj));

}

// this function will be called to read filters from cookie if not found creates
// cookie with default values
function buildCalendarLhsFilters()
{
	var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
	if (eventFilters)
	{
		var type_of_cal = eventFilters.cal_type;
		var owners = eventFilters.owner_ids;
		var event_time = eventFilters.events_time;
		var list_event_type = eventFilters.event_type;

		if (type_of_cal)
		{
			$.each(type_of_cal, function(index, value)
			{
				$('.calendar_check').each(function()
				{ // loop through each checkbox
					if ($(this).val() == value)
						this.checked = true;
				});

			});
		}

		if (owners && owners.length > 0)
		{
			$.each(owners, function(index, value)
			{
				$('.calendar_user_check').each(function()
				{ // loop through each checkbox
					if ($(this).val() == value)
						this.checked = true;
				});

			});
		}

		if (readCookie("agile_calendar_view"))
		{

			if (list_event_type)
				$("#event_time").val(list_event_type);
		}

	}
	else
	{
		$('.calendar_user_check').each(function()
		{ // loop through each checkbox
			if ($(this).val() == CURRENT_AGILE_USER.id)
				this.checked = true;
		});
		$('.calendar_check').each(function()
		{ // loop through each checkbox
			this.checked = true;
		});

		if (readCookie("agile_calendar_view"))
		{
			$("#event_time").val("");
		}

	}

}

// this function will be called to load full calendar based on filters
function loadFullCalednarOrListView()
{
	if (readCookie("agile_calendar_view"))
	{
		var eventFilters = JSON.parse(readCookie('event-lhs-filters'));
		if (eventFilters)
		{
			if (eventFilters.event_type == "future")
			{
				createCookie("agile_calendar_view", "calendar_list_view_future");
			}
			else
			{
				createCookie("agile_calendar_view", "calendar_list_view");
			}
		}
		else
			createCookie("agile_calendar_view", "calendar_list_view");

	}

	// if list view
	if (!readCookie("agile_calendar_view"))
	{
		$('#calendar_event').html('');
		showCalendar();
	}
	else
	{

		loadAgileEvents();
		loadGoogleEvents();

	}
}

function checkBothCalWhenNoCalSelected()
{
	var selectedCal = [];
	$('.calendar_check').each(function()
	{
		if (this.checked)
			selectedCal.push($(this).val());

	});
	if (selectedCal && selectedCal.length == 0)
	{
		$('.calendar_check').each(function()
		{
			this.checked = true;

		});
	}
}

function putGoogleCalendarLink()
{
	var calEnable = false;

	$.ajax({ url : 'core/api/calendar-prefs/get', async : false, success : function(response)
	{
		if (response)
			calEnable = true;

	} });

	/*
	 * if (calEnable) $("google_cal_link") .html( '<label class="i-checks
	 * i-checks-sm" id="google_cal_link">' + '<input type="checkbox"
	 * class="calendar_check" value="google">' + '<i></i> Google </label>');
	 * else $("google_cal_link").html('<label class="icon-icon-plus"
	 * id="google_cal_link"> <a href="">Add Google Calendar</a></label>');
	 */
	if (calEnable)
	{
		$("#google_cal").show();
		$("#google_cal_link").addClass('hide');
	}

	else
	{
		$("#google_cal").hide();
		$("#google_cal_link").removeClass('hide');
	}
}
