$(function() {

	// Plugin name as a global variable
	Twilio_PLUGIN_NAME = "Twilio";
	Twilio_PLUGIN_HEADER = '<div></div>'

	var numbers = agile_crm_get_contact_properties_list("phone");
	console.log(numbers);
	
	var plugin = agile_crm_get_plugin(Twilio_PLUGIN_NAME);
	
	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = plugin.prefs;
	
	// If not found - considering first time usage, setupTwilioOAuth called
	if (plugin_prefs == undefined) {
		setUpTwilio(plugin_id);
		return;
	}
	
	if(numbers.length == 0)
	 {
	  $("#Twilio").html("<div style='padding: 10px;line-height:160%;'>" +
	    "No contact number is associated with this contact</div>");
	        return;
	 }
	
	getTwilioLogs(plugin_id);
	
	$('#save_twilio_token').die().live('click', function(e) {
		
		e.preventDefault();
		
		var prefs={};
		prefs["account_sid"] = $("#twilio_account_sid").val();
		prefs["token"] = $("#twilio_auth_token").val();
			
		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, JSON.stringify(prefs));
		getTwilioLogs(plugin_id);
		
	});
	
});



function setUpTwilio(plugin_id)
{
	$("#Twilio").html('<div class="widget_content" style="border-bottom:none">'
			+ '<p style="padding:5px;"><label><b>Enter Your Account Sid</b></label>'
			+ '<input type="text" id="twilio_account_sid" class="input-medium required" placeholder="Account sid" value=""></input></p>'
			+ '<p style="padding:5px;"><label><b>Enter Your Auth Token</b></label>'
			+ '<input type="text" id="twilio_auth_token" class="input-medium required" placeholder="Auth token" value=""></input></p>'
			+ '<button id="save_twilio_token" class="btn" style="margin-left:5px;"><a href="#">Save</a></button><br/></div>');

}

function getTwilioLogs(plugin_id)
{
	$.get("/core/api/widgets/twilio/call/logs/" + plugin_id, function (data) {
		
		console.log(data);
		
	});
}

function makeCall(plugin_id, from, to, url)
{
	var json = {};
	json["from"] = from;
	json["to"] = to;
	json["url"] = url;
	
	$.post("/core/api/widgets/twilio/call/" + plugin_id, json, function (data) {
		
		console.log(data);
		
	});
}


/**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 */
/*function setupTwilioOAuth(plugin_id) {	

	 $('#Twilio').html('<p class="widget_content" style="border-bottom:none">' 
			 + 'Stay connected to your users with Twilio phone numbers in 40 countries ' 
			 + 'all over the globe. </p><a id="twilio-connect-button" ' 
			 + 'href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state=' 
			 + encodeURIComponent(window.location.href) + '" style="margin-bottom: 10px;"></a>');	
				
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
			
		      $.get("/TwilioCallServlet?From=14105551234&To=" + phone + "&Body=hi", function(data){
		             console.log('in');
		             console.log(data);
		            }).error(function(data){
		             console.log('error' + data);
		            });
			
			
			 $.get("/backend/voice?PhoneNumber=" + phone , function(data){
	             console.log('in');
	             console.log(data);
	            });
			
				Twilio.Device.connect({
				 From: "+919491544841",
				 To: phone,
			     url: "http://agile-crm-cloud.appspot.com/backend/voice?PhoneNumber="+phone
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
*/
