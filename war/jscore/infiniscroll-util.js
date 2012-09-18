var INFINI_SCROLL_JSON = {};

// Adds infini_scroll object to JSON Object with current route as key 
function addInfiniScrollToRoute(infini_scroll)
{
	var current_route = window.location.hash.split("#")[1];
	
	// Destroy if already present
	if(INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].destroy();
		
	INFINI_SCROLL_JSON[current_route] = infini_scroll;
}

// Activates infiniScroll for routes(if required)
function activateInfiniScroll()
{
	var current_route = window.location.hash.split("#")[1];
	
	$.each(INFINI_SCROLL_JSON, function(key, value){
		value.disableFetch();
	});
	
	// Destroy if already present
	if(INFINI_SCROLL_JSON[current_route])
		INFINI_SCROLL_JSON[current_route].enableFetch();
}