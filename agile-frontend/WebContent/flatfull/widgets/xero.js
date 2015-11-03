/**
 * ===xero.js==== It is a pluginIn to be integrated with CRM, developed based on
 * the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */

// xero-invoice

var XEROObj = {};
var XEROCount = 1;
var showMoreHtmlXERO = '<div class="widget_tab_footer xero_show_more" align="center"><a class="c-p text-info" id="XERO_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';
 

function showXeroClient(contact_id)
{
	if (EmailList.length == 0)
	{
		xeroError(Xero_PLUGIN_NAME, "No email for this contact");
		return;
	}
	var emailArray = [];
	for (var i = 0; i < EmailList.length; i++)
	{
		emailArray[i] = EmailList[i].value;
	}
	console.log(emailArray);
	console.log("In show Xero Client" + Xero_PLUGIN_ID);
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/xero/clients/" + Xero_PLUGIN_ID + "/" + emailArray, "json", function success(data)
	{
		console.log('In Xero clients');		
		console.log(data);
		
		// If data is not defined return
		if (data)
		{

			if(data.invoice != undefined && data.invoice.Invoice != undefined){	
				XEROObj = {};
				XEROCount = 1;
				
				if($.isArray(data.invoice.Invoice)){
					data.invoice.Invoice = data.invoice.Invoice.reverse();
					XEROObj.invoice = data.invoice.Invoice;
				}
			}	
			
			// Fill Xero widget template with FreshBooks clients data
			getTemplate('xero-profile', data, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
		    	var template = $('#Xero').html($(template_ui)); 
				console.log("libpath is" + LIB_PATH);
				console.log(template)
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".time-ago", template).timeago();
				});
			}, "#Xero");

			loadInvoices(0);
		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, data.responseText);
		}

	}, function error(data)
	{
		console.log("In Xero error ");

		// Remove loading on error
		$('#XERO_PROFILE_LOAD_IMAGE').remove();

		var resText = data.responseText;
		console.log(resText);
		if (resText.indexOf('No contact found') != -1)
		{
			createContact(resText);
		}
		else if (resText.indexOf('No invoices Exist for this contact') != -1)
		{
			var invoice_json = {};
			invoice_json['ContactID'] = data.Contact.ContactID;

			/*
			 * Get error template and fill it with error message and show it in
			 * the div with given id
			 */
			console.log('invoices screen  ');
			getTemplate('xero-profile-addinvoice', invoice_json, undefined, function(template_ui){
		 		if(!template_ui)
		    		return;
				$('#' + Xero_PLUGIN_NAME).html($(template_ui)); 
			}, '#' + Xero_PLUGIN_NAME);
		}
		else
		{
			xeroError("Xero", resText);
		}
	});
}

function loadInvoices(offSet){

	var data = XEROObj.invoice;

	if(offSet == 0){

		var result = {};
		result.invoice = data.slice(0, 5); ;

		getTemplate('xero-invoice', result, undefined, function(template_ui){
			$('#xero-invoice-list').append(template_ui);
			$('#xero-invoice-list').append(showMoreHtmlXERO);
		});
		
	}else if(offSet > 0  && (offSet + 5) < data.length){
		var result = {};
		result.invoice = data.slice(offSet, (offSet+5));
		console.log("xero 2nd result **** ");
		console.log(result);
		$('.xero_show_more').remove();
		$('#xero-invoice-list').append(getTemplate('xero-invoice', result)).append(showMoreHtmlXERO);
	}else{
		var result = {};
		result.invoice = data.slice(offSet, data.length);
		$('.xero_show_more').remove();
		$('#xero-invoice-list').append(getTemplate('xero-invoice', result));
	}
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
	getTemplate('xero-error', error_json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#' + id).html($(template_ui)); 
	}, '#' + id);

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
	getTemplate('xero-profile-addcontact', contact_json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#' + Xero_PLUGIN_NAME).html($(template_ui)); 
	}, '#' + Xero_PLUGIN_NAME);
}

function addContactToXero(first_name, last_name, contact_id)
{
	/*
	 * send GET request to the URL to add client in FreshBooks based on widget
	 * id, first name, last name and email as path parameters
	 * 
	 */

	console.log("in xero ad contact")
	$("#xero_add_contact").attr("disabled", true);
	$.get("/core/api/widgets/xero/add/contact/" + Xero_PLUGIN_ID + "/" + first_name + "/" + last_name + "/" + Email, function(data)
	{
		console.log('In Xero add contact ');
		console.log(data);

		/*
		 * Response from freshBooks will be sent as "ok" if client is added,
		 * check the response and show added client in FreshBooks widget panel
		 */
		if (data.Status = 'OK')
		{
			showXeroClient(contact_id);
		}
		else
		{
			xeroError(Xero_PLUGIN_NAME, data);
		}
		$("#xero_add_contact").removeAttr("disabled");
	});

}

function startXeroWidget(contact_id){

	XEROObj = {};
	XEROCount = 1;

	console.log("in xero widget.js")
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
		xeroError(Xero_PLUGIN_NAME, 'Authentication Error.Please reconfigure your Xero widget.');
		return;
	}

	var xeroWidgetPref = JSON.parse(xero_widget.prefs);
	
	SHORT_CODE = xeroWidgetPref.xero_org_shortcode;	

	if (typeof SHORT_CODE == "undefined")
	{
		xeroError(Xero_PLUGIN_NAME, "Authentication Error.Please reconfigure your Xero widget.");
		return;
	}

	// Email as global variable
	Email = agile_crm_get_contact_property('email');

	// Email list as global variable
	EmailList = agile_crm_get_contact_properties_list("email");

	var first_name = agile_crm_get_contact_property("first_name");
	var last_name = agile_crm_get_contact_property("last_name");

	if (last_name == undefined || last_name == null)
		last_name = ' ';

	showXeroClient(contact_id);

    $("#widgets").off('click','#xero_add_contact');
	$("#widgets").on('click','#xero_add_contact', function(e)
	{
		e.preventDefault();

		addContactToXero(first_name, last_name, contact_id, Email);
	});

	// attach event to invoices + icon to get lineitems
    $("#widgets").off('click','.invoices');
	$("#widgets").on('click','.invoices', function(e)
	{
		e.preventDefault();
		var invoiceId = $(this).prop('value');

		// checking for data existence in div
		if ($('#collapse-' + invoiceId).text().trim() === "")
		{
			console.log("no data present");
			$('#collapse-' + invoiceId).html(XERO_PROFILE_LOAD_IMAGE);
			$.get("/core/api/widgets/xero/lineItems/" + Xero_PLUGIN_ID + "/" + invoiceId, function(data)
			{
				if (data.Status = 'OK')
				{
					console.log((JSON.parse(data)).Invoices.Invoice);
					
					getTemplate('xero-invoice-lineitems', (JSON.parse(data)).Invoices.Invoice, undefined, function(template_ui){
				 		if(!template_ui)
				    		return;
						$('#collapse-' + invoiceId).html($(template_ui)); 
					}, '#collapse-' + invoiceId);
				}
				else
				{
					console.log("error");
					xeroError(Xero_PLUGIN_NAME, data);
				}
				$('#XERO_PROFILE_LOAD_IMAGE').remove();
			});

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

	/*
	 * On click of add client button in FreshBooks, calls method to add a client
	 * in FreshBooks with contact's first name, last name and email
	 */
	$("#widgets").off("click", "#XERO_show_more");
	$("#widgets").on("click", "#XERO_show_more", function(e)
	{
		e.preventDefault();
		var offSet = XEROCount * 5;
		loadInvoices(offSet);
		++XEROCount;
		
	});
}