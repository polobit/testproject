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
	
	var tickets_data = {};

	// If not found - considering first time usage of widget, setupRapleafOAuth
	// called
	if (plugin_prefs == undefined) {
		setupZendeskOAuth(plugin_id);
		return;
	}
	console.log("in zendesk " + agile_crm_get_contact_property('email'));
	
	if(!agile_crm_get_contact_property('email')){
		$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;">No email is associated with this contact</div>');
		return;
	}
	
	showTicketsFromZendesk(plugin_id,agile_crm_get_contact_property('email'));

	$('#add_ticket').die().live('click', function(e) {
		addTicketToZendesk(plugin_id,agile_crm_get_contact_property('email'));
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
	$('#Zendesk').html(LOADING_HTML);
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
		agile_crm_save_widget_property_to_contact("test", "test");
		//showTicketsFromZendesk(plugin_id,agile_crm_get_contact_property('email'));
		
	}).error(function(data){
		$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data.responseText + '</p></div>');
   	}); 
}

function showTicketsFromZendesk(plugin_id,email){
	$('#Zendesk').html(LOADING_HTML);
	console.log('in show');
			$.get("/core/api/widgets/zendesk/get/" + plugin_id + "/" + email, function (data) {
								
				try
				{					
					$('#Zendesk').html(getTemplate('zendesk-profile', JSON.parse(data)));
									
				}catch(err)
				{					
					if(data == "There are no tickets for this user")
						{
							$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data +
									'</p><a class="btn btn-mini btn-primary" id="add_ticket" style="font-size:13px;">'+
									'Add Ticket</a></div>');
							return;
						}
					
					$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data + '</p></div>');
				}
				
				tickets_data = JSON.parse(data);
			
				$('#ticket_update').die().live('click', function(e) {
					e.preventDefault();
					updateTicketInZendesk(plugin_id,this);
				});

				$('#ticket_show').die().live('click', function(e) {
					e.preventDefault();
					showTicketById(tickets_data, this);
				});
				
			}).error(function(data){
				$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data + '</p></div>');
	       	}); 
			
}

function addTicketToZendesk(plugin_id,email){
	
	var json = {};
	json["headline"] = "Add Ticket";
	json["info"] = "Adds ticket to your Zendesk account associated with Agile CRM";
	json["name"] = agile_crm_get_contact_property('first_name')+" "+ agile_crm_get_contact_property('last_name');
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
				$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data.responseText + '</p></div>');
        		
        	}); 
		});
	
}

function updateTicketInZendesk(plugin_id,element){
	
	var json = {};
	json["headline"] = "Update Ticket";
	json["info"] = "Updates Ticket No "+ $(element).attr('update_id') + " in your Zendesk account associated with Agile CRM";
	json["id"] = $(element).attr('update_id');
	
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
				$('#Zendesk').html('<div style="margin: 0px 2px 10px 2px;word-wrap: break-word;"><p>'+ data.responseText + '</p></div>');
        	}); 
		});
}

function showTicketById(tickets_data, element){
	
	var json = {};
	$('#zendesk_showModal').remove();
	var find_id = $(element).attr('ticket_id');					
	json = getTicketById(find_id, tickets_data);
	json["headline"] = "Ticket " + find_id;		
	json["desc_len"] = json['description'].length > 200;
	console.log(json["desc_len"]);
	
	$('#content').append(getTemplate("zendesk-ticket-show", json));
	$('#zendesk_showModal').modal("show");
}

function getTicketById(ticket_id, data){
	
	for(var i = 0; i < data.length; i++){
		if(ticket_id == data[i].id)
		{
			console.log(data[i]);
			return data[i];
			
		}
	}
	
}