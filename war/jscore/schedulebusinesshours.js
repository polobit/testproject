var businessHoursManager;
$(function()
{

$("#btnSerialize").die().live('click', function(e){
	e.preventDefault();
	
	var meeting_types=$('#meeting_types').val();
	
	
	 var regex = /^[a-zA-Z0-9, ]*$/
		    if(!(regex.test(meeting_types)))
		    	{
		    	 $('#meeting_type_error').fadeIn('slow');
               setTimeout(function() {
            	    $('#meeting_type_error').fadeOut('slow');
            	}, 2000);
		    	return;
		    	}
	
	var json = serializeForm("scheduleform");
	var meeting_durations = serializeForm("meeting_durations");
	console.log(json);
	$("#schedule-preferences").html(getRandomLoadingImg());
	
	 var business_hours=JSON.stringify(businessHoursManager.serialize());
		
		json['businesshours_prefs']=business_hours;
		json['meeting_durations']=JSON.stringify(meeting_durations);
		json['timezone']=$("#timezone").val();
		console.log(business_hours);

		
		$.ajax({
			url : '/core/api/scheduleprefs',
			type : 'PUT',
			contentType:'application/json',
			async:false,
			data : JSON.stringify(json),
			success : function()
			{
			window.location.reload(true);
			},
			error : function(response)
			{
				alert("error");
				
			} });
	
});

});




