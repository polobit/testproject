/* SIP related functions */

/**
 * SIPml initialization, stack creation and session regisration does after
 * adding sip widget / updating sip widget / re-login user.
 */
function sipStart()
{
	console.log("In sipStart.");
	console.log(Sip_Start);
	console.log(Sip_Stack);
	console.log(Sip_Register_Session);

	// After 15 sec procedure will start.
	Ready_State_Timer = setTimeout(function()
	{
		// after DOM ready.
		if (document.readyState === "complete")
		{
			// Clear 15 sec duration to avoid loop calling.
			clearInterval(Ready_State_Timer);

			// If sip not register yet.
			if (Sip_Start == false)
			{
				// Get Sip widget
				$.getJSON("/core/api/widgets/Sip", function(sip_widget)
				{
					if (sip_widget == null)
						return;

					Sip_Widget_Object = sip_widget;

					if (sip_widget.prefs != undefined)
					{
						head.js(LIB_PATH + 'lib/telephony/SIPml-api.js', function()
						{
							// initialize SIPML5
							if (SIPml.isInitialized()) // If already done.
								sipRegister();
							else
								SIPml.init(sipRegister);
						});
					}
				}).error(function(data)
				{
					console.log("In sip error");
					console.log(data);
				});
			}
		}
	}, 15000); // 15 sec
}

/**
 * Create stack, to register a sip.
 */
function sipRegister()
{

	// Properties for session object.
	Config_Call = { audio_remote : document.getElementById('audio_remote'), events_listener : { events : '*', listener : sipSessionEventsListener } };

	// If sip is not started yet.
	if (Sip_Start == false)
	{
		// Set flag to avoid recall.
		Sip_Start = true;

		var url = null;

		// Get widget details.
		var credentials = eval('(' + Sip_Widget_Object.prefs + ')');

		var message = null;

		try
		{
			// Check Sip Public Identity is valid.
			var o_impu = tsip_uri.prototype.Parse(credentials.sip_publicid);

			if (!o_impu || !o_impu.s_user_name || !o_impu.s_host)
			{
				Sip_Start = false;
				message = credentials.sip_publicid + " is not a valid Public identity. Please provide valid credentials.";
				showCallNotyPopup("failed", "error", message, 5000);
			}
			else
			{
				// Check websocket_proxy_url
				if (credentials.sip_wsenable == "true")
					url = "ws://54.83.12.176:10060";

				// Define sip stack
				Sip_Stack = new SIPml.Stack({ realm : credentials.sip_realm, impi : credentials.sip_privateid, impu : credentials.sip_publicid,
					password : credentials.sip_password, display_name : credentials.sip_username, websocket_proxy_url : url, enable_rtcweb_breaker : true,
					events_listener : { events : '*', listener : sipStackEventsListener } });

				// sip stack start
				if (Sip_Stack.start() != 0)
				{
					Sip_Start = false;
					message = 'Failed to start the SIP stack. Please provide valid credentials.';
					showCallNotyPopup("failed", "error", message, 5000);
				}
			} // else end
		}
		catch (e)
		{
			Sip_Start = false;
			message = e + " Please provide valid credentials.";
			showCallNotyPopup("failed", "error", message, 5000);
		}
	}
}

/**
 * Register or login on sip server for session.
 */
function sipLogin()
{
	try
	{
		// LogIn (REGISTER) as soon as the stack finish starting
		Sip_Register_Session = Sip_Stack.newSession('register', { events_listener : { events : '*', listener : sipSessionEventsListener } });
		Sip_Register_Session.register();
	}
	catch (e)
	{
		Sip_Start = false;
	}
}

/**
 * sends SIP REGISTER (expires=0) to logout. Sip unregister stack and session,
 * On logout / window close / SIP details in Sip widget modified.
 */
function sipUnRegister()
{
	// Check stack available.
	if (Sip_Stack)
	{
		// shutdown all sessions
		var done = Sip_Stack.stop();

		console.log("Sip_Stack.stop() :" + done);

		// If not then recursive call.
		if (done != 0)
			sipUnRegister();
	}
}
