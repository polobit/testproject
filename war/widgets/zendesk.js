/**
 * ===zendesk.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API). 
 */
$(function ()
{
    // Plugin name as a global variable
    ZENDESK_PLUGIN_NAME = "Zendesk";

    // Stripe profile loading image declared as global
    ZENDESK_PROFILE_LOAD_IMAGE = '<center><img id="zendesk_profile_load" ' +
        'src=\"img/1-0.gif\" style="margin-bottom: 10px;margin-right: 16px;" >' +
        '</img></center>';

    AgentInfo = null;
       
    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(ZENDESK_PLUGIN_NAME).id;


    // Gets plugin preferences, required to check whether to show setup button or 
    // to fetch details
    var plugin_prefs = agile_crm_get_plugin_prefs(ZENDESK_PLUGIN_NAME);

    // Stores email of the contact as global variable
    Email = agile_crm_get_contact_property('email');
    
    // If not found - considering first time usage of widget, setupZendeskOAuth
    // called
    if (plugin_prefs == undefined)
    {        
        setupZendeskOAuth(plugin_id);
        return;
    }  

    // Checks if contact has email, if undefined shows message in Zendesk panel
    if (!Email)
    {
        $('#Zendesk').html('<div class="widget_content" style="border-bottom:none;padding: 10px;' +
            'line-height:160%;">No email is associated with this contact</div>');
        return;
    }

    // If defined, shows tickets from Zendesk if any with that email
    // showTicketsFromZendesk(plugin_id, Email);
    showZendeskProfile(plugin_id, Email)
    
    // On click of add ticket, add ticket method is called
    $('#add_ticket').die().live('click', function (e)
    {
    	e.preventDefault();
        addTicketToZendesk(plugin_id, Email);
        
    });

});


/**
 * Shows setup if user adds Zendesk widget for the first time. Uses ScribeServlet 
 * to create a client and get preferences and save it to the widget.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupZendeskOAuth(plugin_id)
{

    // Shows loading image until set up is shown 
    $('#Zendesk').html(ZENDESK_PROFILE_LOAD_IMAGE);

    // Shows input fields to save the zendesk preferences
    $('#Zendesk').html(getTemplate('zendesk-login', {}));

    // On click of save button 
    $('#save_prefs').die().live('click', function (e)
    {
        e.preventDefault();
        console.log($(this).length);
        console.log($(this).parents("form#zendesk_login_form").length);
        console.log($("#zendesk_login_form", $('#Zendesk')).length);
        // Checks whether all input fields are given
        if (!isValidForm($("#zendesk_login_form")))
        {
            return;
        }

        // Store the data given by the user as JSON 
        var zendesk_prefs = {};
        zendesk_prefs["zendesk_username"] = $("#zendesk_username").val();
        zendesk_prefs["zendesk_password"] = $("#zendesk_password").val();
        zendesk_prefs["zendesk_url"] = $("#zendesk_url").val();

        // Saves the preferences into widget with zendesk plugin name
        agile_crm_save_widget_prefs(ZENDESK_PLUGIN_NAME,
        JSON.stringify(zendesk_prefs), function (data)
        {
        	// Checks if contact has email, if undefined shows message in Zendesk panel
            if (!Email)
            {
                $('#Zendesk').html('<div class="widget_content" style="border-bottom:none;padding: 10px;' +
                    'line-height:160%;">No email is associated with this contact</div>');
                return;
            }
            
            // Show tickets method called to show tickets after saving preferences
            // showTicketsFromZendesk(plugin_id, Email);
            
            showZendeskProfile(plugin_id, Email);
        });

    })
}

/**
 * Shows tickets from Zendesk matching with the given email
 *  
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 * @param email
 * 			Email of the contact to get the tickets
 */
function showTicketsFromZendesk(plugin_id, email)
{
    // Shows loading until tickets are shown
    $('#Zendesk').html(ZENDESK_PROFILE_LOAD_IMAGE);

    // Sends request to the URL "/core/api/widgets/zendesk/get/" with plugin id and 
    // email as path parameters and calls WidgetsAPI class
    $.get("/core/api/widgets/zendesk/get/" + plugin_id + "/" + email,

    function (data)
    {
        try
        {
            // populates template with data to show tickets
            $('#Zendesk').html(getTemplate('zendesk-ticket_stream', JSON.parse(data)));

        }
        catch (err)
        {
            // Else the error message is shown
            $('#Zendesk').html('<div style="padding: 10px;' +
                'word-wrap: break-word;">' + data + '</div>');
        }


    }).error(function (data)
    {
        // Error message is shown if error occurs
        $('#Zendesk').html('<div style="padding: 10px;' +
            'word-wrap: break-word;">' + data + '</div>');
    });

}


/**
 * Adds a ticket in Zendesk with the contact email based on plugin id
 *  
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 * @param email
 * 			Email of the contact to add the ticket
 */
function addTicketToZendesk(plugin_id, email)
{
    // Stores info as JSON, to send it to the modal when add ticket request is made
    var json = {};

    // Set headline of modal window as Add Ticket
    json["headline"] = "Add Ticket";

    // Information to be shown in the modal to the user
    json["info"] = "Adds ticket to your Zendesk account associated with Agile CRM";

    // Name of the contact to be added to ticket
    json["name"] = agile_crm_get_contact_property('first_name') + " " +
        agile_crm_get_contact_property('last_name');

    // Email of the contact based on which ticket is added
    json["email"] = email;

    // Remove the modal if already exists
    $('#zendesk_messageModal').remove();

    // Populate the modal template with the above JSON details in the form 
    var message_form_modal = getTemplate("zendesk-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    // Shows the modal after filling with details
    $('#zendesk_messageModal').modal("show");

    // On click of send button in the modal, connect request is sent
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#zendesk_messageForm")))
        {
            return;
        }

        // Sends post request to url "core/api/widgets/zendesk/add" to call WidgetsAPI
        // with plugin id and LinkedIn id as path parameters and form as post data
        $.post("/core/api/widgets/zendesk/add/" + plugin_id,
        $('#zendesk_messageForm').serialize(),

        function (data)
        {
            // On success, shows the status as sent
            $('#zendesk_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#zendesk_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
            // If error occurs modal is removed and error message is shown in panel
            $('#zendesk_messageModal').remove();
            alert(data.responseText);
        });
    });
}

/**
 * Updates the ticket in Zendesk with the specified ticket id based on plugin id
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 * @param ticket_id
 * 			Id of the ticket to update it
 */
function updateTicketInZendesk(plugin_id, ticket_id)
{
    // Stores info as JSON, to send it to the modal when update ticket request is made
    var json = {};

    // Set headline of modal window as Update Ticket
    json["headline"] = "Update Ticket";

    // Information to be shown in the modal to the user
    json["info"] = "Updates Ticket No " + ticket_id +
        " in your Zendesk account associated with Agile CRM";

    // Id of the ticket to update it
    json["id"] = ticket_id;

    // Remove the modal if already exists
    $('#zendesk_messageModal').remove();

    // Populate the modal template with the above JSON details in the form 
    var message_form_modal = getTemplate("zendesk-message", json);

    // Append the form into the content
    $('#content').append(message_form_modal);

    // Shows the modal after filling with details
    $('#zendesk_messageModal').modal("show");

    // On click of send button in the modal, connect request is sent
    $('#send_request').click(function (e)
    {
        e.preventDefault();

        // Checks whether all the input fields are filled
        if (!isValidForm($("#zendesk_messageForm")))
        {
            return;
        }

        // Sends post request to url "core/api/widgets/zendesk/update" to call WidgetsAPI
        // with plugin id and LinkedIn id as path parameters and form as post data
        $.post("/core/api/widgets/zendesk/update/" + plugin_id,
        $('#zendesk_messageForm').serialize(),

        function (data1)
        {
            // On success, shows the status as sent
            $('#zendesk_messageModal').find('span.save-status').html("sent");

            // Hides the modal after 2 seconds after the sent is shown
            setTimeout(function ()
            {
                $('#zendesk_messageModal').modal("hide");
            }, 2000);

        }).error(function (data)
        {
            // If error occurs modal is removed and error message is shown in panel
            $('#zendesk_messageModal').remove();
            alert(data.responseText);
        });
    });
}

/**
 * Shows ticket from tickets data retrieved from zendesk based on ticket id
 * 
 * @param tickets_data
 * 			Tickets retrieved from Zendesk  
 * @param ticket_id
 * 			Id of the ticket to be shown
 */
function showTicketById(json, ticket_id)
{
    // Sets headline of modal as Ticket TicketId
    json["headline"] = "Ticket " + ticket_id;

    // If length of decription of ticket is stored as boolean to check in handlebars 
    // if more, scroll bar is shown for description
    json["desc_len"] = json['description'].length > 200;

    // Remove the modal if already exists
    $('#zendesk_showModal').remove();

    // Append the form into the content
    $('#content').append(getTemplate("zendesk-ticket-show", json));

    // Shows the modal after filling with details
    $('#zendesk_showModal').modal("show");
}

function getTicketByStatus(plugin_id, email, status, callback)
{
	$.get("/core/api/widgets/zendesk/ticket/status/" + plugin_id + "/" + email + "/" + status, 
	function(data) 
	{
		console.log(data);
		
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
	    {
			callback(data);
	    }
				
	});
}

function showZendeskProfile(plugin_id, email)
{
	$.getJSON("/core/api/widgets/zendesk/profile/" + plugin_id + "/" + email,
	function (data)
	{
		 $('#Zendesk').html(getTemplate('zendesk-profile', data));

		 var open_tickets;
		 var solved_tickets;
		 var closed_tickets;
		 try
		 {
			 open_tickets = JSON.parse(data.open_tickets);
		 }
		 catch (err)
	     {
			 open_tickets = data.open_tickets;
	     }
		 
		 var open_tickets_template = $(getTemplate('zendesk-ticket-stream', open_tickets));	
		 
		 $('#open_tickets_panel').html(open_tickets_template);	
		 
		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
      		$(".time-ago", open_tickets_template).timeago();
      	  });
		  
	     
	     $('#solved_tickets').die().live('click', function (e)
	     {
	         e.preventDefault();
	         
	         getTicketByStatus(plugin_id, email, "solved", function(data){
	        	 
	        	 try
	    		 {
	        		 solved_tickets = JSON.parse(data);
	    		 }
	    		 catch (err)
	    	     {
	    			 solved_tickets = data;
	    	     }	    		 
	    		 
	    		 var solved_tickets_template = $(getTemplate('zendesk-ticket-stream', solved_tickets));	
	    		 
	    		 $('#solved_tickets_panel').html(solved_tickets_template);	
	    		 
	    		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	          		$(".time-ago", solved_tickets_template).timeago();
	          	  });
	    		  
	         });
	     });
	     
	     $('#closed_tickets').die().live('click', function (e)
	     {
	    	 e.preventDefault();
	         
	         getTicketByStatus(plugin_id, email, "closed", function(data){
	    		 console.log('in zendesk');

	        	 console.log(data);
	        	 try
	    		 {
	        		 closed_tickets = JSON.parse(data);
	    		 }
	    		 catch (err)
	    	     {
	    			 closed_tickets = data;
	    	     }
	    		 
	    		 var closed_tickets_template = $(getTemplate('zendesk-ticket-stream', closed_tickets));
	    		 
	    		 $('#closed_tickets_panel').html(closed_tickets_template);	
	    		 
	    		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	          		$(".time-ago", closed_tickets_template).timeago();
	          	  });	          	
	         });
	    
	     });
	     
	     // On click of update ticket link for ticket, update ticket method is called
	     $('#ticket_update').die().live('click', function (e)
	     {
	         e.preventDefault();

	         // Id of the ticket is retrieved to update ticket based on id
	         var ticket_id = $(this).attr('update_id');
	         updateTicketInZendesk(plugin_id, ticket_id);
	     });

         // On click of show ticket, show ticket by ticket id method is called
	     $('#ticket_show').die().live('click', function (e)
	     {
	         e.preventDefault();

	         console.log($(this).attr('data-attr'));
	         var json = JSON.parse($(this).attr('data-attr'));
	         
	         // Id of the ticket is retrieved to show ticket based on id
	         var ticket_id = $(this).attr('ticket_id');

	         showTicketById(json, ticket_id);
	     });

		 
	}).error(function(data) {
        // Else the error message is shown
        $('#Zendesk').html('<div style="padding: 10px;' +
            'word-wrap: break-word;">' + data + '</div>');
	});
	
}