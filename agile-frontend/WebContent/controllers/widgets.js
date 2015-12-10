/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router
								.extend({

												routes : {

												"add-widget" : "addWidget",

												"Linkedin" : "Linkedin", "Linkedin/:id" : "Linkedin",

												"Twitter" : "Twitter", "Twitter/:id" : "Twitter",
												
												"GooglePlus" : "GooglePlus", "GooglePlus/:id" : "GooglePlus",

												"Rapleaf" : "Rapleaf", "Rapleaf/:id" : "Rapleaf",

												"ClickDesk" : "ClickDesk", "ClickDesk/:id" : "ClickDesk",

												"HelpScout" : "HelpScout", "HelpScout/:id" : "HelpScout",

												"Zendesk" : "Zendesk", "Zendesk/:id" : "Zendesk",

												"Sip" : "Sip", "Sip/:id" : "Sip",

												"Twilio" : "Twilio", "Twilio/:id" : "Twilio",
												
												"TwilioIO" : "TwilioIO", "TwilioIO/:id" : "TwilioIO",

												"FreshBooks" : "FreshBooks", "FreshBooks/:id" : "FreshBooks",

												"Stripe" : "Stripe", "Stripe/:id" : "Stripe",

												"Custom-widget" : "Custom", "Custom-widget/:id" : "Custom",

												"Xero" : "Xero", "Xero/:id" : "Xero",

												"QuickBooks" : "QuickBooks", "QuickBooks/:id" : "QuickBooks",

												"Facebook" : "Facebook", "Facebook/:id" : "Facebook", "Shopify" : "Shopify", "Shopify/:id" : "Shopify",

												"Chargify" : "Chargify", "Chargify/:id" : "Chargify",
												
												"callscript/rules" : "CallScriptShow", "callscript/add-rules" : "CallScriptAdd","callscript/editrules/:id" : "CallScriptEdit",
												"callscript" : "CallScript", "callscript/:id" : "CallScript",												

												"sync" : "contactSync", "sync/contacts" : "google_apps_contacts", "sync/calendar" : "google_apps_calendar", "sync/stripe-import" : "stripe_sync",
																"sync/shopify" : "shopify", "sync/salesforce" : "salesforce", "sync/zoho-import" : "zoho_sync", "sync/quickbook" : "quickbook_import",
																"sync/xero" : "xero_import","sync/freshbooks":"freshbooks_sync","sync/freshbooks/setting":"freshbooks_sync_setting"},

												/**
												 * Adds social widgets (twitter, linkedIn and RapLeaf) to a contact
												 */
												addWidget : function()
												{
																$("#content").html(getTemplate("settings"), {});

																this.Catalog_Widgets_View = new Base_Collection_View({ url : '/core/api/widgets/default', restKey : "widget", templateKey : "widgets-add",
																				sort_collection : false, individual_tag_name : 'div', postRenderCallback : function(el)
																				{
																								build_custom_widget_form(el);
																				} });

																// Append widgets into view by organizing them
																this.Catalog_Widgets_View.appendItem = organize_widgets;

																// Fetch the list of widgets
																this.Catalog_Widgets_View.collection.fetch({
																	success: function(data) {
																		console.log(data.where({"is_added" : true}));
																		_plan_restrictions.process_widgets(data);
																	}
																});

																// Shows available widgets in the content
																$('#prefs-tabs-content').html(this.Catalog_Widgets_View.el);

																$('#PrefsTab .active').removeClass('active');
																$('.add-widget-prefs-tab').addClass('active');
												},

												/**
												 * Manages Linked in widget
												 */
												Linkedin : function(id)
												{
																if (!id)
																{
																				show_set_up_widget("Linkedin", 'linkedin-login',
																												'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href) + "/linkedin");
																}
																else
																{
																				if (!isNaN(parseInt(id)))
																				{
																								$.getJSON("core/api/widgets/social/profile/" + id,
																																								function(data)
																																								{
																																												set_up_access(
																																																				"Linkedin",
																																																				'linkedin-login',
																																																				data,
																																																				'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"));

																																								}).error(
																																								function(data)
																																								{
																																												console.log(data);
																																												setUpError("Linkedin", "widget-settings-error", data.responseText,
																																																				window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1");

																																								});
																								return;

																				}

																				$.getJSON("core/api/widgets/Linkedin",
																																				function(data1)
																																				{
																																								console.log(data1);

																																								if (data1)
																																								{
																																												$
																																																				.getJSON(
																																																												"core/api/widgets/social/profile/" + data1.id,
																																																												function(data)
																																																												{
																																																																set_up_access(
																																																																								"Linkedin",
																																																																								'linkedin-login',
																																																																								data,
																																																																								'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"),
																																																																								data1);

																																																												})
																																																				.error(
																																																												function(data)
																																																												{

																																																																console.log(data);
																																																																setUpError("Linkedin", "widget-settings-error", data.responseText,
																																																																								window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1", data1);

																																																												});
																																												return;
																																								}
																																								else
																																								{
																																												show_set_up_widget("Linkedin", 'linkedin-login',
																																																				'/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href));
																																								}
																																				});

																}

												},

												/**
												 * Manages Twitter widget
												 */
												Twitter : function(id)
												{

																if (!id)
																{
																				show_set_up_widget("Twitter", 'twitter-login',
																												'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href) + "/twitter");
																}
																else
																{
																				if (!isNaN(parseInt(id)))
																				{
																								$
																																.getJSON(
																																								"core/api/widgets/social/profile/" + id,
																																								function(data)
																																								{
																																												set_up_access(
																																																				"Twitter",
																																																				'twitter-login',
																																																				data,
																																																				'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"));

																																								}).error(
																																								function(data)
																																								{

																																												console.log(data);
																																												setUpError("Twitter", "widget-settings-error", data.responseText,
																																																				window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1");

																																								});
																								return;

																				}

																				$
																												.getJSON(
																																				"core/api/widgets/Twitter",
																																				function(data1)
																																				{
																																								console.log(data1);

																																								if (data1)
																																								{
																																												$
																																																				.getJSON(
																																																												"core/api/widgets/social/profile/" + data1.id,
																																																												function(data)
																																																												{
																																																																set_up_access(
																																																																								"Twitter",
																																																																								'twitter-login',
																																																																								data,
																																																																								'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"),
																																																																								data1);

																																																												}).error(
																																																												function(data)
																																																												{
																																																																setUpError("Twitter", "widget-settings-error", data.responseText,
																																																																								window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1", data1);
																																																												});

																																												return;

																																								}
																																								else
																																								{
																																												show_set_up_widget("Twitter", 'twitter-login',
																																																				'/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href));
																																								}
																																				});

																}

												},

												/**
												 * Manages Rapleaf widget
												 */
												Rapleaf : function(id)
												{
																if (!id)
																				show_set_up_widget("Rapleaf", 'rapleaf-login');
																else
																				fill_form(id, "Rapleaf", 'rapleaf-login');
												},

												/**
												 * Manages Clickdesk widget
												 */
												ClickDesk : function(id)
												{
																if (!id)
																				show_set_up_widget("ClickDesk", 'clickdesk-login');
																else
																				fill_form(id, "ClickDesk", 'clickdesk-login');

												},

												/**
												 * Manage HelpScout Widget.
												 */
												HelpScout : function(id)
												{
																if (!id)
																				show_set_up_widget("HelpScout", "helpscout-login");
																else
																				fill_form(id, "HelpScout", 'helpscout-login')
												},

												/**
												 * Manages Zendesk widget
												 */
												Zendesk : function(id)
												{
																if (!id)
																				show_set_up_widget("Zendesk", 'zendesk-login');
																else
																				fill_form(id, "Zendesk", 'zendesk-login');

												},

												/**
												 * Manages Sip widget
												 */
												Sip : function(id)
												{
																if (!id)
																				show_set_up_widget("Sip", 'sip-login');
																else
																				fill_form(id, "Sip", 'sip-login');

												},
												
												/**
												 * Manages TwilioIO widget
												 */
												TwilioIO : function(id)
												{
													if (!id)
														show_set_up_widget("TwilioIO", 'twilioio-login');
													else
														{
														  fill_form(id, "TwilioIO", 'twilioio-login');
														  fill_twilioio_numbers();
														}
												},

												/**
												 * Manages Twilio widget
												 */
												Twilio : function(id)
												{

																if (!id)
																{
																				show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
																}

																else
																{

																				if (!isNaN(parseInt(id)))
																				{
																								$.getJSON(
																																"/core/api/widgets/twilio/numbers/" + id,
																																function(data)
																																{
																																				// If data is not defined return
																																				if (!data)
																																								return;

																																				set_up_access("Twilio", 'twilio-login', data,
																																												encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twilio/twilio"));

																																}).error(
																																function(data)
																																{
																																				// Append the url with the random
																																				// number in
																																				// order to differentiate the same
																																				// action
																																				// performed more than once.
																																				var flag = Math.floor((Math.random() * 10) + 1);
																																				setUpError("Twilio", "widget-settings-error", data.responseText,
																																												window.location.protocol + "//" + window.location.host + "/#Twilio/twilio" + flag);
																																});

																								return;

																				}

																				$.getJSON("core/api/widgets/Twilio", function(data)
																				{
																								console.log(data);

																								if (data)
																								{
																												console.log(data);
																												$.getJSON("/core/api/widgets/twilio/numbers/" + data.id, function(data1)
																												{
																																if (!data1)
																																				return;

																																set_up_access("Twilio", 'twilio-login', data1, encodeURIComponent(window.location.href), data);

																												}).error(
																																				function(data)
																																				{
																																								// Append the
																																								// url with the
																																								// random number
																																								// in order to
																																								// differentiate
																																								// the same
																																								// action
																																								// performed
																																								// more than
																																								// once.
																																								var flag = Math.floor((Math.random() * 10) + 1);

																																								setUpError("Twilio", "widget-settings-error", data.responseText,
																																																window.location.protocol + "//" + window.location.host + "/#Twilio/twilio" + flag, data);
																																				});

																												return;

																								}
																								else
																								{
																												show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
																								}
																				});

																				// window.location.href = "/#add-widget";
																}

												},

												/**
												 * Manages FreshBooks widget
												 */
												FreshBooks : function(id)
												{
																if (!id)
																				show_set_up_widget("FreshBooks", 'freshbooks-login');
																else
																				fill_form(id, "FreshBooks", 'freshbooks-login');

												},

												/**
												 * Manages Stripe widget
												 */
												Stripe : function(id)
												{

																if (!id)
																{
																				show_set_up_widget("Stripe", 'stripe-login', '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href) + "/stripe");
																}
																else
																{
																				{	$.getJSON("core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT",
																																								function(data)
																																								{
																																												set_up_access("Stripe",'stripe-login',data,
																																																				'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"));
																																								});
																								return;

																				}

																				$.getJSON("core/api/widgets/Stripe",function(data1)
																																				{
																																								console.log(data1);

																																								if (data1)
																																								{
																																												$.getJSON(	"core/api/custom-fields/scope?scope=CONTACT&type=TEXT",
																																																												function(data)
																																																												{
																																																																set_up_access(
																																																																								"stripe",
																																																																								'stripe-login',
																																																																								data,
																																																																								'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"),
																																																																								data1);
																																																												});
																																												return;

																																								}
																																								else
																																								{
																																												show_set_up_widget("Stripe", 'stripe-login',
																																																				'/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href));
																																								}
																																				});
																}
												},
												

												/**
												 * Manage Shopify Widget
												 */
												Shopify : function(id)
												{

																 if(!id){
															       show_set_up_widget("Shopify", "shopify-login");
																 }
																 else{ 
																 			
																 				
																 				show_set_up_widget("Shopify","shopify-revoke-access")
																 		
																 }
												},


												/**
												 * Manages Xero widget
												 */

												Xero : function(id)
												{
																if (!id)
																				show_set_up_widget(
																												"Xero",
																												'xero-login',
																												'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?data="));
																else
																{
																				{
																								$
																																.getJSON(
																																								"core/api/widgets/Xero",
																																								function(data)
																																								{
																																									if(typeof data.prefs != "undefined") {
																																										data.prefsObj = JSON.parse(data.prefs);
																																									}
																																												set_up_access(
																																																				"Xero",
																																																				'xero-login',
																																																				data,
																																																				'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?data="));
																																								});
																								return;

																				}
																				$
																												.getJSON(
																																				"core/api/widgets/Xero",
																																				function(data1)
																																				{
																																								console.log(data1);

																																								if (data1)
																																								{
																																												$
																																																				.getJSON(
																																																												"core/api/widgets/Xero",
																																																												function(data)
																																																												{
																																																																set_up_access(
																																																																								"Xero",
																																																																								'xero-login',
																																																																								data,
																																																																								'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?data="),
																																																																								data1);
																																																												});
																																												return;

																																								}
																																								else
																																								{
																																												show_set_up_widget(
																																																				"Xero",
																																																				'xero-login',
																																																				'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?data="));
																																								}
																																				});
																}

												},

												/**
												 * Manages QuickBooks widget
												 */
												QuickBooks : function(id)
												{
																if (!id)
																				show_set_up_widget("QuickBooks", 'quickbooks-login',
																												'/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks");
																else
																{
																				$.getJSON("core/api/widgets/QuickBooks", function(data1)
																				{
																								console.log(data1);

																								if (data1)
																								{
																												$.getJSON("core/api/custom-fields", function(data)
																												{
																																set_up_access("QuickBooks", 'quickbooks-login', data,
																																								'/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks", data1);
																												});
																												return;

																								}
																								else
																								{
																												show_set_up_widget("QuickBooks", 'quickbooks-login',
																																				'/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks");
																								}
																				});

																}
												},

												/**
												 * Manages Facebook widget
												 */
												Facebook : function(id)
												{
																if (!id)
																				show_set_up_widget("Facebook", 'facebook-login',
																												'/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.href) + "/facebook");
																else
																{
																				if (!isNaN(parseInt(id)))
																				{
																								$
																																.getJSON(
																																								"/core/api/widgets/facebook/currentUserProfile/" + id,
																																								function(data)
																																								{
																																												console.log("data is")
																																												console.log(data)
																																												set_up_access(
																																																				"Facebook",
																																																				'facebook-login',
																																																				data,
																																																				'/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Facebook/facebook"));

																																								}).error(
																																								function(data)
																																								{

																																												console.log(data);
																																												setUpError("Facebook", "widget-settings-error", data.responseText,
																																																				window.location.protocol + "//" + window.location.host + "/#Facebook/facebook1");

																																								});
																								return;

																				}

																				$
																												.getJSON(
																																				"core/api/widgets/Facebook",
																																				function(data1)
																																				{
																																								console.log(data1);

																																								if (data1)
																																								{
																																												$
																																																				.getJSON(
																																																												"core/api/widgets/facebook/currentUserProfile/" + data1.id,
																																																												function(data)
																																																												{
																																																																set_up_access(
																																																																								"Facebook",
																																																																								'facebook-login',
																																																																								data,
																																																																								'/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Facebook/facebook"),
																																																																								data1);

																																																												})
																																																				.error(
																																																												function(data)
																																																												{
																																																																setUpError("Facebook", "widget-settings-error", data.responseText,
																																																																								window.location.protocol + "//" + window.location.host + "/#Facebook/facebook1", data1);
																																																												});

																																												return;

																																								}
																																								else
																																								{
																																												show_set_up_widget("Facebook", 'facebook-login',
																																																				'/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.href));
																																								}
																																				});

																}
												},

												/**
												 * Manage Chargify Widget.
												 */
												Chargify : function(id)
												{
																if (!id)
																				show_set_up_widget("Chargify", "chargify-login");
																else
																				fill_form(id, "Chargify", 'chargify-login')
												},

												/**
												 * Manages widget added by user
												 */
												Custom : function(id)
												{
																if (id)
																{
																				console.log($(this))
																				divClone = $(this).clone();
																				var widget_custom_view = new Base_Model_View({ url : "/core/api/widgets/custom", template : "add-custom-widget", isNew : true,
																								postRenderCallback : function(el)
																								{
																												console.log('In post render callback');
																												console.log(el);

																												$('#script_type').die().live('change', function(e)
																												{
																																var script_type = $('#script_type').val();
																																if (script_type == "script")
																																{
																																				$('#script_div').show();
																																				$('#url_div').hide();
																																				return;
																																}

																																if (script_type == "url")
																																{
																																				$('#script_div').hide();
																																				$('#url_div').show();
																																}
																												});

																								}, saveCallback : function(model)
																								{
																												console.log('In save callback');

																												console.log(model);

																												if (model == null)
																																alert("A widget with this name exists already. Please choose a different name");

																												App_Widgets.Catalog_Widgets_View.collection.add(model);
																												$("#custom-widget").replaceWith(divClone);
																								} });

																				$('#custom-widget', el).html(widget_custom_view.render(true).el);

																				$('#cancel_custom_widget').die().live('click', function(e)
																				{
																								// Restore element back to original
																								$("#custom-widget").replaceWith(divClone);
																				});

																}
																// fill_form(id, "Custom", 'custom-widget-settings');
												},

												/**
												 * Contact synchronization with Google
												 */
												contactSync : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');
																// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail


																this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'admin-settings-import-google-contacts', });

																// Adds header
																$('#prefs-tabs-content')
																								.html(
																																'<div class="row-fluid prefs-datasync"><h2 class="widget-head">Google <small>import Contacts from Google</small></h2><div class="span11 no-mg-l"><div id="contact-prefs" class="span4" style="margin-left:0px;"></div>' + '<div id="calendar-prefs" class="span4" style="margin-left:0px;"></div><div id="email-prefs" class="span4" style="margin-left:0px;"></div></div></div>' + '<div class="row-fluid prefs-datasync"><h2 class="widget-head">E-commerce <small>import Contacts from E-commerce</small></h2><div class="span11 no-mg-l"><div id ="shopify"></div></div></div>' +
																												
																																'<div class="row-fluid prefs-datasync"><h2 class="widget-head">Payment <small>import Contacts from payment gateway</small></h2><div class="span11 no-mg-l"><div id ="stripe"></div></div></div>'+
																																'<div class="row-fluid prefs-datasync"><h2 class="widget-head">Accounting <small>import Contacts from Accounting</small></h2><div class="span11 no-mg-l"><div class="span4" id ="freshbook"></div><div class="span4" id ="quickbook"></div></div>'


																								);

																// Adds Gmail Prefs
																$('#contact-prefs').append(this.contact_sync_google.render().el);

																this.calendar_sync_google = new Base_Model_View({ url : 'core/api/calendar-prefs/get', template : 'import-google-calendar', });

																// console.log(getTemplate("import-google-contacts", {}));
																$('#calendar-prefs').append(this.calendar_sync_google.render().el);

																/* Add E-commerce Prefs template */
																this.shopify_sync = new Base_Model_View({ url : 'core/api/shopify/import-settings',
																				template : 'admin-settings-import-shopify-contact-syncPrefs' });
																$('#shopify').append(this.shopify_sync.render().el);
																
																this.freshbooks_sync = new Base_Model_View({url:'core/api/freshbooks/import-settings',template:'admin-settings-import-freshbooks-contacts-syncPrefs'});
																$('#freshbook').append(this.freshbooks_sync.render().el);
																/* salesforce import template */
																// this.salesforce = new
																// Base_Model_View({url:'core/api/salesforce/get-prefs',template:'admin-settings-salesforce-contact-sync'});
																// $('#force').append(this.salesforce.render().el);
																/* salesforce import template */
																// this.salesforce = new
																// Base_Model_View({url:'core/api/salesforce/get-prefs',template:'admin-settings-salesforce-contact-sync'});
																// $('#force').append(this.salesforce.render().el);
																// adding zoho crm contact sync template preferences
																this.zoho_sync = new Base_Model_View({ url : 'core/api/zoho/import-settings', template : 'admin-settings-import-zoho-contact-sync' });
																$('#zoho').append(this.zoho_sync.render().el);
																// model for quickbook import
																this.quickbook_sync = new Base_Model_View({ url : 'core/quickbook/import-settings', template : 'admin-settings-import-quickbook' });
																$('#quickbook').append(this.quickbook_sync.render().el);

																// model for xero import
																this.xero_sync = new Base_Model_View({ url : 'core/xero/import-settings', template : 'admin-settings-import-xeroSync' });
																$('#xero').append(this.xero_sync.render().el);

																/*
																 * Add stripe payment gateway contact sync template preferences
																 */
																this.stripe_sync = new Base_Model_View({ url : 'core/api/stripe/import-settings', template : 'admin-settings-import-stripe-contact-sync' });

																$('#stripe').append(this.stripe_sync.render().el);

																var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
																var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data });
																itemView.model.fetch();

																// Adds Gmail Prefs
																$('#email-prefs').html(itemView.render().el);

																// Gets IMAP Prefs
																/*
																 * var itemView2 = new Base_Model_View({ url : '/core/api/imap',
																 * template : "settings-imap-prefs" }); // Appends IMAP
																 * $('#prefs-tabs-content').append(itemView2.render().el);
																 * $('#PrefsTab .active').removeClass('active');
																 * $('.email-tab').addClass('active');
																 */
												},

												google_apps_contacts : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																var options = { url : "core/api/contactprefs/GOOGLE", template : "admin-settings-import-google-contacts-setup",
																				postRenderCallback : function(el)
																				{
																								console.log(el);
																								// App_Settings.setup_google_contacts.model =
																								// App_Settings.contact_sync_google.model;
																				} };

																var fetch_prefs = true;
																if (this.contact_sync_google && this.contact_sync_google.model)
																{
																				options["model"] = this.contact_sync_google.model;
																				fetch_prefs = false;
																}
																else
																{
																				this.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'import-google-contacts', });
																}

																this.setup_google_contacts = new Base_Model_View(options);

																if (fetch_prefs)
																{
																				$("#prefs-tabs-content").html(this.setup_google_contacts.render().el);
																				return;
																}
																$("#prefs-tabs-content").html(this.setup_google_contacts.render(true).el);
												},

												google_apps_calendar : function()
												{
																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																var options = {

																url : "core/api/calendar-prefs/get", template : "import-google-calendar-setup" };

																var fetch_prefs = true;
																if (this.calendar_sync_google && this.calendar_sync_google.model)
																{
																				options["model"] = this.calendar_sync_google.model;
																				fetch_prefs = false;
																}

																this.setup_google_calendar = new Base_Model_View(options);

																if (fetch_prefs)
																{
																				$("#prefs-tabs-content").html(this.setup_google_calendar.render().el);
																				return;
																}
																$("#prefs-tabs-content").html(this.setup_google_calendar.render(true).el);
												},

												stripe_sync : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																this.stripe_sync_setting = new Base_Model_View({ url : 'core/api/stripe/import-settings',
																				template : 'admin-settings-import-stripe-contact-sync-prefs', saveCallback : function(model)
																				{
																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.stripe_sync_setting.render().el);
												},

												shopify : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																this.shopify_sync_setting = new Base_Model_View({ url : 'core/api/shopify/import-settings', template : 'admin-settings-import-shopify-prefs',
																				saveCallback : function(model)
																				{

																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.shopify_sync_setting.render().el);
												},
												
												freshbooks_sync : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																this.freshbooks_sync_setting = new Base_Model_View({ url : 'core/api/freshbooks/import-settings', template : 'admin-settings-import-freshbooks-contacts-form',
																				saveCallback : function(model)
																				{

																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.freshbooks_sync_setting.render().el);
												},
												
												freshbooks_sync_setting:function(){
																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');
																this.freshbooks_import_settings = new Base_Model_View({ url : 'core/api/freshbooks/import-settings', template : 'admin-settings-import-freshbooks-settings',
																				saveCallback : function(model)
																				{

																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.freshbooks_import_settings.render().el);			
												},

												zoho_sync : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');

																this.zoho_sync_settings = new Base_Model_View({ url : 'core/api/zoho/import-settings', template : 'admin-settings-import-zoho-prefs',
																				saveCallback : function(model)
																				{
																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.zoho_sync_settings.render().el);

												},

												quickbook_import : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');
																this.quickbook_import_settings = new Base_Model_View({ url : 'core/quickbook/import-settings',
																				template : 'admin-settings-import-quickbook-settings', saveCallback : function(model)
																				{

																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.quickbook_import_settings.render().el);

												},

												xero_import : function()
												{

																$("#content").html(getTemplate("settings"), {});

																$('#PrefsTab .active').removeClass('active');
																$('.contact-sync-tab').addClass('active');
																this.xero_import_settings = new Base_Model_View({ url : 'core/xero/import-settings', template : 'admin-settings-import-xero-settings',
																				saveCallback : function(model)
																				{

																								showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
																				} });

																$("#prefs-tabs-content").html(this.xero_import_settings.render().el);

												},
												
												//Reddy code
												/**
												 * Manages GooglePlus widget
												 */
												GooglePlus: function(id) {

												    if (!id) {
												        show_set_up_widget("GooglePlus", 'googleplus-login',
												            '/scribe?service=googleplus&return_url=' + encodeURIComponent(window.location.href) + "/googleplus");
												    } else {
												    	
												    	var widgetDetails = $.parseJSON(
											    		        $.ajax({
											    		            url: "core/api/widgets/GooglePlus", 
											    		            async: false,
											    		            dataType: 'json'
											    		        }).responseText
											    		    );
												    	
												    	console.clear();
												    	console.log("In google Plus widget Router");
											    		console.log(widgetDetails);												    		
											    		
											    		if (widgetDetails) {
								                        	 widgetPrefGP = JSON.parse(widgetDetails.prefs);
								                        	
								                        	var userData = $.parseJSON(
												    		        $.ajax({
												    		            url: "https://www.googleapis.com/plus/v1/people/me?access_token="+ widgetPrefGP['access_token'], 
												    		            async: false,
												    		            dataType: 'json'
												    		        }).responseText
												    		    );
								                        	
								                        	set_up_access(
										                            "GooglePlus",
										                            'googleplus-login',
										                            userData,
										                            '/scribe?service=googleplus&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#GooglePlus/googleplus"));
								                        	
								                        	
								                        } else {
								                            show_set_up_widget("GooglePlus", 'googleplus-login',
								                            		'/scribe?service=googleplus&return_url=' + encodeURIComponent(window.location.href) + "/googleplus");												                            
								                            return;
								                        }
												    }

												},//End of Gplus
												
												/**
												 * Manages CallScript widget
												 */
												CallScript : function(id)
												{
																if (!id)
																				show_set_up_widget("CallScript", 'callscript-login');
																else
																				fill_form(id, "CallScript", 'callscript-login');
																                adjust_form();

												},
												
												/**
												 * Show CallScript rules
												 */
												CallScriptShow : function()
												{	
													showCallScriptRule();
												},
												
												/**
												 * Add CallScript rules
												 */
												CallScriptAdd : function()
												{
													addCallScriptRule();
												},
												
												/**
												 * Edit CallScript rules
												 */
												CallScriptEdit : function(id)
												{
													editCallScriptRule(id);
												}
								});

