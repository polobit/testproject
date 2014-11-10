function showEventNotification()
{
	
	var domain = CURRENT_DOMAIN_USER['domain'];
	subscribeEventToPubNub(domain, function(message)
	{

		console.log("subscription");
		// _setupNotification(message);
	});
}

/**
 * Subscribes to Pubnub.
 * 
 * @param domain -
 *            Domain name.
 */
function subscribeEventToPubNub(domain)
{
	// Put http or https
	// var protocol = document.location.protocol;
	var protocol = 'https';
	load_urls_on_ajax_stop(protocol + '://pubnub.a.ssl.fastly.net/pubnub-3.4.min.js', function()
	{
		// CREATE A PUBNUB OBJECT
		var pubnub = PUBNUB.init({ 'publish_key' : 'pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274',
			'subscribe_key' : 'sub-c-118f8482-92c3-11e2-9b69-12313f022c90', ssl : true, origin : 'pubsub.pubnub.com' });
		pubnub.ready();
		pubnub.subscribe({ channel : domain, callback : function(message)
		{

			// shows call notification

			var html = getTemplate('event-notification', message);
			showNoty('information', html, 'bottomRight', "event");
			return;

		} });
	});
}

