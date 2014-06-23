/**
 * ===xero.js==== It is a pluginIn to be integrated with CRM, developed based on
 * the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */
$(function()
{
	// Xero widget name as a global variable
	Xero_PLUGIN_NAME = "Xero";

	// Xero profile loading image declared as global
	XERO_PROFILE_LOAD_IMAGE = '<center><img id="xero_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var xero_widget = agile_crm_get_widget(Xero_PLUGIN_NAME);

	// ID of the Xero widget as global variable
	Xero_PLUGIN_ID = xero_widget.id;
	console.log("plugin Id" + Xero_PLUGIN_ID);
	/*
	 * Gets Xero widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupXeroOAuth is shown and returned
	 */
	if (xero_widget.prefs == undefined)
	{
		setupXeroOAuth();
		return;
	}

	// Email as global variable
	Email = agile_crm_get_contact_property('email');
	var first_name = agile_crm_get_contact_property("first_name");
	var last_name = agile_crm_get_contact_property("last_name");

	showXeroClient();

	$('#xero_add_contact').die().live('click', function(e)
	{
		e.preventDefault();
		addContactToXero(first_name, last_name, Email);
	});

	$('.invoices').die().live('click', function(e)
	{
		e.preventDefault();
		var invoiceId = $(this).attr('value');
		if ($('#collapse-' + invoiceId).text().trim() === "")
		{
			console.log("no data present");
			$('#collapse-' + invoiceId).html(XERO_PROFILE_LOAD_IMAGE);
			$.get("/core/api/widgets/xero/lineItems/" + Xero_PLUGIN_ID + "/" + invoiceId, function(data)
			{
				if (data.Status = 'OK')
				{
					console.log("am in success call back")
					$('#collapse-' + invoiceId).html(getTemplate('xero-invoice-lineitems', (JSON.parse(data)).Invoices[0]));
				}
				else
				{
					xeroError(Xero_PLUGIN_NAME, data)
				}
			});
			$('#XERO_PROFILE_LOAD_IMAGE').remove();
		}

		if ($('#collapse-' + invoiceId).hasClass("collapse"))
		{
			$('#collapse-' + invoiceId).removeClass("collapse");
		}
		else
		{
			$('#collapse-' + invoiceId).addClass("collapse");
		}

	});

});

function showXeroClient()
{
	if (!Email)
	{
		xeroError(Xero_PLUGIN_NAME, "Please provide email for this contact");
		return;
	}

	console.log("In show Xero Client" + Xero_PLUGIN_ID);

	queueGetRequest("widget_queue", "/core/api/widgets/xero/clients/" + Xero_PLUGIN_ID + "/" + Email, 'json', function success(data)
	{
		// If data is not defined return
		if (data)
		{
			// Fill Xero widget template with FreshBooks clients data
			var template = $('#Xero').html(getTemplate('xero-profile', data));
			console.log("libpath is" + LIB_PATH);
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", template).timeago();
			});

		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, data.responseText);
		}

	}, function error(data)
	{
		// Remove loading on error
		$('#XERO_PROFILE_LOAD_IMAGE').remove();

		var resText = data.responseText;
		console.log(resText);
		if (resText.indexOf('No contact found with email address') != -1)
		{
			createContact(resText);
		}
		else if (resText.indexOf('No invoices Exist for this contact') != -1)
		{
			var invoice_json = {};
			invoice_json['ContactID'] = data.Contact.ContactID;

			/*
			 * Get error template and fill it with error message and show it in the
			 * div with given id
			 */
			console.log('invoices screen  ');
			$('#' + Xero_PLUGIN_NAME).html(getTemplate('xero-profile-addinvoice', invoice_json));
		}
		else
		{
			xeroError("Xero", resText);
		}
	});
}

/**
 * Shows Xero error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function xeroError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	console.log('error ');
	$('#' + id).html(getTemplate('xero-error', error_json));

}

function createContact(message)
{
	// build JSON with error message
	var contact_json = {};
	contact_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	console.log('error ');
	$('#' + Xero_PLUGIN_NAME).html(getTemplate('xero-profile-addcontact', contact_json));
}

function addContactToXero(first_name, last_name)
{
	/*
	 * send GET request to the URL to add client in FreshBooks based on widget
	 * id, first name, last name and email as path parameters
	 * 
	 */

	console.log("in xero ad contact")
	$.get("/core/api/widgets/xero/add/contact/" + Xero_PLUGIN_ID + "/" + first_name + "/" + last_name + "/" + Email, function(data)
	{
		//console.log(data);

		/*
		 * Response from freshBooks will be sent as "ok" if client is added, check
		 * the response and show added client in FreshBooks widget panel
		 */
		if (data.Status = 'OK')
		{
			showXeroClient();
		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, data)
		}
	});

}
