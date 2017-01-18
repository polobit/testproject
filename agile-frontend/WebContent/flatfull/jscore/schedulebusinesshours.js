var businessHoursManager;



function initializeOnlineCalendarListners(el){
	
	 $("#online-cal-listners").off();
	 $("#online-cal-listners .meetingTimePicker").off("click");
	 $("#online-cal-listners").on("click",".meetingTimePicker", function(e){
	 	e.preventDefault();	 	
	 	$(this).next().removeClass('hide');
	 });


	 $("#online-cal-listners .dropdown-parent").off("click");
	 $("#online-cal-listners").on("mouseleave",".dropdown-parent", function(e){
	 	e.preventDefault();	 	
	 	$('.dropdown-content').addClass('hide');
	 });

	 $("#online-cal-listners .dropdown-content").off("click");
	 $("#online-cal-listners").on("mouseleave",".dropdown-content", function(e){
	 	e.preventDefault();	 	
	 	$(this).addClass('hide');
	 });

	 $("#online-cal-listners .dropdown-content a").off("click");
	 $("#online-cal-listners").on("click",".dropdown-content a", function(e){
	 	e.preventDefault();
	 	var elementValue = $(this).text();
	 	$(this).parent().prev().text(elementValue);
	 	$(this).parent().addClass('hide');
	 });

	 $("#online-cal-listners .input_meeting_time_mins").off("click");
	 $("#online-cal-listners").on("click",".input_meeting_time_mins", function(e){
	 	e.preventDefault();
	 	
	 });

	 $("#online-cal-listners #add-meeting-row").off("click");
	 $("#online-cal-listners").on("click","#add-meeting-row", function(e){
	 	e.preventDefault();
	 	var parent = $('#meeting_durations');	 	
	 	var cloneElement = parent.children().first().clone();
 		cloneElement.removeAttr('id');
 		cloneElement.find('.input_meeting_time_hours').text("00");
 		cloneElement.find('.input_meeting_time_mins').text("00");
 		cloneElement.find('.input_meeting_text').removeAttr('value');
	 	parent.append(cloneElement);
	 });

	 $("#online-cal-listners .remove-meeting-row").off("click");
	 $("#online-cal-listners").on("click",".remove-meeting-row", function(e){
	 	e.preventDefault();	 	
	 	if($('#meeting_durations').children().length > 1){
	 		$(this).closest('.meeting-row').remove();	 	
	 	}else{
	 		$("#cancel_error_message").removeClass('hide').removeClass('text-success').addClass('text-danger').html("{{agile_lng_translate 'calendar' 'keep-one-meeting'}}");					
					setTimeout(function(){
						$("#cancel_error_message").addClass('hide').empty();							
					}, 5000);
	 	}	 
	 });
	 
	 $("#online-cal-listners #btnSerialize").off("click");
	 $("#online-cal-listners").on("click","#btnSerialize", function(e){
			e.preventDefault();

			var saveBtn = $(this);
			disable_save_button($(saveBtn));

			var meetinTypesArray = $('#meeting_durations').children();
			var totalEventsLength = meetinTypesArray.length;
			var meetingTypes = {};

			var hasError = false;
			var errorMessage = "";
			var meetingTimes = [];

			for(var i=0; i < totalEventsLength; i++){
				var meetingHours = $(meetinTypesArray[i]).find('.input_meeting_time_hours').text();
				var meetingMins = $(meetinTypesArray[i]).find('.input_meeting_time_mins').text();
				var meetingText = $(meetinTypesArray[i]).find('.input_meeting_text').val();
				var meetingTime = parseInt(meetingHours * 60);
				meetingTime += parseInt(meetingMins);

				var meetingID;
	
				if(meetingTime && meetingTime > 0 && ((meetingTime % 1) == 0)){
					if(meetingTime <= 1440){
						if($.inArray(meetingTime, meetingTimes) == -1){
							meetingTimes.push(meetingTime);			
							meetingID = meetingTime+"mins";
						}else{
							hasError = true;
							errorMessage = "{{agile_lng_translate 'calendar' 'meeting-duplicate-hours'}}";
						}
					}else{
						hasError = true;
						errorMessage = "{{agile_lng_translate 'calendar' 'meeting-duration-limit'}}";
					}					
				}else{
					hasError = true;
					errorMessage = "{{agile_lng_translate 'calendar' 'meeting-proper-duration'}}";
				}
			
				if(!hasError && (!meetingText || !meetingID)){
					hasError = true;
					errorMessage = "{{agile_lng_translate 'calendar' 'meeting-fields-empty'}}";
				}

				if (hasError){					
					enable_save_button($(saveBtn));
					$(saveBtn).next().removeClass('text-success').addClass('text-danger').html(errorMessage);					
					setTimeout(function(){
						$(saveBtn).next().empty();							
					}, 5000);
					return;
				}

				meetingTypes[meetingID] = meetingText;
			}
			
			var businessHoursArray = businessHoursManager.serialize();
			var hasErrorInBSObject = false;

			$.each(businessHoursArray, function(index, value){				
				var bshrObj = value;
				var isActive = bshrObj["isActive"];
				if(isActive == true){
					var startTime = bshrObj["timeFrom"];
					var endTime = bshrObj["timeTill"];
					var startArray = startTime.split(":");
					var endArray = endTime.split(":");
					var startingHours = startArray[0];
					var startingMins = startArray[1];
					var nightHours = endArray[0];
					var nightmins = endArray[1];
					if(nightHours <= startingHours){
						hasErrorInBSObject = true;
						return false;
					}
				}				
			});

			if(hasErrorInBSObject == true){
				enable_save_button($(saveBtn));
				$(saveBtn).next().removeClass('text-success').addClass('text-danger').html("{{agile_lng_translate 'calendar' 'proper-bussiness-hours'}}");					
				setTimeout(function(){
					$(saveBtn).next().empty();							
				}, 5000);
				return;
			}

			
			var data = $('#scheduleurl').text();
			var scheduling_id = data.substr(data.lastIndexOf("/") + 1);
			var url = data.substr(0, data.lastIndexOf("/") + 1);
			var json = serializeForm("scheduleform");
			var meeting_durations = JSON.stringify(meetingTypes);
			console.log(meeting_durations);

			var business_hours = JSON.stringify(businessHoursManager.serialize());

				json['business_hours'] = business_hours;
				json['meeting_durations'] = meeting_durations;
				json['schedule_id'] = scheduling_id;
				json['bufferTime'] = $("#bufferTime").val();
				json['bufferTimeUnit'] = $("#bufferTimeUnit").val();

               var calendarNotes = $(".online_summer_note").code();
               var textWithStyle = $('<span />').html(calendarNotes);
                   textWithStyle = $(textWithStyle).text();

				if(textWithStyle && textWithStyle.indexOf('"') >= 0){
					$(saveBtn).next().html("{{agile_lng_translate 'calendar' 'double-quotes-not-allowed'}}");
					$(saveBtn).next().removeClass("text-success")
				    $(saveBtn).next().addClass("text-danger");
					enable_save_button($(saveBtn));
					setTimeout(function(){
					  $(saveBtn).next().empty();							
				    }, 5000);
					return;
				}else{
					json['user_calendar_title'] = calendarNotes;
				}
				console.log(business_hours);

			// $("#schedule-preferences").html(getRandomLoadingImg());
				$.ajax({ url : '/core/api/scheduleprefs', type : 'PUT', contentType : 'application/json', data : JSON.stringify(json),
					success : function()
					{
						setTimeout(function()
						{
							enable_save_button($(saveBtn));
						}, 2000);
						$('#error_message').empty();
					}, error : function(error)
					{
						$('#error_message').html("{{agile_lng_translate 'calendar' 'saving-prefs-error'}}");
						enable_save_button($(saveBtn));
						
					} });
		});

$("#online-cal-listners #edit-schedule-id").off("click");
$("#online-cal-listners").on("click","#edit-schedule-id", function(e){
					e.preventDefault();
					var data = $('#scheduleurl').text();
					var scheduling_id = data.substr(data.lastIndexOf("/") + 1);
					var url = data.substr(0, data.lastIndexOf("/") + 1);
					console.log(url + "   " + scheduling_id);
					$("#edit").hide();
					$("#scheduleurl").removeAttr("href");
					$('#scheduleurl')
							.html(
									url + "<input class='input-sm inline-block form-control url-textbox w-140' type='text'  name='url' id='url' value='" + scheduling_id + "'/><buttion class='btn btn-primary btn-sm inline-block m-l-sm' id='save-scheduleurl'>{{agile_lng_translate 'modals' 'save'}}</button>");

					$("#scheduleurl").addClass("nounderline");
					$('#scheduleModal').data('modal', null);

				});

$("#online-cal-listners #save-scheduleurl").off("click");
$("#online-cal-listners").on("click","#save-scheduleurl", function(e){
			e.preventDefault();
			var data = $("#url").val();
			if (data.length < 4)
			{
				$('#charlength').fadeIn('slow');
				setTimeout(function()
				{
					$('#charlength').fadeOut('slow');
				}, 2000);
				return;
			}

			var regex = /^[0-9a-zA-Z\_]+$/
			if (!(regex.test(data)))
			{
				$('#specialchar').fadeIn('slow');
				setTimeout(function()
				{
					$('#specialchar').fadeOut('slow');
				}, 2000);
				return;
			}

			var saveBtn = $(this);
			disable_save_button($(saveBtn));
			$.ajax({
				url : '/core/api/scheduleprefs/updateId?scheduleid=' + data + '&domainId=' + CURRENT_DOMAIN_USER.id,
				type : 'GET',
				datatype : "json",
				success : function(user)
				{
					var onlineschedulingURL = "https://" + CURRENT_DOMAIN_USER.domain + ".agilecrm.com/calendar/" + user.schedule_id;
					$("#scheduleurl").attr("href", onlineschedulingURL);
					$("#scheduleurl").text(onlineschedulingURL);

					$("#scheduleurl").removeClass("nounderline");
					enable_save_button($(saveBtn));
					$("#edit").show();
					$("#specialchar").hide();
					$("#charlength").hide();
					$("#scheduleurl").removeClass("nounderline");

				},
				error : function(error)
				{

					console.log(error);
					$('#schedule_error_message').html(
							'{{agile_lng_translate "calendar" "saving-url-error"}}' + error.statusText);
					$('#schedule_error_message').fadeIn('slow');
					setTimeout(function()
					{
						$('#schedule_error_message').fadeOut('slow');
					}, 2000);
					enable_save_button($(saveBtn));
					return;
				} });

		});
	
	$("#online-cal-listners #calendar_advanced").off("click");
	$("#online-cal-listners").on("click","#calendar_advanced", function(e)
	{
		e.preventDefault();
		$("#calendar_advanced span i").toggleClass("fa-minus");
		$("#calendar_advanced span i").toggleClass("fa-plus");

	});

	$("#online-cal-listners #calendar_advanced_block").off("shown");
	$("#online-cal-listners").on("shown","#calendar_advanced_block", function(e)
	{
		$('#calendar_advanced').html('<span><i class="icon-minus"></i></span> {{agile_lng_translate "report-add" "advanced"}}');

	});

	$("#online-cal-listners #calendar_advanced_block").off("hidden");
	$("#online-cal-listners").on("hidden","#calendar_advanced_block", function(e)
	{
		$('#calendar_advanced').html('<span><i class="icon-plus"></i></span> {{agile_lng_translate "report-add" "advanced"}}');
	});

	$("#online-cal-listners #bufferTime").off("keypress");
	$("#online-cal-listners").on("keypress","#bufferTime", function(e){
		// if the letter is not digit then display error and don't type anything
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57))
		{
			// display error message
			$("#errmsg").html("Digits Only").show().fadeOut(3000);
			return false;
		}
	});

	$("#online-cal-listners .onlineCalendarAddToSite").off("click");
	$("#online-cal-listners").on("click",".onlineCalendarAddToSite", function(e)
	{
		e.preventDefault();

        console.log("asadfas");

        $("body #onlineCalendarAddToSite").remove();

		getTemplate('online-calendar-addtosite', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			onlineCalendarModel = $(template_ui);
			onlineCalendarModel.modal('show');	
		}, null);	

	});
/*
     $("#online-cal-listners a[href='#calendar-tab']").unbind("click");
	 $('#online-cal-listners a[href="#calendar-tab"]').on('click', function(e) {
			e.preventDefault();
			$(el).find('#calendar-tab').html(LOADING_ON_CURSOR);
			online_calendar_tabs.loadScheduleUrlTab(el);
	  });
	 $("#online-cal-listners a[href='#businesshours-tab']").unbind("click");
	$('#online-cal-listners a[href="#businesshours-tab"]').on('click', function(e) {
		e.preventDefault();
		$(el).find('#businesshours-tab').html(LOADING_ON_CURSOR);
		online_calendar_tabs.loadBusinessHoursTab(el);
	  });
	 $("#online-cal-listners a[href='#meeting-types-tab']").unbind("click");
	$('#online-cal-listners a[href="#meeting-types-tab"]').on('click', function(e) {
		e.preventDefault();
		$(el).find('#meeting-types-tab').html(LOADING_ON_CURSOR);
		online_calendar_tabs.loadMeetingtypesTab(el);
	  });
	$("#online-cal-listners a[href='#advanced-tab']").unbind("click");
	$('#online-cal-listners a[href="#advanced-tab"]').on('click', function(e) {
		e.preventDefault();
		$(el).find('#advanced-tab').html(LOADING_ON_CURSOR);
		online_calendar_tabs.loadAdvancedTab(el);
	  });*/


	// $("#onlineCalendarAddToSite .getStartedToAddToSite").off("click");	
}

$("body").on("click",".getStartedToAddToSite", function(e)
		{

			e.preventDefault();
			Backbone.history.navigate("webrules-add", { trigger : true });
			if (onlineCalendarModel)
				onlineCalendarModel.modal('hide');
			onlineCalendarModel = null;

			getHtmlContent(function(html_content)
			{
				setTimeout(function()
				{
					tinyMCECallBack("tinyMCEhtml_email", html_content);
				}, 1000);
			});

		});


function getHtmlContent(callback)
{
	$.get("/misc/modal-templates/schedule/popout/pop-out.html", function(data)
	{
		return callback(data);
	});
}

/**
 * meeting duration form will be serialized manually becoz to trim spaces
 * 
 * @returns serialized meeting duration form.
 */

function formToJSON()
{
	return JSON.stringify({ "15mins" : $('#15mins').val().trim(), "45mins" : $('#45mins').val().trim(), "60mins" : $('#60mins').val().trim() });
}
