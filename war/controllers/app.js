/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Contacts, App_Contact_Search, App_Contact_Bulk_Actions, App_Contact_Filters, App_Contact_Views, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings, App_Reports, App_Cases, App_Subscription, App_Visitors, App_WebReports, App_Documents, App_Widgets, App_ShopifyApp;
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

	// Binds an event to activate infinite page scrolling
	Backbone.history.bind("all", currentRoute)

	// Backbone.history.bind("change", routeChange)

	/*
	 * Start Backbone history a necessary step to begin monitoring hashchange
	 * events, and dispatching routes
	 */
	Backbone.history.start();
	setup_our_domain_sync();
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
	Current_Route = window.location.hash.split("#")[1];
	
	if(SCROLL_POSITION)
	{
		var temp = Current_Route;
		if(!temp.match("contact"))
			SCROLL_POSITION = 0;
	}
	
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
	{
		_agile_execute_web_rules();
	}
	// disposeEvents();

	 load_clickdesk_code();

}

/**
 * Clickdesk Widget
 */
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
}
