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


function track_with_save_success_model(ele){
   try{
   	
   	  var href = location.href;
   	  var action = "";
	      
	  if(href.indexOf("newsletter") != -1)
	  	   action = "Save Campaign in Newsletter";
	  else if(href.indexOf("auto_responder") != -1)
	  	   action = "Save Campaign in Autoresponder";
	  else if(href.indexOf("webrule-add") != -1)
	  	   action = "Web Rule Added";
	  else if(href.indexOf("landing-page-add") != -1)
	  	   action = "Landing Page Created";

	  if(action)
		  Agile_GA_Event_Tracker.track_event(action); 

   }catch(e){}
   
}

function agile_update_ga_track_page(hash_content){
	if(!hash_content)
		  return;
	try{
		if(hash_content.split("/").length > 1)
		   hash_content = hash_content.split("/")[0];

		ga('b.set', 'page', '/#' + hash_content);
		ga('b.send', 'pageview');
	}catch(e){}
}