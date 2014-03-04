/**
 *  noty functions 
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