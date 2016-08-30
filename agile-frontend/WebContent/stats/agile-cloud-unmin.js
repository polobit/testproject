/**
 * Loads static version file from cloudfront URL
 * 
 * @returns
 */
function _agile_load_cloud_file() {

	try {

		// Check body presence. If not, wait until it present
		if (!document.body) {

			clearInterval(_agile_body_load_interval_timer);

			_agile_body_load_interval_timer = setInterval(function() {
				_agile_load_cloud_file();
			}, 100);

			return;
		}

		clearInterval(_agile_body_load_interval_timer);

		var nav = window.navigator && window.navigator.appVersion.split("MSIE");
		if (parseFloat(nav[1]))
			nav = parseFloat(nav[1]);

		// Choose live/test environment
		var script_file_url = "https://d1gwclp1pmzk26.cloudfront.net/agile/stats/min/app/v1/agile-min.js";

		// Create script element
		var _agile_script = document.createElement('script');
		_agile_script.type = 'text/javascript';
		_agile_script.async = true;
		_agile_script.src = script_file_url
				+ ((nav && nav == 10) ? "?t=" + new Date().getTime() : "");

		// Append to head of DOM
		document.getElementsByTagName('body')[0].appendChild(_agile_script);
	} catch (err) {
	}
}

var _agile_body_load_interval_timer;
// Load Cloud Server JS
(function() {
	_agile_load_cloud_file();
})();
