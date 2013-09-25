/**
 *  Creates Pubnub object and subscribe client channel as well as publish on agile_CRM_Channel. 
 * 
 */
function initToPubNub() 
{	
	//pubnub already defined.
	if(pubnub != null)
		{
		  return;
		}
	
	//pubnub not defined.
	var protocol = 'https';
	
	head.js(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function() 
	  {		
		// CREATE A PUBNUB OBJECT
		pubnub = PUBNUB.init({
							   'publish_key' : 'pub-c-5139e454-1edf-4bc1-b0b4-7ee86bb313fe',
							   'subscribe_key' : 'sub-c-e77c03c6-d284-11e2-b3bf-02ee2ddab7fe',
								ssl : true,
								origin : 'pubsub.pubnub.com',								 
							});
		//Get compatibility with all browsers.
		//pubnub.ready();
		
		//subscribe to client channel.
		subscribeClientChannel();								
	  });	
}

/**
 * Subscribe client channel. 
 */
function subscribeClientChannel() 
{
  console.log("In subscribeClientChannel.");	
	
  pubnub.subscribe
  ({
	 channel    : CURRENT_DOMAIN_USER.id +"_Channel",
	 restore    : true,                                // FETCH MISSED MESSAGES ON PAGE CHANGES.
	 message    : function( message, env, channel ) 
		              {					
		                console.log(message);
		                
						//display message in stream. 
						handleMessage(message);
		              }, // RECEIVED A MESSAGE.
	 presence   : function( message, env, channel )
		              {
						console.log("In initToPubNub agile presence msg :");
						console.log(message);								
		              },       // OTHER USERS JOIN/LEFT CHANNEL.
	 connect    : function() 
		   			  {
			 			console.log("Agile crm Connected");
			 			
			 			//display added streams 
			 			socialsuitecall.streams();				 
		   			  },     // CONNECTION ESTABLISHED.
	 disconnect : function(channel) {console.log(channel+" Disconnected");},  // LOST CONNECTION (OFFLINE).
	 reconnect  : function(channel) {console.log(channel+" Reconnected")},    // CONNECTION BACK ONLINE!
	 error      : function(channel) {console.log(channel+" Network Error") },
  });	
}

/**
 * Publish message (action of user) on agile_crm_Channel. 
 */
function sendMessage(publishJSON) 
{
	console.log("in publish_message publishJSON: ");
	console.log(publishJSON);
	
	//message to publish is empty.
	if(publishJSON == null)
		{
		 return;
		}  

	if(publishJSON.message_type == "register")
		{		
		  //add img of user to column.
		  addUserImgToColumn(publishJSON.stream);
		  
		  if(publishJSON.stream.network_type == "LINKEDIN")
		   {
			 console.log("stream's network is " +publishJSON.stream.network_type);		     
		     return;
		   }
		}
			//message has data.
			pubnub.publish
				({
					channel : "agile_crm_Channel",
					message : publishJSON,
					callback : function(info) 
					{
						if (info[0])
							console.log("in publish_message Successfully Sent Message!");
						else // The internet is gone. // TRY SENDING AGAIN!
			        		{
							console.log("in publish_message unsuccessfull to Sent Message!");
							alert("in publish_message unsuccessfully to Sent Message!");
			        		}
					}
				});	
}