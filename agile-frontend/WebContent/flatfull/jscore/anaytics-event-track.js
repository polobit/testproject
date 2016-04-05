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
	track_event : function(action) {

		if (!action)
			return;

		var label = CURRENT_DOMAIN_USER.domain;
		label = (!label) ? "localhost" : label;

		try {
			_gaq.push([ '_trackEvent', this.category, action, label ]);
		} catch (e) {
			try {
				ga('b.send', 'event', this.category, action, label);
			} catch (e) {
			}
		}

	}

};

$(function(){
    $("body").on("click", ".ga-track-event", function(){
         var action = $(this).attr("data-ga-text");
         if(!action)
         	 return;

       Agile_GA_Event_Tracker.track_event(action);  	

    });
});