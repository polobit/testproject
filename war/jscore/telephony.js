var CB;
var SIP_STACK;
var SIP_REGISTER_SESSION;
var SIP_START = false;
var SIP_WIDGET_OBJECT;
var SIP_SESSION_CALL;
var Config_Call;
var READY_STATE_TIMER;

$(function()
  {			
	console.log("In telephony.js");
	
	READY_STATE_TIMER = setTimeout(function () 
			{
              if (document.readyState === "complete") 
                 {
                    clearInterval(READY_STATE_TIMER);
                   
                    console.log(SIP_STACK);
                	console.log(SIP_REGISTER_SESSION);
                	
                	if(SIP_START == false)
                	{
                		// Get Sip widget
                		 $.getJSON("/core/api/widgets/Sip",function (sip_widget)
                				    {	 
                			          console.log("In telephony getting sip widget.");	
                			          console.log(sip_widget);	
                			         
                			          SIP_WIDGET_OBJECT = sip_widget;
                			          
                			          if(sip_widget.prefs != undefined )
                			        	 {			
                			        	   head.js(LIB_PATH + 'lib/telephony/SIPml-api.js', function()
                			        		 {
                			        		   console.log("Sip call from telephony for widget.");
                			        		   
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
            },10000); // 20 sec
			
	head.js(LIB_PATH + 'lib/telephony/candybar.js', function()
		{
		   CB = new CandyBar();
		   CB.render();		   
		});	   
	
	
	head.js(LIB_PATH + 'lib/telephony/att.phonenumber.js',LIB_PATH + 'lib/telephony/dialpad.js',function()
	{
		console.log("After including files.");
		
		window.dialer = new Dialpad({
        onPress: function (key) {
            console.log('a key was pressed', key);
        },
        onCallableNumber: function (number) {
            console.log('we have a number that seems callable', number);
        },
        onHide: function () {
            console.log('removed it');
        },
        onCall: function (number) {
            console.log('The call button was pressed', number);
        }
      });
   
	});
	
  $(".make-call").die().live("click", function(e)
    {
	           e.preventDefault();    	
		   	   console.log("In make-call");
		    	
		       //console.log(window.dialer);		    	
		      // $("#dialpadDiv").html(window.dialer.render());
		       
		   	   // SIP
		       if(makeCall('sip:huma@sip2sip.info'))
		       { 
			       // Display
			       showOutgoingingCall();   
		       }		       
   });    
		    
  $(".close_dialer").die().live("click", function(e)
   {
      e.preventDefault();    	
  	  console.log("In close_dialer");
   	      	    	
      $("#dialpadDiv").html("");
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
    	    	    	
		  if(!setUser(name, phone, image)) 
			  {
			    // SIP
			    if(makeCall(phone))
			      {
			    	// Display
				    callUser();
			      }		    
			  }
     });    
    
    $(".call_end").die().live("click", function(e)
     {
    	e.preventDefault();    	
    	console.log("In call_end");

    	// Display
    	//setStateInActive()
    	endCall();    	
           	
        // SIP
    	hangupCall();    	 	
     });    

    $('.ignore').die().live("click", function(e)
      {
    	console.log("In ignore.");    	
    	rejectCall();
      });
    
    $('.answer').die().live("click", function(e)
     {
    	console.log("In answer");    	
    	acceptCall();
     });
        
  });

/* SIP event listeners */
//Callback function for SIP Stack or Events Listener for sip stack
function sipStackEventsListener(e /*SIPml.Stack.Event*/) 
{
	console.log("In sipStack event Listner.");
	
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

                console.log("In sipStack event Listner. stopping "+e.type);
                displayInSip("Disconnected: "+e.description);
                showNotyPopUp('information', "Disconnected with SIP because "+e.description, "top", 5000);
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
        	  showNotyPopUp('information', "Media stream permission denied.", "top", 5000);   
        	  $(".call_end").click();
        	  break;
        	}
        default: {alert("In sipStack event Listner. "+e.type); break;}
    }
};

// Callback function for SIP sessions (INVITE, REGISTER, MESSAGE...)
function sipSessionEventsListener(e /* SIPml.Session.Event */) 
{	
	console.log("In sip Session event Listner.");
	
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
            	 displayInSip(message);               
            	 showNotyPopUp('information', "You are register with SIP.", "top", 5000);
            	 $(".contact-make-call").show();
           	     $(".make-call").show();
               }
             else if (e.session == SIP_SESSION_CALL) 
               {
            	 // Call received.
            	 console.log("call Connected.");
                 console.log("In sip Session event Listner. "+ e.description );                 
                 
                 setStateActive(); 
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

                    console.log("In sip Session event Listner. "+ e.description );
                    displayInSip("Disconnected: "+e.description);
                    showNotyPopUp('information', "Disconnected with SIP because "+e.description, "top", 5000);
                }
                else if (e.session == SIP_SESSION_CALL) 
                {
                	// Call terminated.
                	SIP_SESSION_CALL = null;
                	console.log("call terminated.");
                	console.log("In sip Session event Listner. "+ e.description );
                	
                	// Display
                	setStateInActive()
                	endCall();
                }
                break;
            } // 'terminating' | 'terminated'
        case 'i_ao_request':{ console.log("In sip Session event Listner. i_ao_request "+e.type); break;}
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
        
        case 'm_early_media': { console.log("In sip Session event Listner. m_early_media "+e.type); break;}
        case 'm_stream_audio_local_added': { console.log("In sip Session event Listner. m_stream_audio_local_added "+e.type); break;}
        case 'm_stream_audio_local_removed': { console.log("In sip Session event Listner. m_stream_audio_local_removed "+e.type); break;}
        case 'm_stream_audio_remote_added': { console.log("In sip Session event Listner. m_stream_audio_remote_added "+e.type); break;}
        case 'm_stream_audio_remote_removed': { console.log("In sip Session event Listner. m_stream_audio_remote_removed "+e.type); break;}
        case 'i_ect_new_call': { console.log("In sip Session event Listner. i_ect_new_call "+e.type); break;}
        case 'o_ect_trying': { console.log("In sip Session event Listner. o_ect_trying "+e.type); break;}
        case 'o_ect_accepted': { console.log("In sip Session event Listner. o_ect_accepted "+e.type); break;}
        case 'o_ect_completed': { console.log("In sip Session event Listner. o_ect_completed "+e.type); break;}
        case 'i_ect_completed': { console.log("In sip Session event Listner. i_ect_completed "+e.type); break;}
        case 'o_ect_failed': { console.log("In sip Session event Listner. o_ect_failed "+e.type); break;}
        case 'i_ect_failed': { console.log("In sip Session event Listner. i_ect_failed "+e.type); break;}
        case 'o_ect_notify': { console.log("In sip Session event Listner. o_ect_notify "+e.type); break;}
        case 'i_ect_notify': { console.log("In sip Session event Listner. i_ect_notify "+e.type); break;}
        case 'i_ect_requested ': { console.log("In sip Session event Listner. i_ect_requested "+e.type); break;}
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
 
 if(SIP_START == false)	
  {	
	SIP_START = true;
	console.log(SIP_STACK);
	console.log(SIP_REGISTER_SESSION);

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
		      displayInSip(message);
			}
		else
		  {				
			
			// Define sip stack
			SIP_STACK =  new SIPml.Stack({realm: credentials.sip_realm, 
				                             impi: credentials.sip_privateid, 
				                             impu: credentials.sip_publicid, 
				                             password: credentials.sip_password, 
				                             display_name: credentials.sip_username,				                          
				                             events_listener: { events: '*', listener: sipStackEventsListener },
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
					displayInSip(message);
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
function sipUnRegister() {
    if (SIP_STACK) {
    	SIP_STACK.stop(); // shutdown all sessions
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
             events_listener: { events: '*', listener: sipSessionEventsListener },
         });
     	SIP_REGISTER_SESSION.register();
     }
     catch (e) 
     {
     	SIP_START = false;
     	displayInSip(e);
     }	
}
// New session call for incoming call.
function newCall(e)
{
  console.log("In newCall."); 
  console.log(SIP_SESSION_CALL);
 
	
	if (SIP_SESSION_CALL) 
    {
	  console.log("already in call.");	
		
	  showNotyPopUp('information', "You are already in call.", "top", 5000);
	  
      // do not accept the incoming call if we're already 'in call'
      e.newSession.hangup(); // comment this line for multi-line support     
    }
  else 
    {
	   SIP_SESSION_CALL = e.newSession;
    
	   Config_Call =  { 
			            video_local: document.getElementById('video-local'),
                        video_remote: document.getElementById('video-remote'),
			            audio_remote: document.getElementById('audio-remote'),		                
		                events_listener: { events: '*', listener: sipSessionEventsListener },
		              };
	   
	   // start listening for events
	   SIP_SESSION_CALL.setConfiguration(Config_Call);
	   
      var sRemoteNumber = (SIP_SESSION_CALL.getRemoteFriendlyName() || 'unknown');
      console.log( "Incoming call from "+ sRemoteNumber );
      showIncomingCall();
    } 
}

// show details in candybar for incoming call.
function showIncomingCall()
{
	console.log("In showIncomingCall.");	
	
	if(!setUser(SIP_SESSION_CALL.getRemoteFriendlyName(), SIP_SESSION_CALL.getRemoteUri(), null)) 
	  {
		receiveCall();		
	  }	
	
	// Find contact for incoming call and update display.
	findContact();	
}

//show details in candybar for incoming call.
function showOutgoingingCall()
{
	console.log("In showOutgoingingCall.");	
	
	// Display
	if(!setUser(SIP_SESSION_CALL.getRemoteFriendlyName(), SIP_SESSION_CALL.getRemoteUri(), null)) 
	  {
		callUser();       
	  }	
}

// Accept incoming call.
function acceptCall()
{
  console.log("In acceptCall.");
  console.log(SIP_SESSION_CALL);
  
  // SIP
  SIP_SESSION_CALL.accept(Config_Call);  
}

// Reject incoming call.
function rejectCall()
{
  console.log("In rejectCall.");
  
  // SIP
  SIP_SESSION_CALL.reject(Config_Call);  
  
  // Display
  endCall();   
}

// Makes a call (SIP INVITE)
function makeCall(phoneNumber) 
{
  console.log("In makeCall.");	
  if (SIP_STACK && !SIP_SESSION_CALL) 
    {      
      // create call session
	  SIP_SESSION_CALL = SIP_STACK.newSession('call-audio', Config_Call);
	  
      // make call
      if (SIP_SESSION_CALL.call(phoneNumber) != 0) 
        {
    	  SIP_SESSION_CALL = null;
    	  console.log('Failed to make call');
          alert('Failed to make call');
          return false;
        }     
      return true;
    }  
  else if(SIP_STACK && SIP_SESSION_CALL)
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

// terminates the call (SIP BYE or CANCEL)
function hangupCall() 
{
	console.log("In hangupCall.");
    if (SIP_SESSION_CALL) 
    {
    	stopRingTone();
        console.log("Terminating the call...");
        SIP_SESSION_CALL.hangup({events_listener: { events: '*', listener: sipSessionEventsListener }});
    }
}

function findContact()
{
	console.log("In findContact. " + SIP_SESSION_CALL.getRemoteUri());
	$.getJSON("/core/api/contacts/search/phonenumber/" + SIP_SESSION_CALL.getRemoteUri(),
		   	function(caller)
		   	{ 	
		      console.log("In findContact caller is:  "+caller);
		      /*if(caller != null)
		        {
			      setUser(caller.name, caller.phone, caller.img);
		        }*/		
		   	}).error(function(data)
		 		   	{ 
                       console.log("In Find contact : "+data.responseText);		   		
		 		   	});
}

//Display message in Sip widget's div.
function displayInSip(message)
{
  console.log("In displayInSip.");	
  console.log(message);
  
  var dataDisplay = {};
  dataDisplay["msg"] = message;
  
  // Fill template with data and append it to Sip panel
  $('#Sip').html(getTemplate('sip-profile', dataDisplay));
}

/* functions related to audio */
function startRingTone() 
{
	console.log("In startRingTone.");
    try { ringtone.play(); }
    catch (e) { }
}

function stopRingTone() 
{
	console.log("In stopRingTone.");
    try { ringtone.pause(); }
    catch (e) { }
}



/*  candybar related functions*/
//Active call candy bar UI.
function setStateActive()
{
  console.log("In setStateActive");	
  CB.setState('active'); 
  return false;
}

// Inactive call candy bar UI.
function setStateInActive()
{
  console.log("In setStateInActive");	
  CB.setState('inactive'); 
  return false;
}

// Set User for call.
function setUser(name, number, pic)
{
  console.log("In setUser");  
  CB.setUser({
	          name: name, 
	          number: number, 
	          picUrl: pic
	         }); 
  return false;
}

// Clear User from call.
function clearUser()
{
  console.log("In clearUser");	
  CB.clearUser();
  return false;	
}

// Make call to user.
function callUser()
{
  console.log("In callUser");
  console.log(CB);
  CB.setState('calling');
  return false;
}

// Receive call from user.
function receiveCall()
{
  console.log("In receiveCall");	
  CB.setState('incoming');
  return false;	
}

// End call of user.
function endCall()
{
  console.log("In endCall");
  CB.endGently();
    
  return false;	
}