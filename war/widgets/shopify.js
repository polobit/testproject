$(function()
								{
									// Shopify widget name as a global variable
									Shopify_PLUGIN_NAME = "Shopify";

									SHOPIFY_PROFILE_LOAD_IMAGE = '<center><img id="stripe_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

									// Retrieves widget which is fetched using script API
									var shopify_widget = agile_crm_get_widget(Shopify_PLUGIN_NAME);

									console.log('In Shopify');
									console.log(shopify_widget);

									// ID of the Shopify widget as global variable
									Shopify_Plugin_Id = shopify_widget.id;

									/*
									 * Gets Shopify widget preferences, required to check whether to show setup
									 * button or to fetch details. If undefined - considering first time usage
									 * of widget, setupStripeOAuth is shown and returned
									 */
									if (shopify_widget.prefs == undefined)
									{
									//	setupStripeOAuth();
										return;
									}

									// Parse string Shopify widget preferences as JSON
									var shopify_widget_prefs = JSON.parse(shopify_widget.prefs);
									
									console.log(shopify_widget_prefs);

									/*
									 * Retrieve name of the custom field in which Shopify customer IDs are
									 * stored. We store it as "shopify_field_name" in Shopify Widget preferences
									 */
									var shopify_custom_field_name = shopify_widget_prefs['shopify_field_name'];

									/*
									 * If shopify_custom_field_name is not defined, call setUpShopifyCustomField
									 * method which asks the user to select the field in which Shopify customer
									 * IDs are stored from list of custom fields
									 */
									if (!shopify_custom_field_name)
									{
										setUpShopifyCustomField(shopify_widget_prefs);
										return;
									}

									/*
									 * If shopify_custom_field_name is defined, shows customer details and
									 * invoices from Shopify
									 */
									showShopifyProfile(shopify_custom_field_name);

								});

								/**
								 * Shows setup if user adds Stripe widget for the first time. Uses ScribeServlet
								 * to create a client and get preferences and save it to the widget.
								 */
								function setupShopifyOAuth()
								{
									// Shows loading until the set up is shown
									$('#Shopify').html(SHOPIFY_PROFILE_LOAD_IMAGE);

									// URL to return, after authenticating from Stripe
									var callbackURL = window.location.href;

									console.log('In Shopify OAuth');

									/*
									 * Creates a URL, which on click can connect to scribe using parameters sent
									 * and returns back to the profile based on callbackURLL provided and saves
									 * widget preferences in widget based on Stripe_Plugin_Id
									 */
									var url = '/scribe?service=stripe&return_url=' + encodeURIComponent(callbackURL) + '&plugin_id=' + encodeURIComponent(Stripe_Plugin_Id);

									$('#Stripe')
											.html(
													'<div class="widget_content" style="border-bottom:none;line-height: 160%;">See the contact\'s subscriptions history and payments from your Stripe account.<p style="margin: 10px 0px 5px 0px;"></p><a class="btn" href=' + url + '>Link Your Stripe</a></div>');

								}

								/**
								 * Shows setup to select Stripe custom field from list of custom fields in which
								 * Stripe Customer details are stored
								 * 
								 * @param stripe_widget_prefs
								 *            JSON Stripe widget preferences
								 */
								function setUpShopifyCustomField(shopify_widget_prefs)
								{
									// Retrieve all custom from Agile account
									$.get("/core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT", function(data)
									{
										// Include 'stripe_field_name' to stripe_widget_prefs and save
										shopify_widget_prefs['custom_fields'] = data;

										
										// Fill template with custom fields and show it in Stripe widget panel
										$('#Shopify').html(getTemplate('shopify-custom-field', shopify_widget_prefs));

									}, "json").error(function(data)
									{
										// If error occurs, show error in Stripe Panel
										shopifyError(Shopify_PLUGIN_NAME, data.responseText);
									});

									/*
									 * On click of save button after setting Up Stripe custom field, widget
									 * preferences are saved including stripe_field_name and Stripe profile of
									 * customer is shown
									 */
									$('#save_shopify_name').die().live('click', function(e)
									{
										e.preventDefault();

										// Get the selected value from list of custom fields
										var shopify_custom_field_name = $('#shopify_custom_field_name').val();
										
										if(!shopify_custom_field_name)
											return;

										// Include 'shopify_field_name' to shopify_widget_prefs and save
										shopify_widget_prefs['shopify_field_name'] = shopify_custom_field_name ;

										// preferences are saved and Stripe profile of customer is shown
										agile_crm_save_widget_prefs(Shopify_PLUGIN_NAME, JSON.stringify(shopify_widget_prefs), function(data)
										{
											showShopifyProfile(shopify_custom_field_name);
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
								function showShopifyProfile(shopify_custom_field_name)
								{
									// Shows loading until the profile is retrieved
									$('#Shopify').html(SHOPIFY_PROFILE_LOAD_IMAGE);

									/*
									 * Retrieves the customer id of Stripe related to contact which is saved in
									 * Stripe custom field
									 */
									var customer_id = agile_crm_get_contact_property(shopify_custom_field_name);
									console.log("Shopify customer id " + customer_id);

									// If customer id is undefined, message is shown
									if (!customer_id)
									{
										
										 $('#shopify_contact_id_save').die().live('click', function(e){
											   
										   e.preventDefault();

											   if(!isValidForm($('#shopify_contact_id_form')))
											    return;
											   
											   customer_id = $('#shopify_contact_id').val();
											   
											   agile_crm_save_contact_property(shopify_custom_field_name, "", customer_id, "CUSTOM");
											   
											   showShopifyProfile(shopify_custom_field_name);
											   return;
											   
											  });
									
									
										 $('#Shopify').html("<div><form class='widget_content' style='border-bottom:none;' id='shopify_contact_id_form' name='shopify_contact_id_form' method='post'>" +
										    "<fieldset><p>Please provide the Shopify customer id for this contact</p>" +
										    "<div class='control-group' style='margin-bottom:0px'><div class='controls'>" +
										    "<input type='text' class='required' name='shopify_contact_id' style='width:90%' id='shopify_contact_id' placeholder='Shopify customer id' onkeydown='if (event.keyCode == 13) { event.preventDefault(); }'></input>" +
										    "</div></div><a href='#' class='btn' id='shopify_contact_id_save'>Save</a>" +
										    "</fieldset></form></div>");
										  
										 return;
									}
									// Retrieve Stripe profile and shows profile in Stripe panel on success
									getShopifyProfile(customer_id, function(data)
									{
										// Get and Fill the template with data
													console.log(data.length);
													console.log(data);
										var shopify_template = $(getTemplate("shopify-profile", data));

										// Load jquery time ago function to show time ago in invoices
										head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
										{
											$(".time-ago", shopify_template).timeago();
										});

										// Show the template in Stripe widget panel
										$('#Shopify').html(shopify_template);
									});

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
								function getShopifyProfile(customer_id, callback)
								{
									/*
									 * Calls queueGetRequest method in widget_loader.js, with queue name as
									 * "widget_queue" to retrieve Stripe profile of customer
									 */
									queueGetRequest("widget_queue", "/core/api/widgets/shopify/" + Shopify_Plugin_Id + "/" + customer_id, 'json', function success(data)
									{
										console.log('In Shopify profile ');
										console.log("my order is "+data);

										// If defined, execute the callback function
										if (callback && typeof (callback) === "function")
											callback(data);

									}, function error(data)
									{
										// If error occurs, show error in Shopify Panel
										shopifyError(Shopify_PLUGIN_NAME, data.responseText);
									});
								}

								/**
								 * Shows Shopify error message in the div allocated with given id
								 * 
								 * @param id
								 *            div id
								 * @param message
								 *            error message
								 */
								function shopifyError(id, message)
								{
									// build JSON with error message
									var error_json = {};
									error_json['message'] = message;

									/*
									 * Get error template and fill it with error message and show it in the div
									 * with given id
									 */
									$('#' + id).html(getTemplate('shopify-error', error_json));
								}

