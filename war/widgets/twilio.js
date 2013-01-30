$(function() {

	// Plugin name as a global variable
	Twilio_PLUGIN_NAME = "Twilio";
	Twilio_PLUGIN_HEADER = '<div></div>'

	var plugin = agile_crm_get_plugin(Twilio_PLUGIN_NAME);
	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = plugin.prefs;

	// If not found - considering first time usage of widget, setupTwilioOAuth
	// called
	if (plugin_prefs == undefined) {
		setupTwilioOAuth(plugin_id);
		return;
	}
	$.post("/core/api/widgets/twilio", JSON.parse(plugin_prefs), function(data){
		console.log("generated token : " + data);
		setUpTwilio(data);
	})

	// Gets Contact properties for this widget, based on plugin name (using
	// Third party script API)
	var Twilio_id = agile_crm_get_widget_property_from_contact(Twilio_PLUGIN_NAME);

});

/**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 */
function setupTwilioOAuth(plugin_id) {
	
	// Shows an input filed to save the the prefs (api key provided by Twilio)
	$('#Twilio')
			.html(
					Twilio_PLUGIN_HEADER
							+ '<div><p>Stay connected to your users with Twilio phone numbers in 40 countries all over the globe. To access </p> <p><label><b>Enter Your API key</b></label>'
							+ '<input type="text" id="Twilio_api_key" class="input-medium required" placeholder="API Key" value=""></input></p><p><label><b>Enter Your SID key</b></label>'
							+ '<input type="text" id="Twilio_sid_key" class="input-medium required" placeholder="SID Key" value=""></input></p>'
							+ '<button id="save_api_key" class="btn"><a href="#">Save</a></button><br/>'
							+ '</div>');

	// Saves the api key
	$('#save_api_key').die().live('click', function(e) {
		e.preventDefault();
		var api_key = $("#Twilio_api_key").val();
		var sid_key = $("#Twilio_sid_key").val();
		
		console.log(api_key);
		// If input field is empty return
		if(api_key == "" || sid_key == "")
			return;
		
		var prefs = {};
		prefs["token"] = sid_key;
		prefs["secret"] = api_key;
		
		// api_key = "f3e71aadbbc564750d2057612a775ec6";
		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, JSON.stringify(prefs));
		
	});
}

function setUpTwilio(data){
	
	if(!data)
		return;
	
	 $('#Twilio').html('<p><img src=\"img/1-0.gif\"></img></p>');
	 
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function(){
		  //$(document).ready(function () {
			  
			  
	$("#Twilio").html('<button class="btn" id="twilio_call">Call</button>');
	$("#Twilio").append('<button class="btn" id="hangup">Hangup</button>');
	
	Twilio.Device.setup(data);
	
	$("#twilio_call").live("click", function(e){
		e.preventDefault();
		
		var phone = agile_crm_get_contact_property("phone");
		
		if(!phone)
			{
				$('#Twilio').html('Please add contact number');
				return;
			}
		
		 var connection = Twilio.Device.connect({
			 phone_number:phone
	        });
	})
	

    Twilio.Device.ready(function() {
      console.log("ready");
    });

    Twilio.Device.offline(function() {
        // Called on network connection lost.
    	console.log("went offline");
    });

    Twilio.Device.incoming(function(conn) {
        console.log(conn.parameters.From); // who is calling
        console.log(conn._status);
        conn.status // => "pending"
        //conn.accept();
        conn.status // => "connecting"
    });

    Twilio.Device.cancel(function(conn) {
        console.log(conn.parameters.From); // who canceled the call
        conn.status // => "closed"
    });

    Twilio.Device.connect(function (conn) {
    	console.log("call is connected");
        // Called for all new connections
        console.log(conn);
        console.log(conn._status);
    });

    Twilio.Device.disconnect(function (conn) {
    	console.log("call is disconnected");
        // Called for all disconnections
        console.log(conn._status);
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
    });



    $("#hangup").click(function() {
    	console.log("disconnected");
        Twilio.Device.disconnectAll();
    });
    
		});
	//});

	
	
}
