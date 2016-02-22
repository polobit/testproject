/** The function is commented inorder to implement later. It shows Upgrade message to free users**/

var Nagger_Noty;
function showUpgradeNoty()
{

	// Returns if account if paid account
	if(!_billing_restriction.currentLimits.freePlan)
		return;
	
	// If route is subscribe, it will remove existing noty and returns. If there is not existy nagger noty, it will just return
	if(Current_Route == "subscribe" || Current_Route == "subscribe-plan" || Current_Route == "purchase-plan")
	{
		if(Nagger_Noty)
			$.noty.close(Nagger_Noty);
		return;
	}
	
	// If Noty is present already, then noty is initiated again
	if(Nagger_Noty && $("#" +Nagger_Noty).length > 0)
		return;
	
	
		// Show the first one after 3 secs
	showNotyPopUp("warning", get_random_message(), "topCenter", "none", function(){
			Nagger_Noty = null;
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
	
	message = message.message;
	message = Handlebars.compile("{{message}}")({message : message});

	// if no position, default bottomRight
	if(!position)
	{
		showNotyPopUp(type, message, "bottomRight")
		return;
	}
		
	// shows noty in given position
	showNotyPopUp(type, message, position)
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
function showNotyPopUp(type, message, position, timeout, clickCallback) {
	if(type != 'null' && message !=  'null'){
		// for top position
		if(position == "top")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
			+ 'lib/noty/layouts/top.js', LIB_PATH
			+ 'lib/noty/themes/default.js', function(){
				notySetup(type, message, position, timeout, clickCallback)
			});
		
		//for topCenter position
		if(position == "topCenter")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
					+ 'lib/noty/layouts/topCenter.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
				          notySetup(type,message,position,timeout,clickCallback)
			});
		
		// for bottomRight position
		if(position == "bottomRight")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js',  LIB_PATH
					+ 'lib/noty/layouts/bottom.js', LIB_PATH
					+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
						notySetup(type, message, position, timeout, clickCallback)
					});
		
		// for bottomLeft position
		if(position == "bottomLeft")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
					+ 'lib/noty/layouts/bottomLeft.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
							notySetup(type, message, position, timeout, clickCallback)
					});	
		
		//for bottomCenter position
		if(position == "bottomCenter")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
					+ 'lib/noty/layouts/bottomCenter.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
				          notySetup(type,message,position,timeout,clickCallback)
			});

		//for topCenter position
		if(position == "topCenter")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH
					+ 'lib/noty/layouts/topCenter.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
				          notySetup(type,message,position,timeout,clickCallback)
			});
		
		// for bottomLeft position
		if(position == "bottom")
			head.js(LIB_PATH + 'lib/noty/jquery.noty.js', LIB_PATH + 'lib/noty/layouts/bottom.js', LIB_PATH
					+ 'lib/noty/themes/default.js', function(){
							notySetup(type, message, position, timeout, clickCallback)
					});	
	}
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
function notySetup(type, message, position, noty_timeout, clickCallback) {
		
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
			
			timeout : noty_timeout != undefined ? (noty_timeout == "none" ? undefined : noty_timeout) : 20000, // delay for closing event. Set false for sticky
							// notifications
					
		});
	    
	    if(clickCallback && typeof clickCallback == "function" && n.options.id)
	    {
	    	Nagger_Noty = n.options.id;
	    	$("#" + n.options.id).on('click', function(e){
	    		clickCallback();
	    	})
	    }
	}

function get_random_message() {
	
	
/*	var trail_expiry_message;
	if(getPendingdaysIntrail() == 0)
		trail_expiry_message = "Your trail expired";
	else
		trail_expiry_message = "Your trial will expire in "+getPendingdaysIntrail()+" days";*/
	
	
	var messages = ["You are using FREE limited version of Agile CRM. <span> Upgrade Now </span> "];

	var random = Math.floor((Math.random() * messages.length));
	// console.log(random + messages[random]);

	return messages[random];
}

var TRAIL_PENDING_DAYS;
var _TRAIL_DAYS = 14; 

function getPendingdaysIntrail()
{
	if(TRAIL_PENDING_DAYS)
		return TRAIL_PENDING_DAYS;
	
	if(!_billing_restriction || !_billing_restriction.createdtime)
		return (TRAIL_PENDING_DAYS = 14)
		
	var time = (new Date().getTime()/1000) - _billing_restriction.createdtime;
	
	var days = time / (24 * 60 *60)
	
	var TRAIL_PENDING_DAYS = _TRAIL_DAYS - days;
	
	if(TRAIL_PENDING_DAYS < 0)
	{
		TRAIL_PENDING_DAYS = 0;
	}
	
	TRAIL_PENDING_DAYS = Math.round(TRAIL_PENDING_DAYS);
	return TRAIL_PENDING_DAYS;
}