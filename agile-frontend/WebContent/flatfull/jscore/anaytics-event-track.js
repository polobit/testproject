/**
 * Track Events to Google Analytics
 */
var Agile_GA_Event_Tracker = {

	/**
	 * Set category
	 */
	category : "Agile Dashboard",

	/**
	 * Send track event to google analytics
	 */
	track_event : function(action, label) {

		if (!action)
			return;

		label = (!label) ? "-" : label;

		try {
			_gaq.push([ '_trackEvent', this.category, action, label ]);
		} catch (e) {
			try {
				ga('send', 'event', this.category, action, label);
			} catch (e) {
			}
		}

	}

};