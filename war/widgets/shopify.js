function showShopifyClient(shop)
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

				queueGetRequest("widget_queue", "/core/api/widgets/shopify/" + Shopify_Plugin_Id + "/" + emailArray, "json", function success(data)
				{
								console.log('In Shopify clients fetching data..');
								console.log(data)

								// If data is not defined return
								if (data)
								{
												var name = agile_crm_get_contact_property("first_name") + " " + agile_crm_get_contact_property("last_name");
												var d = data;
												console.log("total spent " + d[0].customer.total_spent);
												data.unshift({ "name" : name,"id":d[0].customer.id, "shop" : shop, "total_spent" : d[0].customer.total_spent, "currency" : d[0].currency });
												console.log("customer info " + name);
												console.log("final data " + data);
												var template = getTemplate('shopify-profile', data);
												console.log("libpath is" + LIB_PATH);
												console.log(template)
												head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
												{
																$(".time-ago", template).timeago();
												});

												$('#Shopify').html(template);

								}
								else
								{
												shopifyError(Shopify_PLUGIN_NAME, data.responseText);
								}

				}, function error(data)
				{
								console.log("In Shopify error ");
								console.log(data);
								console.log("error response " + data);
								// Remove loading on error
								$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();

								var resText = data.responseText;
								if (resText.indexOf('No Customer found') != -1)
								{
												console.log("No customer found")
												createContact(resText);
								}

								else
								{
												shopifyError("Shopify", resText);
								}

				});
}

function createContact(message)
{

				$('#' + Shopify_PLUGIN_NAME).html(getTemplate('shopify-profile-addcontact'));
}

function addContactToShopify(shop)
{
				var url = "https://" + shop + "/admin/customers/new";
				window.open(url, "_blank");

}

function shopifyError(id, message)
{
				// build JSON with error message
				var error_json = {};
				error_json['message'] = message;

				/*
				 * Get error template and fill it with error message and show it in the div
				 * with given id
				 */

				console.log('shopify error ');
				$('#' + id).html(getTemplate('shopify-error', error_json));

}

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

						var shopify_widget_prefs = JSON.parse(shopify_widget.prefs);
						var shop = shopify_widget_prefs['shop'];
						console.log("shop name" + shop);

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
						showShopifyClient(shop);

						$('#shopify_add_contact').die().live('click', function(e)
						{
										e.preventDefault();

										addContactToShopify(shop);
						});

						$('.order').die().live('click', function(e)
						{
										e.preventDefault();
										var orderId = $(this).attr('value');
										console.log("order id is " + orderId);
										// checking for data existence in div
										/*
										 * if ($('#collapse-' + orderId).text().trim() === "") {
										 */
										$('#collapse-' + orderId).html(SHOPIFY_PROFILE_LOAD_IMAGE);

										$.ajax({ url : "/core/api/widgets/shopify/items/" + Shopify_Plugin_Id + "/" + orderId, dataType : "json", success : function(data)
										{
														console.log("success data"+ data);
														console.log("in success order fetch.");
														$('#collapse-' + orderId).html(getTemplate('shopify-line-item', data));
														$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();
										}, error : function(data)
										{
														console.log("in item fetch error" + data);
														shopifyError(Shopify_PLUGIN_NAME, data)
														$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();
										} });
							
										if ($('#collapse-' + orderId).hasClass("collapse"))
										{
														$('#collapse-' + orderId).removeClass("collapse");
										}
										else
										{
														$('#collapse-' + orderId).addClass("collapse");
										}

						});

		});
