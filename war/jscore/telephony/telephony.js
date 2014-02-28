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
var SIP_UPDATED = false;
var NO_INTERNET = false;

window.addEventListener("offline", function(e) 
		{ console.log("offline");
		  NO_INTERNET = true; 
		  sipUnRegister();
		}, false);

window.addEventListener("online", function(e) 
		{ console.log("online");
		  NO_INTERNET = false;
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
		       if(makeCall('sip:+18004321000@proxy.ideasip.com'))
		       { 
		    	 USER_NAME = "Agile";
		    	 USER_NUMBER = "sip:+18004321000@proxy.ideasip.com";
		   	   
		   	/*if(makeCall('sip:farah@sip2sip.info'))
		       { 
		    	 USER_NAME = "farah";
		    	 USER_NUMBER = "sip:farah@sip2sip.info";*/
		    	   
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

