var DataSyncRouter = Backbone.Router.extend({

routes : {

            "sync": "dataSync",
            "sync/contacts": "google_contacts_sync",
            "sync/calendar": "google_apps_calendar",
            "sync/stripe-import": "stripe_sync",
            "sync/shopify": "shopify",
            "sync/salesforce": "salesforce",
            "sync/zoho-import": "zoho_sync",
            "sync/quickbook": "quickbook_import",
            "sync/xero": "xero_import",
            "sync/freshbooks": "freshbooks_sync",
            "sync/freshbooks/setting": "freshbooks_sync_setting"

 },

dataSync : function()
{
	 var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');
               
                that.agile_sync_collection_view = new Base_Collection_View({
                    url: 'core/api/contactprefs/allPrefs',
                    type: 'GET',
                    individual_tag_name: 'div',
                    templateKey: 'data-sync',
                    postRenderCallback: function(el) {


                        that.calendar_sync_google = new GoogleCalendar_Event_Modal_View({
                            url: 'core/api/calendar-prefs/get',
                            template: 'import-google-calendar',
                            postRenderCallback: function(el) {
                                initializeImportListeners();
                            }
                        });
                        // console.log(getTemplate("import-google-contacts", {}));
                        $('#calendar-prefs').append(that.calendar_sync_google.render().el);

                        initializeDataSyncListners();


                    }
                });

                that.agile_sync_collection_view.collection.fetch();
                that.agile_sync_collection_view.appendItem = organize_sync_widgets;
                $('#prefs-tabs-content').html(that.agile_sync_collection_view.render().el);


            }, "#content");
	
},

	 google_contacts_sync: function() {
	            var that = this;
	            getTemplate('settings', {}, undefined, function(template_ui) {
	                if (!template_ui)
	                    return;
	                $('#content').html($(template_ui));

	                $('#PrefsTab .select').removeClass('select');
	                $('.contact-sync-tab').addClass('select');


	                getSyncModelFromName("GOOGLE", function(model){

                   	var	url= 'core/api/contactprefs/GOOGLE',
			                  template= 'admin-settings-import-google-contacts-setup';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });

	            }, "#content");

	        },

        google_apps_calendar: function() {
           
        },


        stripe_sync: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

               
			       getSyncModelFromName("STRIPE", function(model){

                   	var	url= 'core/api/contactprefs/STRIPE',
			                  template= 'admin-settings-import-stripe-contact-sync-prefs';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			    	     });
			          }, "#content");

        },


        shopify : function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));
                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

                   getSyncModelFromName("SHOPIFY", function(model){

                   	var	url= 'core/api/contactprefs/SHOPIFY',
			                  template= 'admin-settings-import-shopify-prefs';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });
               
            }, "#content");
        },

        freshbooks_sync: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

              
                that.freshbooks_sync_setting = new Base_Model_View({
                    url: 'core/api/freshbooks/import-settings',
                    template: 'admin-settings-import-freshbooks-contacts-form',
                    saveCallback: function(model) {

                        showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                    }
                });

                $("#prefs-tabs-content").html(that.freshbooks_sync_setting.render().el);
            
            }, "#content");
        },

        freshbooks_sync_setting: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));
                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');


                
                that.freshbooks_import_settings = new Base_Model_View({
                    url: 'core/api/freshbooks/import-settings',
                    template: 'admin-settings-import-freshbooks-settings',
                    postRenderCallback: function(el) {
                        initializeImportListeners();
                    },
                    saveCallback: function(model) {

                        showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                    }
                });

                $("#prefs-tabs-content").html(that.freshbooks_import_settings.render().el);
          

            }, "#content");
        },

       
        quickbook_import: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));
                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

                  getSyncModelFromName("QUICKBOOK", function(model){

 							var	url= 'core/api/contactprefs/QUICKBOOK',
			                  template= 'admin-settings-import-quickbook-settings';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			         });

            }, "#content");
        },

        xero_import: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

                 getSyncModelFromName("XERO", function(model){

                   	var	url= 'core/api/contactprefs/XERO',
			                  template= 'admin-settings-import-xero-settings';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });

            }, "#content");
        },
         zoho_sync: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));
                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');


                 getSyncModelFromName("ZOHO", function(model){

                   	var	url= 'core/api/contactprefs/ZOHO',
			                  template= 'admin-settings-import-zoho-prefs';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });

            }, "#content");
        }

});
