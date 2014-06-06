/**
 * Loads scripts from url only if there are not active ajax requests. If there
 * are any active ajax requests, current function with all arguments will be
 * called after 5 seconds timeout
 * 
 * @param url
 * @param callback
 */
function load_urls_on_ajax_stop(url, callback)
{
	if (!isActive())
	{
		setTimeout(function()
		{
			load_urls_on_ajax_stop(url, callback);
		}, 5000);
		return;
	}

	head.js(url, function()
	{
		if (callback && typeof callback == "function")
			callback();
	});

}

function loadMiscScripts()
{

	load_urls_on_ajax_stop('lib/user-voice.js');

	load_urls_on_ajax_stop('//static.getclicky.com/js');

	// Clicky code
	load_urls_on_ajax_stop('//static.getclicky.com/js', function()
	{

		try
		{
			clicky.init(100729733);
		}
		catch (e)
		{
		}
		;
	});

	/**
	 * Sets timeout for registering notifications.Waits for 2secs after page
	 * loads and calls downloadAndRegisterForNotifications function
	 */
	downloadAndRegisterForNotifications();
}



/**
 * Checks if there are any active ajax requests
 * 
 * @returns {Boolean}
 */
function isActive()
{
	if ($.active > 0)
		return false;
	return true;
}
