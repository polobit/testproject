$(function()
{
	// Total available slots on selected date with selecetd slot
	var Available_Slots = null;

	// Select slot duration 60/30/15min
	$(".choose").die().live('click', function(e)
	{
		e.preventDefault();

		Selected_Time = $(this).attr('data');

		$(".activemin").removeClass("activemin");
		$(this).find('.minutes').addClass("activemin");

		// Make next part enable
		$('.segment2').removeClass('me-disable');
		$(".segment2").fadeIn("slow");
		$('#one').addClass('green-bg').html('<i class="fa fa-check"></i>');

		autoscrol(".segment2");
		 
		var isFirefox = typeof InstallTrigger !== 'undefined';
		 if(isFirefox){
			 $('#datepick').DatePickerSetDate(current_date_mozilla, true);
		 }
		 $('.checkbox-main-grid').html('<img class="loading-img" src="../img/21-0.gif" style="width: 40px;margin-left: 216px;"></img>');
		if (!selecteddate)
		{
			selecteddate = new Date();
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

	function autoscrol(divclass)
	{

		console.log($(divclass).offset().top);

		$("body,html").animate({ scrollTop : $(divclass).offset().top }, 1000);

	}

});