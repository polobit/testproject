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
                "Bria" : "Bria", "Bria/:id" : "Bria"
                	
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
                            $('[data-toggle="tooltip"]').tooltip();
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
			 * Manages Bria widget
			 */
			// Bria : function(id) {
			// 	addConfigurableWidget(id, "Bria", 'bria-login');
			// },

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
                            "core/api/widgets/social/profile/"+id);
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
                            "/core/api/widgets/facebook/currentUserProfile/"+id);
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
            CallScript : function(id)
            {
                addConfigurableWidget(id, "CallScript", "callscript-login");
                if(id){
                    adjust_form();
                }
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