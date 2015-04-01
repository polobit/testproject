// Sip stack.
var Sip_Stack;

// Sip register session.
var Sip_Register_Session;

// Sip call session.
var Sip_Session_Call;

/*
 * Sip call session properties. Used to create incoming call, outgoing call, and
 * sip registration. Even we need when user reject or accept call.
 */
var Config_Call;

// Sip widget.
var Sip_Widget_Object;

// User details of callee / contact user. We can not set fields in session. 
var User_Name;
var User_Img;
var User_Number;
var User_ID;
var SIP_Call_Noty_IMG = "";
var Contact_Link = "";
var Show_Add_Contact = false;

// Call is ignored
var Is_Ignore = false;

// Call noty.
var CALL;

// HTML5 notification.
var Notify_Call;

// Sip flags.
var Sip_Start = false;
var Sip_Updated = false;
var No_Internet = false;

// Audio object
var Sip_Audio;

// If user get disconnect from internet.
window.addEventListener("offline", function(e)
{	
	No_Internet = true;

	// Unregister all sessions and stop sip stack.
	sipUnRegister();
}, false);

// If user get reconnect with internet.
window.addEventListener("online", function(e)
{
	No_Internet = false;

	// Re-register on sip.
	sipStart();
}, false);

// For telephony on SIP.
$(function()
{
	// Register SIP
	sipStart();
});
