/**
 * Creates backbone router to access preferences of the user widgets
 */
var WidgetsRouter = Backbone.Router
    .extend({

        routes: {

            "add-widget": "addWidget",

            "Linkedin": "Linkedin",
            "Linkedin/:id": "Linkedin",

            "Twitter": "Twitter",
            "Twitter/:id": "Twitter",

            "GooglePlus": "GooglePlus",
            "GooglePlus/:id": "GooglePlus",

            "Rapleaf": "Rapleaf",
            "Rapleaf/:id": "Rapleaf",

            "ClickDesk": "ClickDesk",
            "ClickDesk/:id": "ClickDesk",

            "HelpScout": "HelpScout",
            "HelpScout/:id": "HelpScout",

            "Zendesk": "Zendesk",
            "Zendesk/:id": "Zendesk",

            "Sip": "Sip",
            "Sip/:id": "Sip",

            "Twilio": "Twilio",
            "Twilio/:id": "Twilio",

            "TwilioIO": "TwilioIO",
            "TwilioIO/:id": "TwilioIO",

            "FreshBooks": "FreshBooks",
            "FreshBooks/:id": "FreshBooks",

            "Stripe": "Stripe",
            "Stripe/:id": "Stripe",

            "Custom-widget": "Custom",
            "Custom-widget/:id": "Custom",

            "Xero": "Xero",
            "Xero/:id": "Xero",

            "QuickBooks": "QuickBooks",
            "QuickBooks/:id": "QuickBooks",

            "Facebook": "Facebook",
            "Facebook/:id": "Facebook",
            "Shopify": "Shopify",
            "Shopify/:id": "Shopify",

            "Chargify": "Chargify",
            "Chargify/:id": "Chargify",

            "callscript/rules": "CallScriptShow",
            "callscript/add-rules": "CallScriptAdd",
            "callscript/editrules/:id": "CallScriptEdit",
            "callscript": "CallScript",
            "callscript/:id": "CallScript",

           
        },

        /**
         * Adds social widgets (twitter, linkedIn and RapLeaf) to a contact
         */
        addWidget: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                that.Catalog_Widgets_View = new Base_Collection_View({
                    url: '/core/api/widgets/default',
                    restKey: "widget",
                    templateKey: "widgets-add",
                    sort_collection: false,
                    individual_tag_name: 'div',
                    postRenderCallback: function(el) {
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
                that.Catalog_Widgets_View.appendItem = organize_widgets;


                // Fetch the list of widgets
                that.Catalog_Widgets_View.collection.fetch({
                    success: function(data) {
                        console.log(data.where({
                            "is_added": true
                        }));
                        _plan_restrictions.process_widgets(data);
                    }
                });
                console.log(organize_widgets);

                // Shows available widgets in the content
                $('#prefs-tabs-content').html(that.Catalog_Widgets_View.el);

                $('#PrefsTab .select').removeClass('select');
                $('.add-widget-prefs-tab').addClass('select');

            }, "#content");
        },

        /**
         * Manages Linked in widget
         */
        Linkedin: function(id) {
            if (!id) {
                show_set_up_widget("Linkedin", 'linkedin-login',
                    '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href) + "/linkedin");
            } else {
                if (!isNaN(parseInt(id))) {
                    $.getJSON("core/api/widgets/social/profile/" + id,
                        function(data) {
                            set_up_access(
                                "Linkedin",
                                'linkedin-login',
                                data,
                                '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"));

                        }).error(
                        function(data) {
                            console.log(data);
                            setUpError("Linkedin", "widget-settings-error", data.responseText,
                                window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1");

                        });
                    return;

                }

                $.getJSON("core/api/widgets/Linkedin",
                    function(data1) {
                        console.log(data1);

                        if (data1) {
                            $
                                .getJSON(
                                    "core/api/widgets/social/profile/" + data1.id,
                                    function(data) {
                                        set_up_access(
                                            "Linkedin",
                                            'linkedin-login',
                                            data,
                                            '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin"),
                                            data1);

                                    })
                                .error(
                                    function(data) {

                                        console.log(data);
                                        setUpError("Linkedin", "widget-settings-error", data.responseText,
                                            window.location.protocol + "//" + window.location.host + "/#Linkedin/linkedin1", data1);

                                    });
                            return;
                        } else {
                            show_set_up_widget("Linkedin", 'linkedin-login',
                                '/scribe?service=linkedin&return_url=' + encodeURIComponent(window.location.href));
                        }
                    });

            }

        },

        /**
         * Manages Twitter widget
         */
        Twitter: function(id) {

            if (!id) {
                show_set_up_widget("Twitter", 'twitter-login',
                    '/scribe?service=twitter&isForAll=' + isForAll + '&return_url=' + encodeURIComponent(window.location.href) + "/twitter");
            } else {
                if (!isNaN(parseInt(id))) {
                    $
                        .getJSON(
                            "core/api/widgets/social/profile/" + id,
                            function(data) {
                                set_up_access(
                                    "Twitter",
                                    'twitter-login',
                                    data,
                                    '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"));

                            }).error(
                            function(data) {

                                console.log(data);
                                setUpError("Twitter", "widget-settings-error", data.responseText,
                                    window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1");

                            });
                    return;

                }

                $
                    .getJSON(
                        "core/api/widgets/Twitter",
                        function(data1) {
                            console.log(data1);

                            if (data1) {
                                $
                                    .getJSON(
                                        "core/api/widgets/social/profile/" + data1.id,
                                        function(data) {
                                            set_up_access(
                                                "Twitter",
                                                'twitter-login',
                                                data,
                                                '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twitter/twitter"),
                                                data1);

                                        }).error(
                                        function(data) {
                                            setUpError("Twitter", "widget-settings-error", data.responseText,
                                                window.location.protocol + "//" + window.location.host + "/#Twitter/twitter1", data1);
                                        });

                                return;

                            } else {
                                show_set_up_widget("Twitter", 'twitter-login',
                                    '/scribe?service=twitter&return_url=' + encodeURIComponent(window.location.href));
                            }
                        });

            }

        },

        /**
         * Manages Rapleaf widget
         */
        Rapleaf: function(id) {
            if (!id)
                show_set_up_widget("Rapleaf", 'rapleaf-login');
            else
                fill_form(id, "Rapleaf", 'rapleaf-login');
        },

        /**
         * Manages Clickdesk widget
         */
        ClickDesk: function(id) {
            if (!id)
                show_set_up_widget("ClickDesk", 'clickdesk-login');
            else
                fill_form(id, "ClickDesk", 'clickdesk-login');

        },

        /**
         * Manage HelpScout Widget.
         */
        HelpScout: function(id) {
            if (!id)
                show_set_up_widget("HelpScout", "helpscout-login");
            else
                fill_form(id, "HelpScout", 'helpscout-login')
        },

        /**
         * Manages Zendesk widget
         */
        Zendesk: function(id) {
            if (!id)
                show_set_up_widget("Zendesk", 'zendesk-login');
            else
                fill_form(id, "Zendesk", 'zendesk-login');

        },

        /**
         * Manages Sip widget
         */
        Sip: function(id) {
            if (!id)
                show_set_up_widget("Sip", 'sip-login');
            else
                fill_form(id, "Sip", 'sip-login');

        },

        /**
         * Manages TwilioIO widget
         */
        TwilioIO: function(id) {
            if (!id)
                show_set_up_widget("TwilioIO", 'twilioio-login');
            else {
                fill_form(id, "TwilioIO", 'twilioio-login');
                fill_twilioio_numbers();
            }
        },

        /**
         * Manages Twilio widget
         */
        Twilio: function(id) {

            if (!id) {
                show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
            } else {

                if (!isNaN(parseInt(id))) {
                    $.getJSON(
                        "/core/api/widgets/twilio/numbers/" + id,
                        function(data) {
                            // If data is not defined return
                            if (!data)
                                return;

                            set_up_access("Twilio", 'twilio-login', data,
                                encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Twilio/twilio"));

                        }).error(
                        function(data) {
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

                $.getJSON("core/api/widgets/Twilio", function(data) {
                    console.log(data);

                    if (data) {
                        console.log(data);
                        $.getJSON("/core/api/widgets/twilio/numbers/" + data.id, function(data1) {
                            if (!data1)
                                return;

                            set_up_access("Twilio", 'twilio-login', data1, encodeURIComponent(window.location.href), data);

                        }).error(
                            function(data) {
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

                    } else {
                        show_set_up_widget("Twilio", 'twilio-login', encodeURIComponent(window.location.href) + "/twilio");
                    }
                });

                // window.location.href = "/#add-widget";
            }

        },

        /**
         * Manages FreshBooks widget
         */
        FreshBooks: function(id) {
            if (!id)
                show_set_up_widget("FreshBooks", 'freshbooks-login');
            else
                fill_form(id, "FreshBooks", 'freshbooks-login');

        },

        /**
         * Manages Stripe widget
         */
        Stripe: function(id) {

            if (!id) {
                show_set_up_widget("Stripe", 'stripe-login', '/scribe?service=stripe&isForAll=' + isForAll + '&return_url=' + encodeURIComponent(window.location.href) + "/stripe");
            } else {
                {
                    $.getJSON("core/api/custom-fields/type/scope?scope=CONTACT&type=TEXT",
                        function(data) {
                            set_up_access("Stripe", 'stripe-login', data,
                                '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"));
                        });
                    return;

                }

                $.getJSON("core/api/widgets/Stripe", function(data1) {
                    console.log(data1);

                    if (data1) {
                        $.getJSON("core/api/custom-fields/scope?scope=CONTACT&type=TEXT",
                            function(data) {
                                set_up_access(
                                    "stripe",
                                    'stripe-login',
                                    data,
                                    '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Stripe/stripe"),
                                    data1);
                            });
                        return;

                    } else {
                        show_set_up_widget("Stripe", 'stripe-login',
                            '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href));
                    }
                });
            }
        },


        /**
         * Manage Shopify Widget
         */
        Shopify: function(id) {
            if (!id) {
                show_set_up_widget("Shopify", "shopify-login");
            } else {
                show_set_up_widget("Shopify", "shopify-revoke-access");
            }

            initializeShopifyListeners();
        },


        /**
         * Manages Xero widget
         */

        Xero: function(id) {

            if (!id) {
                show_set_up_widget(
                    "Xero",
                    'xero-login',
                    "http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=" + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?isForAll=" + isForAll + "&data="));
            } else {
                {
                    $
                        .getJSON(
                            "core/api/widgets/Xero",
                            function(data) {
                                if (typeof data.prefs != "undefined") {
                                    data.prefsObj = JSON.parse(data.prefs);
                                }
                                set_up_access(
                                    "Xero",
                                    'xero-login',
                                    data,
                                    'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?isForAll=" + isForAll + "&data="));
                            });
                    return;

                }
                $
                    .getJSON(
                        "core/api/widgets/Xero",
                        function(data1) {
                            console.log(data1);

                            if (data1) {
                                $
                                    .getJSON(
                                        "core/api/widgets/Xero",
                                        function(data) {
                                            set_up_access(
                                                "Xero",
                                                'xero-login',
                                                data,
                                                'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?isForAll=" + isForAll + "&data="),
                                                data1);
                                        });
                                return;

                            } else {
                                show_set_up_widget(
                                    "Xero",
                                    'xero-login',
                                    'http://integrations.clickdesk.com:8080/ClickdeskPlugins/agile-xero-oauth?callbackUrl=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/XeroServlet?isForAll=" + isForAll + "&data="));
                            }
                        });
            }

        },

        /**
         * Manages QuickBooks widget
         */
        QuickBooks: function(id) {
            if (!id) {
                show_set_up_widget("QuickBooks", 'quickbooks-login',
                    '/OAuthServlet?service=quickbooks&isForAll=' + isForAll + '&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks");
            } else {
                $.getJSON("core/api/widgets/QuickBooks", function(data1) {
                    console.log(data1);

                    if (data1) {
                        $.getJSON("core/api/custom-fields", function(data) {
                            set_up_access("QuickBooks", 'quickbooks-login', data,
                                '/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks", data1);
                        });
                        return;

                    } else {
                        show_set_up_widget("QuickBooks", 'quickbooks-login',
                            '/OAuthServlet?service=quickbooks&return_url=' + encodeURIComponent(window.location.href) + "/quickbooks");
                    }
                });

            }
        },

        /**
         * Manages Facebook widget
         */
        Facebook: function(id) {
            if (!id) {
                show_set_up_widget("Facebook", 'facebook-login',
                    '/scribe?service=facebook&isForAll=' + isForAll + '&return_url=' + encodeURIComponent(window.location.href) + '/facebook');
            } else {
                if (!isNaN(parseInt(id))) {
                    $
                        .getJSON(
                            "/core/api/widgets/facebook/currentUserProfile/" + id,
                            function(data) {
                                console.log("data is")
                                console.log(data)
                                set_up_access(
                                    "Facebook",
                                    'facebook-login',
                                    data,
                                    '/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Facebook/facebook"));

                            }).error(
                            function(data) {

                                console.log(data);
                                setUpError("Facebook", "widget-settings-error", data.responseText,
                                    window.location.protocol + "//" + window.location.host + "/#Facebook/facebook1");

                            });
                    return;

                }

                $
                    .getJSON(
                        "core/api/widgets/Facebook",
                        function(data1) {
                            console.log(data1);

                            if (data1) {
                                $
                                    .getJSON(
                                        "core/api/widgets/facebook/currentUserProfile/" + data1.id,
                                        function(data) {
                                            set_up_access(
                                                "Facebook",
                                                'facebook-login',
                                                data,
                                                '/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#Facebook/facebook"),
                                                data1);

                                        })
                                    .error(
                                        function(data) {
                                            setUpError("Facebook", "widget-settings-error", data.responseText,
                                                window.location.protocol + "//" + window.location.host + "/#Facebook/facebook1", data1);
                                        });

                                return;

                            } else {
                                show_set_up_widget("Facebook", 'facebook-login',
                                    '/scribe?service=facebook&return_url=' + encodeURIComponent(window.location.href));
                            }
                        });

            }
        },

        /**
         * Manage Chargify Widget.
         */
        Chargify: function(id) {
            if (!id)
                show_set_up_widget("Chargify", "chargify-login");
            else
                fill_form(id, "Chargify", 'chargify-login')
        },

        /**
         * Manages widget added by user
         */
        Custom: function(id) {
            if (id) {
                alert('clicked');
                console.log($(this))
                divClone = $(this).clone();
                var widget_custom_view = new Base_Model_View({
                    url: "/core/api/widgets/custom",
                    template: "add-custom-widget",
                    isNew: true,
                    postRenderCallback: function(el) {
                        initializeWidgetSettingsListeners();
                        console.log('In post render callback');
                        console.log(el);
                        $('body').off('change', '#script_type');

                        $('body').on('change', '#script_type', function(e) {
                            var script_type = $('#script_type').val();
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
                    saveCallback: function(model) {
                        console.log('In save callback');

                        console.log(model);

                        if (model == null)
                            alert("A widget with this name exists already. Please choose a different name");

                        App_Widgets.Catalog_Widgets_View.collection.add(model);
                        $("#custom-widget").replaceWith(divClone);
                    }
                });

                $('#custom-widget', el).html(widget_custom_view.render(true).el);

                $('#cancel_custom_widget').die().live('click', function(e) {
                    // Restore element back to original
                    $("#custom-widget").replaceWith(divClone);
                });

            }
            // fill_form(id, "Custom", 'custom-widget-settings');
        },

        //Reddy code
        /**
         * Manages GooglePlus widget
         */
        GooglePlus: function(id) {
            if (!id) {
                show_set_up_widget("GooglePlus", 'googleplus-login',
                    '/scribe?service=googleplus&isForAll=' + isForAll + '&return_url=' + encodeURIComponent(window.location.href) + "/googleplus");
            } else {
                var widgetDetails = "";

                accessUrlUsingAjax("core/api/widgets/GooglePlus", function(resp) {
                    widgetDetails = resp;

                    console.clear();
                    console.log("In google Plus widget Router");
                    console.log(widgetDetails);

                    if (!widgetDetails) {
                        show_set_up_widget("GooglePlus", 'googleplus-login',
                            '/scribe?service=googleplus&return_url=' + encodeURIComponent(window.location.href) + "/googleplus");
                        return;
                    }

                    widgetPrefGP = JSON.parse(widgetDetails.prefs);

                    accessUrlUsingAjax("https://www.googleapis.com/plus/v1/people/me?access_token=" + widgetPrefGP['access_token'], function(resp1) {

                        var userData = resp1;
                        set_up_access(
                            "GooglePlus",
                            'googleplus-login',
                            userData,
                            '/scribe?service=googleplus&return_url=' + encodeURIComponent(window.location.protocol + "//" + window.location.host + "/#GooglePlus/googleplus"));



                    });
                });

            }

        }, //End of Gplus

        /**
         * Manages CallScript widget
         */
        CallScript: function(id) {
            if (!id)
                show_set_up_widget("CallScript", 'callscript-login');
            else
                fill_form(id, "CallScript", 'callscript-login');


        },

        /**
         * Show CallScript rules
         */
        CallScriptShow: function() {
            showCallScriptRule();
            initializeCallScriptListeners();
        },

        /**
         * Add CallScript rules
         */
        CallScriptAdd: function() {
            addCallScriptRule();
        },

        /**
         * Edit CallScript rules
         */
        CallScriptEdit: function(id) {
            editCallScriptRule(id);
        }
    });