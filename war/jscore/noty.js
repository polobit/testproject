$(function(){

	var accountprefs = Backbone.Model.extend({
		url:'core/api/account-prefs'
	});
	
	var accountPrefs = new accountprefs();
	accountPrefs.fetch({
		success: function(data)
		{
			var json = data.toJSON();
			
			console.log(json);
			
			// Allow only for free users
			try{
				
				// if json consists of plan, then return
				if(json.plan)
					return;	
				
			}
			catch(err){}	
	
	// Show the first one after 3 secs
	setTimeout(function(){
		showNoty("warning", get_random_message(), "bottom");
	}, 3000);
	
//	// Set the periodically
//	setInterval(function(){
//		showNoty("warning", get_random_message(), "bottom");
//	}, 30000);
	
		}
	});
	
});


//function showNotyP(type, message, position)
//{
//	// Download the lib
//	head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH + 'lib/noty/layouts/top.js', LIB_PATH + 'lib/noty/themes/default.js',
//       		function()
//       		{
//		
//				// Close all
//				$.noty.closeAll()
//		
//				var n = noty({
//		    			 text: message,
//		    			 layout: position,
//		    			 type: type
//		    	});
//				
//			        // Set the handler for click
//				     $('.noty_bar').die().live('click', function(){
//					
//					// Close all
//					$.noty.closeAll();
//					
//					if(n.options.type == "warning"){
//					
//						// Send to upgrade page
//					Backbone.history.navigate('subscribe', {
//						trigger : true
//					});
//					
//					}
//				});
//	   });
//	 
//}

function get_random_message()
{
	
var messages = [
"Thanks for trying Agile CRM.",
"You can upgrade here."
];

var random = Math.floor((Math.random()* messages.length));
// console.log(random + messages[random]);

return messages[random];
}