/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Contacts, App_Contact_Search, App_Contact_Bulk_Actions, App_Contact_Filters, App_Contact_Views, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings, App_Reports, App_Cases, App_Subscription, App_Visitors, App_WebReports, App_Documents, App_Widgets, App_ShopifyApp, App_Portlets, App_VoiceMailRouter,App_Deal_Details, App_Forms, App_ACL, App_Webpages, App_PushNotification, App_Leads, App_Leads_Bulk_Actions;
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
	App_Affiliate = new AffiliateRouter();
	App_Leads=new LeadsRouter();
	App_Leads_Bulk_Actions = new LeadsBulkActionRouter();
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
		//var $li = $("#clickdesk_live_chat").closest("li");
		var $li = $("#clickdesk_live_chat").find(".chat-bubble");
		//$li.removeClass("none block");

    	if(status == "online"){
    		
    		$(".chat-with-us").removeClass("hide");
	    	//$(".support,.product-updates,.agile-affiliate-link").addClass("col-md-4").removeClass("col-md-3");
	    	$(".support,.product-updates,.agile-affiliate-link").removeClass("col-md-4").addClass("col-md-3");
    		
    	}
	    else {
	    	$(".chat-with-us").addClass("hide");
	    	$(".support,.product-updates,.agile-affiliate-link").addClass("col-md-4").removeClass("col-md-3");
	    }	

    });
}

function check_online__chat_status(callback){
	clickdesk_livechat_get_current_status(function(status){
		var online_status = false;
    	if(status == "online")
	    	online_status = true;
	    callback(online_status)

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

});

SUBSCRIBERS_SELECT_ALL = false;



var SHOW_EXIT_CAMPAIGN_POPUP = false;
// Observed route triggerring for Some unsafe changes like Campaign.
Backbone.History.prototype.loadUrl = function (fragment, options) {
    var opts = options;
    var nextRoute = Backbone.history.fragment = Backbone.history.getFragment(fragment);
    var is_campaign_unsave = getCampaignAction(Current_Route);
    var currentRoute = Current_Route;
    if(nextRoute == 'navigate-dashboard'){
    	var userRole = CURRENT_DOMAIN_USER.role;
    }
    try{
    	// Validation for unsave Campaign, If we are in middle of designing a Campaign and trigger another route then show confirmation popup
	    //if (is_campaign_unsave && fragment === void (0) && options === void (0) && this.confirmationDisplay !== void(0))
	    if (is_campaign_unsave && SHOW_EXIT_CAMPAIGN_POPUP == false)
	    {   	    	
	    	$("#agile-menu-navigation-container").html(getTemplate("marketing-menu-items", {due_tasks_count : due_tasks_count}));
	    	SHOW_EXIT_CAMPAIGN_POPUP = true;	
			var response = false;
			// Showing modal for unsave Campaign
	    	showModalConfirmation(
					"Campaign Alert",
					"There are unsave changes are you want to continue?",
					function()
					{
						// Yes callback
						response = true;
						if(nextRoute == 'navigate-dashboard')
							$('.menu-service-select').attr('data-service-name',userRole).click();
						else
							Backbone.history.navigate(nextRoute, { trigger : true });
						return;
					},function()
					{
						// No callback
						response = true;
						Backbone.history.navigate(currentRoute);
						return;
					}, function()
					{
						// Popup close callback
						if(!response)
							Backbone.history.navigate(currentRoute);

						SHOW_EXIT_CAMPAIGN_POPUP = false;
						return;			   
					}, "Yes", "No");
	    	// Stay on same page while Exit Campaign popup response
	    	Backbone.history.navigate(currentRoute); 
		    return this;
	    }
	    else{ 
		    //this.confirmationDisplay = true;
		    return _.any(Backbone.history.handlers, function (handler) {
		        if (handler.route.test(nextRoute)) {
		            //We just pass in the options
		            handler.callback(nextRoute, opts);
		            return true;
		        }
		    });		       	
	    }
    }
    catch(err){
    	console.log(err);
    	SHOW_CAMPAIGN_POPUP = false;
    	Backbone.history.navigate(currentRoute); 
	    return this;
    }    
}

// Find the route for campaign.
function getCampaignAction(previous_route){
	var is_campaign_unsave = false;
	try{
		if(previous_route == undefined)
			return is_campaign_unsave;

		// Check for new Campaign
		if(previous_route == 'workflow-add'){
			is_campaign_unsave = true;
		}
		else{
			// Check for existing Campaign
			var route = previous_route.split('/');
			if(route[0] && route[0] == 'workflow'){
				if(route[1] && typeof(parseInt(route[1])) == 'number')
					is_campaign_unsave = true;
			}
		}
		return is_campaign_unsave;
	}
	catch(err){
		console.log(err);
		return is_campaign_unsave;
	}
}
