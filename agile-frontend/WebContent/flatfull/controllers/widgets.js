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
                "FullContact" :"FullContact",
                "FullContact/:id" :"FullContact",
                "Klout" : "Klout",
                "Klout/:id" : "Klout",    

                // Support widgets
                "ClickDesk" : "ClickDesk",
                "ClickDesk/:id" : "ClickDesk",
                "HelpScout" : "HelpScout",
                "HelpScout/:id" : "HelpScout",
                "Zendesk" : "Zendesk",
                "Zendesk/:id" : "Zendesk",
                "Uservoice" : "Uservoice",
                "Uservoice/:id" : "Uservoice",

                // Calling widgets
                "Sip" : "Sip",
                "Sip/:id" : "Sip",
                "Twilio" : "Twilio",
                "Twilio/:id" : "Twilio",
                "TwilioIO" : "TwilioIO",
                "TwilioIO/:id" : "TwilioIO",
                "Ozonetel" : "Ozonetel",
                "Ozonetel/:id" : "Ozonetel",
                "callscript/rules" : "CallScriptShow",
                "callscript/add-rules" : "CallScriptAdd",
                "callscript/editrules/:id" : "CallScriptEdit",
                "callscript" : "CallScript",
                "callscript/:id" : "CallScript",
                "Android" : "Android",
                "Android/:id" : "Android",
                "Knowlarity" : "Knowlarity",
                "Knowlarity/:id" : "Knowlarity",
                "VMdrops" : "VMdrops",
                "VMdrops/:id" : "VMdrops",

                // Billing widgets
                "FreshBooks" : "FreshBooks",
                "FreshBooks/:id" : "FreshBooks",
                "Stripe" : "Stripe",
                "Stripe/:id" : "Stripe",
                "Braintree" : "Braintree",
                "Braintree/:id" : "Braintree",
                "Xero" : "Xero",
                "Xero/:id" : "Xero",
                "QuickBooks" : "QuickBooks",
                "QuickBooks/:id" : "QuickBooks",
                "PayPal" : "PayPal",
                "PayPal/:id" : "PayPal",

                // Ecommerce widgets
                "Shopify" : "Shopify",
                "Shopify/:id" : "Shopify",
                // Custom widget
                "Custom-widget" : "Custom",
                "Custom-widget/:id" : "Custom",
				"Bria" : "Bria", "Bria/:id" : "Bria",
				"Skype" : "Skype", "Skype/:id" : "Skype",
				"Asterisk" : "Asterisk", "Asterisk/:id" : "Asterisk"
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
                        templateKey : "widgets-add-new",
                        sort_collection : false,
                        individual_tag_name : 'div',
                        postRenderCallback : function(el) {
                            var widgetTab = _agile_get_prefs("widget_tab");
                            if(!widgetTab || widgetTab == null) {
                                _agile_set_prefs('widget_tab', "call-tab");
                                widgetTab = "call-tab";
                            }
                            $('#prefs-tabs-content a[href="#'+widgetTab+'"]').tab('show');
                            initializeWidgetSettingsListeners();
                            $("#prefs-tabs-content .tab-container ul li").off("click");
                            $("#prefs-tabs-content").on("click",".tab-container ul li",function(){
                                var temp = $(this).find("a").attr("href").split("#");
                                _agile_set_prefs('widget_tab', temp[1]);
                            });                                                    

                            /*setTimeout(function() {
                                var socialHeight = 0;
                                $('#social > div', el).each(function() {
                                    if ($(that).height() > socialHeight)
                                        socialHeight = $(that).height();
                                });
                                $('#social > div', el).each(function() {
                                    $(that).height(socialHeight);
                                });
                            }, 1000);*/
                            $('#settings-widgets-tab-content').find('#call div:nth-child(6)').css({"display":"none"});
                            $('#settings-widgets-tab-content').find('#call div:nth-child(7)').css({"display":"none"});
                            $('#settings-widgets-tab-content').find('#call div:nth-child(8)').css({"display":"none"});
                         //   $('#settings-widgets-tab-content').find('#call div:nth-child(10)').css({"display":"none"});
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
             * Manages TwilioIo widget
             */
            Ozonetel : function(id) {
                addConfigurableWidget(id, "Ozonetel", 'ozonetel-login');
            },
            /**
             * Manages TwilioIo widget
             */
            VMdrops : function(id) {
                addConfigurableWidget(id, "VMdrops", 'voice-mail-drops-collection');
            },

            Custom : function(id){                
                addConfigurableWidget(id, "Custom", 'custom-widget-edit');                
            },
            
			/**
			 * Manages Bria widget
			 */
			 Bria : function(id) {
			 	addConfigurableWidget(id, "Bria", 'bria-login');
			 },
			 
			 /**
			 * Manages Skype widget
			 */
			 Skype : function(id) {
			 	addConfigurableWidget(id, "Skype", 'skype-login');
			 },
			 
			 /**
				 * Manages Skype widget
				 */
			 Asterisk : function(id) {
				 	addConfigurableWidget(id, "Asterisk", 'asterisk-login');
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
             * Manages Uservoice widget
             */            
            Uservoice : function(id){
                addConfigurableWidget(id, "Uservoice", "uservoice-login");
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

            FullContact : function(id){
                addConfigurableWidget(id, "FullContact", "fullcontact-login");
            },

            Klout : function(id){
               addConfigurableWidget(id, "Klout", "klout-login");
            },

            /**
             * Manages Facebook widget
             */
            Xero : function(id) {
                if (!id) {
                    // For live use.
                    var URL = "http://integrations.clickdesk.com:8080/ClickdeskPlugins";
                    // For local use.
                    //var URL = "http://localhost:8585/clickdesk-plugins";

                    addOAuthWidget(
                            "Xero",
                            "xero-login",
                            (URL + "/agile-xero-oauth?callbackUrl=" + encodeURIComponent(window.location.protocol
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
            *
            */
            PayPal : function(id){

               if (!id) {
                    addOAuthWidget(
                            "PayPal",
                            "paypal-login",
                            ('/paypalScribe?isForAll=' + isForAll + '&return_url='
                                    + encodeURIComponent(window.location.href)));
                } else {
                    addWidgetProfile(id, "PayPal", "paypal-revoke-access",
                            "core/api/widgets/paypal");
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
                            ('/scribe?service=stripe&linkType=widget&isForAll=' + isForAll));                   
                } else {
                    addWidgetProfile(id, "Stripe", "stripe-revoke-access",
                            "core/api/widgets/Stripe");
                }

            },

            /**
             * Manages Stripe widget
             */
            Braintree : function(id) {
               addConfigurableWidget(id, "Braintree", "braintree-login");
            },

            /**
             *
             */
            Android : function(id){
                addConfigurableWidget(id, "Android", "android-login");
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

            Knowlarity : function(id){
                addConfigurableWidget(id, "Knowlarity", "knowlarity-login");
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
            if(model && model.name != "Stripe"){
                deserializeWidget(model, el);
            }
             if(model && model.name == "CallScript"){
                adjust_form();
             }
            var widgetTab = _agile_get_prefs("widget_tab");
            $("#prefs-tabs-content").find('a[href="#'+widgetTab+'"]').closest("li").addClass("active");
            var url_oz = window.location.href;
            if(url_oz.indexOf("#") > -1){
                url_oz = url_oz.split("/#")[0];
            }
            $('#prefs-tabs-content').find('#ozonetelurl').text(url_oz+"/incomingcall?email="+CURRENT_DOMAIN_USER.email);
            initializeTabListeners("widget_tab", "add-widget");
            $("#twilioio_login_form .question-tag" ).popover({
              template: '<div class="popover col-md-12"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
            });
            $('#prefs-tabs-content').find('#twilio_twimlet_url').attr('value',"http://twimlets.com/voicemail?Email="+CURRENT_DOMAIN_USER.email);
        }
    });
    var output = widgetModel.render().el;
    if(model && model.name == "VMdrops"){
        var that = this;
        App_VoiceMailRouter.VoiceMailCollectionView = new Base_Collection_View({ url : 'core/api/voicemails', templateKey : "voice-mail-drops", cursor : true, page_size : getMaximumPageSize(),
            individual_tag_name : 'tr', postRenderCallback : function(el)
            {
                includeTimeAgo(el);
            },
            appendItemCallback : function(el)
            { 
                includeTimeAgo(el);
            } });
        
        App_VoiceMailRouter.VoiceMailCollectionView.collection.fetch();
        console.log(App_VoiceMailRouter.VoiceMailCollectionView);
        output = App_VoiceMailRouter.VoiceMailCollectionView.render().el;
    }
    $(renderEle).html(output);
    if(model && model.name == "VMdrops"){
        $("#widget-settings-tab-pane .img-responsive").css({"width":"47px"});
        $('#prefs-tabs-content #widget-settings-tab-pane').find('.row div:nth-child(1)').removeClass("col-md-4").addClass("col-md-12");
        $('#widget-settings-tab-pane .panel').css({"padding-left":"0px","padding-right":"0px"});
    }
    $("#twilioio_login_form .question-tag" ).popover({
      template: '<div class="popover col-md-12"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
    });
    $('#prefs-tabs-content').find('#twilio_twimlet_url').attr('value',"http://twimlets.com/voicemail?Email="+CURRENT_DOMAIN_USER.email);
    var url_oz = window.location.href;
    if(url_oz.indexOf("#") > -1){
        url_oz = url_oz.split("/#")[0];
    }
    $('#prefs-tabs-content').find('#ozonetelurl').text(url_oz+"/incomingcall?email="+CURRENT_DOMAIN_USER.email);
}
function closesupportnoty(){
    $("#support_plan_alert_info").hide();
}
function gotoService(e,service,dashboard){
    e.preventDefault();
    // Remove blink icon from menu group icon
    $(".grid_icon_center a.grid-icon-header").removeClass("agile-feature-item-blink");
    // Reset active state from DomainUser.role
    $(".menu-service-select[data-service-name='" + CURRENT_DOMAIN_USER.role + "']").addClass("active");

    var serviceName = service;
    if(!serviceName)
          return;

    var dashboardName = dashboard;
    if(!dashboardName)
         dashboardName = "dashboard";

    // Update user with the current service
    var json = {};
    json.id = CURRENT_DOMAIN_USER.id;
    json.role = serviceName;

    var Role = Backbone.Model.extend({url : '/core/api/users/update-role'});
    new Role().save( json, 
    {success :function(model, response){
        console.log("success");
        console.log(model);
        CURRENT_DOMAIN_USER = model.toJSON();
        // Call dashboard route
        Backbone.history.navigate("#", {
                trigger: true
            });
    }, 
    error: function(model, response){
        console.log("error");
    }});

    //$(this).parents(".popover").popover('hide');

    // Update dashboard name here
    _agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, dashboardName);

    var due_tasks_count = $("#due_tasks_count").text();
    due_tasks_count = due_tasks_count ? due_tasks_count : "";

    // Update UI
    $("#agile-menu-navigation-container").html(getTemplate(serviceName.toLowerCase() + "-menu-items", {due_tasks_count : due_tasks_count}));
}
