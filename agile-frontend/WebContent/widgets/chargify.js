/**
 * ===chargify.js==== It is a pluginIn to be integrated with CRM, developed
 * based on the third party JavaScript API provided. It interacts with the
 * application based on the function provided on agile_widgets.js (Third party
 * API).
 */


/*
 * Show Chargify profile
 */
function showChargifyClient()
{
	if (EmailList.length == 0)
	{
		chargifyError(CHARGIFY_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}
	var emailArray = [];
	for ( var i = 0; i < EmailList.length; i++)
	{
		emailArray[i] = EmailList[i].value;
	}
	console.log(emailArray);

	queueGetRequest("widget_queue", "core/api/widgets/chargify/clients/" + CHARGIFY_PLUGIN_ID + "/" + emailArray, "json", function success(data)
	{
		console.log(data)
		// If data is not defined return
		if (data)
		{
			// Fill Chargify widget template with FreshBooks clients data
			console.log(data)
			var template = $('#' + CHARGIFY_PLUGIN_NAME).html(getTemplate('chargify-profile', data));
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", template).timeago();
			});

		}
		else
		{
			chargifyError(CHARGIFY_PLUGIN_NAME, data.responseText);
		}

	}, function error(data)
	{
		console.log(data.responseText);
		if (data.responseText == "Customer not found")
		{
			$('#' + CHARGIFY_PLUGIN_NAME).html(getTemplate('chargify-profile-addcontact', { message : "agilecrm domain of doesn't contain any customers" }));
		}

	});
}

/**
 * Shows Chargify error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function chargifyError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	console.log('error ');
	$('#' + id).html(getTemplate('chargify-error', error_json));

}

function addContactToChargify(first_name, last_name)
{
	/*
	 * send GET request to the URL to add client in Chargify based on widget id,
	 * first name, last name and email as path parameters
	 * 
	 */
	$("#chargify_add_contact").attr("disabled", true);
	$.get("/core/api/widgets/chargify/add/customer/" + CHARGIFY_PLUGIN_ID + "/" + first_name + "/" + last_name + "/" + Email, function(data)
	{
		console.log('In Chargify add contact ');
		console.log(data);

		/*
		 * Response from freshBooks will be sent as "ok" if client is added,
		 * check the response and show added client in FreshBooks widget panel
		 */
		if (data.Status = 'OK')
		{
			showChargifyClient();
		}
		else
		{
			chargifyError(CHARGIFY_PLUGIN_NAME, data)
		}
		$("#chargify_add_contact").removeAttr("disabled");
	});

}


$(function()
		{
			console.log("in Chargify.js")
			// Chargify widget name as a global variable
			CHARGIFY_PLUGIN_NAME = "Chargify";

			// Chargify profile loading image declared as global
			CHARGIFY_PROFILE_LOAD_IMAGE = '<center><img id="chargify_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

			// Retrieves widget which is fetched using script API
			var chargify_widget = agile_crm_get_widget(CHARGIFY_PLUGIN_NAME);

			// ID of the Chargify widget as global variable
			CHARGIFY_PLUGIN_ID = chargify_widget.id;
			console.log("plugin Id" + CHARGIFY_PLUGIN_ID);

			// Email as global variable
			Email = agile_crm_get_contact_property('email');

			// Email list as global variable
			EmailList = agile_crm_get_contact_properties_list("email");

			var first_name = agile_crm_get_contact_property("first_name");
			var last_name = agile_crm_get_contact_property("last_name");

			if (last_name == undefined || last_name == null)
				last_name == ' ';
			showChargifyClient();

			$('#chargify_add_contact').die().live('click', function(e)
			{
				e.preventDefault();

				addContactToChargify(first_name, last_name, Email);
			});

		});
