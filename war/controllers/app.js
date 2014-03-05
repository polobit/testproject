/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Contacts, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings, App_Reports, App_Cases;
var Collection_View = {};
$(function()
{
	App_Contacts = new ContactsRouter();
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
	console.log("in app/js : " + Current_Route);
	activateInfiniScroll();
	set_profile_noty();
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
		_agile_execute_webrules();
	}
	// disposeEvents();
}
