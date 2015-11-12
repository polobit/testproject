function showQuickbooksContacts(contact_id)
{
    if (!Email)
    {
	quickBooksError("<div class='wrapper-sm'>Please provide email for this contact</div>");
	return;
    }

    console.log("In show Quickbooks Client" + QUICKBOOKS_PLUGIN_ID);
    
    var emailArray = [];
	for ( var i = 0; i < EmailList.length; i++)
	{
		emailArray[i] = EmailList[i].value;
	}
	
    queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/quickbooks/contacts/" + QUICKBOOKS_PLUGIN_ID + "/" + emailArray, 'json', function success(data)
    {
	console.log('QuickBooks');
	console.log(data)
	// If data is not defined return
	if (data)
	{
	    // Fill Quickbooks widget template with Quickbooks clients data
	    var template = $('#' + QUICKBOOKS_PLUGIN_NAME).html(getTemplate('quickbooks-profile', data));
	    console.log("libpath is" + LIB_PATH);
	    console.log(template)
	    head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
	    {
		$(".time-ago", template).timeago();
	    });

	}
	else
	{
	    quickBooksError("<div class='wrapper-sm'>"+data.responseText+"</div>");
	}

    }, function error(data)
    {
	console.log("In Quickbooks error ");
	console.log(data.responseText);
	if (data.responseText == 'Contact not Found')
	{
	    $('#' + QUICKBOOKS_PLUGIN_NAME).html(getTemplate('quickbooks-profile-addcontact', {}));
	}
	else if(data.responseText.indexOf('Exception Timeout while fetching') != -1)
	{
		quickBooksError("<div class='wrapper-sm'>Timeout while fetching Please refresh</div>");
	}
	else
	{
	    quickBooksError("<div class='wrapper-sm'>"+data.responseText+"</div>");
	}
    });

}

/**
 * Shows QuickBooks error message in the div allocated with given id
 * 
 * @param id
 *                div id
 * @param message
 *                error message
 */

function quickBooksError(message)
{
    var error_json = {};
    error_json['message'] = message;

    /*
     * Get error template and fill it with error message and show it in the div
     * with given id
     */
    console.log('error ');
    $('#' + QUICKBOOKS_PLUGIN_NAME).html(getTemplate('quickbooks-error', error_json));
}

function addContactToQuickbooks(first_name, last_name, contact_id)
{

	// Shows loading image until set up is shown
	$('#QuickBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

    /*
     * send GET request to the URL to add client in Quickbooks based on widget
     * id, first name, last name and email as path parameters
     * 
     */

    console.log("in quickbooks add contact")
      $("#quickbooks_add_contact").attr("disabled", true);
    $.get("/core/api/widgets/quickbooks/add/contact/" + QUICKBOOKS_PLUGIN_ID + "/" + first_name + "/" + last_name + "/" + Email, function(data, queueName)
    {
	console.log('In Quickbooks add contact ');
	console.log(data);
	$('#quickbooks_profile_load').remove();
	/*
	 * Response from freshBooks will be sent as "ok" if client is added,
	 * check the response and show added client in FreshBooks widget panel
	 */
	if (data.Status = 'OK')
	{
	    showQuickbooksContacts(contact_id);
	}
	else
	{
	    console.log(data);
		quickBooksError("<div class='wrapper-sm'>"+data+"</div>");
	}
	$("#quickbooks_add_contact").removeAttr("disabled");
    }).error(function(data, queueName)
	{
		// Shows error if error occurs in quickbooks widget panel
    	console.log("data is in add contact error");
    	console.log(data);
    	$('#quickbooks_profile_load').remove();
		quickBooksError("<div class='wrapper-sm'>"+data.responseText+"</div>");
	});
}

function startQuickBooksWidget(contact_id){

    console.log("in quickbooks widget.js")

    // QuickBooks widget name as a global variable
    QUICKBOOKS_PLUGIN_NAME = "QuickBooks";

    // QuickBooks profile loading image declared as global
    QUICKBOOKS_PROFILE_LOAD_IMAGE = '<center><img id="quickbooks_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

    // Retrieves widget which is fetched using script API
    var quickbooks_widget = agile_crm_get_widget(QUICKBOOKS_PLUGIN_NAME);

    // ID of the QuickBooks widget as global variable
    QUICKBOOKS_PLUGIN_ID = quickbooks_widget.id;
    console.log("plugin Id" + QUICKBOOKS_PLUGIN_ID);

    Email = agile_crm_get_contact_property('email');
    
 // Email list as global variable
	EmailList = agile_crm_get_contact_properties_list("email");
    var first_name = agile_crm_get_contact_property("first_name");
    var last_name = agile_crm_get_contact_property("last_name");
    
    //set last name empty if it is undifned
    if(last_name==undefined||last_name==null)
    	last_name=' ';
    
    console.log("Email is" + Email)

    showQuickbooksContacts(contact_id);

    $("#widgets").off("click", '#quickbooks_add_contact');
	$("#widgets").on("click", '#quickbooks_add_contact', function(e)
    {
		e.preventDefault();
		addContactToQuickbooks(first_name, last_name, contact_id, Email);
    });
}