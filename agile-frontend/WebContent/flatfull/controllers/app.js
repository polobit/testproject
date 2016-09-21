/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Contacts, App_Contact_Search, App_Contact_Bulk_Actions, App_Contact_Filters, App_Contact_Views, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings, App_Reports, App_Cases, App_Subscription, App_Visitors, App_WebReports, App_Documents, App_Widgets, App_ShopifyApp, App_Portlets, App_VoiceMailRouter,App_Deal_Details, App_Forms, App_ACL, App_Webpages, App_PushNotification;
var Collection_View = {};
$(function()
{
	App_Contacts = new ContactsRouter();
	App_Contact_Views = new ContactViewsRouter();
	App_Contact_Filters = new ContactFiltersRouter();
	App_Contact_Bulk_Actions = new ContactBulkActionRouter();
	App_Contact_Search = new ContactSearchRouter();
	App_Workflows = new WorkflowsRouter();
	App_Deals = new DealsRouter();
	App_Admin_Settings = new AdminSettingsRouter();
	App_Settings = new SettingsRouter();
	App_Calendar = new CalendarRouter();
	App_Subscription = new SubscribeRouter();
	App_Reports = new ReportsRouter();
	App_Cases = new CasesRouter();
	App_Visitors = new VisitorsRouter();
	App_WebReports = new WebreportsRouter();
	App_Documents = new DocumentsRouter();
	App_Widgets = new WidgetsRouter();
	App_Configuration = new AgileConfigRouter();
	App_Adminpanel = new AdminPanelRouter();
	App_ReferelRouter = new ReferelRouter();
	App_Activity_log = new ActivitylogRouter();
	App_ShopifyApp = new ShopifyRouter();
	App_Deal_Details= new DealDetailsRouter();
	App_VoiceMailRouter = new VoiceMailRouter();
	App_Portlets = new PortletsRouter;
	App_Tasks = new TaskDetailsRouter();
	App_Forms = new FormsRouter();
	App_ACL = new ACLRestriction();
	App_FacebookPageTabRouter = new FacebookPageTabRouter();
	App_Companies = new CompaniesRouter();
	App_Datasync = new DataSyncRouter();
	App_Ticket_Module = new TicketsUtilRouter();
	App_LandingPageRouter = new LandingPageRouter();
	App_Dashboards = new DashboardsRouter();
	App_EmailBuilderRouter = new EmailBuilderRouter();
	App_VisitorsSegmentation=new VisitorsSegmentationRouter();
	App_PushNotification = new PushNotificationRouter();
	// Binds an event to activate infinite page scrolling
	Backbone.history.bind("all", currentRoute)

	// Backbone.history.bind("change", routeChange)

	/*
	 * Start Backbone history a necessary step to begin monitoring hashchange
	 * events, and dispatching routes
	 */
	Backbone.history.start();
	App_Admin_Settings.contactsLimitreachedview()

//	setup_our_domain_sync();
});

// Global variable to store current route
var Current_Route;

/**
 * Reads current route, from the url of the browser, splits at "#" ( current
 * route is after "#" ), and activates infinite scrolling
 * 
 * @param route
 */
function currentRoute(route)
{
	endFunctionTimer("startbackbone");
	
	Current_Route = window.location.hash.split("#")[1];
	
	if(SCROLL_POSITION)
	{
		var temp = Current_Route;
		if(!temp.match("contact"))
			SCROLL_POSITION = 0;
	}

	// Update Google Analytics Track Page
	agile_update_ga_track_page(Current_Route);
	
	activateInfiniScroll();
	// set_profile_noty();
	// Reset it to uncheck checkboxes for bulk actions on route change
	SELECT_ALL = false;
	SUBSCRIBERS_SELECT_ALL = false;
	if (tour)
	{
		tour.end();
		tour = null;
	}
	if (GLOBAL_WEBRULE_FLAG)
		executeWebRulesOnRoute();

	// disposeEvents();

	// load_clickdesk_code();
	try{
		showPageBlockModal();
	}catch(e){
	}
	
	 showUpgradeNoty();
	 if(!_agile_get_prefs("contactslimit"))
	{
	App_Admin_Settings.contactsLimitreachedview();
	}


	 // Check the user permission to view the current route.
	 if(CURRENT_DOMAIN_USER)
		 tight_acl.init_permissions();

		//removing_fullscreen();

}



/*
checking the current path for the contacts
*/
/*
function removing_fullscreen()
{

    var fullscreenhideRoutes = ["contacts", "deals", "workflows"];
    var hideFullScreen = false;
    for(var i=0;i <fullscreenhideRoutes.length; i++){
    	if(Current_Route == undefined) {
    		$("#content").removeClass("fullscreenwidjet");
			$("#aside").removeClass("hide");
		}
         else if (Current_Route.indexOf(fullscreenhideRoutes[i]) == 0){
           		return;
    }
    else  {
    $("#content").removeClass("fullscreenwidjet");
	$("#aside").removeClass("hide");
	}
	}

    
 }
 */
/**
 * Clickdesk Widget
 */
var CLICKDESK_Live_Chat = CLICKDESK_Live_Chat || {};
function load_clickdesk_code()
{

	if (CLICKDESK_CODE_LOADED)
		return;

	console.log("loading clickdesk..");

	CLICKDESK_CODE_LOADED = true;

	var glcspt = document.createElement('script');
	glcspt.type = 'text/javascript';
	glcspt.async = true;
	glcspt.src = glcpath + 'livechat-new.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(glcspt, s);

	CLICKDESK_Live_Chat.on_after_load = function(){
		agile_toggle_chat_option_on_status();
	};
}

function clickdesk_livechat_get_current_status(callback){
	CLICKDESK_Live_Chat.onStatus(function(status){callback(status)});
}

function agile_toggle_chat_option_on_status(){
	clickdesk_livechat_get_current_status(function(status){
		var $li = $("#clickdesk_live_chat").closest("li");
		$li.removeClass("none block");
		
    	if(status == "online")
	    	$li.addClass("block");
	    else 
	    	$li.addClass("none");
    });
}

function executeWebRulesOnRoute(){
 	  if(typeof _agile_execute_action == "function")
	  {
	        _agile_webrules();
	        return;
	  }
}

$(document).ready(function(){
  load_clickdesk_code();
  setTimeout(function(){$(".modal-header .close").html("&times;");}, 1000);
if(_agile_get_prefs("contacts_limit_noty") ==  true || _agile_get_prefs("contacts_limit_noty") == undefined)

{
  $.get("/core/api/contacts/list/count", {}, function(data)
		{
			console.log('inside the contacts count ajax request');
    		data = parseInt(data);
    		if(data > parseInt(USER_BILLING_PREFS.planLimits.contactLimit*0.8))
    		{
    			_agile_set_prefs("contacts_limit_noty",true)
    			$("#contacts_plan_alert_info").css("display" , "block");
    		}
    			
    	});
	}
});

SUBSCRIBERS_SELECT_ALL = false;

