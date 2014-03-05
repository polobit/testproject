var Sip_Stack;
var Sip_Register_Session;
var Sip_Start = false;
var Sip_Widget_Object;
var Sip_Session_Call;
var Config_Call;
var Ready_State_Timer;
var CALL;
var User_Name;
var User_Img;
var User_Number;
var Notifi_Call;
var Sip_Updated = false;
var No_Internet = false;

window.addEventListener("offline", function(e)
{
	console.log("offline");
	No_Internet = true;
	sipUnRegister();
}, false);

window.addEventListener("online", function(e)
{
	console.log("online");
	No_Internet = false;
	sipStart();
}, false);

$(function()
{
	// Register SIP
	sipStart();	
});
