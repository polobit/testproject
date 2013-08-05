$(function()
{

	// Widget name as a global variable
	FRESHBOOKS_PLUGIN_NAME = "FreshBooks";

	// FreshBooks update loading image declared as global
	FRESHBOOKS_LOGS_LOAD_IMAGE = '<center><img id="freshbooks_invoice_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 14px;margin-bottom: 10px;">' + '</img></center>';

	items = {};
	Errorjson = {};

	// Gets widget id from widget object, fetched using script API
	var plugin_id = agile_crm_get_plugin(FRESHBOOKS_PLUGIN_NAME).id;

	// Gets widget preferences, required to check whether to show setup button
	// or
	// to fetch details
	var plugin_prefs = agile_crm_get_plugin_prefs(FRESHBOOKS_PLUGIN_NAME);

	$('#FreshBooks_plugin_delete').die().live('click', function(e)
	{

		e.preventDefault();

		agile_crm_save_widget_prefs(FRESHBOOKS_PLUGIN_NAME, undefined, function(data)
		{
			setUpFreshbooksAuth(plugin_id);
		});
	});

	console.log('before email');

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');

	console.log('after email');

	/*
	 * If not found - considering first time usage of widget,
	 * setUpFreshbooksAuth called
	 */
	if (plugin_prefs == undefined)
	{
		setUpFreshbooksAuth(plugin_id);
		return;
	}

	// Checks if contact has email, if undefined shows message in FreshBooks
	// panel
	if (!Email)
	{
		freshbooksError('FreshBooks', "No email is associated with this contact");
		return;
	}

	showFreshBooksClient(plugin_id, Email);

	var first_name = agile_crm_get_contact_property("first_name");
	var last_name = agile_crm_get_contact_property("last_name");

	$('#freshbooks_add_client').die().live('click', function(e)
	{
		e.preventDefault();

		addClientToFreshBooks(plugin_id, first_name, last_name, Email);

	});

	$('#freshbooks_items').die().live('click', function(e)
	{
		e.preventDefault();

		console.log(items.total);
		if (!items.total)
			getItemsInFreshBooks(plugin_id);
	});

	$('#freshbooks_add_invoice').die().live('click', function(e)
	{
		e.preventDefault();

		addInvoiceToClientInFreshBooks(plugin_id, first_name, last_name, Email);
	});

});

function setUpFreshbooksAuth(plugin_id)
{
	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	// Shows input fields to save the FreshBooks preferences
	$('#FreshBooks').html(getTemplate('freshbooks-login', {}));

	// On click of save button
	$('#freshbooks_save_token')
			.die()
			.live(
					'click',
					function(e)
					{
						e.preventDefault();

						// Checks whether all input fields are given
						if (!isValidForm($("#freshbooks_login_form")))
						{
							return;
						}

						// Store the data given by the user as JSON
						var freshbooks_prefs = {};
						freshbooks_prefs["freshbooks_apiKey"] = $("#freshbooks_apikey").val();
						freshbooks_prefs["freshbooks_url"] = $("#freshbooks_url").val();

						// Saves the preferences into widget with FreshBooks
						// widget name
						agile_crm_save_widget_prefs(
								FRESHBOOKS_PLUGIN_NAME,
								JSON.stringify(freshbooks_prefs),
								function(data)
								{
									// Checks if contact has email, if undefined
									// shows message in FreshBooks panel
									if (!Email)
									{
										$('#FreshBooks')
												.html(
														'<div class="widget_content" style="border-bottom:none;padding: 10px;' + 'line-height:160%;">No email is associated with this contact</div>');
										return;
									}

									showFreshBooksClient(plugin_id, Email);

								});

					});
}

function showFreshBooksClient(plugin_id, email)
{
	// Shows loading image until set up is shown
	$('#FreshBooks').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	queueGetRequest("widget_queue", "/core/api/widgets/freshbooks/clients/" + plugin_id + "/" + email, 'json', function success(data)
	{
		console.log(data);

		if (!data)
			return;

		$('#FreshBooks').html(getTemplate('freshbooks-profile', data));

		if (!data.client)
			return;

		if (isArray(data.client))
			getInvoicesOfClient(plugin_id, data.client[0].client_id);
		else
			getInvoicesOfClient(plugin_id, data.client.client_id);
	}, function error(data)
	{
		console.log(data);
		console.log("in freshbooks error " + data.responseText);
		$('#freshbooks_invoice_load').remove();

		freshbooksError("FreshBooks", data.responseText);
	});
}

function getInvoicesOfClient(plugin_id, client_id)
{
	$.get("/core/api/widgets/freshbooks/invoices/" + plugin_id + "/" + client_id, function(data)
	{

		var freshbooks_invoice_template = $(getTemplate('freshbooks-invoice', data));

		$('#freshbooks_invoice_panel').html(freshbooks_invoice_template);

		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", freshbooks_invoice_template).timeago();
		});

	}, 'json').error(function(data)
	{
		freshbooksError("freshbooks_invoice_panel", data.responseText);
	});
}

function getItemsInFreshBooks(plugin_id, callback)
{
	$('#freshbooks_items_panel').html(FRESHBOOKS_LOGS_LOAD_IMAGE);

	$.get("/core/api/widgets/freshbooks/items/" + plugin_id + "/", function(data)
	{
		items = data;
		console.log(items);
		$('#freshbooks_items_panel').html(getTemplate('freshbooks-items', data));

		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".time-ago", $('#freshbooks_items_panel')).timeago();
		});

		if (callback && typeof (callback) === "function")
		{
			// Execute the callback, passing parameters as necessary
			callback(data);
		}

	}, 'json').error(function(data)
	{
		$('#freshbooks_invoice_load').remove();

		freshbooksError("freshbooks_items_panel", data.responseText);

	});
}

function addClientToFreshBooks(plugin_id, first_name, last_name, email)
{
	$.get("/core/api/widgets/freshbooks/add/client/" + plugin_id + "/" + first_name + "/" + last_name + "/" + email, function(data)
	{
		console.log(data);
		if (data.status == "ok")
			showFreshBooksClient(plugin_id, email);

	}, 'json').error(function(data)
	{
		freshbooksError("FreshBooks", data.responseText);
	});

}

function addInvoiceToClientInFreshBooks(plugin_id, first_name, last_name, email)
{

	// Store info in a json, to send it to the modal window when making send
	// message request
	var json = {};

	// Set headline of modal window as Send Message
	json["headline"] = "Add Invoice";

	// Information to be shown in the modal to the user while sending message
	json["info"] = "Generates an invoice for the item and sends an email to " + email;

	getItemsInFreshBooks(plugin_id, function(data)
	{
		json["items"] = data;

		console.log(json);

		// If modal already exists remove to show a new one
		$('#freshbooks_addModal').remove();

		// Populate the modal template with the above json details in the form
		var message_form_modal = getTemplate("freshbooks-modal", json);

		// Append the form into the content
		$('#content').append(message_form_modal);

		// Shows the modal after filling with details
		$(message_form_modal).modal("show");

	});

	// On click of send button in the modal, message request is sent
	$('#send_request')
			.click(
					function(e)
					{
						e.preventDefault();

						var quantity;

						// Checks whether all the input fields are filled
						if (!isValidForm($("#freshbooks_addForm")))
						{
							quantity = $('#quantity').val();
							return;
						}

						if (!quantity)
							quantity = 1;
						var item_name = "pro";
						console.log(quantity);

						$
								.get(
										"/core/api/widgets/freshbooks/add/invoice/" + plugin_id + "/" + first_name + "/" + last_name + "/" + email + "/" + item_name + "/" + quantity,
										function(data)
										{
											console.log(data);

											if (data.status == "ok")
												// On success, shows the status
												// as sent
												$('#freshbooks_addModal').find('span.save-status').html("sent");

											// Hides the modal after 2 seconds
											// after the sent is shown
											setTimeout(function()
											{
												$('#freshbooks_addModal').modal("hide");
											}, 2000);

										}, 'json').error(function(data)
								{
									// Remove modal if an error occurs
									$('#freshbooks_addModal').remove();

									alert(data.responseText);
								});

					});
}

function freshbooksError(id, message)
{
	Errorjson['message'] = message;
	$('#' + id).html(getTemplate('freshbooks-error', Errorjson));
}
