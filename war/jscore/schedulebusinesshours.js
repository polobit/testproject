var businessHoursManager;
$(function()
{

$("#btnSerialize").die().live('click', function(e){
	e.preventDefault();
	
	var saveBtn = $(this);
	disable_save_button($(saveBtn));
	
	var json = serializeForm("scheduleform");
	var meeting_durations = serializeForm("meeting_durations");
	console.log(json);
	
	 var business_hours=JSON.stringify(businessHoursManager.serialize());
		
		json['businesshours_prefs']=business_hours;
		json['meeting_durations']=JSON.stringify(meeting_durations);
		json['timezone']=$("#timezone").val();
		console.log(business_hours);
		
	//	$("#schedule-preferences").html(getRandomLoadingImg());
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
			error : function(error)
			{
				$('#error_message').html("Due to "+error.statusText+" scheduling preferences not updated. Please try again in few hours");
				enable_save_button($(saveBtn));
			} });
	
});

});




