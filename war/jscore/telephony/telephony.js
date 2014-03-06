// Sip stack.
var Sip_Stack;

// Sip register session.
var Sip_Register_Session;

// Sip call session.
var Sip_Session_Call;

// Sip call session properties.
var Config_Call;

// Sip widget.
var Sip_Widget_Object;

// User details of callee / contact user.
var User_Name;
var User_Img;
var User_Number;

// Call noty.
var CALL;

// HTML5 notification.
var Notifi_Call;

// Sip flags.
var Sip_Start = false;
var Sip_Updated = false;
var No_Internet = false;

// Time Counter.
var Ready_State_Timer;

// Audio object
var Sip_Audio;

// If user get disconnect from internet.
window.addEventListener("offline", function(e)
{
	console.log("offline");
	No_Internet = true;

	// Unregister all sessions and stop sip stack.
	sipUnRegister();
}, false);

// If user get reconnect with internet.
window.addEventListener("online", function(e)
{
	console.log("online");
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
