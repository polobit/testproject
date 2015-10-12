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
			 * Manages Twitter widget
			 */
			Twitter : function(id) {
				if (!id) {
					addOAuthWidget(
							"Twitter",
							"twitter-login",
							('/scribe?service=twitter&linkType=widget&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href)));
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
							('/scribe?service=facebook&linkType=widget&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href)));
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
									+ "&linkType=widget&data=")));
				} else {
					addWidgetProfile(id, "Xero", "xero-revoke-access",
							"core/api/widgets/Xero");
				}

			},

			/**
			 * Manages Quickbooks widget
			 */
			QuickBooks : function(id) {
				if (!id) {
					addOAuthWidget(
							"QuickBooks",
							"quickbooks-login",
							('/OAuthServlet?service=quickbooks&linkType=widget&isForAll='
									+ isForAll + '&return_url='
									+ encodeURIComponent(window.location.href)));
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
							('/scribe?service=googleplus&linkType=widget&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href)));
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
							('/scribe?service=stripe&linkType=widget&isForAll=' + isForAll
									+ '&return_url='
									+ encodeURIComponent(window.location.href)));
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
			 * Contact synchronization with Google
			 */
			contactSync : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');
					// Gets Social Prefs (Same as Linkedin/Twitter) for Gmail


					that.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'admin-settings-import-google-contacts',postRenderCallback: function(el){initializeImportListeners();} });
						
					// Adds header
					$('#prefs-tabs-content').html(
							'<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Google <small>import Contacts from Google</small></h4><div class="row"><div id="contact-prefs" class="col-md-4 col-sm-6 col-xs-12"></div>'
							+ '<div id="calendar-prefs" class="col-md-4 col-sm-6 col-xs-12"></div><div id="email-prefs" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
							+ '<div class="row prefs-datasync"><div class="col-md-12 no-mg-l"><h4 class="m-b">E-commerce <small>import Contacts from E-commerce</small></h4><div class="row"><div id ="shopify" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'																	
							+ '<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Payment <small>import Contacts from payment gateway</small></h4><div class="row"><div id ="stripe" class="col-md-4 col-sm-6 col-xs-12"></div></div></div></div>'
							+ '<div class="row prefs-datasync"><div class="col-md-12"><h4 class="m-b">Accounting <small>import Contacts from Accounting</small></h4><div class="row"><div id ="freshbook" class="col-md-4 col-sm-6 col-xs-12"></div><div class="col-md-4 col-sm-6 col-xs-12" id ="quickbook"></div></div></div></div>'
					);

					// Adds Gmail Prefs
					$('#contact-prefs').append(that.contact_sync_google.render().el);
							

					that.calendar_sync_google = new Base_Model_View({ url : 'core/api/calendar-prefs/get', template : 'import-google-calendar',postRenderCallback: function(el){initializeImportListeners();} });
							
							
					// console.log(getTemplate("import-google-contacts", {}));
					$('#calendar-prefs').append(that.calendar_sync_google.render().el);

					/* Add E-commerce Prefs template */
					that.shopify_sync = new Base_Model_View({ url : 'core/api/shopify/import-settings',
									template : 'admin-settings-import-shopify-contact-syncPrefs',postRenderCallback: function(el){initializeImportListeners();} });
					$('#shopify').append(that.shopify_sync.render().el);
					
					that.freshbooks_sync = new Base_Model_View({url:'core/api/freshbooks/import-settings',template:'admin-settings-import-freshbooks-contacts-syncPrefs',postRenderCallback: function(el){initializeImportListeners();}});
					$('#freshbook').append(that.freshbooks_sync.render().el);
					// adding zoho crm contact sync template preferences
					that.zoho_sync = new Base_Model_View({ url : 'core/api/zoho/import-settings', template : 'admin-settings-import-zoho-contact-sync' ,postRenderCallback: function(el){initializeImportListeners();}});
					$('#zoho').append(that.zoho_sync.render().el);
					// model for quickbook import
					that.quickbook_sync = new Base_Model_View({ url : 'core/quickbook/import-settings', template : 'admin-settings-import-quickbook',postRenderCallback: function(el){initializeImportListeners();} });
					$('#quickbook').append(that.quickbook_sync.render().el);

					// model for xero import
					that.xero_sync = new Base_Model_View({ url : 'core/xero/import-settings', template : 'admin-settings-import-xeroSync',postRenderCallback: function(el){initializeImportListeners();} });
					$('#xero').append(that.xero_sync.render().el);

					/*
					 * Add stripe payment gateway contact sync template preferences
					 */
					that.stripe_sync = new Base_Model_View({ url : 'core/api/stripe/import-settings', template : 'admin-settings-import-stripe-contact-sync' ,postRenderCallback: function(el){initializeImportListeners();}});

					$('#stripe').append(that.stripe_sync.render().el);

					var data = { "service" : "Gmail", "return_url" : encodeURIComponent(window.location.href) };
					var itemView = new Base_Model_View({ url : '/core/api/social-prefs/GMAIL', template : "settings-social-prefs", data : data,postRenderCallback: function(el){initializeImportListeners();} });
					itemView.model.fetch();

					// Adds Gmail Prefs
					$('#email-prefs').html(itemView.render().el);

				}, "#content");
			},

			google_apps_contacts : function()
			{
					var that = this;
					getTemplate('settings', {}, undefined, function(template_ui){
						if(!template_ui)
							  return;
						$('#content').html($(template_ui));	

						$('#PrefsTab .select').removeClass('select');
						$('.contact-sync-tab').addClass('select');

						var options = { url : "core/api/contactprefs/GOOGLE", template : "admin-settings-import-google-contacts-setup",
										postRenderCallback : function(el)
										{
											            
														initializeWidgetSettingsListeners();
														initializeImportListeners();
														// App_Settings.setup_google_contacts.model =
														// App_Settings.contact_sync_google.model;
										} };

						var fetch_prefs = true;
							if (that.contact_sync_google && that.contact_sync_google.model)
							{
											options["model"] = that.contact_sync_google.model;
											fetch_prefs = false;
							}
							else
							{
											that.contact_sync_google = new Base_Model_View({ url : 'core/api/contactprefs/google', template : 'import-google-contacts', });
							}

							that.setup_google_contacts = new Base_Model_View(options);

							if (fetch_prefs)
							{
											$("#prefs-tabs-content").html(that.setup_google_contacts.render().el);
											return;
							}
							$("#prefs-tabs-content").html(that.setup_google_contacts.render(true).el);
			

					}, "#content");
							
			},

			google_apps_calendar : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');

					var options = {

					url : "core/api/calendar-prefs/get", template : "import-google-calendar-setup" };

					var fetch_prefs = true;
					if (that.calendar_sync_google && that.calendar_sync_google.model)
					{
									options["model"] = that.calendar_sync_google.model;
									fetch_prefs = false;
					}

					that.setup_google_calendar = new Base_Model_View(options);

					if (fetch_prefs)
					{
									$("#prefs-tabs-content").html(that.setup_google_calendar.render().el);
									return;
					}
					$("#prefs-tabs-content").html(that.setup_google_calendar.render(true).el);

				}, "#content");
			},																				
			

			stripe_sync : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');

					that.stripe_sync_setting = new Base_Model_View({ url : 'core/api/stripe/import-settings',
									template : 'admin-settings-import-stripe-contact-sync-prefs', saveCallback : function(model)
									{
													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.stripe_sync_setting.render().el);

				}, "#content");

			},

			shopify : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));
					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');

					that.shopify_sync_setting = new Base_Model_View({ url : 'core/api/shopify/import-settings', template : 'admin-settings-import-shopify-prefs',
									saveCallback : function(model)
									{

													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.shopify_sync_setting.render().el);	
				}, "#content");			
			},
			
			freshbooks_sync : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));

					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');

					that.freshbooks_sync_setting = new Base_Model_View({ url : 'core/api/freshbooks/import-settings', template : 'admin-settings-import-freshbooks-contacts-form',
									saveCallback : function(model)
									{

													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.freshbooks_sync_setting.render().el);	
				}, "#content");	
			},
			
			freshbooks_sync_setting:function(){
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');
					that.freshbooks_import_settings = new Base_Model_View({ url : 'core/api/freshbooks/import-settings', template : 'admin-settings-import-freshbooks-settings',
						            postRenderCallback: function(el){initializeImportListeners();},
									saveCallback : function(model)
									{

													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.freshbooks_import_settings.render().el);			

				}, "#content");
			},

			zoho_sync : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');

					that.zoho_sync_settings = new Base_Model_View({ url : 'core/api/zoho/import-settings', template : 'admin-settings-import-zoho-prefs',
									saveCallback : function(model)
									{
													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.zoho_sync_settings.render().el);
				}, "#content");
			},

			quickbook_import : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');
					that.quickbook_import_settings = new Base_Model_View({ url : 'core/quickbook/import-settings',
									template : 'admin-settings-import-quickbook-settings', saveCallback : function(model)
									{
												showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									}, postRenderCallback: function(){
												initializeImportListeners();
											}
							                });																
					$("#prefs-tabs-content").html(that.quickbook_import_settings.render().el);

				}, "#content");
			},

			xero_import : function()
			{
				var that = this;
				getTemplate('settings', {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	

					$('#PrefsTab .select').removeClass('select');
					$('.contact-sync-tab').addClass('select');
					that.xero_import_settings = new Base_Model_View({ url : 'core/xero/import-settings', template : 'admin-settings-import-xero-settings',
									saveCallback : function(model)
									{

													showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
									} });

					$("#prefs-tabs-content").html(that.xero_import_settings.render().el);
				}, "#content");
			}
});

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

function renderWidgetView(templateName, url, model, renderEle){

	var widgetModel = new Widget_Model_Events({
		template : templateName,
		url : url,
		isNew : true,
		data : model,
		postRenderCallback : function(el) {
			deserializeWidget(model, el);
		}
	});

	$(renderEle).html(widgetModel.render().el);
}
