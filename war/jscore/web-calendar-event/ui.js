$(function()
{
	// Total available slots on selected date with selecetd slot
	var Available_Slots = null;

	// Select slot duration 60/30/15min
	$(".choose").die().live('click', function(e)
	{
		e.preventDefault();

		Selected_Time = $(this).attr('data');
  
		 if(Selected_Time==15){
			 Selected_Time=30;
		 }
		
		$(".activemin").removeClass("activemin");
		$(this).find('.minutes').addClass("activemin");

		// Make next part enable
		$('.segment2').removeClass('me-disable');
		
		if(selecteddate){
			
		get_slots(selecteddate, Selected_Time);
		}
		
		// Reset all
		//resetAll();
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
	});	
});
