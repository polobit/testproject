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
		/*Pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-6b11bf61-b2c4-4662-83da-003dea06707f', 'subscribe_key' : 'sub-c-20574022-a7e6-11e6-80fa-02ee2ddab7fe',
			ssl : true, origin : 'pubsub.pubnub.com', });*/

		subscribeClientChannel(callback);
	});
}

/**
 * Subscribe client channel.
 */
function subscribeClientChannel(callback){
	Pubnub.subscribe({
		channel : CURRENT_DOMAIN_USER.id + "_Channel", 
		restore : false, 
		message : function(message, env, channel){
			try{
				try{
					if(typeof message == "string"){
						message = JSON.parse(message);
					}
				}catch(e){
					return;
				}
			}catch(e){
				return;
			}
			//alert((message || {}).type +"===="+ (message || {}).state +"======="+ (message || {}).duration +"======="+ (message || {}).contact_number+"======="+ (message || {}).phone_no);
			if((message || {}).type  == "call"){
				if((message || {}).check){	
					if(message.extension && AsteriskWidgetPrefs.asterisk_call_channel){
						if(AsteriskWidgetPrefs.asterisk_call_channel.indexOf(message.extension) != -1){
					    	handleCallRequest(message);
					    }						
					}										
				}else{
					handleCallRequest(message);
				}
			}else{
				// Display message in stream.
				handleMessage(message);	
			}
		},presence : function(message, env, channel){
			// RECEIVED A MESSAGE.
			console.log(message);
		},connect : function(){
			// OTHER USERS JOIN/LEFT CHANNEL.
			console.log("Agile crm Connected");
			Pubnub.is_connected_call = true;
			
			if(callback)
				callback();
		
		},disconnect : function(channel){
			// CONNECTION ESTABLISHED.
			console.log(channel + " Disconnected");
		},reconnect : function(channel){
			// LOST CONNECTION (OFFLINE).
			console.log(channel + " Reconnected")
		},error : function(channel){
			// CONNECTION BACK ONLINE!
			console.log(channel + " Network Error");
		},
	});
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
			showNotyPopUp('information', "{{agile_lng_translate 'socialsuite' 'connection-error'}}", "top", 5000);
			displayErrorInStream(publishJSON.stream);
			
			// How many streams are register.			
			Register_Counter++;
			
			// Register next stream.
			registerAll(Register_Counter);
			
			// sendMessage(publishJSON);
		}
	} });
}