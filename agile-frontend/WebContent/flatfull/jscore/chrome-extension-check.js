$("body").on('click', '.agent-popup-alert-dismiss', function(event)
{
	_agile_set_prefs('CHORME_EXTENSION_DOWNLOAD', false);
	$("#chrome_extension").remove();
});

/**
 * Chrome extension id
 */
/*
 * var Chrome_Extension_Id = "eofoblinhpjfhkjlfckmeidagfogclib";
 * 
 *//**
	 * Chrome extension resource path to detect extension
	 */
/*
 * var Chrome_Extension_Accesible_Resource = "/js/xhr_override.js";
 * 
 *//**
	 * Chrome extension webstore url
	 */
/*
 * var Chrome_Extension_Webstore_Url =
 * "https://chrome.google.com/webstore/detail/" + Chrome_Extension_Id;
 * 
 *//**
	 * Detect chrome extension on load
	 */

/*
 * $(function() { console.log("**chrome extension**");
 * 
 * var chrome = window.chrome || {}; console.log("chrome: " + chrome); // Check
 * chrome browser if (!chrome.app || !chrome.webstore) { console.log("***Its not
 * chrome***") return false; } else { // Check forincognito mode var fs =
 * window.RequestFileSystem || window.webkitRequestFileSystem; if (!fs) {
 * console.log("check failed?"); return false; } else { fs(window.TEMPORARY,
 * 100, function(fs) { console.log("it does not seem like you are in incognito
 * mode"); // After clicking on logout, erase cookie to show notification //
 * after // // re-login about chrome extension if not install.
 * $('a').click(function(event) { var herfLogout = $(this).attr("href"); if
 * (herfLogout == "/login") { // erasefield
 * 
 * _agile_delete_prefs("agile_chrome_extension"); } });
 * 
 * console.log("_agile_get_prefs: " + _agile_get_prefs("agile_chrome_extension") + " " +
 * _agile_get_prefs("prevent_extension_request")); // Read cookie to notify once per
 * session if (_agile_get_prefs("agile_chrome_extension") ||
 * _agile_get_prefs("prevent_extension_request")) { console.log("return now"); return; } //
 * Detect extension Detect_Chrome_Extension(Toggle_Extension_Request_Ui); },
 * function(err) { console.log("it seems like you are in incognito mode");
 * return false; }); } } });
 * 
 *//**
	 * Detect chrome extension by chechking element added in page from extension
	 */
/*
 * 
 * function Detect_Chrome_Extension(callback) { console.log("In
 * Detect_Chrome_Extension");
 * 
 * if (document.getElementById('agilecrm_extension')) { console.log("crome
 * extension installed."); if (callback) callback(true); } else {
 * console.log("crome extension is not installed."); // Create visit type cookie
 * to notify once per session // _agile_set_prefs("agile_chrome_extension",
 * "notified");
 * 
 * if (callback) callback(false);
 * 
 * Initialize_Chrome_Webstore_events(); } }
 * 
 *//**
	 * Toggle extension installer UI
	 * 
	 * @param hide
	 */
/*
 * 
 * function Toggle_Extension_Request_Ui(hide) { console.log("in
 * Toggle_Extension_Request_Ui:" + hide);
 * 
 * if ($("#chrome_extension").length >= 1) { $("#chrome_extension").remove(); //
 * toggle_navbar_position("slide_up"); } // true, extension installed if (hide)
 * return;
 * 
 * $("body").append(getTemplate("chrome-extension", {})); //
 * toggle_navbar_position("slide_down"); }
 * 
 * function toggle_navbar_position(positionToChange) {
 * console.log("intoggle_navbar_position: " + positionToChange);
 * 
 * if (positionToChange == "slide_up")
 * $(".navbar-fixed-top").removeClass("navbar-slide-down"); else if
 * (positionToChange == "slide_down")
 * $(".navbar-fixed-top").addClass("navbar-slide-down"); }
 */

/**
 * Initilaize webstore events to install the extension
 */
/*
 * function Initialize_Chrome_Webstore_events() {
 * 
 * console.log("in Initialize_Chrome_Webstore_events");
 * 
 *//**
	 * To dismiss chrome extension popup
	 *//*
	$('#chrome_extension #dismiss').live('click', function(e)
	{
		e.stopPropagation();

		// To prevent notify user permanantly
		_agile_set_prefs("prevent_extension_request", "true");

		Toggle_Extension_Request_Ui(true);
	});

	*//**
	 * To prevent notify user on each session
	 *//*
	$("#chrome_extension #prevent_extension_request").live('click', function()
	{

		// To prevent notify user permanantly
		_agile_set_prefs("prevent_extension_request", "true");

		Toggle_Extension_Request_Ui(true);
	});

	*//**
	 * Install extension
	 *//*
	$('#chrome_extension #chrome_install_button').live('click', function(e)
	{

		e.stopPropagation();

		var $this = $(this);

		Toggle_Extension_Loader("inline");

		try
		{
			chrome.webstore.install(Chrome_Extension_Webstore_Url, function(success)
			{

				console.log(success);
				Toggle_Extension_Request_Ui(true);

			}, function(error)
			{
				console.log(error);
				Toggle_Extension_Loader("none");
				//OpenInNewTab();
			});
		}
		catch (e)
		{
			console.log(e);
			Toggle_Extension_Loader("none");
			//OpenInNewTab();
		}
		return false;
	});
}

*//**
 * Toggle loader image
 * 
 * e.stopPropagation();
 * 
 * var $this = $(this);
 * 
 * Toggle_Extension_Loader("inline");
 * 
 * try { chrome.webstore.install(Chrome_Extension_Webstore_Url,
 * function(success) {
 * 
 * console.log(success); Toggle_Extension_Request_Ui(true); }, function(error) {
 * console.log(error); Toggle_Extension_Loader("none"); //OpenInNewTab(); }); }
 * catch (e) { console.log(e); Toggle_Extension_Loader("none");
 * //OpenInNewTab(); } return false; }); }
 * 
 *//**
	 * Toggle loader image
	 * 
	 * @param type
	 */
/*
 * function Toggle_Extension_Loader(type) {
 * 
 * console.log("In Toggle_Extension_Loader: " + type);
 * 
 * if (!type) return;
 * 
 * $("#chrome_extension").find("#loading").css('display', type); } // Open
 * extension installation in new window function OpenInNewTab() { var url =
 * "https://chrome.google.com/webstore/detail/agile-crm/eofoblinhpjfhkjlfckmeidagfogclib?utm_source=chrome-ntp-icon";
 * var win = window.open(url, '_blank'); win.focus(); }
 */