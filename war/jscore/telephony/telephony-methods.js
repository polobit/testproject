/* SIP related functions */

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
                			        		   if(SIPml.isInitialized())
                			        			   sipRegister();
                			        		   else
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
            },15000); // 15 sec
}

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
    	var done = SIP_STACK.stop(); // shutdown all sessions
    	console.log("SIP_STACK.stop() :" + done);
    	if(done != 0) 
    		sipUnRegister();
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

function addAudio()
{
	console.log("In addAudio.");
	
	var audioElmt = document.getElementById("audio_remote");
	console.log(audioElmt);
	
	// Already added.
	if(audioElmt != null)
		return;
	else if(audioElmt == null) // not added.		
		{
		  // add audio
		  $('body').append('<!-- Audios --><audio id="audio_remote" autoplay="autoplay" /><audio id="ringtone" loop><source src="/sounds/ringtone.wav" type="audio/wav" preload="auto"></source></audio><audio id="ringbacktone" loop><source src="/sounds/ringbacktone.wav" type="audio/wav" preload="auto"></source></audio><audio id="dtmfTone"><source src="/sounds/dtmf.wav" type="audio/wav" preload="auto"></source></audio>');
		}
}

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
