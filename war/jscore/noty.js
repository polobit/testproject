/**
 * Runs jquery noty plugin for notification pop-ups
 * @param type - notification type
 * @param message - html content for notification
 * @param position - position of pop-up within the webpage 
 **/
function showSuccessNoty(type, message, position){
	// shownoty(type, message, position);
}

function shownoty(type, message, position)
{
	// Download the lib
	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/top.js', LIB_PATH + 'lib/noty/themes/default.js',
       		function()
       		{
		
				// Close all
				$.noty.closeAll()
		
				$noty = noty({
		    			 text: message,
		    			 layout: position,
		    			 type: type,
		    			 closeWith: []
		    	});
				
				// Set the handler for click
				$('.noty_bar').die().live('click', function(){
					
					// Close all
					$.noty.closeAll();
					
					// Send to upgrade page
					Backbone.history.navigate('subscribe', {
						trigger : true
					});
				});
	   });
	 
}

$(function(){

	var accountprefs = Backbone.Model.extend({
		url:'core/api/account-prefs'
	});
	
	var accountPrefs = new accountprefs();
	accountPrefs.fetch({
		success: function(data)
		{
			var json = data.toJSON();
			
			// Allow only for free users
			try{
				
				// if json consists of plan, then return
				if(json.plan)
					return;	
				
			}
			catch(err){}	
	
	// Show the first one after 3 secs
	setTimeout(function(){
		shownoty("warning", get_random_message(), "bottom");
	}, 3000);
	
	// Set the periodically
	setInterval(function(){
		shownoty("warning", get_random_message(), "bottom");
	}, 30000);
	
		}
	});
	
});

function get_random_message()
{
	
var messages = [
"Thanks for trying Agile CRM. You can upgrade here."
];

var random = Math.floor((Math.random()* messages.length));
// console.log(random + messages[random]);

return messages[random];
}