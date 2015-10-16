// On change of date, change right column above available slot box
function change_availability_date(selected_date)
{

	var date = new Date(selected_date);

	$('.availability').html("Availability on " + date.getDayName() + ", " + date.getMonthName() + " " + date.getDate());
}

// Get slot details time n description
function getSlotDurations()
{

	if (multiple_schedule_ids)
	{
		fillSlotDetails();
		return;
	}
	else if (single_user_mapobject[User_Id].length > 0)
	{
		fillSlotDetails(single_user_mapobject[User_Id]);
		return;
	}
	// Send request to get slot details time n description
	var initialURL = '/core/api/webevents/calendar/getslotdetails?userid=' + User_Id;
	$
			.getJSON(
					initialURL,
					function(data)
					{
						var slots_data = data;
						var slot_data_temp = [];
						if (slot_array && slot_array.length > 0)
						{
							for (var i = 0; i < slot_array.length; i++)
							{
								if ((parseInt(slot_array[i]) - 1) < data.length && parseInt(slot_array[i]) != 0)
								{

									slot_data_temp[i] = slot_array[i];
								}
							}
							if (slot_data_temp.length > 0)
							{
								slot_array = [];
								slot_array = slot_data_temp;
							}
							else
							{
								$('.segment1')
										.append(
												'<div class="col-sm-12" align="center"><p class="lead" style="color: #777;font-size: 19px;text-align: center;font-weight:normal">please enter valid slot number </p> </div>');
								return;

							}
						}
						if (slot_array && data.length >= slot_array.length && slot_array.length > 0)
						{
							data = [];
							var j = 0;
							for (var i = 0; i < slot_array.length; i++)
							{

								if ((parseInt(slot_array[i]) - 1) < slots_data.length)
								{
									data[j] = slots_data[parseInt(slot_array[i]) - 1];
									j++;
								}

							}
						}
						if (data.length == 3)
						{
							for ( var slotDetail in data)
							{
								var json = JSON.parse(data[slotDetail]);
								$('.segment1')
										.append(
												'<div class="col-sm-4 show_slots"><p title="' + json.title + '" class="choose timeslot-view" data="' + json.time + '"><span class="minutes">' + json.time + ' mins</span><br />' + addDotsAtEnd(json.title) + '</p></div>');
							}
							$('.segment1').append('<div class="clearfix"></div>');
						}
						if (data.length == 2)
						{
							for ( var slotDetail in data)
							{
								var json = JSON.parse(data[slotDetail]);
								$('.segment1')
										.append(
												'<div class="col-sm-5 col-md-4 show_slots" style="margin-left: 99px;"><p title="' + json.title + '" class="choose" data="' + json.time + '"><span class="minutes">' + json.time + ' mins</span><br />' + addDotsAtEnd(json.title) + '</p></div>');
							}
							$('.segment1').append('<div class="clearfix"></div>');
						}
						if (data.length == 1)
						{
							for ( var slotDetail in data)
							{
								var json = JSON.parse(data[slotDetail]);
								$('.segment1')
										.append(
												'<div class="col-sm-12 show_slots" align="center"><p title="' + json.title + '" class="choose" data="' + json.time + '"><span class="minutes">' + json.time + ' mins</span><br />' + addDotsAtEnd(json.title) + '</p></div>');
							}
						}
					});
}

// Enable segment 3 after selection of slot
function enableSegment3()
{
	// Make input enable
	$('.me-disable').removeAttr("disabled");

	// Make next part enable
	$('.me-disable').removeClass('me-disable');
}

// Reset all, set current date in calendar, clear all slots, clear form and make
// segment 3 disable
function resetAll()
{
	// Get current date
	var newDate = new Date();
	var currMonth = (newDate.getMonth() + 1);
	if (currMonth < 10)
		currMonth = "0" + currMonth;
	var currentDate = newDate.getFullYear() + '-' + currMonth + '-' + newDate.getDate();

	// Set current date as selected date
	Selected_Date = currentDate;

	// Set current date in calendar
	$('#datepick').DatePickerSetDate(Selected_Date, true);

	// Default date in right column above available slot box
	change_availability_date(Selected_Date);

	// Empty div where all slots listed
	$('.checkbox-main-grid').html('');

	// Clear form
	document.getElementById("addEventForm").reset();

	Available_Slots = null;
}

// Send selected slot and selected date and get available slots from all sync
// calendar.
function get_slots(s_date, s_slot)
{
	MIDNIGHT_START_TIME = null;
	MIDNIGHT_END_TIME = null;
	var selected_epoch_start = getSelectedTimeFromDate(s_date);
	// Current timezone name
	var timezoneName = SELECTED_TIMEZONE;

	// selected date in current epoch time
	var epochTime = getEpochTimeFromDate(s_date); // milliseconds

	var d = new Date(s_date);
	var secs = epochTime + d.getSeconds() + (60 * d.getMinutes()) + (60 * 60 * d.getHours());
	// gets the midnight of selected date. selected date will be stored in
	// global variable i.e current_date_mozilla
	MIDNIGHT_START_TIME = selected_epoch_start = getMidnightEpoch();
	MIDNIGHT_END_TIME = selected_epoch_end = selected_epoch_start + 86400;
	var start_time = getEpochTimeFromDate(d);
	d.setDate(d.getDate() + 1)
	var end_time = getEpochTimeFromDate(d);
	var timezone = getTimezoneOffset();

	// Send request to get available slot
	var initialURL = '/core/api/webevents/calendar/getslots?&user_id=' + User_Id + '&date=' + s_date + '&slot_time=' + s_slot + "&timezone_name=" + timezoneName + "&epoch_time=" + epochTime + "&startTime=" + selected_epoch_start + "&endTime=" + selected_epoch_end + "&agile_user_id=" + Agile_User_Id + "&timezone=" + timezone;
	$.getJSON(initialURL, function(data)
	{

		// No slots available for selected day
		if (data.length == 0)
		{
			displayNoSlotsMsg();
			return;
		}

		Available_Slots = data;

		// Update in UI
		displaySlots();
	});
}

// Add no slots available msg in grid of checkbox
function displayNoSlotsMsg()
{
	// Empty div where all slots listed, to display new slots
	$('.checkbox-main-grid').html('');

	var date = new Date(selecteddate);

	$('.availability').html("No slots available for " + date.getDayName() + ", " + date.getMonthName() + " " + date.getDate());

	// Add msg
	// $('.checkbox-main-grid').append('<label for="no-slots"
	// style="margin-left:112px;">Slots are not available for selected
	// day.</label>');
}

// Add slots in grid checkbox in checkbox list
function displaySlots()
{
	var i = 0, j = 0, k = 0;

	// Empty div where all slots listed, to display new slots
	$('.checkbox-main-grid').html('');

	console.log(Available_Slots.length);
	var after_now = [];
	var date = new Date();
	if (BUFFERTIME == null)
	{
		BUFFERTIME = single_user_mapobject['buffer_time'];
	}
	var current_date_time = date.getTime() + parseInt(BUFFERTIME);
	for (var s = 0; s < Available_Slots.length; s++)
	{
		if (Available_Slots[s][0] * 1000 > parseInt(current_date_time))
		{

			after_now.push(Available_Slots[s]);
		}

	}
	console.log(after_now.length);
	Available_Slots = "";
	Available_Slots = after_now;

	if (Available_Slots.length == 0)
	{
		displayNoSlotsMsg();
		return;
	}

	change_availability_date(selecteddate);
	// Number of row
	var numRow = Available_Slots.length / 5;

	numRow++;

	var addList = function()
	{
		var listSlot = "";
		for (i = 0; i <= numRow; i++)
		{
			if (k < Available_Slots.length)
				listSlot = listSlot + '<li><input class="selected-slot" type="checkbox" id="startTime_' + k + '"name="startTime_' + k + '" value="' + Available_Slots[k][0] + '" /><label for="' + Available_Slots[k][0] + '">' + getConvertedTimeFromEpoch(Available_Slots[k][0]) + '</label></li>';

			k++;
		}
		return listSlot;
	}

	// 5 columns
	for (j = 0; j < 5; j++)
	{
		// Add number of rows, slots with time conversion
		$('.checkbox-main-grid').append('<li><ul class="checkbox-grid">' + addList() + '<ul><li>');
	}
}

// Validates the form fields
function isValid(formId)
{

	$(formId).validate();
	return $(formId).valid();
}

/*
 * // Validates phone number function validatePhone(txtPhone) { var a =
 * document.getElementById(txtPhone).value; var filter = /^[0-9-+]+$/; if
 * (filter.test(a)) return true; else return false; }​
 */

// Save selected slot with user details
function save_web_event(formId, confirmBtn)
{
	// Check if the form is valid
	if (!isValid('#' + formId))
	{
		$('#' + formId).find("input").focus();
		return false;
	}

	// Get details
	var data = $('#' + formId).serializeArray();

	// Make json
	var web_calendar_event = {};
	$.each(data, function()
	{
		if (web_calendar_event[this.name])
		{
			if (!web_calendar_event[this.name].push)
			{
				web_calendar_event[this.name] = [
					web_calendar_event[this.name]
				];
			}
			web_calendar_event[this.name].push(this.value || '');
		}
		else
		{
			web_calendar_event[this.name] = this.value || '';
		}
	});

	// Add selected parameter which are out of form
	web_calendar_event["name"] = appointmenttype;
	// web_calendar_event["date"] = Selected_Date;
	web_calendar_event["slot_time"] = Selected_Time;
	web_calendar_event["domainUserId"] = User_Id;
	web_calendar_event["agileUserId"] = Agile_User_Id;
	web_calendar_event["selectedSlotsString"] = [];
	web_calendar_event["timezone"] = SELECTED_TIMEZONE;
	web_calendar_event["midnight_start_time"] = MIDNIGHT_START_TIME;
	web_calendar_event["midnight_end_time"] = MIDNIGHT_END_TIME;
	web_calendar_event["timezone_offset"] = getTimezoneOffset();
	// Get selected slots in UI from available slots list.
	var i = 0;
	for ( var prop in web_calendar_event)
	{
		if (prop.indexOf("startTime") != -1)
		{
			var res = prop.split("_");

			var result = {};
			result["start"] = Available_Slots[res[1]][0];
			result["end"] = Available_Slots[res[1]][1];
			web_calendar_event["selectedSlotsString"][i] = result;
			i++;

			var dd = new Date(result["start"] * 1000);
			web_calendar_event["date"] = dd.toString();
		}
	}

	if (web_calendar_event["selectedSlotsString"].length == 0)
	{
		alert("Please select appointment time.");
		return false;
	}
	$('#confirm').attr('disabled', 'disabled');
	$('#three').addClass('green-bg').html('<i class="fa fa-check"></i>');
	// Add selected slots to input json
	web_calendar_event["selectedSlotsString"] = JSON.stringify(web_calendar_event["selectedSlotsString"]);

	// Send request to save slot, if new then contact, event
	$
			.ajax({
				url : '/core/api/webevents/calendar/save',
				type : 'PUT',
				contentType : 'application/json; charset=utf-8',
				data : JSON.stringify(web_calendar_event),
				dataType : '',
				complete : function(res, status)
				{

					console.log(status);
					// style="border-bottom: 1px solid #ddd;"
					var dates = JSON.parse(web_calendar_event.selectedSlotsString);
					var d = dates[0];
					var start = convertToHumanDateUsingMoment("", d.start);

					if (status == "success" && res.responseText != "slot booked")
					{
						$('#mainwrap').addClass("appointment-wrap");
						var appointment_success_img1 = "/img/appointment_confirmation.png";
						var temp = '<div style="margin: 26px;font-size:15px;">'

						+ '<div id="info" ><h3 style="border-bottom: 1px solid #ddd;padding-bottom:8px;margin-bottom:15px;"><img style="margin-right: 8px;margin-top: -4px;" src=' + appointment_success_img1 + '><b>Appointment Scheduled</b></h3>' + '<p >Your appointment (' + appointmenttype + ') has been scheduled with <b>' + User_Name + '</b> for ' + web_calendar_event.slot_time + ' mins on ' + start + '. </div>' + '<div class="row">' + '<div class="col-md-12">' + '<div class="row">' + '<div class="col-md-12">' + '<div class="left">' + '<a class="btn btn-primary" id="create_new_appointment" style="margin-top:20px;">Schedule Another Appointment</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<div align="right" style="position: absolute;right: 280px;bottom: -80px;">' + '<span style="display: inherit;font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 71px;">Powered by</span> <a href="https://www.agilecrm.com?utm_source=powered-by&amp;medium=event_scheduler&amp;utm_campaign=' + domainname + '" rel="nofollow" target="_blank"><img src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container" alt="Logo for AgileCRM" style="border: 0;background: white;padding: 0px 10px 5px 2px;height: auto;width: 135px;"></a>' + '</div>'

						resetAll();

						$(".container").html(temp);

					}
					else if (res.responseText == "slot booked")
					{
						alert("Looks like this slot is booked already. Please try another one.");
						get_slots(selecteddate, Selected_Time);
						$('#confirm').attr('disabled', false);
					}

					else
					{
						alert("Something went wrong as your appointment was not scheduled. Please try again in few hours. Error: " + res.statusText);
						resetAll();
						location.reload(true);
					}

				} });
}

function convertToHumanDate(format, date)
{

	if (!format)
		format = "ddd, mmmm d yyyy, h:MM TT";

	if (!date)
		return;

	if ((date / 100000000000) > 1)
	{
		return new Date(parseInt(date)).format(format, 0);
	}
	// date form milliseconds
	var d = new Date(parseInt(date) * 1000).format(format);

	return d
}

function convertToHumanDateUsingMoment(format, date)
{

	if (!format)
		format = "ddd, MMM DD YYYY, hh:mm A";

	if (!date)
		return;
	var date = moment.unix(date);
	var time_s = date.tz(SELECTED_TIMEZONE).format(format);
	return time_s;
}

$("#create_new_appointment").die().live('click', function(e)
{
	// reloads the page
	location.reload(true);

});

/**
 * if value morethan 50 adds .. at the end
 */
function addDotsAtEnd(title)
{
	if (title)
	{
		if (title.length > 10)
		{
			var subst = title.substr(0, 10);
			subst = subst + "....";
			return subst;
		}
	}

	return title;
}

function resetToPrevious()
{
	$("#one").html("2");
	$("#two").html("3");
	$("#three").html("4");
	$('#two').removeClass("green-bg").html('3');
	$('#one').removeClass("green-bg").html('2');
	$('#three').removeClass("green-bg").html('4');
	$("#confirm").hide();
	$(".segment3").hide();
	$(".segment2").hide();

}
function fillSlotDetails(slot_durations_one_user)
{
	var slots_data = data = slot_details;
	if (slot_durations_one_user)
	{
		slots_data = data = slot_durations_one_user;
	}
	var slot_data_temp = [];
	if (slot_array && slot_array.length > 0)
	{
		for (var i = 0; i < slot_array.length; i++)
		{
			if ((parseInt(slot_array[i]) - 1) < data.length && parseInt(slot_array[i]) != 0)
			{

				slot_data_temp[i] = slot_array[i];
			}
		}
		if (slot_data_temp.length > 0)
		{
			slot_array = [];
			slot_array = slot_data_temp;
		}
		else
		{
			$('.segment1')
					.append(
							'<div class="col-sm-12" align="center"><p class="lead" style="color: #777;font-size: 19px;text-align: center;font-weight:normal">please enter valid slot number </p> </div>');
			return;

		}
	}
	if (slot_array && data.length >= slot_array.length && slot_array.length > 0)
	{
		data = [];
		var j = 0;
		for (var i = 0; i < slot_array.length; i++)
		{

			if ((parseInt(slot_array[i]) - 1) < slots_data.length)
			{
				data[j] = slots_data[parseInt(slot_array[i]) - 1];
				j++;
			}

		}
	}
	MEETING_DURATION_AND_NAMES = data = generateNewDataArray(data);
	var dataLength = 12 / data.length;
	for ( var slotDetail in data)
	{
		var json = JSON.parse(data[slotDetail]);
		var meeting_names = json.meeting_names;
		var temp = '';

		for ( var meeting_name in meeting_names)
		{
			temp += '<div class="radio"><label><input class="c-p selected_meeting_time" type="radio" data="' + json.time + '" name="selected_meeting_time" value="' + meeting_names[meeting_name] + '"><i></i>' + meeting_names[meeting_name] + '</label></div>';
		}
		var select = '<div class="panel panel-default">' + '<div class="panel-heading font-bold">' + json.time + ' mins</div>' + '<div class="panel-body">' + '<form class="bs-example form-horizontal">' + '<div class="form-group" style="margin-left:7px;">' + temp + '</div></form></div></div>';
		$('.segment1').append('<div class="col-sm-' + dataLength + ' show_slots"><p class="timeslot-view">' + select + '</p></div>');
	}
	if(multi_user_ids.length<2)
	$(".panel-body").height(parseInt(getPanelBodyMaxHeight()) + 26);
	$('.segment1').append('<div class="clearfix"></div>');

}

function getPanelBodyMaxHeight()
{
	var max = 0;
	$('.panel-body').each(function()
	{
		var height = $(this).height();
		if (height > max)
		{
			max = height;
		}
	});
	return max;
}

function generateNewDataArray(data)
{
	var finalJsonArray = [];
	for ( var slotDetail in data)
	{
		var json = JSON.parse(data[slotDetail]);

		var json_meeting_names = [];
		if (json.title.indexOf(",") > -1)
		{
			json_meeting_names = json.title.split(",");
		}
		else
		{
			json_meeting_names.push(json.title);
		}
		if (json_meeting_names.length > 0)
		{
			var newJson = {};
			newJson.time = json.time;
			newJson.meeting_names = json_meeting_names;
			finalJsonArray.push(JSON.stringify(newJson));

		}
		else
		{
			finalJsonArray.push(JSON.stringify(json));
		}

	}
	return finalJsonArray;
}
