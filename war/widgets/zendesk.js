/**
 * ===rapleaf.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party javascript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API). Rapleaf 
 * fetches information based on the email
 */
$(function() {

	// Plugin name as a global variable
	ZENDESK_PLUGIN_NAME = "Zendesk";
	ZENDESK_PLUGIN_HEADER = '<div></div>';

	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = agile_crm_get_plugin(ZENDESK_PLUGIN_NAME).id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = agile_crm_get_plugin_prefs(ZENDESK_PLUGIN_NAME);

	// If not found - considering first time usage of widget, setupRapleafOAuth
	// called
	if (plugin_prefs == undefined) {
		setupZendeskOAuth(plugin_id);
		return;
	}
	console.log("in zendesk " + agile_crm_get_contact_property('email'));
	showTicketsFromZendesk(plugin_id,agile_crm_get_contact_property('email'));

	$('#add_ticket').die().live('click', function(e) {
		addTicketToZendesk(plugin_id,agile_crm_get_contact_property('email'));
	});
	
	$('#update_ticket').die().live('click', function(e) {
		updateTicketInZendesk(plugin_id);
	});

});


/**
 * Shows setup if user adds rapleaf widget for the first time, to set up
 * connection to rapleaf account. Enter and api key provided by Rapleaf access
 * functionalities
 * 
 * @param plugin_id
 */
function setupZendeskOAuth(plugin_id) {
	
	// Shows an input filed to save the the prefs (api key provided by rapleaf)
	$('#Zendesk').html(getTemplate('zendesk-login'));

	$('#save_prefs').die().live('click', function(e) {
		e.preventDefault();
		
		var zendesk_prefs = {};
		zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
		zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
		zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();
		
		if(!isValidForm($("#zendesk_login_form"))){
	    	return;
	    }	
		
		agile_crm_save_widget_prefs(ZENDESK_PLUGIN_NAME, JSON.stringify(zendesk_prefs));		
		showTicketsFromZendesk(plugin_id,agile_crm_get_contact_property('email'));
		
	});
}

function showTicketsFromZendesk(plugin_id,email){
	
	console.log('in show');
			$.get("/core/api/widgets/zendesk/get/" + plugin_id + "/" + email, function (data) {
				/*var result = data.substring(data.indexOf("id")).split("<br/><br/>");
	
				var array = [];
				$.each(result, function(index, value){
					result[index] ="{" + result[index].split("<br/>").join(",") + "}";
					
				});
				
				console.log(result);
				console.log(JSON.parse(result.toString()));*/
			
				var json = {};
				json['info'] = data;
				console.log(json);
				
				$('#Zendesk').html(getTemplate('zendesk-profile',json));				
						
			}).error(function(data){
	       		alert("error");
	       	}); 
			
}

function addTicketToZendesk(plugin_id,email){
	//zendesk/add/{widget-id}
	
	var json = {};
	json["headline"] = "Add Ticket";
	json["info"] = "Adds ticket in your Zendesk account associated with Agile CRM";
	json["email"] =  agile_crm_get_contact_property('email');
	
	$('#zendesk_messageModal').remove();
	var message_form_modal = getTemplate("zendesk-message", json);

		$('#content').append(message_form_modal);
		$('#zendesk_messageModal').modal("show");
		
		$('#send_request').click( function(e) {
			e.preventDefault();
		    
			if(!isValidForm($("#zendesk_messageForm"))){
		    	return;
		    }
			
			var data = {};
			data = $('#zendesk_messageForm').serialize();
			
			$.post("/core/api/widgets/zendesk/add/" + plugin_id , data,function (data1) {
				console.log(data1);
				$('#zendesk_messageModal').find('span.save-status').html("sent");
				
				setTimeout(function(){ 
					$('#zendesk_messageModal').modal("hide");
				}, 2000);
			}).error(function(data) { 
       			$('#zendesk_messageModal').remove();
        		alert(data.responseText); 
        	}); 
		});
	
}

function updateTicketInZendesk(plugin_id){
	
	var json = {};
	json["headline"] = "Update Ticket";
	json["info"] = "Updates ticket in your Zendesk account associated with Agile CRM";
	
	
	$('#zendesk_messageModal').remove();
	var message_form_modal = getTemplate("zendesk-message", json);

		$('#content').append(message_form_modal);
		$('#zendesk_messageModal').modal("show");
		
		$('#send_request').click( function(e) {
			e.preventDefault();
		    
			if(!isValidForm($("#zendesk_messageForm"))){
		    	return;
		    }
			
			var data = {};
			data = $('#zendesk_messageForm').serialize();
			console.log(data);
			$.post("/core/api/widgets/zendesk/update/" + plugin_id , data,function (data1) {
				console.log(data1);
				$('#zendesk_messageModal').find('span.save-status').html("sent");
				
				setTimeout(function(){ 
					$('#zendesk_messageModal').modal("hide");
				}, 2000);
			}).error(function(data) { 
       			$('#zendesk_messageModal').remove();
        		alert(data.responseText); 
        	}); 
		});
}