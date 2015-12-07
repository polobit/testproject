/**
 new DataSync router
 separated from widgets
*/



var DataSyncRouter = Backbone.Router.extend({

routes : {

            "sync": "dataSync",
            "sync/contacts": "google_contacts_sync",
            "sync/calendar-setup": "google_calendar_setup",
            "sync/stripe-import": "stripe_sync",
            "sync/shopify": "shopify",
            "sync/officeCalendar" : "office365_calendar_sync",
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
                var dataSyncTab = localStorage.getItem("datasync_tab");
                if(!dataSyncTab || dataSyncTab == null) {
                    if(islocalStorageHasSpace())
                        localStorage.setItem('datasync_tab', "google-tab");
                    dataSyncTab = "google-tab";
                }
                $('#prefs-tabs-content a[href="#'+dataSyncTab+'"]').tab('show');
                $("#prefs-tabs-content .tab-container ul li").off("click");
                $("#prefs-tabs-content").on("click",".tab-container ul li",function(){
                    var temp = $(this).find("a").attr("href").split("#");
                    if(islocalStorageHasSpace())
                        localStorage.setItem('datasync_tab', temp[1]);
                });
            	that.google_calendar(el);
                that.office_calendar();
                initializeDataSyncListners();

            }
        });

        that.agile_sync_collection_view.collection.fetch();
        that.agile_sync_collection_view.appendItem = organize_sync_widgets;
        $('#prefs-tabs-content').html(that.agile_sync_collection_view.render().el);

    }, "#content");
},


    google_calendar:function(el){
    	this.calendar_sync_google = new GoogleCalendar_Event_Modal_View({
            url: 'core/api/calendar-prefs/get',
            template: 'import-google-calendar',
            postRenderCallback: function(el) {
                initializeImportListeners();
            }
        });

        // console.log(getTemplate("import-google-contacts", {}));
        $('#calendar-prefs').html(this.calendar_sync_google.render().el);
    },

    office_calendar: function(){

         var calendar_settings_view = new Calendar_Sync_Settings_View({
                        url : "core/api/calendar-prefs/type/OFFICE365",
                        template : "admin-settings-import-office365-sync-details"
                    });
        $('#office365').html(calendar_settings_view.render().el);
    },

	 google_contacts_sync: function() {
	            var that = this;
	            getTemplate('settings', {}, undefined, function(template_ui) {
	                if (!template_ui)
	                    return;
	                $('#content').html($(template_ui));

	                $('#PrefsTab .select').removeClass('select');
	                $('.contact-sync-tab').addClass('select');

                    getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
    	                getSyncModelFromName("GOOGLE", function(model){

                       	var	url= 'core/api/contactprefs/GOOGLE',
    			                  template= 'admin-settings-import-google-contacts-setup';
                      					renderInnerSyncView(url,template,model,function(model){
    									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                      					});
    			               
    			         });
                    }, null);

	            }, "#content");

	        },
            google_calendar_setup: function()
            {
                getTemplate('settings', {}, undefined, function(template_ui) {

                    $('#content').html($(template_ui));
                    $('#PrefsTab .select').removeClass('select');
                    $('.contact-sync-tab').addClass('select');

                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
                          var calendar_settings_view = new Calendar_Sync_Settings_View({
                        url : "core/api/calendar-prefs/get",
                        template : "import-google-calendar-setup",
                        postRenderCallback: function(el)
                        {
                                head.js(LIB_PATH + 'lib/jquery.multi-select.js', function()
                                    {

                                        $('#multi-select-calendars', el).multiSelect();

                                    });
                        }
                    });
                    $("#data-sync-settings-tab-content").html(calendar_settings_view.render().el);
                    
                    }, null);
                  


                }, "#content");
            },


        stripe_sync: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

               getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
    			       getSyncModelFromName("STRIPE", function(model){

                       	var	url= 'core/api/contactprefs/STRIPE',
    			                  template= 'admin-settings-import-stripe-contact-sync-prefs';
                      					renderInnerSyncView(url,template,model,function(model){
    									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                      					});
    			               
    			    	     });
                }, null);
			 }, "#content");

        },

        office365_calendar_sync: function() {
            var that = this;
            getTemplate('settings', {}, undefined, function(template_ui) {
                if (!template_ui)
                    return;
                $('#content').html($(template_ui));

                $('#PrefsTab .select').removeClass('select');
                $('.contact-sync-tab').addClass('select');

               getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");

                        var calendar_settings_view = new Calendar_Sync_Settings_View({
                            url : "core/api/calendar-prefs/type/OFFICE365",
                            template : "admin-settings-import-office365-calendar-prefs",
                            postRenderCallback: function(el){
                               var model = calendar_settings_view.model;
                               if(model && model.get("prefs"))
                               {
                                    try
                                    {
                                        var prefs = model.get("prefs");
                                        if(typeof prefs != 'object')
                                            model.set('prefs', JSON.parse(prefs), {silent: true});
                                    }
                                    catch (err)
                                    {
                                        console.log(err)
                                    }
                               }
                            },
                            saveCallback: function() {
                                App_Datasync.dataSync();
                                showNotyPopUp("information", "Office365 calendar saved successfully", "top", 1000);
                            }
                        });
                        $("#data-sync-settings-tab-content").html(calendar_settings_view.render().el);


                       // getSyncModelFromName("officeCalendar", function(model){
                       //      var url= '',
                       //      template= '';
                       //      renderInnerSyncView(url,template,model,function(model){
                       //          showNotyPopUp("information", "Office 365 calendar saved successfully", "top", 1000);
                       //      });                       
                       //  });

                }, null);
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
                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
                   getSyncModelFromName("SHOPIFY", function(model){

                   	var	url= 'core/api/contactprefs/SHOPIFY',
			                  template= 'admin-settings-import-shopify-prefs';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });
                }, null);    
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
                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
                getSyncModelFromName("FRESHBOOKS", function(model){

                    var url= 'core/api/contactprefs/FRESHBOOKS',
                              template= 'admin-settings-import-freshbooks-contacts-form';
                                    renderInnerSyncView(url,template,model,function(model){
                                    showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                                    });
                           
                     });
                }, null);      
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
                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
                  getSyncModelFromName("FRESHBOOKS", function(model){
                    var url= 'core/api/contactprefs/FRESHBOOKS',
                              template= 'admin-settings-import-freshbooks-settings';
                                    renderInnerSyncView(url,template,model,function(model){
                                    //initializes freshbooks listners which is present in 
                                    //import.js
                                    
                                    showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                                    });
                     });

                  }, null);
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
                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");

                  getSyncModelFromName("QUICKBOOK", function(model){

 							var	url= 'core/api/contactprefs/QUICKBOOK',
			                  template= 'admin-settings-import-quickbook-settings';
                  					renderInnerSyncView(url,template,model,function(model){
                                        
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			         });
                  }, null);
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
                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");

                 getSyncModelFromName("XERO", function(model){

                   	var	url= 'core/api/contactprefs/XERO',
			                  template= 'admin-settings-import-xero-settings';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });
                 }, null);
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

                getTemplate('data-sync-settings', {}, undefined, function(template_ui1){
                        if(!template_ui1)
                            return;
                        $("#prefs-tabs-content").html(template_ui1);
                        var dataSynctTab = localStorage.getItem("datasync_tab");
                        $("#prefs-tabs-content").find('a[href="#'+dataSynctTab+'"]').closest("li").addClass("active");
                        initializeTabListeners("datasync_tab", "sync");
                 getSyncModelFromName("ZOHO", function(model){

                   	var	url= 'core/api/contactprefs/ZOHO',
			                  template= 'admin-settings-import-zoho-prefs';
                  					renderInnerSyncView(url,template,model,function(model){
									showNotyPopUp("information", "Contacts sync initiated", "top", 1000);
                  					});
			               
			         });
                }, null);
            }, "#content");
        }

});
