/** The function is commented inorder to implement later. It shows Upgrade message to free users**/

$(function(){
	setTimeout(function(){
		showUpgradeNoty();
	}, 3000);
});

function showUpgradeNoty()
{

	if(!_billing_restriction.currentLimits.freePlan)
		return;
	
		// Show the first one after 3 secs
	showNotyPopUp("warning", get_random_message(), "bottom", "none", function(){
			Backbone.history.navigate('subscribe', {
				 trigger : true
				 });
		});
}

var CONTACTS_HARD_RELOAD = false;

/**
 * Shows noty popup for bulk actions like bulk contacts deletion, 
 * adding bulk contacts to campaign etc.
 * 
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.            
 *                     
 */
function bulkActivitiesNoty(type, message, position) {
	CONTACTS_HARD_RELOAD = true;
	
	// if no position, default bottomRight
	if(!position)
	{
		showNotyPopUp(type, message.message, "bottomRight")
		return;
	}
		
	// shows noty in given position
	showNotyPopUp(type, message.message, position)
}

/**
 * Loads files required for noty and calls notySetup to show 
 * noty with the given options.
 *
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.
 */
function showNotyPopUp(type, message, position, timeout, closeCallback) {
	
	// for top position
	if(position == "top")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
		+ 'lib/noty/layouts/top.js', LIB_PATH
		+ 'lib/noty/themes/default.js', function(){
			notySetup(type, message, position, timeout, closeCallback)
		});
	
	// for bottomRight position
	if(position == "bottomRight")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js',  LIB_PATH
				+ 'lib/noty/layouts/bottom.js', LIB_PATH
				+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){
					notySetup(type, message, position, timeout, closeCallback)
				});
	
	// for bottomLeft position
	if(position == "bottomLeft")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
				+ 'lib/noty/layouts/bottomLeft.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){
						notySetup(type, message, position, timeout, closeCallback)
				});	
	
	// for bottomLeft position
	if(position == "bottom")
		head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){
						notySetup(type, message, position, timeout, closeCallback)
				});	
}

/**
 * Sets noty popup to show message in the given position and type.
 * 
 * @param type - 
 *             type of noty. For e.g. noty of information type is blue.
 * @param message -
 *             message to be shown on noty.
 * @param position -
 *             position of noty like bottomRight, top etc.*/
function notySetup(type, message, position, noty_timeout, onCloseCallback) {
		
	    // close all other noty before showing current
	    $.noty.closeAll()

		var n = noty({
			text : message,
			layout : position,
			type : type,
			animation : {
				open : {
					height : 'toggle'
				},
				close : {
					height : 'toggle'
				},
				easing : 'swing',
				speed : 500
				// opening & closing animation speed
			},
			timeout : noty_timeout == undefined ? noty_timeout : (noty_timeout == "none" ? undefined : 20000), // delay for closing event. Set false for sticky
							// notifications
					
			closeCallback : (onCloseCallback && typeof onCloseCallback == 'function') ? onCloseCallback : undefined,
			
			callback : {
					// If on close callback is defined, callback is called after noty is closed. Small hack; because noty close callback in lib is badly implemented 
					// and one callback gets called on other noty action
					onClose : function(){
						console.log(this);
						if(this.options.closeCallback && typeof this.options.closeCallback == 'function')
							{
								this.options.closeCallback ();
							}
						}
					}
		});
	}

function get_random_message() {

	var messages = ["Thanks for trying Agile CRM. You can upgrade here."];

	var random = Math.floor((Math.random() * messages.length));
	// console.log(random + messages[random]);

	return messages[random];
}