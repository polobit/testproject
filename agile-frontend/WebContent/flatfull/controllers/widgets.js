/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router.extend({
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
	 * Adds the configured and configurable widgets on widgets add route.
	 */
	addWidget : function() {
		$("#content").html(getTemplate("settings"), {});

		this.Catalog_Widgets_View = new Base_Collection_View({
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
						if ($(this).height() > socialHeight)
							socialHeight = $(this).height();
					});
					$('#social > div', el).each(function() {
						$(this).height(socialHeight);
					});
				}, 1000);

			}
		});

		// Append widgets into view by organizing them
		this.Catalog_Widgets_View.appendItem = organize_widgets;
		console.log(organize_widgets);

		// Fetch the list of widgets
		this.Catalog_Widgets_View.collection.fetch({
			success : function(data) {
				console.log(data.where({
					"is_added" : true
				}));
				_plan_restrictions.process_widgets(data);
			}
		});

		// Shows available widgets in the content
		$('#prefs-tabs-content').html(this.Catalog_Widgets_View.el);

		$('#PrefsTab .select').removeClass('select');
		$('.add-widget-prefs-tab').addClass('select');
	},

	/**
	 * Manages FreshBooks widget
	 */
	FreshBooks : function(id) {
		var freshbookModel = new Base_Model_View({ 
			template : 'freshbooks-login',
			url:'core/api/widgets/default',
			//data: App_Widgets.Catalog_Widgets_View.collection.model,
			data : {},
			postRenderCallback : function(el) {
				initializeImportListeners();
			}
		});

		$('#prefs-tabs-content').append(freshbookModel.render().el);
	}
});
