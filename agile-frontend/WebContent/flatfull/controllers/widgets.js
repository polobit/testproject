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
				if(!id){
					addOAuthWidget("Twitter", "twitter-login",
						('/scribe?service=twitter&isForAll=' + isForAll	+ '&return_url=' + encodeURIComponent(window.location.href) + '/twitter')
					);
				}else{
					addWidgetProfile(id, "Twitter", "twitter-revoke-access", "core/api/widgets/social/profile/");
				}

			},

			/**
			 * Manages Facebook widget
			 */
			Facebook : function(id) {
				if(!id){
					addOAuthWidget("Facebook", "facebook-login",
						('/scribe?service=facebook&isForAll='+isForAll+'&return_url=' + encodeURIComponent(window.location.href) + '/facebook')
					);
				}else{
					addWidgetProfile(id, "Facebook", "facebook-revoke-access", "/core/api/widgets/facebook/currentUserProfile/");
				}

			},

			/**
			 * Manages Facebook widget
			 */
			Xero : function(id) {
				if(!id){
					addOAuthWidget("Xero", "xero-login",
						("http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=" + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?isForAll="+isForAll+"&data="))
					);
				}else{
					addWidgetProfile(id, "Xero", "xero-revoke-access", "core/api/widgets/Xero");
				}

			},

			/**
			 * Manages Stripe widget
			 */
			QuickBooks : function(id) {
				if(!id){
					addOAuthWidget("QuickBooks", "quickbooks-login",
						('/OAuthServlet?service=quickbooks&isForAll='+isForAll+'&return_url=' + encodeURIComponent(window.location.href) + '/quickbooks')
					);
				}else{
					addWidgetProfile(id, "QuickBooks", "quickbooks-revoke-access", "core/api/widgets/QuickBooks");
				}

			},

			/**
			 * Manages Shopify widget
			 */
			Shopify : function(id) {
				if(!id){
					addOAuthWidget("Shopify", "shopify-login","");
				}else{
					addWidgetProfile(id, "Shopify", "shopify-revoke-access", "/core/api/widgets/default");
				}
				//addConfigurableWidget(id, "Shopify", "shopify-login");
			}


			/**
			 * Manages GooglePlus widget
			 */
			// GooglePlus : function(id) {
			// 	if(!id){
			// 		addOAuthWidget("GooglePlus", "googleplus-login",
			// 			('/scribe?service=googleplus&isForAll='+isForAll+'&return_url=' + encodeURIComponent(window.location.href) + "/googleplus")
			// 		);
			// 	}else{
			// 		addWidgetProfile(id, "GooglePlus", "googleplus-revoke-access", "/core/api/widgets/facebook/currentUserProfile/");
			// 	}

			// }
		});

function addWidgetProfile(widgetId, widgetName, template, url){
	loadSettingsUI(function() {

		// Get route model
		getWidgetModelFromName(widgetId, "", function(model) {

		$.getJSON((url + widgetId), function(data){
				if(data){
					model["profile"] = data;	
				}else{
					model["profile"] = jQuery.parseJSON(model.prefs);
				}
				
				var widget_el = getTemplate("widget-settings", model);
				$('#prefs-tabs-content').html(widget_el);
				var widgetProfile = getTemplate(template, model);
				$('#widget-settings').html(widgetProfile);
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