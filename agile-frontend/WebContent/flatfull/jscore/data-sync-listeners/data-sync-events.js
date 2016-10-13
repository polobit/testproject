/**
 *  DataSync inner model view events
 */

var DATA_SYNC_URL="core/api/contactprefs"
var DataSync_Event_Modal_View = Base_Model_View.extend({

    events: {
        'click #import_shopify': 'importShopify',
        'change #sync-type': 'googleContactsSyncTypeChange',
        'click .save-contact-prefs': 'syncGoogleContacts',
        'click #stripe-import-prefs-delete': 'importStripePrefsDelete',
        'click #stripe_sync_prefs': 'syncStripePrefs',
        'click #shopify-setting': 'syncShopify',
        'click #quickbook_sync_prefs': 'syncQuickbooks',
        'click #freshbooks_sync_prefs': 'syncFreshbooks',
        'click #data-sync-type':'enableDataSyncWidget',
        'click .my_contacts_set' : 'checkMyContactType'
    },

    /**
     * For adding new case
     */
    importShopify: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);

        var shopName = $('#shop').val();
        if (shopName == "") {
            showAlertModal("empty_shop", undefined, function(){
              $('#shop').focus();
              
            });
            return false;
        }
        var domain = agileWindowOrigin();

        e.preventDefault();
        var callbackURL = window.location.href;
        var url = "/scribe?service_type=shopify&url=sync&window_opened=true&shop=" + shopName + "&domain=" + domain + "";

        // For every request of import, it will ask to grant access
        window.open(url + "&return_url=" + encodeURIComponent(callbackURL), 'dataSync', 'height=1000,width=500');
    },

     enableDataSyncWidget: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);

        var sync_type=$(ele).attr('sync_type');
        if(sync_type=='STRIPE'){
            var callbackURL = agileWindowOrigin() + "/#sync/stripe-import";
            // For every request of import, it will ask to grant access
            window.open( "/scribe?service=stripe_import&window_opened=true&return_url=" + encodeURIComponent(callbackURL),'dataSync','height=1000,width=500');
            return false;

        }else if(sync_type=='QUICKBOOK'){

          window.open('/OAuthServlet?service=quickbook-import&window_opened=true&return_url=' + encodeURIComponent(window.location.href) + 'quickbooks','dataSync','height=1000,width=500');
          return;
        }else if(sync_type=='OFFICE365'){
            
        }
    },

    syncShopify: function(e) {

        e.preventDefault();
        var ele = $(e.currentTarget);
        /*var disabled = $(this).attr("disabled");
        if (disabled) {
            return false;
        } else {
            $(ele).attr("disabled", "disabled");
            $(ele).text("Syncing");
        }

*/        $(ele).attr("disabled", "disabled");
       
                      
        var syncPrefs = serializeForm("shopify-contact-import-form");
        syncPrefs["inProgress"] = true;
             getSyncModelFromName('SHOPIFY', function(mod) {
              if(mod!=undefined){
                if(mod.inProgress==true)
                {
                     show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-in-progress"), App_Datasync.dataSync.el);
                      setTimeout(function() {
            $(ele).removeAttr("disabled");
            },3000);
                     return false;
                }
          }

       

            var model = new Backbone.Model(mod);
            model.set(syncPrefs, {
                silent: true
            });

            var url = DATA_SYNC_URL + "/SHOPIFY";

          //  $(ele).after(getRandomLoadingImg());
            model.url = url + "?sync=true"
            model.save({}, {
                success: function(data) {
                    show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-init"), App_Datasync.dataSync.el);
                    setTimeout(function() {
                 $(ele).removeAttr("disabled");
                     },3000);
                    showNotyPopUp("information", _agile_get_translated_val("misc-keys", "sync-contacts-init"), "top", 1000);
                }
            });
        },true);


    },

    /**
     * For adding new case
     */
    googleContactsSyncTypeChange: function(e) {

        e.preventDefault();
        var ele = $(e.currentTarget);

        var value = $(ele).val();
        if (value == "AGILE_TO_CLIENT" || value == "TWO_WAY") {
            $("#sync_to_group_controlgroup").show();
            $("#my_contacts_sync_group").show();
            if (value == "AGILE_TO_CLIENT") {
                $("#sync_from_group_controlgroup").hide();
                return;
            }

            $("#sync_from_group_controlgroup").show();
        } else {
            $("#sync_from_group_controlgroup").show();
            $("#sync_to_group_controlgroup").hide();
            $("#my_contacts_sync_group").hide();
        }
    },

    syncGoogleContacts: function(e) {

        var ele = $(e.currentTarget);
        var disabled = $(ele).attr("disabled");
       // if (disabled)
         //   return;

        if (!isValidForm("#google-contacts-import-form")) {
            return;
        };

        //$(ele).attr("disabled", "disabled");
       // $(ele).text("Syncing");

        //	return;
         $(ele).attr("disabled", "disabled");

        var syncPrefs = serializeForm("google-contacts-import-form");
        syncPrefs["inProgress"] = true;



        getSyncModelFromName('GOOGLE', function(mod) {

             if(mod.inProgress==true)
                {
                     show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-in-progress"), App_Datasync.dataSync.el);
                     setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                     return false;
                }
        
            var model = new Backbone.Model(mod);
            model.set(syncPrefs, {
                silent: true
            });

            var url = DATA_SYNC_URL + "/GOOGLE";
          //  $(ele).after(getRandomLoadingImg());
            model.url = url + "?sync=true&my_contacts_enable="+DataSync_Event_Modal_View.my_contacts_value;
            model.save({}, {
                success: function(data) {
                  DataSync_Event_Modal_View.my_contacts_value=false;
                    show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-init"), App_Datasync.dataSync.el);
                    /*setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);*/
                    showNotyPopUp("information", _agile_get_translated_val("misc-keys", "sync-contacts-init"), "top", 1000);
                }
            });
        },true);
    },

    importStripePrefsDelete: function(e) {

        e.preventDefault();

        var ele = $(e.currentTarget);
        var disable = $(ele).attr("disabled");
        if (disable)
            return;
        $(ele).attr("disabled", "disabled");
       // $(ele).after(getRandomLoadingImg());

        getTemplate('admin-settings-import-stripe-contact-sync', {}, undefined, function(template_) {
            if (!template_)
                return;
            $('#prefs-tabs-content').find('#stripe').html($(template_));
        });


    },

    syncStripePrefs: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);
        //var disabled = $(ele).attr("disabled");
       /* if (disabled) {
            return false;
        } else {
            $(ele).attr("disabled", "disabled");
            $(ele).text("Syncing");
        }*/
        $(ele).attr("disabled", "disabled");
                   

        var syncPrefs = serializeForm("stripe-prefs-form");
        syncPrefs["inProgress"] = true;
        getSyncModelFromName('STRIPE', function(mod) {

             if(mod.inProgress==true)
                {
                     show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-in-progress"), App_Datasync.dataSync.el);
                     setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                     return false;
                }
        
            var model = new Backbone.Model(mod);
            model.set(syncPrefs, {
                silent: true
            });

            var url = DATA_SYNC_URL + "/STRIPE";

           // $(ele).after(getRandomLoadingImg());
            model.url = url + "?sync=true"
            model.save({}, {
                success: function(data) {
                    show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-init"), App_Datasync.dataSync.el);
                    setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                    showNotyPopUp("information", _agile_get_translated_val("misc-keys", "sync-contacts-init"), "top", 1000);
                }
            });
        },true);
    },

    syncQuickbooks: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);

       /*var disable = $(ele).attr('disabled');
        if(disable)
            return false;
        $(ele).attr("disabled", "disabled");
        $(ele).text("Syncing");*/
         $(ele).attr("disabled", "disabled");
        
        var quickbookPrefs = serializeForm("quickbook-form");
        quickbookPrefs['inProgress'] = true;


          getSyncModelFromName('QUICKBOOK', function(mod) {

             if(mod.inProgress==true)
                {
                     show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-in-progress"), App_Datasync.dataSync.el);
                     setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                     return false;
                }
        
            var model = new Backbone.Model(mod);
            model.set(quickbookPrefs, {
                silent: true
            });

            var url = DATA_SYNC_URL + "/QUICKBOOK";

         //   $(ele).after(getRandomLoadingImg());
            model.url = url + "?sync=true"
            model.save({}, {
                success: function(data) {
                    show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-init"), App_Datasync.dataSync.el);
                    setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                    showNotyPopUp("information", _agile_get_translated_val("misc-keys", "sync-contacts-init"), "top", 1000);
                }
            });
        },true);

    },

    syncFreshbooks: function(e) {
        e.preventDefault();
        var ele = $(e.currentTarget);

                //var disable = $(ele).attr('disabled');
                    //if(disable)
                    //return false;
                    $(ele).attr("disabled", "disabled");
                   
                   // $(ele).text("Syncing");*/
                    
                    var freshbooks_prefs = serializeForm("freshbooks-form");
                    freshbooks_prefs['inProgress'] = true;
                     getSyncModelFromName('FRESHBOOKS', function(mod) {

                         if(mod.inProgress==true)
                {
                     show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-in-progress"), App_Datasync.dataSync.el);
                     setTimeout(function() {
                      $(ele).removeAttr("disabled");
                      },3000);
                     return false;
                }
        
                        var model = new Backbone.Model(mod);
                        model.set(freshbooks_prefs, {
                            silent: true
                        });

                        var url = DATA_SYNC_URL + "/FRESHBOOKS";

                       // $(ele).after(getRandomLoadingImg());
                        model.url = url + "?sync=true"
                        model.save({}, {
                            success: function(data) {
                                show_success_message_after_save_button(_agile_get_translated_val("misc-keys", "sync-init"), App_Datasync.dataSync.el);
                            setTimeout(function() {
                                 $(ele).removeAttr("disabled");
                                     },3000);
                            
                                showNotyPopUp("information", _agile_get_translated_val("misc-keys", "sync-contacts-init"), "top", 1000);
                            }
                        });
                    },true);
                    
    },

    checkMyContactType :function(e){
       if($('.my_contacts_set:checked').length==0){
        showAlertModal("sync_contacts", "confirm", function() {
           DataSync_Event_Modal_View.my_contacts_value=true;
       },
         function() {
             $(".my_contacts_set").prop("checked",true);
          }
       );
       }

    }

});




/**
binds all click events  for google calendar model
*/

	var GoogleCalendar_Event_Modal_View = Base_Model_View.extend({

    events: {
        'click #sync-google-calendar': 'syncGoogleCalendarEnable',
        'click #sync-google-calendar-delete': 'deleteGoogleCalendarPrefs',
       
    },

      syncGoogleCalendarEnable: function(e) {

        e.preventDefault();

       // URL to return, after fetching token and secret key from LinkedIn
		var callbackURL = agileWindowOrigin() + "/#sync/calendar-setup";

		// For every request of import, it will ask to grant access
		window.open("/scribe?service=google_calendar&window_opened=true&return_url=" + encodeURIComponent(callbackURL),'dataSync','height=1000,width=500');

    },


     deleteGoogleCalendarPrefs: function(e) {

     	e.preventDefault();
      var $that = $(this);
      showAlertModal("delete_calendar_prefs", "confirm", function(){
        var ele = $(e.currentTarget);

        var disabled = $that.attr("disabled");
        if (disabled)
          return;

        $(ele).attr("disabled", "disabled");

        $(ele).after(getRandomLoadingImg());
        App_Datasync.calendar_sync_google.model.url = "/core/api/calendar-prefs/type/GOOGLE"
        App_Datasync.calendar_sync_google.model.destroy({ success : function()
        {

          App_Datasync.calendar_sync_google.model.clear();
          App_Datasync.calendar_sync_google.render(true);
          erase_google_calendar_prefs_cookie();
                _resetGAPI();
        } });
      });
       

    }
}); 