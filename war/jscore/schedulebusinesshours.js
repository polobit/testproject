var businessHoursManager;
$(function()
{
	
$("#btnSerialize").die().live('click', function(e){
	e.preventDefault();
	
	
	if(!$.trim($("#15mins").val())&&!$.trim($("#30mins").val())&&!$.trim($("#60mins").val())){
		$('#meeting_duration_message').fadeIn('slow');
        setTimeout(function() {
     	    $('#meeting_duration_message').fadeOut('slow');
     	}, 2000);
    	return;
	}
	
	if($("#15mins").val().charCodeAt(0)== ' ' && $("#30mins").val().charCodeAt(0)== ' ' && $("#60mins").val().charCodeAt(0)== ' '){
		$('#meeting_duration_message').fadeIn('slow');
        setTimeout(function() {
     	    $('#meeting_duration_message').fadeOut('slow');
     	}, 2000);
    	return;
	}
	
	
	var saveBtn = $(this);
	disable_save_button($(saveBtn));
	
	var json = serializeForm("scheduleform");
	var meeting_durations = formToJSON();
	console.log(meeting_durations);
	
	 var business_hours=JSON.stringify(businessHoursManager.serialize());
		
		json['businesshours_prefs']=business_hours;
		json['meeting_durations']=meeting_durations;
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

/**
 * meeting duration form will be serialized manually becoz to trim spaces
 * @returns  serialized meeting duration form.
 */

function formToJSON() {
    return JSON.stringify({
        "15mins": $('#15mins').val().trim(),
        "30mins": $('#30mins').val().trim(),
        "60mins": $('#60mins').val().trim()
        });
}




