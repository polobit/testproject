/**
 * Infini scroll utility to control the scroll on all routes,
 * Called from base-collection when page requires infiniscroll function and from app.js when route is initialized
 */

/**
 * Map to store infini scroll object with route name as a key
 */
var INFINI_SCROLL_JSON = {};

/**
 * Adds infini_scroll object to JSON Object with current route as key. Destroys
 * infini scroll if already exists in map and sets new infini scroll object to
 * current route
 * 
 * @param inifni_scroll
 *            infiniscroll object
 */
function addInfiniScrollToRoute(infini_scroll) {
	var current_route = window.location.hash.split("#")[1];

	// Destroys infini scroll
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].destroy();

	// Sets new infini scroll object w.r.t current route
	INFINI_SCROLL_JSON[current_route] = infini_scroll;
}

// Activates infiniScroll for routes
/**
 * Activates infiniScroll for current route(if required) and disables scroll in
 * other routes, to solve unnecessary requests on scroll. This method is called
 * when routes are initialized
 */
function activateInfiniScroll() {

	// Gets the current route from the url of the browser, splits at "#" (
	// current route is after "#" ).
	var current_route = window.location.hash.split("#")[1];

	// Disables all infini scrolls in the map
	$.each(INFINI_SCROLL_JSON, function(key, value) {
		value.disableFetch();
	});

	// Enables fetch if current route exists in INFINI_SCROLL_JSON map
	if (INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].enableFetch();
}