function appDialer(to, contact){
	if(to){
		var requestURL = "core/api/android/call?phone_number="+to;	 
	 	console.log(requestURL);
	 
	 	$.ajax({	 		
	 		url : requestURL,
	 		type : "GET",	 		
	 		success : function(result) {
	 			console.log("AppCalling *** success : "+ JSON.stringify(result));						
	 			//{{agile_lng_translate 'other' 'cancel'}}			
	 			console.log(to + " : "+ contact);				
	 		},
	 		error : function(result) {
	 			console.log("AppCalling *** error : "+ JSON.stringify(result));								
	 		}
	 	});
 	}
}

function startAppCallingWidget(contact_id){
	APPCALLING_PLUGIN_NAME = "AppCalling";

	APPCALLING_UPDATE_LOAD_IMAGE = '<center><img id="appcalling_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var appcalling_widget = agile_crm_get_widget(APPCALLING_PLUGIN_NAME);

	console.log(appcalling_widget);

	APPCALLING_Plugin_Id = appcalling_widget.id;	
	
	$('#AppCalling').html("No Logs");

	$(".contact-make-call-div").off("click", ".AppCalling_call");
 	$(".contact-make-call-div").on("click", ".AppCalling_call", function(e){
 		e.preventDefault();
 		e.stopPropagation();
 		var contactDetailsObj = agile_crm_get_contact();
 		var contactPhoneNumber = $(this).closest(".contact-make-call").attr("phone");		
 	 	appDialer(contactPhoneNumber, contactDetailsObj);	
 	});
}