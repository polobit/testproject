function knowlarityEventsFinder(SR_API_KEY){
	console.log("In event source created");
	var notificationURL = "https://konnect.knowlarity.com:8100/update-stream/"+SR_API_KEY+"/konnect";
	knowlaritySource = new EventSource(notificationURL);
	knowlaritySource.onmessage = function (event) {
		var data = JSON.parse(event.data);
		console.log('Received an event .......');
		console.log(data);
	}
}

function knowlarityDailer(responceObject, to, contact){
	var knowlarityNumber = responceObject.knowlarityNumber;
	var agentNumber = responceObject.agentNumber;
	var authCode = responceObject.apiKEY;
	var appCode = responceObject.app_code;
	var channel = responceObject.knowlarity_channel;	

	//console.log("Knowlarity url : "+url);

	var dataObj = {
	  "k_number": knowlarityNumber,
	  "agent_number": agentNumber,
	  "customer_number": to
	};

	var requestURL = "https://kpi.knowlarity.com/"+channel+"/v1/account/call/makecall";
	$.ajax({
		headers : {
				"Accept-Language" : "en_US",			
				"Authorization" : authCode,
				"x-api-key" : appCode
		},
		url : requestURL,
		type : "POST",		
		data : JSON.stringify(dataObj),
		success : function(result) {
			console.log("Knowlarity *** success : "+ JSON.stringify(result));			

			//{{agile_lng_translate 'other' 'cancel'}}
			var btns = [{"id":"", "class":"btn btn-default btn-sm noty_twilio_cancel","title":"Cancel"}];
			showDraggableNoty("Knowlarity", contact, "outgoing", to, btns);
			console.log(to + " : "+ contact);				
		},
		error : function(result) {
			console.log("Knowlarity *** error : "+ JSON.stringify(result));								
		}
	});
}


function startKnowlarityWidget(contact_id){
	KNOWLARITY_PLUGIN_NAME = "Knowlarity";

	KNOWLARITY_UPDATE_LOAD_IMAGE = '<center><img id="knowlarity_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';
	var knowlarity_widget = agile_crm_get_widget(KNOWLARITY_PLUGIN_NAME);
	console.log(knowlarity_widget);
	KNOWLARITY_Plugin_Id = knowlarity_widget.id;	
	Email = agile_crm_get_contact_property('email');

	$('#Knowlarity').html('<div class="wrapper-sm">No Logs</div>');
	
	$(".contact-make-call-div").off("click", ".Knowlarity_call");
	$(".contact-make-call-div").on("click", ".Knowlarity_call", function(e){
		e.preventDefault();
		e.stopPropagation();
		var contactDetailsObj = agile_crm_get_contact();
		var contactPhoneNumber = $(this).closest(".contact-make-call").attr("phone");
		var prefsObject = JSON.parse(knowlarity_widget.prefs);

   		knowlarityDailer(prefsObject, contactPhoneNumber, contactDetailsObj);		
	});
}