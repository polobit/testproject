$(function()
{
	// Total available slots on selected date with selecetd slot
	var Available_Slots = null;
	var selected_user_name = null;
	var Available_Slots = null;

	// Select slot duration 60/30/15min
	$(".choose").die().live('click', function(e)
	{
		e.preventDefault();

		$("#details").empty();
		Selected_Time = $(this).attr('data');

		var json_meeting_duration = JSON.parse(meeting_duration);
		console.log(json_meeting_duration);
		if (Selected_Time == 15)
		{
			appointmenttype = json_meeting_duration['15mins'];
		}
		else if (Selected_Time == 30)
		{
			appointmenttype = json_meeting_duration['30mins'];
			;
		}
		else if (Selected_Time == 60)
		{
			appointmenttype = json_meeting_duration['60mins'];
			;
		}

		$(".activemin").removeClass("activemin");
		$(this).find('.minutes').addClass("activemin");

		// Make next part enable
		$('.segment2').removeClass('me-disable');
		$(".segment2").fadeIn("slow");
		$('#one').addClass('green-bg').html('<i class="fa fa-check"></i>');

		autoscrol(".segment2");

		var isFirefox = typeof InstallTrigger !== 'undefined';
		if (isFirefox)
		{
			$('#datepick').DatePickerSetDate(current_date_mozilla, true);
		}
		$('.checkbox-main-grid').html('<img class="loading-img" src="../../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');
		if (!selecteddate)
		{
			selecteddate = new Date();
			CURRENT_DAY_OPERATION = true;

		}
		if (selecteddate)
		{

			get_slots(selecteddate, Selected_Time);
		}

		// Reset all
		// resetAll();
	});

	// Confirm filled info with selected slot
	$('#confirm').click(function(e)
	{
		e.preventDefault();
		// Save scheduled slot
		save_web_event('addEventForm', this);
	});

	// Only single slot selection is allowed
	$(".selected-slot").die().live('click', function(e)
	{
		var currentId = $(this).attr('id');

		$('.selected-slot').each(function()
		{
			if ($(this).attr('id') != currentId)
				$(this).attr("checked", false);
		});

		// Make next part enable
		enableSegment3();

		$(".segment3").fadeIn("slow");
		$("#confirm").show();
		$('#two').addClass('green-bg').html('<i class="fa fa-check"></i>');
		autoscrol(".segment3");

	});

	$("#multi-user-avatar").die().live('click', function(e)
	{
		$(".thumbnail").css("background", "none");
		$(this).css("background", "#4A90E2");
		$('#users_div').addClass('green-bg').html('<i class="fa fa-check"></i>');
		var domainUser_id = $(this).attr('data');
		if (domainUser_id != User_Id)
		{
			resetToPrevious();
			if (!isEmpty(mapobject))
			{
				SELECTED_DOMAIN_USER = mapobject[domainUser_id];

				User_Id = SELECTED_DOMAIN_USER['id'];
				Agile_User_Id = SELECTED_DOMAIN_USER['agile_user_id'];
				User_Name = selected_user_name = SELECTED_DOMAIN_USER['name'];
				meeting_duration = SELECTED_DOMAIN_USER['meeting_durations'];
				meeting_types = SELECTED_DOMAIN_USER['meeting_types'];

				if (meeting_types[0] != "")
				{
					$(".meetingtypes").show();
					$(".meetingtypes").empty();
					$(".meetingtypes").append("<option selected disabled>Meeting Type</option>");
					for (var i = 0; i < meeting_types.length; i++)
					{
						$(".meetingtypes").append("<option value='" + meeting_types[i] + "'>" + meeting_types[i] + "</option>");
					}
				}
				else
					$(".meetingtypes").hide();

				slot_details = SELECTED_DOMAIN_USER['slot_details'];
				$('.show_slots').hide();

				getSlotDurations();
				$(".segment1").fadeIn("slow");
				autoscrol(".segment1");
			}

		}

	});

	$('#user_timezone').die().change(function()
	{

		SELECTED_TIMEZONE = $('#user_timezone').val();
		$(".timezone1").text(SELECTED_TIMEZONE);
		$('.timezone1').show();
		$("#hidetimezone").addClass("hide");

		if (!selecteddate || !Selected_Time)
			return;
		$("#current_local_time").html("Current Time: " + getConvertedTimeFromEpoch(new Date().getTime() / 1000));
		$('.checkbox-main-grid').html('<img class="loading-img" src="../../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');
		get_slots(selecteddate, Selected_Time);
	});

	$('.timezone1').die().click(function()
	{
		$("#hidetimezone").removeClass("hide");
		$('.timezone1').hide();
	});

	$('#user_timezone').die().blur(function()
	{
		if (SELECTED_TIMEZONE == $('#user_timezone').val())
		{
			$(".timezone1").text(SELECTED_TIMEZONE);
			$('.timezone1').show();
			$("#hidetimezone").addClass("hide");
		}
	});

	function autoscrol(divclass)
	{

		console.log($(divclass).offset().top);

		$("body,html").animate({ scrollTop : $(divclass).offset().top }, 1000);

	}

	function isEmpty(o)
	{
		for ( var p in o)
		{
			if (o.hasOwnProperty(p))
			{
				return false;
			}
		}
		return true;
	}

});