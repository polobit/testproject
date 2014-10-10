// On change of date, change right column above available slot box
function change_availability_date(selected_date)
{
	console.log("In change_availability_date");
	console.log(selected_date);

	var date = new Date(selected_date);
	console.log(date);

	$('.availability').html("Availability on " + date.getDayName() + ", " + date.getMonthName() + ", " + date.getDate());
	$('.timezone').html('<span class="timezone1">Timezone -</span> ' + /\((.*)\)/.exec(new Date().toString())[1]);
}

// Get slot details time n description
function getSlotDurations()
{
	// Send request to get slot details time n description
	var initialURL = '/core/api/webevents/getslotdetails';
	$
			.getJSON(
					initialURL,
					function(data)
					{
						for ( var slotDetail in data)
						{
							var json = JSON.parse(data[slotDetail]);
							$('.segment1')
									.append(
											'<div class="col-sm-4"><p class="choose" data="' + json.time + '"><span class="minutes">' + json.time + ' mins</span><br />' + json.title + '</p></div>');
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
	console.log("in get_slots");
	console.log(s_date + " " + s_slot);

	// Current timezone
	var timezone = new Date().getTimezoneOffset();
	console.log(timezone);

	console.log(new Date().toString());

	// Current timezone name
	var timezoneName = /\((.*)\)/.exec(new Date().toString())[1];
	console.log(timezoneName);

	// Get Timezone Abbreviation from Time
	var timezoneAbbr = GetTimezoneShort(new Date());
	console.log(timezoneAbbr);

	// selected date in current epoch time
	var epochTime = getEpochTimeFromDate(s_date); // milliseconds
	console.log(epochTime);

	var d = new Date(s_date)
	console.log(d);

	var start_time = getEpochTimeFromDate(d);
	d.setDate(d.getDate() + 1)
	var end_time = getEpochTimeFromDate(d);
	console.log(start_time + "  " + end_time);

	// Send request to get available slot
	var initialURL = '/core/api/webevents/getslots?&user_name=' + User_Name + '&user_id=' + User_Id + '&timezone=' + timezone + '&date=' + s_date + '&slot_time=' + s_slot + "&timezone_name=" + timezoneAbbr + "&epoch_time=" + epochTime + "&start_time=" + start_time + "&end_time=" + end_time;
	$.getJSON(initialURL, function(data)
	{
		console.log(data);

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

	// Add msg
	$('.checkbox-main-grid').append('<label for="no-slots" style="margin-left:112px;">Slots are not available for selected day.</label>');
}

// Add slots in grid checkbox in checkbox list
function displaySlots()
{
	var i = 0, j = 0, k = 0;

	// Empty div where all slots listed, to display new slots
	$('.checkbox-main-grid').html('');

	// Number of row
	var numRow = Available_Slots.length / 5;

	numRow++;

	var addList = function()
	{
		var listSlot = "";
		for (i = 0; i <= numRow; i++)
		{
			if (k < Available_Slots.length)
				listSlot = listSlot + '<li><input class="selected-slot" type="checkbox" id="startTime_' + k + '"name="startTime_' + k + '" value="' + Available_Slots[k][0] + '" /><label for="' + Available_Slots[k][0] + '">' + createNormalTime(Available_Slots[k][0]) + '</label></li>';

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
	console.log(formId);

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
	$('#three').addClass('green-bg').html('<i class="fa fa-check"></i>');
	console.log(data);
	
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
	console.log(web_calendar_event);

	// Add selected parameter which are out of form
	web_calendar_event["name"] = "Save in DB";
	// web_calendar_event["date"] = Selected_Date;
	web_calendar_event["slot_time"] = Selected_Time;
	web_calendar_event["domainUserId"] = User_Id;
	web_calendar_event["agileUserId"] = Agile_User_Id;
	web_calendar_event["selectedSlotsString"] = [];
	web_calendar_event["timezone"] = -new Date().getTimezoneOffset();

	// Get selected slots in UI from available slots list.
	var i = 0;
	for ( var prop in web_calendar_event)
	{
		console.log(prop);
		if (prop.indexOf("startTime") != -1)
		{
			console.log(web_calendar_event[prop]);
			var res = prop.split("_");

			var result = {};
			result["start"] = Available_Slots[res[1]][0];
			result["end"] = Available_Slots[res[1]][1];
			web_calendar_event["selectedSlotsString"][i] = result;
			i++;

			console.log(result["start"]);
			var dd = new Date(result["start"] * 1000);
			web_calendar_event["date"] = dd.toString();
		}
	}

	console.log(web_calendar_event["selectedSlotsString"].length);

	if (web_calendar_event["selectedSlotsString"].length == 0)
	{
		alert("Please select appointment time.");
		return false;
	}
	$('#confirm').attr('disabled', 'disabled');
	$('#three').addClass('green-bg').html('<i class="fa fa-check"></i>');
	// Add selected slots to input json
	web_calendar_event["selectedSlotsString"] = JSON.stringify(web_calendar_event["selectedSlotsString"]);
	console.log(web_calendar_event);
	console.log(JSON.stringify(web_calendar_event));

	// Send request to save slot, if new then contact, event
	$
			.ajax({
				url : '/core/api/webevents/save',
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
					var start = convertToHumanDate("", d.start);

					if (status == "success")
					{

						$('#mainwrap').addClass("appointment-wrap");

						var temp = '<div style="margin: 25px;font-size:15px;">'

						+ '<div id="info" ><h3 style="border-bottom: 1px solid #ddd;padding-bottom:8px;margin-bottom:15px;"><b>Appointment Scheduled</b></h3>' + '<p >Your appointment was scheduled with <b>' + User_Name + '</b> on ' + start + '</div>' + '<div class="row">' + '<div class="col-md-12">' + '<p>Duration: ' + web_calendar_event.slot_time + ' Minutes </p>' + '</div>' + '</div>' + '<div class="row">' + '<div class="col-md-12">' + '<div class="left">' + '<a class="btn btn-primary" id="create_new_appointment" style="margin-top:20px;">Schedule Another Appointment</a>' + '</div>' + '</div>' + '</div>' + '</div>' + '<div align="right" style="position: absolute;right: 280px;bottom: -80px;">' + '<span style="display: inherit;font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 71px;">Powered by</span> <a href="https://www.agilecrm.com?utm_source=powered-by&amp;medium=event_scheduler&amp;utm_campaign=' + domainname + '" rel="nofollow" target="_blank"><img src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container" alt="Logo for AgileCRM" style="border: 0;background: white;padding: 0px 10px 5px 2px;height: auto;width: 135px;"></a>' + '</div>'

						resetAll();

						$(".container").html(temp);

					}
					else
					{
						alert("Your appointment not scheduled. please try again");
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
		console.log(new Date(parseInt(date)).format(format));
		return new Date(parseInt(date)).format(format, 0);
	}
	// date form milliseconds
	var d = new Date(parseInt(date) * 1000).format(format);

	return d
}

$("#create_new_appointment").die().live('click', function(e)
{

	location.reload(true);
});
