var notification_prefs;
var socket;

// Download and Register
function downloadAndRegisterForNotifications()
{
	// Download Notification Prefs
	var notification_model = Backbone.Model.extend({
		  url: 'core/api/notifications'
		});
	
	var model = new notification_model();
	model.fetch({ success: function(data) { 
		
		// Register For Notifications
		notification_prefs = data.toJSON();	
		console.log(notification_prefs);
		registerForNotifications(notification_prefs)
	}});	
}

// Register for notifications
function registerForNotifications(prefs)
{
	// Check if at least one key is not present. In backend, we do not store if the value is default
	if(!prefs.contact_any_browsing || !prefs.contact_assigned_browsing || !prefs.contact_assigned_starred_browsing)
	{
		// Register for sockets
		
	}
	
	registerForSockets();
}


// Gets API Key and Sets up Socket 
function registerForSockets()
{

	// Put http or https
	//var protocol = document.location.protocol;
	var protocol = 'https';
	head.js(protocol + '://stats.agilecrm.com:90/socket.io/socket.io.js', function()
	{
		
		// Get API Key
		var api_key_model = Backbone.Model.extend({
			  url: 'core/api/api-key'
			});		
		
		var model = new api_key_model();
		model.fetch({ success: function(data) { 
			
			var api_key = data.get('api_key');
			_setupSockets(api_key);
			
		}});
		
	});
}

// Setup sockets
function _setupSockets(api_key)
{	
	console.log("Connecting " + api_key);
	
	var agile = api_key;
	socket = io.connect('https://stats.agilecrm.com:90');
	socket.on('connect', function () {
		    console.log('socket connected');
		    socket.emit('subscribe', { agile_id: agile });
		  });
	  
	socket.on('browsing', function (data) {
		console.log('browsing');
	    console.log(data);
	    
	    // Get his email address
	    //var email = 'manohar@invox.com';
	    fetchContactAndNotify(data.email);
	});	
	
	  
	socket.on('notification', function (data) {
		console.log('notification');
	    console.log(data);
	   
	    var parse_data = JSON.parse(data);
	    var html = getTemplate('notify-html',parse_data);
	    notify('success1', html, 'bottom-right', true);	
	    
	    /*console.log(parse_data);
	    for(var i=0;i<parse_data.contacts.length;i++)
	    {
	   // var email = getPropertyValue(parse_data.contacts[i].properties, "email");
	    console.log(parse_data.contacts[i]);
	    var html = getTemplate('notify-html',parse_data.contacts[i]);
	    notify('success1', html, 'bottom-right', true);	
	    }
	    //fetchContactAndNotify(email);*/
	
	    });	
}

function fetchContactAndNotify(email)
{
	
	 // Get Contact by email address
	var contact_model = Backbone.Model.extend({
		  url: function() {
		    return '/core/api/contacts/search/email/' + encodeURIComponent(email);
		  }
		});
	
	var model = new contact_model();
	model.fetch({ success: function(data) 
		{
			console.log(data);
			console.log(data.toJSON());
			
			var id = data.id;
			if(!id)
				return;
			
		var html = getTemplate('notify-html', data.toJSON());
		
		  // Show picture, name, title, company
		//JSON.stringify(data.toJSON())
	    notify('success1', html, 'bottom-right', true);	
	}});
	
}

function _cancelSockets()
{
	socket.disconnect();
}

function notify(type, message, position, closable)
{	
	head.js('lib/bootstrap-notifications-min.js', function(){
		 $('.' + position).notify({
				type: type,
				message: {html: message},
				closable: closable,
				fadeOut: { enabled: true, delay: 10000000 },
				transition: 'fade'
			}).show();
	});
}

$(function(){
	setTimeout(downloadAndRegisterForNotifications, 2000);
	
	//fetchContactAndNotify('manohar@invox.com');
	
});


function showNoty(type, message, position)
{
	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', 'lib/noty/layouts/top.js', LIB_PATH + 'lib/noty/themes/default.js',
       		function(){
		     noty({
		    			 text: message,
		    			 layout: position,
		    			 type: type
		    	});
	   });
}