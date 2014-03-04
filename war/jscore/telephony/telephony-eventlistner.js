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
        case 'failed_to_start':{showCallNotyPopup("disconnected",'error', "SIP: There was an error registering your account. Please modify and try again.",false);} 
        case 'failed_to_stop':
        case 'stopping': case 'stopped':         
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
        	  
        	  showCallNotyPopup("mediaDeny",'warning', "SIP: Media stream permission denied.",false);  
        	  
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
        	     
        	     if (e.session == SIP_REGISTER_SESSION) 
          	        {
        	    	 // Add audio tags in home page.
        	    	 addAudio();
          	        }
        	     
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
        		 
            	 showCallNotyPopup("register",'information', "SIP: You are now registered to make and receive calls successfully.",5000);
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
                    
                    if(SIP_UPDATED == true && e.description == "Disconnecting...")
                    	{
                    	  SIP_UPDATED = false;
                    	  showCallNotyPopup("disconnected",'warning', "SIP : Terminated for modifications. Registering again...", 5000);
                    	}
                    else if(NO_INTERNET == true && e.description == "Disconnecting...")
                    	{
                    	  NO_INTERNET = false;
                    	  showCallNotyPopup("disconnected",'error', "SIP : Terminated because no internet connectivity.", 5000);
                    	}
                    else
                        showCallNotyPopup("disconnected",'error', "SIP : Terminated because "+e.description, 5000);
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
                  	   showCallNotyPopup("forbidden","error", "SIP: PSTN calls are forbidden.",false);
                	else if(e.description == "Not acceptable here")
                   	   showCallNotyPopup("noresponce","error", "SIP: Not acceptable here.",false); 
                	else if(e.description == "Media stream permission denied")
                       showCallNotyPopup("permissiondenied","error", "SIP: Media stream permission denied.");                 	
                	else if (e.description == "Call terminated")
                	   showCallNotyPopup("hangup","information", "<b>Call ended with : <b><br>"+USER_NAME+"   "+USER_NUMBER+"<br>",false);
                	else if (e.description == "Decline")
                 	   showCallNotyPopup("decline","error", "Call Decline.",false);
                	else if (e.description == "Request Timeout")
                  	   showCallNotyPopup("requestTimeout","error", "SIP: Request Timeout.",false);
                	else if (e.description == "Hackers Forbidden")
                   	   showCallNotyPopup("hackersForbidden","error", "SIP: Hackers Forbidden.",false);
                	                	                	
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
