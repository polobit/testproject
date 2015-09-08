/**
 * Loads scripts from url only if there are not active ajax requests. If there
 * are any active ajax requests, current function with all arguments will be
 * called after 5 seconds timeout
 * 
 * @param url
 * @param callback
 */
function load_urls_on_ajax_stop(url, callback) { 
	if (!isActive()) {
		setTimeout(function() {
			load_urls_on_ajax_stop(url, callback);
		}, 5000);
		return;
	}

	head.js(url, function() {
		if (callback && typeof callback == "function")
			callback();
	});

}

function loadMiscScriptsWithTimeOut() {
	if (loadMiscScripts) {
		// Load User voice then
		setTimeout(loadMiscScripts, 10000);
		return;
	}

	try {
		setTimeout(loadMiscScriptsWithTimeOut, 3000);
	} catch (err) {
		console.log(err);
	}

}

function loadMiscScripts() {

    // Load Google Analytics code
    load_analytics_code();

    // Load agile web stats
    load_urls_on_ajax_stop('stats/min/agile-min.js?_=' + _AGILE_VERSION, function(){

    		initialize_agile_domain_sync();
    		_agile_execute_web_rules();
    });

	// load_urls_on_ajax_stop('lib/user-voice.js');

	// load_clickdesk_code();

	// Clicky code
	/*load_urls_on_ajax_stop('//static.getclicky.com/js', function() {

		try {
			clicky.init(100729733);
		} catch (e) {

		}
	});*/

	/**
	 * Sets timeout for registering notifications.Waits for 2secs after page
	 * loads and calls downloadAndRegisterForNotifications function
	 */
	downloadAndRegisterForNotifications();
	
} 

/**
 * Clickdesk Widget
 */
/*
 * function load_clickdesk_code() { return;
 * 
 * if (CLICKDESK_CODE_LOADED) return;
 * 
 * console.log("loading clickdesk..");
 * 
 * CLICKDESK_CODE_LOADED = true;
 * 
 * load_urls_on_ajax_stop(glcpath + 'livechat-new.js', function(){
 * CLICKDESK_CODE_LOADED = true; }) }
 */

$(function() {
	setTimeout(loadMiscScriptsWithTimeOut, 10000);
})

/**
 * Checks if there are any active ajax requests
 * 
 * @returns {Boolean}
 */
function isActive() {
	if ($.active > 0)
		return false;
	return true;
}

/** Google analytics code **/
function load_analytics_code(){

	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	  ga('create', 'UA-44894190-1', 'auto');
	  ga('send', 'pageview');
}