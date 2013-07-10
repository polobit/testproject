$(function ()
{
    // Plugin name as a global variable
    CLICKDESK_PLUGIN_NAME = "ClickDesk";
    
    // ClickDesk update loading image declared as global
    CLICKDESK_UPDATE_LOAD_IMAGE = '<center><img id="chats_load" src=' +
        '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

    Errorjson = {};
    console.log('in clikdesk');
       
    // Gets plugin id from plugin object, fetched using script API
    var plugin_id = agile_crm_get_plugin(CLICKDESK_PLUGIN_NAME).id;


    // Gets plugin preferences, required to check whether to show setup button or 
    // to fetch details
    var plugin_prefs = agile_crm_get_plugin_prefs(CLICKDESK_PLUGIN_NAME);

    
    $('#ClickDesk_plugin_delete').die().live('click', function (e) {
    	
    	e.preventDefault();
    	
    	agile_crm_save_widget_prefs(CLICKDESK_PLUGIN_NAME,
		        undefined , function (data)
        {
    		setupClickDeskAuth(plugin_id);
        });
    });
 
    // Stores email of the contact as global variable
    Email = agile_crm_get_contact_property('email');
    
    // If not found - considering first time usage of widget, setupClickDeskOAuth
    // called
    if (plugin_prefs == undefined)
    {        
        setupClickDeskAuth(plugin_id);
        return;
    }  

    // Checks if contact has email, if undefined shows message in ClickDesk panel
    if (!Email)
    {
    	clickDeskError("ClickDesk", "No email is associated with this contact");
        return;
    }
    
    // If defined, shows tickets from ClickDesk if any with that email
    // showTicketsFromClickDesk(plugin_id, Email);
    showClickDeskProfile(plugin_id, Email);

    $('.clickdesk_ticket_hover').live('mouseenter', function (e)
    {
        $(this).find('.clickdesk_ticket_tab_link').show();
    });

    $('.clickdesk_ticket_hover').live('mouseleave', function (e)
    {
        $('.clickdesk_ticket_tab_link').hide();
    });
    
    $('.clickdesk_chat_hover').live('mouseenter', function (e)
    {
    	$(this).find('.clickdesk_chat_tab_link').show();
    });

    $('.clickdesk_chat_hover').live('mouseleave', function (e)
    {
        $('.clickdesk_chat_tab_link').hide();
    });
    
});

/**
 * Shows setup if user adds ClickDesk widget for the first time. Uses ScribeServlet 
 * to create a client and get preferences and save it to the widget.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupClickDeskAuth(plugin_id)
{
    // Shows loading image until set up is shown 
    $('#ClickDesk').html(CLICKDESK_UPDATE_LOAD_IMAGE);

    console.log('ClickDesk auth');
    
    // Shows input fields to save the ClickDesk preferences
    $('#ClickDesk').html(getTemplate('clickdesk-login', {}));

    // On click of save button 
    $('#save_clickdesk_prefs').die().live('click', function (e)
    {
        e.preventDefault();
       
        // Checks whether all input fields are given
        if (!isValidForm($("#clickdesk_login_form")))
        {
            return;
        }

        // Store the data given by the user as JSON 
        var ClickDesk_prefs = {};
        ClickDesk_prefs["clickdesk_username"] = $("#clickdesk_username").val();
        ClickDesk_prefs["clickdesk_api_key"] = $("#clickdesk_api_key").val();

        // Saves the preferences into widget with ClickDesk plugin name
        agile_crm_save_widget_prefs(CLICKDESK_PLUGIN_NAME,
        JSON.stringify(ClickDesk_prefs), function (data)
        {
        	// Checks if contact has email, if undefined shows message in ClickDesk panel
            if (!Email)
            {
                clickDeskError("ClickDesk", "No email is associated with this contact");
                return;
            }
                    
            showClickDeskProfile(plugin_id, Email);
        });

    });
}

function showClickDeskProfile(plugin_id, Email)
{
	$('#ClickDesk').html(CLICKDESK_UPDATE_LOAD_IMAGE);
	
	var flag = false;
	queueGetRequest("widget_queue", "/core/api/widgets/clickdesk/chats/" + plugin_id + "/" + Email + "/0", "json",	
	function success(data)
	{
		 $('#ClickDesk').html(getTemplate('clickdesk-profile', data)); 
		 
		 if(!data)
			 return;
		 
		 if(data.length == 0)
		 {
			 $('#clickdesk_chats_panel').html('<li class="sub_header_li">No chats</li>');	
			 return;
		 }
		 
		 if(data.length >= 5)
			 flag = true;
		 
		  $('#clickdesk_chats_panel').html(
				  getTemplate('clickdesk-chat-stream', data));	
		 
		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
     		$(".time-ago", $('#clickdesk_chats_panel')).timeago();
     	  });
	     
		  // On click of show ticket, show ticket by ticket id method is called
		  $('#clickdesk_chat_show').die().live('click', function (e)
		  {
			     e.preventDefault();
		         var json = JSON.parse($(this).attr('data-attr'));

		         // Remove the modal if already exists
		         $('#clickdesk_chat_showModal').remove();

		         // Append the form into the content
		         $('#content').append(getTemplate("clickdesk-show-chat", json));
		         
		         $(".time-ago", $('#clickdesk_chat_showModal')).timeago();
		         
		         // Shows the modal after filling with details
		         $('#clickdesk_chat_showModal').modal("show");
		  });
		  
		  $('#more_chats_link').die().live('click', function (e)
		  {
			  e.preventDefault();
			    
			  if(!flag)
			  {
				  clickDeskStreamError("clickdesk-chats-error-panel", 'No more chats');
				  return;
			  }
			  
			  $('#spinner-clickdesk-chats').show();
			  var offset = $('#chats ul li').length;
			  console.log(offset);
			  
			  $.get("/core/api/widgets/clickdesk/chats/" + plugin_id + "/" + Email + "/" + offset, 
			  function(data1)
		      {
				    showMoreChats(data1);
				    
		      }, "json").error(function(data1) {
		    	  
		    	  $('#spinner-clickdesk-chats').hide();
		          // Else the error message is shown
		       	  clickDeskStreamError("clickdesk-chats-error-panel", data1.responseText);
		     });
			 
		  });
	     
	}, function error(data) 
	{
		$('#chats_load').remove();

		// Else the error message is shown
		clickDeskError("ClickDesk", data.responseText );
	});
	
	 Tickets_clicked = false;
	    $('#clickdesk_tickets').die().live('click', function(e) {
	    	
	    	e.preventDefault();
	    	if(Tickets_clicked)
	    		return;
	    	
	    	getClickDeskTickets(plugin_id, Email);
	    	Tickets_clicked = true;
	    	
	    });
}

function showMoreChats(data)
{
	if(data.length == 0)
	{
		clickDeskStreamError("clickdesk-chats-error-panel", 'No more chats');
		$('#spinner-clickdesk-chats').hide();
		return;
	}
	 
	var more_chats_template = getTemplate('clickdesk-chat-stream', data);
	  
	$('#spinner-clickdesk-chats').hide();
	 
	$('#clickdesk_chats_panel').append(more_chats_template);	
		 
	$(".time-ago", $('#clickdesk_chats_panel')).timeago();
}

function getClickDeskTickets(plugin_id, Email)
{
	$('#clickdesk_tickets_panel').html(CLICKDESK_UPDATE_LOAD_IMAGE);
	
	var flag = false;
	$.get("/core/api/widgets/clickdesk/tickets/" + plugin_id + "/" + Email + "/0", 
	function(data)
	{
		 if(!data)
			 return;
		 
		 if(data.length == 0)
		 {
			 $('#clickdesk_tickets_panel').html('<li class="sub_header_li">No tickets</li>');	
			 return;
		 }
		 
		 if(data.length >= 5)
			 flag = true;
		 
		  $('#clickdesk_tickets_panel').html(
				  getTemplate('clickdesk-ticket-stream', data));	
		 
		  head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
			$(".time-ago", $('#clickdesk_tickets_panel')).timeago();
		  });
		  
		  // On click of show ticket, show ticket by ticket id method is called
		  $('#clickdesk_ticket_show').die().live('click', function (e)
		  {
			     e.preventDefault();
		         var json = JSON.parse($(this).attr('data-attr'));

		         // Remove the modal if already exists
		         $('#clickdesk_ticket_showModal').remove();

		         // Append the form into the content
		         $('#content').append(getTemplate("clickdesk-show-ticket", json));

		         $(".time-ago",$('#clickdesk_ticket_showModal')).timeago();
		         
		         // Shows the modal after filling with details
		         $('#clickdesk_ticket_showModal').modal("show");
		  });
		     
		     
		  $('#more_tickets_link').die().live('click', function (e)
		  {
			  e.preventDefault();
			    
			  if(!flag)
			  {
				  clickDeskStreamError("clickdesk-tickets-error-panel", 'No more tickets');
				  return;
			  }
			  
			  $('#spinner-clickdesk-tickets').show();
			  var offset = $('#c_tickets ul li').length;
			  console.log('offset ' + offset);
			  
			  $.get("/core/api/widgets/clickdesk/tickets/" + plugin_id + "/" + Email + "/" + offset, 
			  function(data1)
			  {
				  showMoreTickets(data1);
				  
			  }, "json").error(function(data1) {
			      
				  $('#spinner-clickdesk-tickets').hide();
				  
				  // Else the error message is shown
				  clickDeskStreamError("clickdesk-tickets-error-panel", data1.responseText);
			  });
		   	 
		  });
	}, "json").error(function(data) {
		
		$('#chats_load').remove();
		Tickets_clicked = false;
		
        // Else the error message is shown
		clickDeskError("clickdesk_tickets_panel", data.responseText);
	});
	
	
}

function showMoreTickets(data)
{
	if(data.length == 0)
	{
		clickDeskStreamError("clickdesk-tickets-error-panel", 'No more tickets');
		$('#spinner-clickdesk-tickets').hide();
		return;
	}
	 
	var more_tickets_template = getTemplate('clickdesk-ticket-stream', data);
	  
	$('#spinner-clickdesk-tickets').hide();
   	 
	$('#clickdesk_tickets_panel').append(more_tickets_template);	
		 
	$(".time-ago", $('#clickdesk_tickets_panel')).timeago();
}

function clickDeskError(id, message)
{
	Errorjson['message'] = message;
	$('#' + id).html(getTemplate('clickdesk-error', Errorjson));
}

function clickDeskStreamError(id, message)
{
	Errorjson['message'] = message;
	$('#' + id).html(getTemplate('clickdesk-error', Errorjson));
	
	$('#' + id).show();
	$('#' + id).fadeOut(10000);
}