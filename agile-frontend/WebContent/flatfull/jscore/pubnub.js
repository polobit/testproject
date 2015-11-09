/**
 * Creates Pubnub object and subscribe client channel as well as publish on
 * agile_CRM_Channel.
 * 
 */
function initToPubNub(callback)
{
	//console.log(Pubnub);
	// Pubnub already defined.
	if(Pubnub != undefined)
	 if (Pubnub != null){
		 if(callback)
			 callback();
	 	 return;
}

	// Pubnub not defined.
	var protocol = 'https';

	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		Pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274', 'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90',
			ssl : true, origin : 'pubsub.pubnub.com', });
		// Get compatibility with all browsers.
		// Pubnub.ready();

		// Subscribe to client channel. Receive tweet from social server.
		subscribeClientChannel(callback);
	});
}

/**
 * Subscribe client channel.
 */
function subscribeClientChannel(callback)
{
	Pubnub.subscribe({ channel : CURRENT_DOMAIN_USER.id + "_Channel", restore : true, message : function(message, env, channel)
	{
		//console.log(message);

		// Display message in stream.
			if((message || {}).type  == "BRIA_CALL"){
				showBriaCallNoty(message);
				return;
		}
		handleMessage(message);

	}, // RECEIVED A MESSAGE.
	presence : function(message, env, channel)
	{
		console.log(message);
	}, // OTHER USERS JOIN/LEFT CHANNEL.
	connect : function()
	{
		console.log("Agile crm Connected");
		Pubnub.is_connected_call = true;
		
		if(callback)
			callback();
	
	}, // CONNECTION ESTABLISHED.
	disconnect : function(channel)
	{
		console.log(channel + " Disconnected");
	}, // LOST CONNECTION (OFFLINE).
	reconnect : function(channel)
	{
		console.log(channel + " Reconnected")
	}, // CONNECTION BACK ONLINE!
	error : function(channel)
	{
		console.log(channel + " Network Error")
	}, });
}

/**
 * Publish message (action of user) on agile_crm_Channel.
 */
function sendMessage(publishJSON)
{
	console.log("publish_message publishJSON: ");
	console.log(publishJSON);

	// Message to publish is empty.
	if (publishJSON == null)
		return;

	// Message has data.
	Pubnub.publish({ channel : "agile_crm_Channel", message : publishJSON, callback : function(info)
	{
		if (info[0])
			console.log("publish_message Successfully Sent!");
		else
		// The internet is gone. // TRY SENDING AGAIN!
		{
			console.log("publish_message unsuccessfull to Sent!");
			showNotyPopUp('information', "You are not connected with Twitter server or you have problem with connection!", "top", 5000);
			displayErrorInStream(publishJSON.stream);
			
			// How many streams are register.			
			Register_Counter++;
			
			// Register next stream.
			registerAll(Register_Counter);
			
			// sendMessage(publishJSON);
		}
	} });
}
