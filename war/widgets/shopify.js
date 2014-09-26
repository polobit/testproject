$(function()
{
				// Shopify widget name as a global variable
				Shopify_PLUGIN_NAME = "Shopify";

				console.log(" welcome to shopify plugin..")

				SHOPIFY_PROFILE_LOAD_IMAGE = '<center><img id="shopify_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

				// Retrieves widget which is fetches using widget name
				var shopify_widget = agile_crm_get_widget(Shopify_PLUGIN_NAME);

				console.log('In Shopify');
				console.log("found widget " + shopify_widget);

				// ID of the Shopify widget as global variable
				Shopify_Plugin_Id = shopify_widget.id;

				console.log("showing shopify plugin id " + Shopify_Plugin_Id);

				// Email as global variable
				Email = agile_crm_get_contact_property('email');

				console.log("email search found " + Email);

				// Email list as global variable
				EmailList = agile_crm_get_contact_properties_list("email");

				console.log("List of email in contact " + EmailList);

				var first_name = agile_crm_get_contact_property("first_name");
				var last_name = agile_crm_get_contact_property("last_name");
				console.log("found first name " + first_name);
				console.log("found last name" + last_name);

				if (last_name == undefined || last_name == null)
								last_name = ' ';
				showShopifyClient();

});

function showShopifyClient()
{
				console.log("calling show shopify client..");

				if (EmailList.length == 0)
				{
								shopifyError(Shopify_PLUGIN_NAME, "Please provide email for this contact");
								return;
				}
				var emailArray = [];
				for (var i = 0; i < EmailList.length; i++)
				{
								emailArray[i] = EmailList[i].value;
				}
				console.log(emailArray);
				console.log("In show Shopify Client" + Shopify_Plugin_Id);
				
				queueGetRequest("widget_queue", "/core/api/widgets/shopify/" + Shopify_Plugin_Id + "/" + emailArray, "json",
			  function success(data)
			   	{
								console.log('In Shopify clients fetching data..');
								console.log(data)
								
											// If data is not defined return
								if (data)
								{
												var template = $('#shopify').html(getTemplate('shopify-profile', data));
												console.log("libpath is" + LIB_PATH);
												console.log(template)
												head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
												{
																$(".time-ago", template).timeago();
												});

								}
								else
								{
												shopifyError(Shopify_PLUGIN_NAME, data.responseText);
								}

				  }, 
				 function error(data)
				   {
								console.log("In Shopify error ");

								console.log("error response " +data.responseText);
								// Remove loading on error
							 $('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();

								var resText = data.responseText;
								if (resText.indexOf('No customer found') != -1)
								{
									createContact(resText);
								}
								else if (resText.indexOf('No order exist') != -1)
								{
									var invoice_json = {};
									invoice_json['ContactID'] = data.Contact.ContactID;

									/*
									 * Get error template and fill it with error message and show it in
									 * the div with given id
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
