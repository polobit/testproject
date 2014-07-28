// On change of date, change right column above available slot box
function change_availability_date(selected_date)
{
	var date = new Date(selected_date);

	$('.availability').html("Availability on " + date.getDayName() + ", " + date.getMonthName() + ", " + date.getDate());
	$('.timezone').html('<span class="timezone1">Timezone</span> ' + /\((.*)\)/.exec(new Date().toString())[1]);
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
											'<div class="col-sm-4"><p class="choose" data="' + json.time + '"><span class="minutes">' + json.time + 'mins</span><br />' + json.title + '</p></div>');
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
	var currentDate = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate();

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

	// selected date in current epoch time
	var epochTime = getEpochTimeFromDate(s_date); // milliseconds
	console.log(epochTime);

	// Send request to get available slot
	var initialURL = '/core/api/webevents/getslots?&timezone=' + timezone + '&date=' + s_date + '&slot_time=' + s_slot + "&timezone_name=" + timezoneName + "&epoch_time=" + epochTime;
	$.getJSON(initialURL, function(data)
	{
		console.log(data);
		Available_Slots = data;

		// Update in UI
		displaySlots();
	});
}

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
	console.log(data);

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
	web_calendar_event["date"] = Selected_Date;
	web_calendar_event["slot_time"] = Selected_Time;
	web_calendar_event["selectedSlotsString"] = [];

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
		}
	}

	// Add selected slots to input json
	web_calendar_event["selectedSlotsString"] = JSON.stringify(web_calendar_event["selectedSlotsString"]);
	console.log(web_calendar_event);
	console.log(JSON.stringify(web_calendar_event));

	// Send request to save slot, if new then contact, event
	$.ajax({ url : '/core/api/webevents/save', type : 'PUT', contentType : 'application/json; charset=utf-8', data : JSON.stringify(web_calendar_event),
		dataType : 'json', success : function(output)
		{
			alert("Event added." + output);
			document.getElementById("addEventForm").reset();

			// Reset whole form
			resetAll();
		} });
}
