/**
 * Creates Pubnub object and subscribe client channel as well as publish on
 * agile_CRM_Channel.
 * 
 */
function initToPubNub()
{
	// Pubnub already defined.
	if (Pubnub != null)
		return;

	// Pubnub not defined.
	var protocol = 'https';

	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		Pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-5139e454-1edf-4bc1-b0b4-7ee86bb313fe', 'subscribe_key' : 'sub-c-e77c03c6-d284-11e2-b3bf-02ee2ddab7fe',
			ssl : true, origin : 'pubsub.pubnub.com', });
		// Get compatibility with all browsers.
		// Pubnub.ready();

		// Subscribe to client channel.
		subscribeClientChannel();
	});
}

/**
 * Subscribe client channel.
 */
function subscribeClientChannel()
{
	Pubnub.subscribe({ channel : CURRENT_DOMAIN_USER.id + "_Channel", restore : true, message : function(message, env, channel)
	{
		console.log(message);

		// Display message in stream.
		handleMessage(message);

	}, // RECEIVED A MESSAGE.
	presence : function(message, env, channel)
	{
		console.log(message);
	}, // OTHER USERS JOIN/LEFT CHANNEL.
	connect : function()
	{
		console.log("Agile crm Connected");

		// Display added streams
		socialsuitecall.streams();
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
	console.log("in publish_message publishJSON: ");
	console.log(publishJSON);

	// Message to publish is empty.
	if (publishJSON == null)
		return;

	// Message has data.
	Pubnub.publish({ channel : "agile_crm_Channel", message : publishJSON, callback : function(info)
	{
		if (info[0])
			console.log("in publish_message Successfully Sent Message!");
		else
		// The internet is gone. // TRY SENDING AGAIN!
		{
			console.log("in publish_message unsuccessfull to Sent Message!");
			showNotyPopUp('information', "You are not connected with Twitter server or you have problem with connection!", "top", 5000);
			displayErrorInStream(publishJSON.stream);
			Register_Counter++;
			registerAll(Register_Counter);
			// sendMessage(publishJSON);
		}
	} });
}
