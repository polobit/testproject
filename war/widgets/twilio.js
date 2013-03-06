$(function() {

	// Plugin name as a global variable
	Twilio_PLUGIN_NAME = "Twilio";
	Twilio_PLUGIN_HEADER = '<div></div>'

	var numbers = agile_crm_get_contact_properties_list("phone");
	console.log(numbers);
	
	if(numbers.length == 0)
		{
			$("#Twilio").html("<p>No contact number associated with this contact</p>");
			return;
		}
	
	var plugin = agile_crm_get_plugin(Twilio_PLUGIN_NAME);
	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = plugin.prefs;
	
	// If not found - considering first time usage of widget, setupTwilioOAuth
	// called
	/*if (plugin_prefs == undefined) {
		setupTwilioOAuth(plugin_id);
		return;
	}*/
	
	/*var prefs = JSON.parse(plugin_prefs);
	$.get("/core/api/widgets/twilio/"+prefs.token,  function(data){
		console.log("generated token : " + data);
		setUpTwilio(data);
	})*/

	setUpTwilio("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBQzdkNTVhMDFhNjQwNDBiMTk2ODBjMTA2ZDk5NmRjOWNlIiwiZXhwIjoiMTM1OTcxODU0NiIsInNjb3BlIjoic2NvcGU6Y2xpZW50OmluY29taW5nP2NsaWVudE5hbWU9dGVqdSBzY29wZTpjbGllbnQ6b3V0Z29pbmc_YXBwU2lkPUNOZjYzYmNhMDM1NDE0YmUxMjFkNTE3YTExNjA2NmE1ZjgmY2xpZW50TmFtZT10ZWp1In0.Vr1iLBOWvXS0TjUqlYyrDDnovfuVCcbcdDHNUI1Qig4", numbers);

});

/**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 */
function setupTwilioOAuth(plugin_id) {	

	 $('#Twilio').html('<p>Stay connected to your users with Twilio phone numbers in 40 countries all over the globe. </p><a id="twilio-connect-button" href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state=' + encodeURIComponent(window.location.href) + '" style="margin-bottom: 10px;"></a>');	
				
}

function addCallNote(start, end, status)
{
	if(status == "outgoing")
	{
		agile_crm_add_note("Outgoing call", "Call started at " + new Date(start) + " \r\nCall ended at " + new Date(end));

		return;
	}
	if(status == "incoming")
	{
		agile_crm_add_note("Incoming call", "Call started at " + new Date(start) + " \r\nCall ended at " + new Date(end));
		return;
	}
	
}

function setUpTwilio(data, numbers){
	
	
	 $('#Twilio').html('<p><img src=\"img/1-0.gif\"></img></p>');

	 var start_time;
	 var end_time;
	 var status;
	 
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function(){
		  			  
			
		
		
		Twilio.Device.setup(data);
		
		
		$("#twilio_call").die().live("click", function(e){
			
			e.preventDefault();
			console.log($('#contact_number').val());
			var phone = $('#contact_number').val();
			
			 Twilio.Device.connect({
				 phone_number:phone
		        });
		})
		
	
	    Twilio.Device.ready(function() {
	      console.log("ready");
	      $("#Twilio").html(getTemplate("twilio-profile", numbers));
	      $("#twilio_call").show();
	    });
	
		
	    Twilio.Device.offline(function() {
	        // Called on network connection lost.
	    	console.log("went offline");
	    });
	
	    Twilio.Device.incoming(function(conn) {
	        console.log(conn.parameters.From); // who is calling
	        console.log(conn._status);
	        conn.status // => "pending"
	        conn.accept();
	        conn.status // => "connecting"
	        
	        if(conn._status == "open")
	        {
	        	start_time = new Date().getTime();
	        	status = "incoming";
	        	console.log(start_time + "incoming started");
	        	$("#twilio_hangup").show();
	        	$("#twilio_call").hide();
	        }
	        
	    });
	
	    Twilio.Device.cancel(function(conn) {
	        console.log(conn.parameters.From); // who canceled the call
	        conn.status // => "closed"
	        $("#twilio_hangup").hide();
	        $("#twilio_call").show();
	        
	    });
	
	    Twilio.Device.connect(function (conn) {
	    	console.log("call is connected");
	        // Called for all new connections
	        console.log(conn);
	        console.log(conn._status);
	        
	        if(conn._status == "open")
	        {
	        	start_time = new Date().getTime();
	        	status = "outgoing";
	        	console.log(start_time + "outgoing started");
	        	$("#twilio_hangup").show();
	        	$("#twilio_call").hide();
	        }
	    });
	
	    Twilio.Device.disconnect(function (conn) {
	    	console.log("call is disconnected");
	        // Called for all disconnections
	        console.log(conn._status);
	        if(conn._status == "closed")
	        {
	        	end_time = new Date().getTime();
	        	console.log(end_time + "ended");
	        	addCallNote(start_time,end_time,status);
	        	$("#twilio_hangup").hide();
	        	$("#twilio_call").show();
	        }
	        
	    });
	
	    Twilio.Device.presence(function (presenceEvent) {
	        // Called for each available client when this device becomes ready
	        // and every time another client's availability changes.
	        presenceEvent.from // => name of client whose availablity changed
	        presenceEvent.available // => true or false
	    });
	
	    Twilio.Device.error(function (e) {
	    	console.log("error");
	        console.log(e);
	        $("#twilio_hangup").hide();
	    });
	
	
	
	    $("#twilio_hangup").die().live('click', function(e) {
	    	e.preventDefault();
	    	console.log("disconnected");
	        Twilio.Device.disconnectAll();
	        $("#twilio_hangup").hide();
	        $("#twilio_call").show();
	    });
    
		
	});

	
	
}
