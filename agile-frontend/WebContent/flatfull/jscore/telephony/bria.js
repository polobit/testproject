/**
 * 
 */
 var Bria_Call_Noty;
 var default_call_type;
 var callFromBria = false;
 var Bria={};
 var NamedPipe="";
 var displayName="";
 
$(function()
{
	globalBriaSetup();
	
	$('body').on('click', '.contact-make-bria-call', function(e)
	{
	  	e.preventDefault();
		var command = "Start-Call";
		var number =  $(this).attr("phone");
		var callId = "";
		
		sendMessageToBriaClient(command,number,callId);

	});
	
// }


//answer the call
	$('body').on('click', '.noty_bria_answer', function(e)
		{
			e.preventDefault();
			var command = "Answer-Call";
			var number =  "";
			var callId = $("#callId").attr("value");
			
			sendMessageToBriaClient(command,number,callId);
	  });
	  
//ignore the incoming call
	$('body').on('click', '.noty_bria_ignore', function(e)
		{
			e.preventDefault();
			var command = "Ignore-Call";
			var number =  "";
			var callId =  $("#callId").attr("value");
			
			sendMessageToBriaClient(command,number,callId);

	});


//hang up the call	
	$('body').on('click', '.noty_bria_hangup', function(e)
		{
		
		e.preventDefault();
		var command = "End-Call";
		var number =  "";
		var callId =  $("#callId").attr("value");
		
		sendMessageToBriaClient(command,number,callId);

	});


//cancel the outgoing call	
	$('body').on('click', '.noty_bria_cancel', function(e)
	{
		
		e.preventDefault();
		var command = "Cancel-Call";
		var number =  "";
		var callId =  $("#callId").attr("value");
		
		sendMessageToBriaClient(command,number,callId);
	});

	
//mute the current call	
	$('body').on('click', '.noty_bria_mute', function(e)
	{
		
		e.preventDefault();
		var command = "mute";
		var number =  "";
		var callId =  $("#callId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		
		sendMessageToBriaClient(command,number,callId);
	});

//unmute the call	
	$('body').on('click', '.noty_bria_unmute', function(e)
	{
		
		e.preventDefault();
		var command = "unMute";
		var number =  "";
		var callId =  $("#callId").attr("value");
		
		$('.noty_buttons').find('.noty_bria_unmute').toggle();
		$('.noty_buttons').find('.noty_bria_mute').toggle();
		sendMessageToBriaClient(command,number,callId);
	});


	
//show dialpad	 ---note implemented
	$('body').on('click', '.noty_bria_dialpad', function(e)
	{
	e.preventDefault();
	e.stopPropagation();
	$('#briaDialpad_btns').toggle();
	});


//this is to close the dialpad when clicked anywhere in screen
	$(document).on('click', function(e){
		if($('#briaDialpad_btns').length !=0){
			$('#briaDialpad_btns').hide();
		}
		
		
	});	
	
// this is used to prevent dialpad from closing 	
	$('body').on('click', '#briaDialpad_btns', function(e)	{
		e.stopPropagation();
	});
	

//	This function is to hide the information shown to the client when the user is not running bria client
	$('body').on('click', '#bria_info_ok', function(e)	{
		e.preventDefault();
		$('#briaInfoModal').modal('hide');
	});
	
	
});

//function for sending DTMF
function briaSendDTMF(digit)
{
	if(digit){
			play_sound("dtmf");
			var command = "sendDTMF";
			var number =  digit;
			var callId =  "";
			sendMessageToBriaClient(command,number,callId);
			return;
	}
}


function sendMessageToBriaClient(command, number, callid){
	var domain = CURRENT_DOMAIN_USER['domain'];
	var id = CURRENT_DOMAIN_USER['id'];
	var image = new Image();
	image.onload = function(png) {
		console.log("bria sucess");
		window.focus();

	};
	image.onerror= function(png) {
		console.log("bria failure");
		if (Bria_Call_Noty != undefined)
			Bria_Call_Noty.close();
		window.focus();
		$('#briaInfoModal').modal('show');
	};
	
	image.src = "http://localhost:33333/"+ new Date().getTime() +"?command="+command+";number="+number+";callid="+callid+";domain="+domain+";userid="+id+";namedpipe="+NamedPipe+"?";
}





function globalBriaSetup()
{
	console.log('Fetching Bria initial status');
	
	$.getJSON("/core/api/widgets/Bria", function(bria_widget)
	{
		if (bria_widget == null)
			return;

		if (bria_widget.prefs != undefined)
		{
			
				bria_widget.prefs = eval("(" + bria_widget.prefs + ")");
				
				var type = bria_widget.prefs.bria_type;
				if(type == "X-Lite"){
					NamedPipe = "apixlite";
				}else if(type == "Bria4"){
					NamedPipe = "apipipe";
				}else if(type == "Bria3"){
					NamedPipe = "apipipe";
				}
				
			if (bria_widget.prefs.make_bria_default_call){
				default_call_type = "Bria";
				callFromBria = true;
				initToPubNub();
				console.log("Bria is set properly");
				showBriaCallOption();
			}else{
				if(default_call_type == "Bria"){
					default_call_type = null;
					callFromBria = false;
				}
				
			}
		}else{
			console.log("No preferences found for bria setting");
		}

		
	}).error(function(data)
			{
				console.log("Bria error");
				console.log(data);
			});
}

function showBriaCallOption(){
	
	$(".contact-call-button").removeAttr('disabled');
	$(".contact-make-call").removeAttr("href");
	$(".contact-call-button").addClass("contact-make-bria-call");
	
}


function changeTooltipTo(selector, text){
	$(selector).tooltip('hide')
	  .attr('data-original-title', text)
    .tooltip('fixTitle');

}

function _getMessage(message, callback){
	var state = message.state;
	var number = message.number;
	var callId = message.callId;
	var displayName = message.displayName;
	var message="";
	console.log("state--" + state + " number --" + number + "   callId" + callId + "  displayName" + displayName);
	
	if (state == "incoming"){
		To_Number = number;
		/*		searchForContact(To_Number, function(name){
			displayName = name;
		});*/
		
		getContactImage(number,"Incoming",function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Incoming Call &nbsp;&nbsp;&nbsp;  </b>'+'<span id="callId" class="text-xs" value ='+callId+ '>' + number +'</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
		});
				
	}else if(state == "connected"){
		getContactImage(number,"Outgoing",function(contact_Image){
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>On Call &nbsp;&nbsp;&nbsp; </b>'+'<span id="callId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
			if(callback)
				callback(message);
		});
		
	
	}else if(state == "missed-call"){
		To_Number = number;
		getContactImage(number,"Incoming",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Missed Call &nbsp;&nbsp;&nbsp;  </b>'+ '<span id="callId" class="text-xs" value ='+callId+ '>' + number + '</span>' +'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
	}else if(state == "connecting"){
		//var contactDetailsObj = agile_crm_get_contact();
		//displayName = getContactName(contactDetailsObj);
		
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Calling... &nbsp;&nbsp;&nbsp; </b>'+'<span id="callId" class="text-xs" value ='+callId+ '>' + number + '</span>' +'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
		
		
	}else if(state == "failed"){
		getContactImage(number,"Outgoing",function(contact_Image){		
			message =contact_Image+'<span class="noty_contact_details m-l-sm inline pos-rlt" style="top: 10px;"><i class="icon icon-phone m-r-xs pos-rlt m-t-xxs"></i><b>Call Failed &nbsp;&nbsp;&nbsp; </b>'+'<span id="callId" class="text-xs" value ='+callId+ '>' + number + '</span>'+'<br><br></span><div class="clearfix"></div>';
		if(callback)
			callback(message);
		});
		
	
	}else if(state == "ended"){
		callback("");
	}

}

function getContactImage(number, type, callback){
	if(type){
		if(type == "Outgoing"){
			var currentContact = agile_crm_get_contact();
			getTemplate('contact-image', currentContact, undefined, function(image){
		 		if(!image)
		    		callback("");
		 			callback(image);
			});
			
		}else{
			
			searchForContactImg(number,function(currentContact){
				getTemplate('contact-image', currentContact, undefined, function(image){
			 		if(!image)
			    		callback("");
			 			callback(image);
				});
			});
			
		}
	}
	
}


