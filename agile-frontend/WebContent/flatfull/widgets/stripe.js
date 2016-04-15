/**
 * ===stripe.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API).
 */

var stripeOBJ = {};
var customer_id = 0;
var stripeINVCount = 1;
var stripePAYCount = 1;

var showMoreStripeINV = '<div class="widget_tab_footer stripe_inv_show_more" align="center"><a class="c-p text-info" id="stripe_inv_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';
var showMoreStripePAY = '<div class="widget_tab_footer stripe_pay_show_more" align="center"><a class="c-p text-info" id="stripe_pay_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';

/**
 * Shows setup if user adds Stripe widget for the first time. Uses ScribeServlet
 * to create a client and get preferences and save it to the widget.
 */
function setupStripeOAuth()
{
	// Shows loading until the set up is shown
	$('#Stripe').html(STRIPE_PROFILE_LOAD_IMAGE);

	// URL to return, after authenticating from Stripe
	var callbackURL = window.location.href;

	console.log('In Stripe OAuth');

	/*
	 * Creates a URL, which on click can connect to scribe using parameters sent
	 * and returns back to the profile based on callbackURLL provided and saves
	 * widget preferences in widget based on Stripe_Plugin_Id
	 */
	var url = '/scribe?service=stripe&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(Stripe_Plugin_Id);

	$('#Stripe')
			.html(
					'<div class="widget_content" style="border-bottom:none;line-height: 160%;">See the contact\'s subscriptions history and payments from your Stripe account.<p style="margin: 10px 0px 5px 0px;"></p><div class="text-center"><a class="btn" href=' + url + '>Link your Stripe</a></div></div>');

}

/**
 * Shows setup to select Stripe custom field from list of custom fields in which
 * Stripe Customer details are stored
 * 
 * @param stripe_widget_prefs
 *            JSON Stripe widget preferences
 */
function setUpStripeCustomField(stripe_widget_prefs, contact_id)
{
	// Retrieve all custom from Agile account
	$.get("/core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT", function(data)
	{
		// Include 'stripe_field_name' to stripe_widget_prefs and save
		stripe_widget_prefs['custom_fields'] = data;

		
		// Fill template with custom fields and show it in Stripe widget panel
		getTemplate('stripe-custom-field', stripe_widget_prefs, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#Stripe').html($(template_ui)); 
		}, "#Stripe");

	}, "json").error(function(data)
	{
		// If error occurs, show error in Stripe Panel
		stripeError(Stripe_PLUGIN_NAME, data.responseText);
	});

	/*
	 * On click of save button after setting Up Stripe custom field, widget
	 * preferences are saved including stripe_field_name and Stripe profile of
	 * customer is shown
	 */
    $("#widgets").off("click", '#save_stripe_name');
	$("#widgets").on("click", '#save_stripe_name', function(e)
	{
		e.preventDefault();

		// Get the selected value from list of custom fields
		var stripe_custom_field_name = $('#stripe_custom_field_name').val();
		
		if(!stripe_custom_field_name)
			return;

		// Include 'stripe_field_name' to stripe_widget_prefs and save
		stripe_widget_prefs['stripe_field_name'] = stripe_custom_field_name;

		// preferences are saved and Stripe profile of customer is shown
		agile_crm_save_widget_prefs(Stripe_PLUGIN_NAME, JSON.stringify(stripe_widget_prefs), function(data)
		{
			showStripeProfile(stripe_custom_field_name, contact_id);
		});

	});
}

/**
 * Shows stripe profile based on customer Id and Stripe_Plugin_Id
 * 
 * @param stripe_custom_field_name
 *            Stripe custom field name in which Stripe customer id related to
 *            contact is stored
 */
function showStripeProfile(stripe_custom_field_name, contact_id)
{
	// Shows loading until the profile is retrieved
	$('#Stripe').html(STRIPE_PROFILE_LOAD_IMAGE);

	/*
	 * Retrieves the customer id of Stripe related to contact which is saved in
	 * Stripe custom field
	 */
	customer_id = agile_crm_get_contact_property(stripe_custom_field_name);
	console.log("Stripe customer id " + customer_id);

	// If customer id is undefined, message is shown
	if (!customer_id)
	{
		
         $("#widgets").off("click", '#stripe_contact_id_save');
		 $("#widgets").on("click", '#stripe_contact_id_save', function(e){
			   
			   e.preventDefault();

			   if(!isValidForm($('#stripe_contact_id_form')))
			    return;
			   
			   customer_id = $('#stripe_contact_id').val();
			   
			   agile_crm_save_contact_property(stripe_custom_field_name, "", customer_id, "CUSTOM");
			   
			   showStripeProfile(stripe_custom_field_name, contact_id);
			   return;
			   
			  });
	
	
		 $('#Stripe').html("<div class='wrapper-sm'><form style='border-bottom:none;margin-bottom:5px;' id='stripe_contact_id_form' name='stripe_contact_id_form' method='post'>" +
		    "<fieldset><p>Please provide the Stripe customer id for this contact</p>" +
		    "<div class='control-group' style='margin-bottom:0px'><div class='controls'>" +
		    "<input type='text' class='required form-control' name='stripe_contact_id' style='width:90%' id='stripe_contact_id' placeholder='Stripe customer id' onkeydown='if (event.keyCode == 13) { event.preventDefault(); }'></input>" +
		    "</div></div><a href='#' class='btn btn-ms btn-default m-t-xs' id='stripe_contact_id_save'>Save</a>" +
		    "</fieldset></form></div>");
		  
		 return;
	}
	// Retrieve Stripe profile and shows profile in Stripe panel on success
	getStripeProfile(customer_id, function(data)
	{
		// Get and Fill the template with data
		

		getTemplate('stripe-profile', data, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
	    	
	    	var stripe_template = $(template_ui);
	    	// Load jquery time ago function to show time ago in invoices
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".time-ago", stripe_template).timeago();
			});

			// Show the template in Stripe widget panel
			$('#Stripe').html(stripe_template);

			stripeOBJ = {};
			stripeINVCount = 1;
			stripePAYCount = 1;

			stripeOBJ.invoice = data.invoice;
			stripeOBJ.payments = data.payments;
			loadStripeInvoices(0);
			loadStripePayments(0);
			 
		}, null);

			
	}, contact_id);


	$("#widgets").off("click", "#stripe_pay_show_more");
	$("#widgets").on("click", "#stripe_pay_show_more", function(e)
	{
		e.preventDefault();
		var offSet = stripePAYCount * 5;
		loadStripePayments(offSet);
		++stripePAYCount;
	});

	$("#widgets").off("click", "#stripe_inv_show_more");
	$("#widgets").on("click", "#stripe_inv_show_more", function(e){
		e.preventDefault();
		var offSet = stripeINVCount * 5;
		loadStripeInvoices(offSet);
		++stripeINVCount;
	});

	$("#widgets").off("click", "#add_credits");
	$("#widgets").on("click", "#add_credits", function(e){
		$('#stripe_credits_panel').removeClass('hide');
		$('#add_credits').addClass('hide');
	});

	$("#widgets").off("click", "#stripe_credits_cancel");
	$("#widgets").on("click", "#stripe_credits_cancel", function(e){
		$('#add_credits').removeClass('hide');
		$('#stripe_credits_panel').addClass('hide');
	});	 

	$("#widgets").off("click", "#stripe_credits_add");
	$("#widgets").on("click", "#stripe_credits_add", function(e){
		var creditAmt = (parseFloat($('#credit_amount').val())*100);
		if(creditAmt != 0){
			$("#stripe_credits_panel *").attr("disabled", "disabled");
			$.get("/core/api/widgets/stripe/credit/" +Stripe_Plugin_Id+ "/" +customer_id+ "/" +creditAmt , function(data){
				console.log(data);
				if(data){
					var balance = $('#balance_credit').text();
					balance = parseFloat(creditAmt/100) + parseFloat(balance);
					$('#balance_credit').text(balance);					 
					$('#add_credits').removeClass('hide');
					$('#stripe_credits_panel').addClass('hide');
					$('#credit_amount').val(0);
				}else{
					showNotyPopUp('warning', 'Stripe : Error occured while adding credits' , "bottomRight");
				}
				$("#stripe_credits_panel *").removeAttr("disabled");
			});
		}else{
			alert('Please enter proper amount');
		}
	});	

}

function loadStripeInvoices(offSet){

	if(offSet == 0){
		var result = {};
		result.invoice = stripeOBJ.invoice.slice(0, 5);

		getTemplate('stripe-invoices', result, undefined, function(template_inv){			
			$('#invoice_block').append(template_inv);
		},null);

		if(stripeOBJ.invoice.length > 5){
			$('#invoice_block').append(showMoreStripeINV);
		}
	}else if(offSet > 0  && (offSet+5) < stripeOBJ.invoice.length){
		var result = {};
		result.invoice = stripeOBJ.invoice.slice(offSet, (offSet+5));
		$('.stripe_inv_show_more').remove();
		$('#invoice_block').apped(getTemplate('stripe-invoices', result));
		$('#invoice_block').append(showMoreStripeINV);
	}else{
		var result = {};
		result.invoice = stripeOBJ.invoice.slice(offSet, stripeOBJ.invoice.length);
		$('.stripe_inv_show_more').remove();
		$('#invoice_block').append(getTemplate('stripe-invoices', result));
	}

}

function loadStripePayments(offSet){
	if(offSet == 0){
		var result = {};
		result.payments = stripeOBJ.payments.slice(0, 5);

		getTemplate('stripe-payments', result, undefined, function(template_pay){			
			$('#payments_block').append(template_pay);
		},null);

		if(stripeOBJ.payments.length > 5){
			$('#payments_block').append(showMoreStripePAY);
		}
	}else if(offSet > 0  && (offSet+5) < stripeOBJ.payments.length){
		var result = {};
		result.payments = stripeOBJ.payments.slice(offSet, (offSet+5));
		$('.stripe_pay_show_more').remove();
		$('#payments_block').apped(getTemplate('stripe-payments', result));
		$('#payments_block').append(showMoreStripePAY);
	}else{
		var result = {};
		result.payments = stripeOBJ.payments.slice(offSet, stripeOBJ.payments.length);
		$('.stripe_pay_show_more').remove();
		$('#payments_block').append(getTemplate('stripe-payments', result));
	}
}

/**
 * Initializes an AJAX queue request to retrieve Stripe customer details and
 * invoices based on given Stripe customer id
 * 
 * <p>
 * Request is added to queue to make the requests from all the widgets
 * synchronous
 * </p>
 * 
 * @param customer_id
 *            {@link String} Stripe customer id
 * @param callback
 *            Function to be executed on success
 */
function getStripeProfile(customer_id, callback, contact_id)
{
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve Stripe profile of customer
	 */
	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/stripe/" + Stripe_Plugin_Id + "/" + customer_id, 'json', function success(data)
	{
		console.log('In Stripe profile');
		console.log(data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, function error(data)
	{
		// If error occurs, show error in Stripe Panel
		stripeError(Stripe_PLUGIN_NAME, data.responseText);
	});
}

/**
 * Shows Stripe error message in the div allocated with given id
 * 
 * @param id
 *            div id
 * @param message
 *            error message
 */
function stripeError(id, message)
{
	// build JSON with error message
	var error_json = {};
	error_json['message'] = message;

	/*
	 * Get error template and fill it with error message and show it in the div
	 * with given id
	 */
	
	getTemplate('stripe-error', error_json, undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$('#' + id).html($(template_ui)); 
	}, '#' + id);
}

function startStripeWidget(contact_id){

	stripeOBJ = {};
	stripeINVCount = 1;
	stripePAYCount = 1;
	customer_id = 0;

	// Stripe widget name as a global variable
	Stripe_PLUGIN_NAME = "Stripe";

	// Stripe profile loading image declared as global
	STRIPE_PROFILE_LOAD_IMAGE = '<center><img id="stripe_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	// Retrieves widget which is fetched using script API
	var stripe_widget = agile_crm_get_widget(Stripe_PLUGIN_NAME);

	console.log('In Stripe');
	console.log(stripe_widget);

	// ID of the Stripe widget as global variable
	Stripe_Plugin_Id = stripe_widget.id;

	/*
	 * Gets Stripe widget preferences, required to check whether to show setup
	 * button or to fetch details. If undefined - considering first time usage
	 * of widget, setupStripeOAuth is shown and returned
	 */
	if (stripe_widget.prefs == undefined)
	{
		setupStripeOAuth();
		return;
	}

	// Parse string Stripe widget preferences as JSON
	var stripe_widget_prefs = JSON.parse(stripe_widget.prefs);
	
	console.log(stripe_widget_prefs);

	/*
	 * Retrieve name of the custom field in which Stripe customer IDs are
	 * stored. We store it as "stripe_field_name" in Stripe Widget preferences
	 */
	var stripe_custom_field_name = stripe_widget_prefs['stripe_field_name'];

	/*
	 * If stripe_custom_field_name is not defined, call setUpStripeCustomField
	 * method which asks the user to select the field in which Stripe customer
	 * IDs are stored from list of custom fields
	 */
	if (!stripe_custom_field_name)
	{
		setUpStripeCustomField(stripe_widget_prefs, contact_id);
		return;
	}

	/*
	 * If stripe_custom_field_name is defined, shows customer details and
	 * invoices from Stripe
	 */
	showStripeProfile(stripe_custom_field_name, contact_id);
	
}