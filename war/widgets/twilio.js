/*$(function() {

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
	
	// If not found - considering first time usage of widget, setupTwilioOAuth
	// called
	if (plugin_prefs == undefined) {
		setupTwilioOAuth(plugin_id);
		return;
	}
	
	if(numbers.length == 0)
	 {
	  $("#Twilio").html("<div style='padding: 0px 5px 7px 5px;line-height:160%;'>" +
	    "No contact number is associated with this contact</div>");
	        return;
	 }
	
	var prefs = JSON.parse(plugin_prefs);
	console.log(prefs);

    if(!prefs.app_sid)
    {
    	console.log(prefs.token);
    	$.get("/core/api/widgets/twilio/appsid/" + prefs.token, function(data) {
    		
    		prefs['app_sid'] = data;
    		console.log(prefs);
    		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME,JSON.stringify(prefs));
    		
    		$.get("/core/api/widgets/twilio/accountsid/"+ prefs.token + "/" + data,  function(data){
    			console.log("generated token : " + data);
    			setUpTwilio(data, numbers, prefs);
    			return;
    	    });

    	});
    }
	
    $.get("/core/api/widgets/twilio/accountsid/"+ prefs.token + "/" + prefs.app_sid,  function(data){
		console.log("generated token : " + data);
		setUpTwilio(data, numbers, prefs);
		return;
    });
	
	//setUpTwilio("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBQzc5YmQwYTNkYTZiMjk5NDlmMGRhYjZmYzUyMjFkNWZiIiwiZXhwIjoiMTM2NzQ4OTM1MSIsInNjb3BlIjoic2NvcGU6Y2xpZW50Om91dGdvaW5nP2FwcFNpZD1BUDUxMWFkMmQzOGRhZTk2YzZhMjlhOWQ3NDdkYjViZTQ2In0.j0OiOWr6iELZzDKNzwulwB28wDGaQuxq_EU-5Of0w0c", numbers);

});

*//**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 *//*
function setupTwilioOAuth(plugin_id) {	

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

function setUpTwilio(data, numbers, prefs){
	
	
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
			//var from = "+15109008283";
			var from = "+14076411220";
				
			Twilio.Device.connect({
					
				 //From: from,
				//To: phone,
				from:from,
				PhoneNumber:phone,
			     Url:"https://teju-first.appspot.com/twilio/voice"
		        });
		});
		
		$("#twilio_verify").die().live("click", function(e){
		
			e.preventDefault();
			var from = $('#twilio_from').val();
			console.log(from);
			getOutgoingNumbers(prefs.token, from, function(data) {
				
				var result = JSON.parse(data);
				
				if(result.validation_code)
					$('#Twilio').html('<div class="widget_content">' + 
							'Enter this number after receiving a call to verify your number ' + 
							result.validation_code + ' </div>');
				
				$('#Twilio').html('done');
				
				
			});
			
			
		});
	
	    Twilio.Device.ready(function() {
	      console.log("ready");
	      $("#Twilio").html(getTemplate("twilio-initial", {}));
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
	        	//addCallNote(start_time,end_time,status);
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

/*function setUpTwilioAuth(plugin_id)
{
	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);
	
	$("#Twilio").html('<div class="widget_content" style="border-bottom:none">'
			+ '<p style="padding:5px;"><label><b>Enter Your Account Sid</b></label>'
			+ '<input type="text" id="twilio_account_sid" class="input-medium required" placeholder="Account sid" value=""></input></p>'
			+ '<p style="padding:5px;"><label><b>Enter Your Auth Token</b></label>'
			+ '<input type="text" id="twilio_auth_token" class="input-medium required" placeholder="Auth token" value=""></input></p>'
			+ '<button id="save_twilio_token" class="btn" style="margin-left:5px;"><a href="#">Save</a></button><br/></div>');

	$('#save_twilio_token').die().live('click', function(e) {
		
		e.preventDefault();
		console.log('in');
		
		var prefs={};
		prefs["account_sid"] = $("#twilio_account_sid").val();
		prefs["auth_token"] = $("#twilio_auth_token").val();
		
		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME, JSON.stringify(prefs), function(data) {
			
			generateTwilioToken(plugin_id);
			
		});
	});
}*/


$(function() {

	// Plugin name as a global variable
	Twilio_PLUGIN_NAME = "Twilio";
	Twilio_PLUGIN_HEADER = '<div></div>'

    // Twilio update loading image declared as global
	TWILIO_LOGS_LOAD_IMAGE = '<center><img id="logs_load" src=\"img/ajax-loader-cursor.gif\" ' + 
					'style="margin-top: 10px;margin-bottom: 14px;"></img></center>'

	    
	Numbers = agile_crm_get_contact_properties_list("phone");
	console.log(Numbers);
	
	var plugin = agile_crm_get_plugin(Twilio_PLUGIN_NAME);
	
	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = plugin.prefs;
	
	// If not found - considering first time usage, setupTwilioOAuth called
	if (plugin_prefs == undefined) {
		setupTwilioOAuth(plugin_id);
		return;
	}
	
	if(Numbers.length == 0)
	 {
	  $("#Twilio").html("<div style='padding: 10px;line-height:160%;'>" +
	    "No contact number is associated with this contact</div>");
	        return;
	 }
	
	var prefs = JSON.parse(plugin_prefs);
	console.log(prefs);
	
	generateTwilioToken(plugin_id, prefs);
	
});


/**
 * Shows setup if user adds Twilio widget for the first time, to set up
 * connection to Twilio account. Enter and api key provided by Twilio access
 * functionalities
 * 
 * @param plugin_id
 */
function setupTwilioOAuth(plugin_id) {	

	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);
	
	 $('#Twilio').html('<p class="widget_content" style="border-bottom:none">' 
			 + 'Stay connected to your users with Twilio phone numbers in 40 countries ' 
			 + 'all over the globe. </p><a id="twilio-connect-button" ' 
			 + 'href="https://www.twilio.com/authorize/CNf63bca035414be121d517a116066a5f8?state=' 
			 + encodeURIComponent(window.location.href) + '" style="margin-bottom: 10px;"></a>');	
				
}


function generateTwilioToken(plugin_id, prefs)
{
	if(prefs.account_sid)
	{				
		if(!prefs.app_sid)
	    {
	    	setUpApplication(plugin_id, prefs);
	    }
		else
		{
			$.get("/core/api/widgets/twilio/token/"+ plugin_id,  function(token) {
				console.log("generated token : " + token);
				setUpTwilio(token, plugin_id);
				showTwilioDetails(token, plugin_id);
				return;
		    });
		}
	}
}

function setUpApplication(plugin_id, prefs)
{
	$.get("/core/api/widgets/twilio/appsid/" + plugin_id , function(data) {
		
		prefs['app_sid'] = data;
		console.log(prefs);
		
		agile_crm_save_widget_prefs(Twilio_PLUGIN_NAME,JSON.stringify(prefs), function(data) {
			
			generateTwilioToken(plugin_id, prefs);

		});
	});
	
}

function showTwilioDetails(token, plugin_id)
{
	$('#Twilio').html(TWILIO_LOGS_LOAD_IMAGE);
	
	if(Numbers.length == 0)
	{
	  $("#Twilio").html("<div style='padding: 10px;line-height:160%;'>" +
	    "No contact number is associated with this contact</div>");
	        return;
	}

	var numbers = {};
	numbers['to'] = Numbers;
	
	//setUpTwilio(token, plugin_id);
	
	$('#Twilio').html(getTemplate('twilio-profile', numbers));
	
	getTwilioLogs(plugin_id, Numbers[0].value);
	
	$('#contact_number').die().live('change', function(e) {
		var to = $('#contact_number').val();
		
		getTwilioLogs(plugin_id, to);
	});
	
}

function getTwilioLogs(plugin_id, to, callback)
{
	$('#twilio-logs-panel').html(TWILIO_LOGS_LOAD_IMAGE);
	
	$.get("/core/api/widgets/twilio/call/logs/" + plugin_id + "/" + to, function (logs) {
		
		 console.log(logs);
		
		 var twilio_logs_template = $(getTemplate('twilio-logs', JSON.parse(logs)));
		 
		 $('#twilio-logs-panel').html(twilio_logs_template);	
		 
		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
     		$(".time-ago", twilio_logs_template).timeago();
     	  });
		  
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
		
	}).error(function(data) {
		
		$('#logs_load').remove();
		$('#twilio-logs-panel').html('<div style="padding:10px">' + data.responseText + '</div>');
	});
}


function getOutgoingNumbers(plugin_id, callback)
{
	$.get("/core/api/widgets/twilio/numbers/" + plugin_id, 
		function (data) {
		
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
		
	}).error( function (data) {
		
		$('#twilio_profile_load').remove();
		$('#Twilio').html('<div style="padding:10px">' + data.responseText + '</div>');
	});

}

function getIncomingNumbers(plugin_id, callback)
{
	$.get("/core/api/widgets/twilio/incoming/numbers/" + plugin_id, 
		function (data) {
		
		if (callback && typeof (callback) === "function")
		{
			callback(data);
		}
		
	},"json").error(function (data) {
		
		$('#twilio_profile_load').remove();
		$('#Twilio').html('<div style="padding:10px">' + data.responseText + '</div>');
	});

}

function setUpTwilio(token, plugin_id){
	
	 var start_time;
	 var end_time;
	 var status;
	 var from;
	 
	head.js("https://static.twilio.com/libs/twiliojs/1.1/twilio.min.js", function(){
		Twilio.Device.setup(token);
		
		Twilio.Device.ready(function() {
		      console.log("ready");
		      
				
				getIncomingNumbers(plugin_id, function (data) {
					
					from = data.PhoneNumber;
					console.log(from);
					$("#twilio_call").show();
				});
		      
		});
		
		$("#record_sound_play").die().live("click", function(e){
			e.preventDefault();
			var sound_url = "https://api.twilio.com" + $(this).attr("sound_url");
			console.log(sound_url);
			
			playSound(sound_url, "true");
		});
		
		$("#twilio_call").die().live("click", function(e){
			
			e.preventDefault();
			var phone = $('#contact_number').val();
			from= "+918121623734";
			Twilio.Device.connect({
				from:from,
				PhoneNumber:phone,
			    Url:"https://teju-first.appspot.com/twilio/voice"
		    });
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
	        	//addCallNote(start_time,end_time,status);
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
	        // 31205 error code
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