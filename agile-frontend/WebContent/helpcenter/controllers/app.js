/**
 * Initiates all the routers and assigns to global variable to access the routes
 * from any where in the code.
 */

// All Routers are global
var App_Helpcenter;

$(function()
{
	App_Helpcenter = new HelpcenterRouter();

	// Binds an event to activate infinite page scrolling
	Backbone.history.bind("all", currentRoute)

	// Backbone.history.bind("change", routeChange)

	/*
	 * Start Backbone history a necessary step to begin monitoring hashchange
	 * events, and dispatching routes
	 */
	Backbone.history.start();
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
	console.timeEnd("startbackbone");
	
	Current_Route = window.location.hash.split("#")[1];
}
