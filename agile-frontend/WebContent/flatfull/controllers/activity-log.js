/**
 * calendar.js is a script file having a route to show calendar
 * 
 * @module Activities
 */
var ActivitylogRouter = Backbone.Router.extend({

    routes: {
        /* Shows page */
        "activities": "activities",
        /*"navbar-activities/:id" : "navbarActivities",*/
        "contact-activities": "contactActivities",
        "contact-activities/:type": "contactActivities",
        "activities/campaign/:id" : "activities"
    },
    navbarActivities :function(e)
    {
        navbarRoutes(e)
        Backbone.history.navigate("activities", {
            trigger: true
        });
    },
    activities: function(id) {
        if (!tight_acl.checkPermission('ACTIVITY'))
            return;
        if(CURRENT_DOMAIN_USER.domain == "admin" && CURRENT_DOMAIN_USER.adminPanelAccessScopes.indexOf("VIEW_LOGS") == -1)
            return  showNotyPopUp("information", 'You donot have the Privileges to Access this page ', "top", 6000);
        head.js(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'), function() {

            $('#content').html("<div id='activities-listners'>&nbsp;</div>");
            getTemplate('activity-list-header', {}, undefined, function(template_ui) {

                if (!template_ui)
                    return;

                getTracksCount(function(count) {

                    DEAL_TRACKS_COUNT = count;

                    $('#activities-listners').html($(template_ui));

                    var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
                    /*$(".appaside.dropdownnavbar ul li").removeClass("agile-menuactive");
                    $("."+dashboard_name+"-activitiesnavbar").addClass("agile-menuactive");*/

                    var activities_list;
                    if(!dashboard_name){
                        var role = CURRENT_DOMAIN_USER.role;
                        switch(role){
                            case "SALES" :
                                dashboard_name = "SalesDashboard";
                                break;
                            case "MARKETING" :
                                dashboard_name = "MarketingDashboard";
                                break;
                            case "SERVICE" :
                                dashboard_name = "dashboard";
                                break;
                        }
                        
                    }
                    switch(dashboard_name){
                         case "SalesDashboard" :
                             activities_list = "sales-activity-list-header"
                             break;
                         case "MarketingDashboard" :
                             activities_list = "marketing-activity-list-header"
                             break;
                         case "dashboard" :
                             activities_list = "service-activity-list-header"
                             break;
                        case "Dashboard" :
                             activities_list = "service-activity-list-header"
                             break;
                     }
                     getTemplate(activities_list, {}, undefined, function(template) {
 
                         if (!template)
                             return;
                         $(".dashboard-activities").append(template);
                     });

                    initActivitiesDateRange();

                    //comaign  history
                    var campaignHistory=true;

                    if(id==undefined){
                        campaignHistory=false;
                    }
                    else{
                        $('#selectedentity_type').html(_agile_get_translated_val("menu", "menu-campaigns"));
                        $("#activities_date_range").hide();
                    }

                    renderActivityView(getActivityFilterParameters(true,campaignHistory)+"&campaign-id="+id);
                    
                    $(".activity-log-button").css('display','none');

                    var activityFilters = JSON.parse(_agile_get_prefs(ACTIVITY_FILTER));

                    var entityId;
                    var entitytype_dashboard;
                    if(activityFilters){
                        if(activityFilters[dashboard_name] != undefined){
                                entityId = activityFilters[dashboard_name].entityId;
                                entitytype_dashboard = activityFilters[dashboard_name].entity;
                                console.log("saddfasda");
                        }
                    }

                    var optionsTemplate = "<li><a  href='{{id}}'>{{name}}</li>";

                    // fill workflows
                    fillSelect('user-select', 'core/api/users', 'domainuser', function fillActivities() {
                        $('#activities-listners').find("#user-select").append("<li><a href=''>" + _agile_get_translated_val('report-view', 'all-users') + "</a></li>");
                        if (activityFilters &&  (activityFilters.user || entitytype_dashboard)) {
                            $('ul#user-select li a').closest("ul").data("selected_item", activityFilters.userId);
                            $('ul#entity_type li a').closest("ul").data("selected_item", entityId);
                            $('#selectedusername').html(activityFilters.user);

                                    //Campaing History
                            if(id != undefined)
                            {

                                   activityFilters.entity = _agile_get_translated_val("menu", "menu-campaigns");
                            }
                            
                                $('#selectedentity_type').html(entitytype_dashboard);
                                $('.activity-sub-heading').html(entitytype_dashboard);

                        }

                        $(".activity-log-button").css('display','inline-block');


                    }, optionsTemplate, true);



                });

            }, "#activities-listners");

            $(".active").removeClass("active");
            $("#activitiesmenu").addClass("active");
            
        })
    },
    contactActivities: function(id) { // begin contact activities

            head.js(LIB_PATH + 'lib/date-charts-en.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'), function() {


                getTemplate('contact-activity-header', {}, undefined, function(template_ui) {
                    if (!template_ui)
                        return;
                    $('#content').html($(template_ui));

                    var urlPath = "core/api/campaigns/logs/ContactActivities";

                    var keyword = "";
                    var uiKeyword = "";
                    var sortKey = "time";
                    switch (id) {
                        case "all":
                            keyword = "?log_type=All_Activities";
                            uiKeyword = _agile_get_translated_val("report-view", "all-activities");
                            break;
                        case "page-views":
                            keyword = "?log_type=Page_Views";
                            uiKeyword = _agile_get_translated_val("contact-details", "page-views");
                            break;
                        case "email-opens":
                            keyword = "?log_type=Email_Opened";
                            uiKeyword = _agile_get_translated_val("portlets", "email-opens");
                            break;
                        case "email-clicks":
                            keyword = "?log_type=Email_Clicked";
                            uiKeyword = _agile_get_translated_val('contact-details', 'email-clicks');
                            break;
                        case "unsubscriptions":
                            keyword = "?log_type=Unsubscribed";
                            uiKeyword = _agile_get_translated_val('campaigns', 'unsubscriptions');
                            break;
                        case "spam-reports":
                            keyword = "?log_type=Email_Spam";
                            uiKeyword = _agile_get_translated_val("contact-details", "spam-reports");
                            break;
                        case "hard-bounces":
                            keyword = "?log_type=Email_Hard_Bounced";
                            uiKeyword = _agile_get_translated_val("campaigns", "hard-bounces");
                            break;
                        case "soft-bounces":
                            keyword = "?log_type=Email_Soft_Bounced";
                            uiKeyword = _agile_get_translated_val("campaigns", "soft-bounces");
                            break;
                        default:
                            keyword = "?log_type=All_Activities";
                            uiKeyword = _agile_get_translated_val("report-view", "all-activities");
                    }

                    urlPath = urlPath + keyword;
                    if (id != undefined && id != "all")
                        $('.contact-activity-sub-heading').text(uiKeyword);
                    $('#log-filter-title').text(uiKeyword);

                    /*
                     * if(IS_FLUID){
                     * $('#contact_activity_header').removeClass('row').addClass('row-fluid');
                     * $('#contact_activity_model').removeClass('row').addClass('row-fluid'); }
                     * else{
                     * $('#contact_activity_header').removeClass('row-fluid').addClass('row');
                     * $('#contact_activity_model').removeClass('row-fluid').addClass('row'); }
                     */
                    var collectionList = new Base_Collection_View({
                        url: urlPath,
                        templateKey: 'contact-activity-list-log',
                        individual_tag_name: 'li',
                        cursor: true,
                        scroll_symbol: 'scroll',
                        page_size: 20,
                        sort_collection: false,
                        postRenderCallback: function(el) {
                            // initDateRangePicker("contact_activities_date_range",el);
                            contactListener();
                            agileTimeAgoWithLngConversion($("time", el));
                        },
                        appendItemCallback: function(el) {
                            includeTimeAgo(el);
                        }
                    });
                    collectionList.appendItem = append_contact_activities_log;
                    collectionList.collection.fetch();

                    $('#contact-activity-list-based-condition').html(collectionList.render().el);

                    console.log("========contact activities ==========");


                }, "#content");

            });

            $(".active").removeClass("active");
            $("#activitiesmenu").addClass("active");

        } // end contact activities

});