$(function()
{
	// Total available slots on selected date with selecetd slot
	var Available_Slots = null;
	var selected_user_name = null;
	var MIDNIGHT_START_TIME = null;
	var MIDNIGHT_END_TIME = null;

	// Select slot duration 60/30/15min
	//$(".selected_meeting_time").die().live('click', function(e)
	$('body').on('click','.selected_meeting_time',function(e)
	{		
		// e.preventDefault();

		$("#details").empty();
		Selected_Time = $(this).prop('data');
		$(".show_slots").find('input:radio').prop('checked', false);
		$(this, [
			'input:radio'
		]).prop('checked', true);
		appointmenttype = $('input[name="selected_meeting_time"]:checked').val();

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
	//$(".selected-slot").die().live('click', function(e)
	$('body').on('click','.selected-slot',function(e)
	{
		var currentId = $(this).attr('id');

		$('.selected-slot').each(function()
		{
			if ($(this).attr('id') != currentId)
				$(this).prop("checked", false);
		});

		// Make next part enable
		enableSegment3();

		$(".segment3").fadeIn("slow");
		$("#confirm").show();
		$('#two').addClass('green-bg').html('<i class="fa fa-check"></i>');
		autoscrol(".segment3");

	});

	//$("#multi-user-avatar").die().live('click', function(e)
	$('body').on('click','#multi-user-avatar',function(e)
	{
		$(".thumbnail").css("background", "none");
		$(this).css("background", "#4A90E2");
		$('#users_div').addClass('green-bg').html('<i class="fa fa-check"></i>');
		var domainUser_id = $(this).prop('data');
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
				BUFFERTIME = SELECTED_DOMAIN_USER['buffer_time'];

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
				$(".panel-body").height(parseInt(getPanelBodyMaxHeight()) + 26);
				autoscrol(".segment1");
			}

		}

	});

	//$('#user_timezone').die().change(function()
	$('#user_timezone').change(function()
	{

		SELECTED_TIMEZONE = $('#user_timezone').val();		
		updateUserBusinessHoursInVisitorTimezone();

		if (!selecteddate || !Selected_Time)
			return;
		$("#current_local_time").html("Current Time: " + getConvertedTimeFromEpoch(new Date().getTime() / 1000));
		$('.checkbox-main-grid').html('<img class="loading-img" src="../../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');
		get_slots(selecteddate, Selected_Time);
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