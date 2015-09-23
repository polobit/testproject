/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router
		.extend({
			routes : {
				// Add widgets main route
				"add-widget" : "addWidget",
				// Social widgets
				"Twitter" : "Twitter",
				"Twitter/:id" : "Twitter",
				"GooglePlus" : "GooglePlus",
				"GooglePlus/:id" : "GooglePlus",
				"Rapleaf" : "Rapleaf",
				"Rapleaf/:id" : "Rapleaf",
				"Facebook" : "Facebook",
				"Facebook/:id" : "Facebook",
				// Support widgets
				"ClickDesk" : "ClickDesk",
				"ClickDesk/:id" : "ClickDesk",
				"HelpScout" : "HelpScout",
				"HelpScout/:id" : "HelpScout",
				"Zendesk" : "Zendesk",
				"Zendesk/:id" : "Zendesk",
				// Calling widgets
				"Sip" : "Sip",
				"Sip/:id" : "Sip",
				"Twilio" : "Twilio",
				"Twilio/:id" : "Twilio",
				"TwilioIO" : "TwilioIO",
				"TwilioIO/:id" : "TwilioIO",
				"callscript/rules" : "CallScriptShow",
				"callscript/add-rules" : "CallScriptAdd",
				"callscript/editrules/:id" : "CallScriptEdit",
				"callscript" : "CallScript",
				"callscript/:id" : "CallScript",
				// Billing widgets
				"FreshBooks" : "FreshBooks",
				"FreshBooks/:id" : "FreshBooks",
				"Stripe" : "Stripe",
				"Stripe/:id" : "Stripe",
				"Xero" : "Xero",
				"Xero/:id" : "Xero",
				"QuickBooks" : "QuickBooks",
				"QuickBooks/:id" : "QuickBooks",
				// Ecommerce widgets
				"Shopify" : "Shopify",
				"Shopify/:id" : "Shopify",
				// Custom widget
				"Custom-widget" : "Custom",
				"Custom-widget/:id" : "Custom",
				// Syncing email and calendar
				"sync" : "contactSync",
				"sync/contacts" : "google_apps_contacts",
				"sync/calendar" : "google_apps_calendar",
				"sync/stripe-import" : "stripe_sync",
				"sync/shopify" : "shopify",
				"sync/salesforce" : "salesforce",
				"sync/zoho-import" : "zoho_sync",
				"sync/quickbook" : "quickbook_import",
				"sync/xero" : "xero_import",
				"sync/freshbooks" : "freshbooks_sync",
				"sync/freshbooks/setting" : "freshbooks_sync_setting",
				"sync/officecalendar" : "office365Calendar"
			},

			/**
			 * Adds the configured and configurable widgets on widgets add
			 * route.
			 */
			addWidget : function() {

				var that = this;
				loadSettingsUI(function() {

					that.Catalog_Widgets_View = new Base_Collection_View({
						url : '/core/api/widgets/default',
						restKey : "widget",
						templateKey : "widgets-add",
						sort_collection : false,
						individual_tag_name : 'div',
						postRenderCallback : function(el) {
							initializeWidgetSettingsListeners();

							build_custom_widget_form(el);
							setTimeout(function() {
								var socialHeight = 0;
								$('#social > div', el).each(function() {
									if ($(that).height() > socialHeight)
										socialHeight = $(that).height();
								});
								$('#social > div', el).each(function() {
									$(that).height(socialHeight);
								});
							}, 1000);

						}
					});

					// Append widgets into view by organizing them
					that.Catalog_Widgets_View.appendItem = organize_widgets;
					console.log(organize_widgets);

					// Fetch the list of widgets
					that.Catalog_Widgets_View.collection.fetch({
						success : function(data) {
							console.log(data.where({
								"is_added" : true
							}));
							_plan_restrictions.process_widgets(data);
							console.log(data);
							console.log("****");
						}
					});

					// Shows available widgets in the content
					$('#prefs-tabs-content').html(that.Catalog_Widgets_View.el);

				});

			},

			/**
			 * Manages FreshBooks widget
			 */
			FreshBooks : function(id) {
				addConfigurableWidget(id, "FreshBooks", 'freshbooks-login');
			},

			/**
			 * Manages TwilioIo widget
			 */
			TwilioIO : function(id) {
				addConfigurableWidget(id, "TwilioIO", 'twilioio-login');
			},

			/**
			 * Manages Rapleaf widget
			 */
			Rapleaf : function(id) {
				addConfigurableWidget(id, "Rapleaf", "rapleaf-login");
			},

			/**
			 * Manages ClickDesk widget
			 */
			ClickDesk : function(id) {
				addConfigurableWidget(id, "ClickDesk", "clickdesk-login");
			},

			/**
			 * Manages Zendesk widget
			 */
			Zendesk : function(id) {
				addConfigurableWidget(id, "Zendesk", "zendesk-login");
			},

			/**
			 * Manages HelpScout widget
			 */
			HelpScout : function(id) {
				addConfigurableWidget(id, "HelpScout", "helpscout-login");
			},

			/**
			 * Manages Sip widget
			 */
			Sip : function(id) {
				addConfigurableWidget(id, "Sip", "sip-login");
			},

			/**
			 * Manages Quickbooks widget
			 */
			QuickBooks : function(id) {
				addConfigurableWidget(id, "QuickBooks", "quickbooks-login");
			},

			/**
			 * Manages Twitter widget
			 */
			Twitter : function(id) {
				if (!id) {
					addOAuthWidget(
							"Twitter",
							"twitter-login",
							('/scribe?service=twitter&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href) + '/twitter'));
				} else {
					addWidgetProfile(id, "Twitter", "twitter-revoke-access",
							"core/api/widgets/social/profile/");
				}

			},

			/**
			 * Manages Facebook widget
			 */
			Facebook : function(id) {
				if (!id) {
					addOAuthWidget(
							"Facebook",
							"facebook-login",
							('/scribe?service=facebook&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href) + '/facebook'));
				} else {
					addWidgetProfile(id, "Facebook", "facebook-revoke-access",
							"/core/api/widgets/facebook/currentUserProfile/");
				}

			},

			/**
			 * Manages Facebook widget
			 */
			Xero : function(id) {
				if (!id) {
					addOAuthWidget(
							"Xero",
							"xero-login",
							("http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=" + encodeURIComponent(window.location.protocol
									+ "//"
									+ window.location.host
									+ "/XeroServlet?isForAll="
									+ isForAll
									+ "&data=")));
				} else {
					addWidgetProfile(id, "Xero", "xero-revoke-access",
							"core/api/widgets/Xero");
				}

			},

			/**
			 * Manages Stripe widget
			 */
			QuickBooks : function(id) {
				if (!id) {
					addOAuthWidget(
							"QuickBooks",
							"quickbooks-login",
							('/OAuthServlet?service=quickbooks&isForAll='
									+ isForAll + '&return_url='
									+ encodeURIComponent(window.location.href) + '/quickbooks'));
				} else {
					addWidgetProfile(id, "QuickBooks",
							"quickbooks-revoke-access",
							"core/api/widgets/QuickBooks");
				}

			},

			/**
			 * Manages Shopify widget
			 */
			Shopify : function(id) {
				if (!id) {
					addOAuthWidget("Shopify", "shopify-login", "");
				} else {
					addWidgetProfile(id, "Shopify", "shopify-revoke-access",
							"/core/api/widgets/default");
				}
				// addConfigurableWidget(id, "Shopify", "shopify-login");
			},

			/**
			 * Manages GooglePlus widget
			 */
			GooglePlus : function(id) {
				if (!id) {
					addOAuthWidget(
							"GooglePlus",
							"googleplus-login",
							('/scribe?service=googleplus&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href) + '/googleplus'));
				} else {
					addWidgetProfile(id, "GooglePlus",
							"googleplus-revoke-access",
							"core/api/widgets/GooglePlus");
				}

			},

			/**
			 * Manages Stripe widget
			 */
			Stripe : function(id) {
				if (!id) {
					addOAuthWidget(
							"Stripe",
							"stripe-login",
							('/scribe?service=stripe&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href) + '/stripe'));
				} else {
					addWidgetProfile(id, "Stripe", "stripe-revoke-access",
							"core/api/widgets/Stripe");
				}

			},

			/**
			 * Manages CallScript widget
			 */
			CallScript : function(id) {
				if (!id) {
					addCallScriptRule();
				} else {
					showCallScriptRule();
				}
			},

			/**
			 * Manages widget added by user
			 */
			Custom : function(id) {
				if (id) {
					alert('clicked');
					console.log($(this))
					divClone = $(this).clone();
					var widget_custom_view = new Base_Model_View(
							{
								url : "/core/api/widgets/custom",
								template : "add-custom-widget",
								isNew : true,
								postRenderCallback : function(el) {
									initializeWidgetSettingsListeners();
									console.log('In post render callback');
									console.log(el);

									$('body').on(
											'change',
											'#script_type',
											function(e) {
												var script_type = $(
														'#script_type').val();
												if (script_type == "script") {
													$('#script_div').show();
													$('#url_div').hide();
													return;
												}

												if (script_type == "url") {
													$('#script_div').hide();
													$('#url_div').show();
												}
											});

								},
								saveCallback : function(model) {
									console.log('In save callback');

									console.log(model);

									if (model == null)
										alert("A widget with this name exists already. Please choose a different name");

									App_Widgets.Catalog_Widgets_View.collection
											.add(model);
									$("#custom-widget").replaceWith(divClone);
								}
							});

					$('#custom-widget', el).html(
							widget_custom_view.render(true).el);

					$('#cancel_custom_widget').die().live('click', function(e) {
						// Restore element back to original
						$("#custom-widget").replaceWith(divClone);
					});

				}
				// fill_form(id, "Custom", 'custom-widget-settings');
			},

			/**
			 * Contact synchronization with Google
			 */
			contactSync : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');
				// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail

				this.contact_sync_google = new Base_Model_View({
					url : 'core/api/contactprefs/google',
					template : 'admin-settings-import-google-contacts',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});
				this.contact_sync_office365 = new Base_Model_View({
					url : 'core/api/officecalendar',
					template : 'admin-settings-office365-sync-details',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});

				// Adds header
				$('#prefs-tabs-content')
						.html(
								'<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Google <small>import Contacts from Google</small></h4><div class="row"><div id="contact-prefs" class="col-md-4 col-sm-6 col-xs-12"></div>'
										+ '<div id="calendar-prefs" class="col-md-4 col-sm-6 col-xs-12"></div><div id="email-prefs" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
										+ '<div class="row prefs-datasync"><div class="col-md-12 no-mg-l"><h4 class="m-b">E-commerce <small>import Contacts from E-commerce</small></h4><div class="row"><div id ="shopify" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
										+ '<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Office365 <small> calendar events Sync</small></h4><div class="row"><div id ="office365-calendar-sync" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
										+ '<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Payment <small>import Contacts from payment gateway</small></h4><div class="row"><div id ="stripe" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
										+ '<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Accounting <small>import Contacts from Accounting</small></h4><div class="row"><div id ="freshbook" class="col-md-4 col-sm-6 col-xs-12"></div><div class="col-md-4 col-sm-6 col-xs-12" id ="quickbook"></div></div></div></div>');

				// Adds Gmail Prefs
				$('#contact-prefs')
						.append(this.contact_sync_google.render().el);
				$('#office365-calendar-sync').append(
						this.contact_sync_office365.render().el);

				this.calendar_sync_google = new Base_Model_View({
					url : 'core/api/calendar-prefs/get',
					template : 'import-google-calendar',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});

				// console.log(getTemplate("import-google-contacts", {}));
				$('#calendar-prefs').append(
						this.calendar_sync_google.render().el);

				/* Add E-commerce Prefs template */
				this.shopify_sync = new Base_Model_View(
						{
							url : 'core/api/shopify/import-settings',
							template : 'admin-settings-import-shopify-contact-syncPrefs',
							postRenderCallback : function(el) {
								initializeImportListeners();
							}
						});
				$('#shopify').append(this.shopify_sync.render().el);

				this.freshbooks_sync = new Base_Model_View(
						{
							url : 'core/api/freshbooks/import-settings',
							template : 'admin-settings-import-freshbooks-contacts-syncPrefs',
							postRenderCallback : function(el) {
								initializeImportListeners();
							}
						});
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
				this.zoho_sync = new Base_Model_View({
					url : 'core/api/zoho/import-settings',
					template : 'admin-settings-import-zoho-contact-sync',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});
				$('#zoho').append(this.zoho_sync.render().el);
				// model for quickbook import
				this.quickbook_sync = new Base_Model_View({
					url : 'core/quickbook/import-settings',
					template : 'admin-settings-import-quickbook',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});
				$('#quickbook').append(this.quickbook_sync.render().el);

				// model for xero import
				this.xero_sync = new Base_Model_View({
					url : 'core/xero/import-settings',
					template : 'admin-settings-import-xeroSync',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});
				$('#xero').append(this.xero_sync.render().el);

				/*
				 * Add stripe payment gateway contact sync template preferences
				 */
				this.stripe_sync = new Base_Model_View({
					url : 'core/api/stripe/import-settings',
					template : 'admin-settings-import-stripe-contact-sync',
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});

				$('#stripe').append(this.stripe_sync.render().el);

				var data = {
					"service" : "Gmail",
					"return_url" : encodeURIComponent(window.location.href)
				};
				var itemView = new Base_Model_View({
					url : '/core/api/social-prefs/GMAIL',
					template : "settings-social-prefs",
					data : data,
					postRenderCallback : function(el) {
						initializeImportListeners();
					}
				});
				itemView.model.fetch();

				// Adds Gmail Prefs
				$('#email-prefs').html(itemView.render().el);

				// Gets IMAP Prefs
				/*
				 * var itemView2 = new Base_Model_View({ url : '/core/api/imap',
				 * template : "settings-imap-prefs" }); // Appends IMAP
				 * $('#prefs-tabs-content').append(itemView2.render().el);
				 * $('#PrefsTab .select').removeClass('select');
				 * $('.email-tab').addClass('select');
				 */
			},

			google_apps_contacts : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				var options = {
					url : "core/api/contactprefs/GOOGLE",
					template : "admin-settings-import-google-contacts-setup",
					postRenderCallback : function(el) {

						initializeWidgetSettingsListeners();
						initializeImportListeners();
						console.log(el);
						// App_Settings.setup_google_contacts.model =
						// App_Settings.contact_sync_google.model;
					}
				};

				var fetch_prefs = true;
				if (this.contact_sync_google && this.contact_sync_google.model) {
					options["model"] = this.contact_sync_google.model;
					fetch_prefs = false;
				} else {
					this.contact_sync_google = new Base_Model_View({
						url : 'core/api/contactprefs/google',
						template : 'import-google-contacts',
					});
				}

				this.setup_google_contacts = new Base_Model_View(options);

				if (fetch_prefs) {
					$("#prefs-tabs-content").html(
							this.setup_google_contacts.render().el);
					return;
				}
				$("#prefs-tabs-content").html(
						this.setup_google_contacts.render(true).el);
			},

			google_apps_calendar : function() {
				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				var options = {

					url : "core/api/calendar-prefs/get",
					template : "import-google-calendar-setup"
				};

				var fetch_prefs = true;
				if (this.calendar_sync_google
						&& this.calendar_sync_google.model) {
					options["model"] = this.calendar_sync_google.model;
					fetch_prefs = false;
				}

				this.setup_google_calendar = new Base_Model_View(options);

				if (fetch_prefs) {
					$("#prefs-tabs-content").html(
							this.setup_google_calendar.render().el);
					return;
				}
				$("#prefs-tabs-content").html(
						this.setup_google_calendar.render(true).el);
			},

			office365Calendar : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				this.office365_sync_setting = new Base_Model_View({
					url : 'core/api/officecalendar',
					template : 'admin-settings-office365-calendar-prefs',
					saveCallback : function(model) {
						window.location.href = '#sync';
					}
				});
				$("#prefs-tabs-content").html(
						this.office365_sync_setting.render().el);
			},

			stripe_sync : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				this.stripe_sync_setting = new Base_Model_View(
						{
							url : 'core/api/stripe/import-settings',
							template : 'admin-settings-import-stripe-contact-sync-prefs',
							saveCallback : function(model) {
								showNotyPopUp("information",
										"Contacts sync initiated", "top", 1000);
							}
						});

				$("#prefs-tabs-content").html(
						this.stripe_sync_setting.render().el);
			},

			shopify : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				this.shopify_sync_setting = new Base_Model_View({
					url : 'core/api/shopify/import-settings',
					template : 'admin-settings-import-shopify-prefs',
					saveCallback : function(model) {

						showNotyPopUp("information", "Contacts sync initiated",
								"top", 1000);
					}
				});

				$("#prefs-tabs-content").html(
						this.shopify_sync_setting.render().el);
			},

			freshbooks_sync : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				this.freshbooks_sync_setting = new Base_Model_View(
						{
							url : 'core/api/freshbooks/import-settings',
							template : 'admin-settings-import-freshbooks-contacts-form',
							saveCallback : function(model) {

								showNotyPopUp("information",
										"Contacts sync initiated", "top", 1000);
							}
						});

				$("#prefs-tabs-content").html(
						this.freshbooks_sync_setting.render().el);
			},

			freshbooks_sync_setting : function() {
				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');
				this.freshbooks_import_settings = new Base_Model_View({
					url : 'core/api/freshbooks/import-settings',
					template : 'admin-settings-import-freshbooks-settings',
					postRenderCallback : function(el) {
						initializeImportListeners();
					},
					saveCallback : function(model) {

						showNotyPopUp("information", "Contacts sync initiated",
								"top", 1000);
					}
				});

				$("#prefs-tabs-content").html(
						this.freshbooks_import_settings.render().el);
			},

			zoho_sync : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');

				this.zoho_sync_settings = new Base_Model_View({
					url : 'core/api/zoho/import-settings',
					template : 'admin-settings-import-zoho-prefs',
					saveCallback : function(model) {
						showNotyPopUp("information", "Contacts sync initiated",
								"top", 1000);
					}
				});

				$("#prefs-tabs-content").html(
						this.zoho_sync_settings.render().el);

			},

			quickbook_import : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');
				this.quickbook_import_settings = new Base_Model_View({
					url : 'core/quickbook/import-settings',
					template : 'admin-settings-import-quickbook-settings',
					saveCallback : function(model) {

						showNotyPopUp("information", "Contacts sync initiated",
								"top", 1000);
					},
					postRenderCallback : function() {
						initializeImportListeners();
					}
				});

				$("#prefs-tabs-content").html(
						this.quickbook_import_settings.render().el);

			},

			xero_import : function() {

				$("#content").html(getTemplate("settings"), {});

				$('#PrefsTab .select').removeClass('select');
				$('.contact-sync-tab').addClass('select');
				this.xero_import_settings = new Base_Model_View({
					url : 'core/xero/import-settings',
					template : 'admin-settings-import-xero-settings',
					saveCallback : function(model) {

						showNotyPopUp("information", "Contacts sync initiated",
								"top", 1000);
					}
				});

				$("#prefs-tabs-content").html(
						this.xero_import_settings.render().el);

			},

			// Reddy code
			/**
			 * Manages GooglePlus widget
			 */
			GooglePlus : function(id) {
				if (!id) {
					show_set_up_widget("GooglePlus", 'googleplus-login',
							'/scribe?service=googleplus&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href)
									+ "/googleplus");
				} else {
					var widgetDetails = $.parseJSON($.ajax({
						url : "core/api/widgets/GooglePlus",
						async : false,
						dataType : 'json'
					}).responseText);

					console.clear();
					console.log("In google Plus widget Router");
					console.log(widgetDetails);

					if (widgetDetails) {
						widgetPrefGP = JSON.parse(widgetDetails.prefs);
						var userData = $
								.parseJSON($
										.ajax({
											url : "https://www.googleapis.com/plus/v1/people/me?access_token="
													+ widgetPrefGP['access_token'],
											async : false,
											dataType : 'json'
										}).responseText);

						set_up_access(
								"GooglePlus",
								'googleplus-login',
								userData,
								'/scribe?service=googleplus&return_url='
										+ encodeURIComponent(window.location.protocol
												+ "//"
												+ window.location.host
												+ "/#GooglePlus/googleplus"));

					} else {
						show_set_up_widget(
								"GooglePlus",
								'googleplus-login',
								'/scribe?service=googleplus&isForAll='
										+ isForAll
										+ '&return_url='
										+ encodeURIComponent(window.location.href)
										+ "/googleplus");
						return;
					}
				}

			}// End of Gplus
		});

function addWidgetProfile(widgetId, widgetName, template, url) {
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(
				widgetId,
				"",
				function(model) {

					$
							.getJSON(
									(url + widgetId),
									function(data) {
										var widget_el = getTemplate(
												"widget-settings", model);
										$('#prefs-tabs-content')
												.html(widget_el);

										if (data) {
											model["profile"] = data;
										} else {
											// Loading GooglePlus profile
											if (widgetName == "GooglePlus") {
												var widgetPrefGP = JSON
														.parse(model.prefs);
												var userData = $
														.parseJSON($
																.ajax({
																	url : "https://www.googleapis.com/plus/v1/people/me?access_token="
																			+ widgetPrefGP['access_token'],
																	async : false,
																	dataType : 'json'
																}).responseText);
												model["profile"] = userData;
												// Loading Stripe profile
											} else if (widgetName == "Stripe") {
												$
														.getJSON(
																"core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT",
																function(data) {
																	model["custom_data"] = data;

																	// App_Widgets.Catalog_Widgets_View.collection.model
																	var widgetModel = new Widget_Model_Events(
																			{
																				template : template,
																				url : url,
																				isNew : true,
																				data : model,
																				postRenderCallback : function(
																						el) {
																					deserializeWidget(
																							model,
																							el);
																				}
																			});

																	$(
																			'#widget-settings')
																			.html(
																					widgetModel
																							.render().el);
																	return;
																});
												model["profile"] = jQuery
														.parseJSON(model.prefs);
											} else {
												model["profile"] = jQuery
														.parseJSON(model.prefs);
											}
										}

										// App_Widgets.Catalog_Widgets_View.collection.model
										var widgetModel = new Widget_Model_Events(
												{
													template : template,
													url : url,
													isNew : true,
													data : model,
													postRenderCallback : function(
															el) {
														deserializeWidget(
																model, el);
													}
												});

										$('#widget-settings').html(
												widgetModel.render().el);
									});
				});

	});

}

function addOAuthWidget(widgetName, template, url) {
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(widgetName, "name", function(model) {

			if (model) {
				model["url"] = url;
			}

			var widget_el = getTemplate("widget-settings", model);
			$('#prefs-tabs-content').html(widget_el);

			// App_Widgets.Catalog_Widgets_View.collection.model
			var widgetModel = new Widget_Model_Events({
				template : template,
				url : 'core/api/widgets',
				isNew : true,
				data : model,
				postRenderCallback : function(el) {

				}
			});

			$('#widget-settings').html(widgetModel.render().el);
		});

	});
}

/**
 * Add model widget.
 */
function addConfigurableWidget(widgetId, widgetName, templateName) {

	loadSettingsUI(function() {

		var type = "";
		var selector = "";

		if (!widgetId) {
			type = "name";
			selector = widgetName;
		} else {
			selector = widgetId;
		}

		// Get route model
		getWidgetModelFromName(selector, type, function(model) {

			var widget_el = getTemplate("widget-settings", model);
			$('#prefs-tabs-content').html(widget_el);

			// App_Widgets.Catalog_Widgets_View.collection.model
			var widgetModel = new Widget_Model_Events({
				template : templateName,
				url : 'core/api/widgets',
				isNew : true,
				data : model,
				postRenderCallback : function(el) {
					deserializeWidget(model, el);
				}
			});

			$('#widget-settings').html(widgetModel.render().el);

			if (model.name == "TwilioIO") {
				fill_twilioio_numbers();
			}

		});

	});
}

function loadSettingsUI(callback) {
	getTemplate('settings', {}, undefined, function(template_ui) {
		if (!template_ui)
			return;

		$('#content').html($(template_ui));
		$('#prefs-tabs-content').html(getRandomLoadingImg());

		$('#PrefsTab .select').removeClass('select');
		$('.add-widget-prefs-tab').addClass('select');

		if (callback)
			callback();

	}, "#content");

}

function getWidgetModelFromName(widgetId, type, callback) {

	getAgileConfiguredWidgetCollection(function(widgetCollection) {

		var model = "";
		if (type == "name") {
			models = widgetCollection.where({
				name : widgetId
			});
			model = models[0];
		} else {
			model = widgetCollection.get(widgetId);
		}

		if (!model) {

			Backbone.history.navigate('add-widget', {
				trigger : true
			});
			return;
		}

		callback(model.toJSON());

	});

}

function getAgileConfiguredWidgetCollection(callback) {

	if (App_Widgets.Catalog_Widgets_View
			&& App_Widgets.Catalog_Widgets_View.collection) {

		callback(App_Widgets.Catalog_Widgets_View.collection);
		return;
	}

	App_Widgets.Catalog_Widgets_View = new Base_Collection_View({
		url : '/core/api/widgets/default'
	});

	// Fetch the list of widgets
	App_Widgets.Catalog_Widgets_View.collection.fetch({
		success : function() {

			getAgileConfiguredWidgetCollection(callback);

		}
	});
}

function deserializeWidget(widget, el) {

	if (!widget.prefs)
		return;

	deserializeForm(JSON.parse(widget.prefs), $(el).find("form"));
}
