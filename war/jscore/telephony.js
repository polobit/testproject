var SIP_STACK;
var SIP_REGISTER_SESSION;
var SIP_START = false;
var SIP_WIDGET_OBJECT;
var SIP_SESSION_CALL;
var Config_Call;
var READY_STATE_TIMER;
var CALL;
var USER_NAME;
var USER_IMG;
var USER_NUMBER;
var Notifi_Call;


window.addEventListener("offline", function(e) 
		{ console.log("offline");
		  sipUnRegister();
		}, false);

window.addEventListener("online", function(e) 
		{ console.log("online");
		  sipStart();
		}, false);

$(function()
  {			
	console.log("In telephony.js");
	
	// Register SIP
	sipStart();	

$(".dialpad").die().live("click", function(e)
  {
     e.preventDefault();    	
     console.log("In dialpad");
     
     console.log($('.noty_message').find('.dialpad_btns').html());
     
     // If noty do not have dialpad then add
     if($('.noty_message').find('.dialpad_btns').html() == null)
       {
    	 var dialpad = $(getTemplate("dialpad"),{});    
         $(".noty_message").append(dialpad);	 
       }
     else
       {
    	 // If noty has dialpad then remove
         $("#dialpad_btns").remove(); 
       }      
  });    	
	
  $(".make-call").die().live("click", function(e)
    {
	           e.preventDefault();    	
		   	   console.log("In make-call");		    			      
		   	   
		   	   // SIP
		       /*if(makeCall('sip:+18004321000@proxy.ideasip.com'))
		       { 
		    	 USER_NAME = "Agile";
		    	 USER_NUMBER = "sip:+18004321000@proxy.ideasip.com";*/
		   	   
		   	if(makeCall('sip:farah@sip2sip.info'))
		       { 
		    	 USER_NAME = "farah";
		    	 USER_NUMBER = "sip:farah@sip2sip.info";
		    	   
			     // Display
		    	 showCallNotyPopup("outgoing","confirm", '<i class="icon icon-phone"></i><b>Calling :</b><br> '+USER_NAME+"  "+USER_NUMBER+"<br>",false);
		    	 
		    	 //findContact(); //for testing	
		       }       
   });  
  
  $(".contact-make-call").die().live("click", function(e)
     {
    	e.preventDefault();    	
    	console.log("In contact-make-call");
    	var name = $(this).attr('fname')+" "+$(this).attr('lname');
    	var image = $(this).attr('image');
    	var phone = $(this).attr('phone');
    	
    	console.log(phone);
    	if(phone == "" || phone == null)
        {
    	  alert(name +"'s contact number not added."); 
    	  return;
    	}  	
    	    	 
    	// SIP
		if(makeCall(phone))
		  {
			USER_NAME = name;
	    	USER_NUMBER = phone;
	    	USER_IMG = image;
			
		  	// Display
        	 showCallNotyPopup("outgoing","confirm", '<i class="icon icon-phone"></i><b>Calling : </b><br>'+USER_NAME+"   "+USER_NUMBER+"<br>",false);        	 
          }		
     });    
        
    $(".hangup").die().live("click", function(e)
     {
    	e.preventDefault();    	
    	console.log("In hangup");
         
    	// Display    	    	
    	showCallNotyPopup("hangup","information", "<b>Call ended with : </b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>",false);

    	// SIP
    	hangupCall();
     });    

    $('.ignore').die().live("click", function(e)
      {
    	console.log("In ignore.");    	
    	 
    	// Display
    	showCallNotyPopup("ignored","error", "<b>Ignored call : </b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>", 5000);
    	
    	// SIP
    	SIP_SESSION_CALL.reject(Config_Call);
    	
    	if (Notifi_Call) {
    		Notifi_Call.cancel();
    		Notifi_Call = null;
        }
      });
    
    $('.answer').die().live("click", function(e)
     {
    	console.log("In answer");    	
    	
    	// SIP
    	SIP_SESSION_CALL.accept(Config_Call);  
     });
        
  });


	

function sipStart()
{
	console.log("In sipStart.");
	console.log(SIP_START);
	console.log(SIP_STACK);
	console.log(SIP_REGISTER_SESSION);
	
	READY_STATE_TIMER = setTimeout(function () 
			{
              if (document.readyState === "complete") 
                 {
                    clearInterval(READY_STATE_TIMER);                   
                	
                	if(SIP_START == false)
                	{
                		// Get Sip widget
                		 $.getJSON("/core/api/widgets/Sip",function (sip_widget)
                				    {	 
                			          console.log("In sipStart getting sip widget.");	
                			          console.log(sip_widget);	
                			         
                			          if(sip_widget == null)
                			        	  return;
                			          
                			          SIP_WIDGET_OBJECT = sip_widget;
                			          
                			          if(sip_widget.prefs != undefined )
                			        	 {			
                			        	   head.js(LIB_PATH + 'lib/telephony/SIPml-api.js', function()
                			        		 {
                			        		   console.log("Sip call from sipStart for widget.");
                			        		   
                			        		   // initialize SIPML5
                			                   SIPml.init(sipRegister);
                			        		 });					        	   		            
                			        	 }		          
                				    }).error(function (data)
                				    {
                				    	console.log("In sip error");
                				    	console.log(data);
                				    });
                	}
                 }
            },10000); // 10 sec
}


/* SIP event listeners */
//Callback function for SIP Stack or Events Listener for sip stack
function sipStackEventsListener(e /*SIPml.Stack.Event*/) 
{
	console.log("In sipStack event Listner.");
	console.log(e.type);
	console.log(e.description);
	
	tsk_utils_log_info('==agile stack event = ' + e.type);
	
    switch (e.type) {
        case 'started':
            {        
        	   console.log("In sipStack event Listner. started "+e.type);
               sipLogin();        	
               break;
            }
        case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
            {
          	    SIP_START = false;
                SIP_STACK = null;
                SIP_REGISTER_SESSION = null;
                SIP_SESSION_CALL = null;
                USER_NAME = null;
                USER_NUMBER = null;
                USER_IMG = null;

                stopRingbackTone();
                stopRingTone();
                
                console.log("In sipStack event Listner. stopping "+e.type);
                
               showCallNotyPopup("disconnected",'error', "SIP: There was an error registering your account to SIP. Please modify and try again.",false);
                break;
            }
        case 'i_new_call':
            {
        	   console.log("In sipStack event Listner. i_new_call "+e.type);
        	   newCall(e);        	 
           	   break;
            }  
        case 'starting':{console.log("In sipStack event Listner. starting "+e.type);break;}
        case 'm_permission_requested':{console.log("In sipStack event Listner. m_permission_requested "+e.type);break;}
        case 'm_permission_accepted':{console.log("In sipStack event Listner. m_permission_accepted "+e.type);break;}
        case 'm_permission_refused': 
            {
        	  console.log("In sipStack event Listner. m_permission_refused "+e.type);
        	  
        	  stopRingbackTone();
        	  stopRingTone();
        	  
        	  showCallNotyPopup("mediaDeny",'warning', "Media stream permission denied.",false);  
        	  
        	  // SIP
          	  hangupCall(); 
        	  break;
        	}
        default: {alert("In sipStack event Listner. "+e.type); break;}
    }
};

// Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
function sipSessionEventsListener(e /* SIPml.Session.Event */) 
{	
	console.log("In sip Session event Listner.");
	console.log(e.type);
	console.log(e.description);
	
	tsk_utils_log_info('==agile session event = ' + e.type);
	
    switch (e.type) {
        case 'connecting': 
        	   {
        	     console.log("In sip Session event Listner. connecting "+e.type);	
            	 break;
        	   }           
        case 'sent_request':
               {
   	             console.log("In sip Session event Listner. sent_request "+e.type);	
       	         break;
   	           }
        case 'connected':
            {        	
        	 if (e.session == SIP_REGISTER_SESSION) 
        	   {
        		 console.log("SIP server Connected.");
        		 message = "You can make and receive calls with SIP.";
            	               
        		 // Play sound on register.
        		 startRingTone();
        		 var runTimer = setTimeout(function () 
        					{       		              
        		              clearInterval(runTimer);
        		              stopRingTone();
        					},2000); // 2 sec 
        		 
            	 showCallNotyPopup("register",'information', "SIP: You are now registered to make and receive calls successfully.",false);
            	 $(".contact-make-call").show();
           	     $(".make-call").show();
           	     
           	     // enable notifications if not already done
                 if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
                     window.webkitNotifications.requestPermission();
                 }
               }
             else if (e.session == SIP_SESSION_CALL) 
               {
            	 // Call received.
            	 console.log("call Connected.");
                 console.log("In sip Session event Listner. "+ e.description );                 
                 
                 stopRingbackTone();
                 stopRingTone();
                 
                 showCallNotyPopup("connected","success", "<b>On call : </b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>",false);
                 
                 if (Notifi_Call) {
             		Notifi_Call.cancel();
             		Notifi_Call = null;
                 }
               }
              break;
            } // 'connecting' | 'connected'
        case 'terminating': case 'terminated':
            {        	  
                if (e.session == SIP_REGISTER_SESSION) 
                {
                	// Session terminated.   
                	SIP_START = false;
                    SIP_SESSION_CALL = null;
                    SIP_REGISTER_SESSION = null;
                    USER_NAME = null;
                    USER_NUMBER = null;
                    USER_IMG = null;

                    console.log("In sip Session event Listner. "+ e.description );
                
                    showCallNotyPopup("disconnected",'error', "Disconnected with SIP because "+e.description, 5000);
                }
                else if (e.session == SIP_SESSION_CALL) 
                {
                	console.log("call terminated.");
                	console.log("In sip Session event Listner. "+ e.description );
                	
                	stopRingbackTone();
                	stopRingTone();               	              		
                	
                	if(e.description == "Request Cancelled")
                 	   showCallNotyPopup("missedCall","error", "<b>Missed call : </b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>",false);
                	else if(e.description == "PSTN calls are forbidden")
                  	   showCallNotyPopup("forbidden","error", "PSTN calls are forbidden",false);
                	else if(e.description == "Not acceptable here")
                   	   showCallNotyPopup("noresponce","error", "Not acceptable here",false); 
                	else if(e.description == "Media stream permission denied")
                       showCallNotyPopup("permissiondenied","error", "Media stream permission denied");                 	
                	else if (e.description == "Call terminated")
                	   showCallNotyPopup("hangup","information", "<b>Call ended with : <b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>",false);
                	else if (e.description == "Decline")
                 	   showCallNotyPopup("decline","error", "Decline",false);
                	else if (e.description == "Request Timeout")
                  	   showCallNotyPopup("requestTimeout","error", "Request Timeout",false);
                	else if (e.description == "Hackers Forbidden")
                   	   showCallNotyPopup("requestTimeout","error", "Hackers Forbidden",false);
                	                	                	
                	// Call terminated.
                	SIP_SESSION_CALL = null;
                	USER_NAME = null;
                	USER_NUMBER = null;
                	USER_IMG = null;
                	
                	if (Notifi_Call) {
                		Notifi_Call.cancel();
                		Notifi_Call = null;
                    }
                }
                break;
            } // 'terminating' | 'terminated'
        case 'i_ao_request':
              {
        	   console.log("In sip Session event Listner. i_ao_request "+e.type);
        	   
        	   if(e.session == SIP_SESSION_CALL){
                   var iSipResponseCode = e.getSipResponseCode();
                   if (iSipResponseCode == 180 || iSipResponseCode == 183) {
                       startRingbackTone();
                       console.log("Remote ringing....");
                   }
               }
        	   
        	   break;
        	  }
        case 'media_added': { console.log("In sip Session event Listner. media_added "+e.type); break;}
        case 'media_removed':{ console.log("In sip Session event Listner. media_removed "+e.type); break;}
        case 'i_request':{ console.log("In sip Session event Listner. i_request "+e.type); break;}
        case 'o_request':{ console.log("In sip Session event Listner. o_request "+e.type); break;}
        case 'cancelled_request':{ console.log("In sip Session event Listner. cancelled_request "+e.type); break;}
        case 'sent_request':{ console.log("In sip Session event Listner. sent_request "+e.type); break;}
        case 'transport_error':{ console.log("In sip Session event Listner. transport_error "+e.type); break;}
        case 'global_error':{ console.log("In sip Session event Listner. global_error "+e.type); break;}
        case 'message_error':{ console.log("In sip Session event Listner. message_error "+e.type); break;}
        case 'webrtc_error': { console.log("In sip Session event Listner. webrtc_error "+e.type); break;}
        
        case 'm_early_media': 
             { 
        	   console.log("In sip Session event Listner. m_early_media "+e.type); 
        	   stopRingbackTone();
        	   stopRingTone(); 
        	   break;
        	 }
        case 'm_stream_audio_local_added': { console.log("In sip Session event Listner. m_stream_audio_local_added "+e.type); break;}
        case 'm_stream_audio_local_removed': { console.log("In sip Session event Listner. m_stream_audio_local_removed "+e.type); break;}
        case 'm_stream_audio_remote_added': { console.log("In sip Session event Listner. m_stream_audio_remote_added "+e.type); break;}
        case 'm_stream_audio_remote_removed': { console.log("In sip Session event Listner. m_stream_audio_remote_removed "+e.type); break;} 
        case 'i_info': { console.log("In sip Session event Listner. i_info "+e.type); break;}
        default: {alert("In sip Session event Listner. "+e.type); break;}
    }
}

		 
/* SIP related functions */
/**
 * Create stack, to register a sip.
 */
function sipRegister()
{
 console.log("In sipRegister.");
 console.log(SIP_START);
 
 Config_Call =  { 			            
         audio_remote: document.getElementById('audio_remote'),		                
         events_listener: { events: '*', listener: sipSessionEventsListener }
       };
 
 if(SIP_START == false)	
  {	
	SIP_START = true;
	console.log(SIP_STACK);
	console.log(SIP_REGISTER_SESSION);
	
    var url = null;
	var credentials = eval('(' + SIP_WIDGET_OBJECT.prefs + ')');
	console.log(credentials);
	console.log(credentials.sip_publicid);
	
	var message = null;

	try
	{
	  	// Check Sip Public Identity is valid.
		var o_impu = tsip_uri.prototype.Parse(credentials.sip_publicid);
		console.log("o_impu");
		console.log(o_impu);
		
		if (!o_impu || !o_impu.s_user_name || !o_impu.s_host)		
			{
			  SIP_START = false;
		      message = credentials.sip_publicid +  " is not a valid Public identity. Please provide valid credentials.";
			}
		else
		  {				
			// Check websocket_proxy_url
			if(credentials.sip_wsenable == "true")
			   url = "ws://54.83.12.176:10060";
								
			// Define sip stack
			SIP_STACK =  new SIPml.Stack({
				                             realm: credentials.sip_realm, 
				                             impi: credentials.sip_privateid, 
				                             impu: credentials.sip_publicid, 
				                             password: credentials.sip_password, 
				                             display_name: credentials.sip_username,
				                             websocket_proxy_url: url,
				                             enable_rtcweb_breaker: true,
				                             events_listener: { events: '*', listener: sipStackEventsListener }
				                          });
			
			
			  /* SIP_STACK = new SIPml.Stack({realm: "sip2sip.info", 
				                            impi: "farah", 
				                            impu: "sip:farah@sip2sip.info", 
				                            password: "onelove786", 
				                            display_name: "farah",
				                            events_listener: { events: '*', listener: sipStackEventsListener }, // optional: '*' means all events
				                           });*/

	  		   console.log("stack");
			   console.log(SIP_STACK);

	 		   // sip stack start
			   if (SIP_STACK.start() != 0)			   
				  {
	 			    SIP_START = false;
					message = 'Failed to start the SIP stack. Please provide valid credentials.';
				  }					
		  } // else end		
	}
	catch(e)
	{
		SIP_START = false;
		message = e + " Please provide valid credentials.";
		returnResult();		
	}	
  }
}

//sends SIP REGISTER (expires=0) to logout
function sipUnRegister() 
{
	console.log("In sipUnRegister.");
    if (SIP_STACK) 
    {    	
    	SIP_STACK.stop(); // shutdown all sessions
    	SIP_START = false;
        SIP_STACK = undefined;
        SIP_REGISTER_SESSION = undefined;
        SIP_SESSION_CALL = undefined;
        USER_NAME = null;
        USER_NUMBER = null;
        USER_IMG = null;
    }
}

// Register or login on sip server for session.
function sipLogin()
{
  console.log("In sipLogin.");
	 try 
     {                	
         // LogIn (REGISTER) as soon as the stack finish starting
     	SIP_REGISTER_SESSION = SIP_STACK.newSession('register', {                        
             events_listener: { events: '*', listener: sipSessionEventsListener }
         });
     	SIP_REGISTER_SESSION.register();
     }
     catch (e) 
     {
     	SIP_START = false;
     }	
}
// New session call for incoming call.
function newCall(e)
{
  console.log("In newCall."); 
  console.log(SIP_SESSION_CALL); 
	
  if (SIP_SESSION_CALL != null) 
    {
	  console.log("already in call.");	
		
	  showNotyPopUp('information', "You are already in call.", "top", 5000);
	  
      // do not accept the incoming call if we're already 'in call'
      e.newSession.hangup(); // comment this line for multi-line support     
    }
  else 
    {	  
	  SIP_SESSION_CALL = e.newSession;
       
	  // start listening for events
	  SIP_SESSION_CALL.setConfiguration(Config_Call);
	      
      var sRemoteName = (SIP_SESSION_CALL.getRemoteFriendlyName() || 'unknown');
      console.log( "Incoming call from "+ sRemoteName );
      
      USER_NAME = sRemoteName;	  
	  USER_NUMBER = SIP_SESSION_CALL.getRemoteUri();
	 	  
	  // Show noty
      showIncomingCall();
    } 
}

//terminates the call (SIP BYE or CANCEL)
function hangupCall()
{
	if (SIP_SESSION_CALL != null) 
	 {
	   	stopRingTone();
	    console.log("Terminating the call...");
	    SIP_SESSION_CALL.hangup({events_listener: { events: '*', listener: sipSessionEventsListener }});
	 }  
	
	if (Notifi_Call) {
		Notifi_Call.cancel();
		Notifi_Call = null;
    }
}


// show details in noty popup for incoming call.
function showIncomingCall()
{
	console.log("In showIncomingCall.");	
	
	showCallNotyPopup("incoming","confirm", '<i class="icon icon-phone"></i><b>Incoming call :</b><br> '+USER_NAME+"   "+USER_NUMBER+"<br>",false);
	
	startRingTone();
	
	//if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0)
	//show_desktop_notification(imageURL, title, message, link, tag);
	//show_desktop_notification("/img/plugins/sipIcon.png", "Incoming Call :", USER_NAME+"   "+USER_NUMBER, undefined, "SipCall");
	
	// permission already asked when we registered
    if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) 
       {
          if (Notifi_Call) 
            {
        	  Notifi_Call.cancel();
            }
          Notifi_Call = window.webkitNotifications.createNotification('/img/plugins/sipIcon.png', 'Incoming call :', USER_NAME+"   "+USER_NUMBER);
          Notifi_Call.onclose = function () { Notifi_Call = null; };
          Notifi_Call.show();
        }    
		
	//notifyMe();	
	
	// Find contact for incoming call and update display.
	findContact();	
}

function notifyMe() {
	console.log("In notifyMe");
	
	
	var Notification = window.Notification || window.mozNotification || window.webkitNotification;
	
	console.log(Notification.permission);
	  // Let's check if the browser supports notifications
	  if (!("Notification" in window)) {
	    alert("This browser does not support desktop notification");
	  }

	  // Let's check if the user is okay to get some notification
	  else if (Notification.permission == "granted") {
	    // If it's okay let's create a notification
		 Notifi_Call = new Notification("Incoming Call :", {
		    body : USER_NAME+"   "+USER_NUMBER,
		    tag :  "SipCall",
		    icon : '/img/plugins/sipIcon.png'
		});
	  }

	  // Otherwise, we need to ask the user for permission
	  // Note, Chrome does not implement the permission static property
	  // So we have to check for NOT 'denied' instead of 'default'
	  else if (Notification.permission != 'denied') {
	    Notification.requestPermission(function (permission) {

	      // Whatever the user answers, we make sure we store the information
	      if(!('permission' in Notification)) {
	        Notification.permission = permission;
	      }

	      // If the user is okay, let's create a notification
	      if (permission == "granted") {
	         Notifi_Call = new Notification("Incoming Call :", {
	  		    body : USER_NAME+"   "+USER_NUMBER,
	  		    tag :  "SipCall",
	  		    icon : '/img/plugins/sipIcon.png'
	  		});
	      }
	    });
	  }

	  // At last, if the user already denied any notification, and you 
	  // want to be respectful there is no need to bother him any more.
	}

// Makes a call (SIP INVITE)
function makeCall(phoneNumber) 
{
  console.log("In makeCall.");	
  console.log(SIP_SESSION_CALL);
  
  if (SIP_STACK && !SIP_SESSION_CALL && !tsk_string_is_null_or_empty(phoneNumber)) 
    {      
      // create call session
	  SIP_SESSION_CALL = SIP_STACK.newSession('call-audio', Config_Call);
	  
      // make call
      if (SIP_SESSION_CALL.call(phoneNumber) != 0) 
        {
    	  SIP_SESSION_CALL = null;
    	  console.log('Failed to make call');
    	  
    	  showCallNotyPopup("failed","error", "Failed to make call.",false);
    	  
          return false;
        }      
      return true;
    }  
  else if(SIP_STACK != null && SIP_SESSION_CALL != null)
	  {
	    showNotyPopUp('information', "You are already in call.", "top", 5000);
	    return false;
	  }
  else if(!SIP_STACK)
      {
	    showNotyPopUp('information', "You are not register with SIP server, Please refresh the page.", "top", 5000);
	    return false;
	  }  
}

function findContact()
{
	//var n = "+918564789652";
	console.log("In findContact. "+ SIP_SESSION_CALL.getRemoteUri());
	$.getJSON("/core/api/contacts/search/phonenumber/" + SIP_SESSION_CALL.getRemoteUri(),
		   	function(caller)
		   	{ 	
		      console.log("In findContact caller is:  "); console.log(caller);
		      
		      if(caller != null)
		        {
		    	  if(caller.properties[0].name == 'first_name' 
		    		  && caller.properties[1].name == 'last_name' 
		    		  && caller.properties[2].name == 'image')
			         {
		    		   console.log(caller.properties[0].value);
		    	       console.log(caller.properties[1].value);			         
				       console.log(caller.properties[2].value);
				       
				       USER_NAME = caller.properties[0].value+" "+caller.properties[1].value;
				       USER_NUMBER = SIP_SESSION_CALL.getRemoteUri();
				       USER_IMG = caller.properties[2].value;
				      
				       if(CALL != undefined)
				        CALL.setText('<i class="icon icon-phone"></i><b>Incoming call : </b><br>'+USER_NAME+"   "+USER_NUMBER);
			         }
		        }		
		   	}).error(function(data)
		 		   	{ 
                       console.log("In Find contact : "+data.responseText);		   		
		 		   	});
}

/* functions related to audio */

function sipSendDTMF(c){
	console.log("In sipSendDTMF: " + c);
	
    if(SIP_SESSION_CALL && c){
        if(SIP_SESSION_CALL.dtmf(c) == 0)
        {
          try 
            { 
           	 var sound = $("#dtmfTone")[0];
    	     sound.load();
    	     sound.play(); 
            } catch(e){ }
        }
    }
}

function startRingTone() {
	console.log("In startRingTone");
    try 
    {     	
     var sound = $("#ringtone")[0];
	     sound.load();
	     sound.play();
    }
    catch (e) { }
}

function stopRingTone() {
	console.log("In stopRingTone");
    try { ringtone.pause(); }
    catch (e) { }
}

function startRingbackTone() {
	console.log("In startRingbackTone");
    try 
    {     	
     var sound = $("#ringbacktone")[0];
	     sound.load();
	     sound.play();
    } catch (e) { }
}

function stopRingbackTone() {
	console.log("In stopRingbackTone");
    try { ringbacktone.pause(); }
    catch (e) { }
}

/** noty functions 
 */

function showCallNotyPopup(state, type, message, duration)
{
	console.log("In showCallNotyPopup");
	
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js',  LIB_PATH
			+ 'lib/noty/layouts/bottom.js', LIB_PATH
			+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
			+ 'lib/noty/themes/default.js',LIB_PATH
			+ 'lib/noty/packaged/jquery.noty.packaged.min.js', function()
	   {
		  if(state == "incoming") // confirm
			  incomingCallNoty(message);		  
	      else if (state == "connected") // success
	    	  connectedCallNoty(message);	
	      else if(state == "outgoing")
	    	  outgoingCallNoty(message);	     	  
	      else
	    	  showCallNoty(type, message, duration);			  
	   });	
}

function showCallNoty(type, message, duration)
{
	console.log("In showCallNoty");
	
	if(CALL != undefined)
    CALL.close();
	
	CALL = noty({
		text        : message,
		type        : type,		
		layout      : "bottomRight",
		timeout     : duration, // delay for closing event. Set false for sticky notifications
	  });	
}

function incomingCallNoty(message)
{
	console.log("In incomingCallNoty");
	
	if(CALL != undefined)
	CALL.close();
	
	CALL = noty({
		text        : message,
		type        : "confirm",		
		layout      : "bottomRight",
		buttons     : [
			           {addClass: 'btn btn-primary answer', text: 'Answer'},
			           {addClass: 'btn btn-danger ignore', text: 'Ignore'}
		              ]
	  });	
}

function connectedCallNoty(message)
{
	console.log("In connectedCallNoty");
	
	if(CALL != undefined)
	CALL.close();
	
	CALL = noty({
		text        : message,
		type        : "success",		
		layout      : "bottomRight",
		buttons     : [
			           {addClass: 'btn btn-primary dialpad', text: 'Dialpad'},
			           {addClass: 'btn btn-danger hangup', text: 'Hangup'}
		              ]
	  });	
}

function outgoingCallNoty(message)
{
	console.log("In outgoingCallNoty");
	
	if(CALL != undefined)
	CALL.close();
	
	CALL = noty({
		text        : message,
		type        : "confirm",		
		layout      : "bottomRight",
		buttons     : [
			           {addClass: 'btn btn-danger hangup', text: 'Cancel'}			           
		              ]
	  });	
}