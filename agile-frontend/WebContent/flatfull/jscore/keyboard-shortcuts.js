/** 
 * Check if route is the current route of the app.
 * @param route
 * @returns {Boolean}
 */
function isRoute(route)
{
	if(!Current_Route)return false;
	return (Current_Route.indexOf(route)==0);
}

/**
 * Checks if any modal is visible.
 * @returns
 */
function isModalVisible()
{
	return $(".modal").is(":visible");
}

$(function(){
	
	/* To enable or disable the keyboard shortcuts	 */
	if(CURRENT_USER_PREFS.keyboard_shotcuts){
		enableKeyboardShotcuts();
		$(".show_shortcuts .shortcuts").addClass("enable");
	}
	/* For toggling keyboard shortcuts modal popup */
    $("body").on('click', '#keyboard-shortcuts', function(e){
		e.preventDefault();

		getTemplate("shortcut-keys", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$(template_ui).modal('show');
		}, null);
	});
});

/**
 * Enables keyboard shortcuts based on user prefs.
 */
function enableKeyboardShotcuts()
{
	head.js(LIB_PATH+'lib/mousetrap.min.js',function(){
	
		
		// New contact
		Mousetrap.bind('shift+n',function(){
			if(!isModalVisible())
				addContactBasedOnCustomfields(); 
		});

		// New company
		Mousetrap.bind('shift+c',function(){
			if(!isModalVisible())
				$('#companyModal').modal('show'); 
		});

		// New event
		Mousetrap.bind('shift+v',function(){
			if(!isModalVisible()){
				$('#activityModal').html(getTemplate("new-event-modal")).modal('show');
				highlight_event();
			}
		});
		
		// New Task
		Mousetrap.bind('shift+t',function(){
			if(!isModalVisible())
				showTaskModal("");
		});

		// New deal
		Mousetrap.bind('shift+d',function(){
			if(!isModalVisible())
				show_deal(); 
		});

		// New note
		Mousetrap.bind('shift+o',function(){
			if(!isModalVisible()){
				$('#noteModal').modal('show'); 
				var el = $("#noteForm");
				agile_type_ahead("note_related_to", el, contacts_typeahead);
			}
		});

		// New email
		/*Mousetrap.bind('shift+l',function(){
			if(!isRoute("send-email") && !isModalVisible())
				App_Contacts.navigate("send-email",{trigger:true});
		});*/




		// Preferences
		Mousetrap.bind('shift+p',function(){
			if(!isRoute("user-prefs") && !isModalVisible())
				App_Settings.navigate("user-prefs",{trigger:true});
		});

		// Admin settings
		Mousetrap.bind('shift+a',function(){
			if(!isRoute("account-prefs") && !isModalVisible() && CURRENT_DOMAIN_USER.is_admin)
				App_Settings.navigate("account-prefs",{trigger:true});
		});

		// Theme and layout
		Mousetrap.bind('shift+l',function(){
			if(!isRoute("themeandlayout") && !isModalVisible())
				App_Settings.navigate("themeandlayout",{trigger:true});
		});

		// upgrade
		Mousetrap.bind('shift+u',function(){
			if(!isRoute("subscribe") && !isModalVisible())
				App_Settings.navigate("subscribe",{trigger:true});
		});

		// Product updates
		Mousetrap.bind('shift+r',function(){
			if(!isModalVisible())
				window.open("https://www.agilecrm.com/product-updates", true);
		});

		// Help
		Mousetrap.bind('shift+h',function(){
			if(!isRoute("help") && !isModalVisible())
				App_Settings.navigate("help",{trigger:true});
		});

		// Logout
		Mousetrap.bind('shift+g',function(){
			if(!isModalVisible())
				window.location.href = "/login?sur=true";
		});



		
		// Edit the current contact
		Mousetrap.bind('shift+e',function(){
			if(isRoute("contact/") && !isModalVisible())
				App_Contacts.navigate("contact-edit",{trigger:true});
		});
		
		// Send mail to current contact
		Mousetrap.bind('shift+m',function(){
			if(isModalVisible())
				return;
			if(isRoute("contact/"))
				App_Contacts.navigate("send-email/"+ getCurrentContactProperty("email"),{trigger:true});
			else
				App_Contacts.navigate("send-email",{trigger:true});
		});
		
		// Focus on search box in main menu
		Mousetrap.bind('/',function(e){
			if(isModalVisible())return;
			document.getElementById('searchText').focus();
			
			if(e.preventDefault)
		        e.preventDefault();
		    else
		        e.returnValue = false; // internet explorer
		});
		
		// New of current entity type
		Mousetrap.bind('n',function(){
			
			if(isModalVisible())return;
			
			if(isRoute('contact'))
				addContactBasedOnCustomfields();
			else if(isRoute('cases'))
				showCases();
			else if(isRoute('deals'))
				show_deal();
			else if(isRoute('workflow'))
				App_Workflows.navigate("workflow-add",{trigger:true});
			else if(isRoute('report'))
				App_Reports.navigate("report-add",{trigger:true});
			else if(isRoute('tasks'))
				showTaskModal("");
			else if(isRoute('calendar'))
				{
				  $('#activityModal').html(getTemplate("new-event-modal")).modal('show');
				  highlight_event();
				}
		});
	});
}

/** OLD CODE Below - Without any library, just native js.
 * 	Performance not tested, so don't know if this or the one with Mousetrap Library is faster.
 *

// keyCode value of keys used in shortcut.
var CodeASCII={
E:"E".charCodeAt(0),
M:"M".charCodeAt(0),
N:"N".charCodeAt(0),
P:"P".charCodeAt(0),
T:"T".charCodeAt(0),
Slash:191
};



/**
 * Check if tg is any input tag
 * @param tg - tag name to test.
 * @returns
 *
function isInputTag(tg)
{
	var tagList=[ "INPUT", "TEXTAREA" ];
	
	for(var i=0;i<tagList.length;++i)
		if(tg==tagList[i])return true;
	
	return false;
}

/**
 * Handler function fired when any key is pressed.
 * @param e
 *
function keyHandler(e)
{
	if((e.target && isInputTag(e.target.tagName)) || isModalVisible())return;
	// focussed on input, so return default, as user is typing text.
	
	if(e.shiftKey)
	{
		if(e.keyCode==CodeASCII.P)
			App_Settings.navigate("user-prefs",{trigger:true}); 	// Shift+P : preferences
		else if(e.keyCode==CodeASCII.N)
			$('#personModal').modal('show');                    	// Shift+N : new contact person
		else if(e.keyCode==CodeASCII.T)
			$('#activityModal').modal('show');						// Shift+T : new task
		else if(isRoute("contact/"))
		{
			if(e.keyCode==CodeASCII.E)
				App_Contacts.navigate("contact-edit",{trigger:true});	// Shift+E : edit current contact
			else if(e.keyCode==CodeASCII.M)	
				App_Contacts.navigate("send-email",{trigger:true});		// Shift+M : send mail to current contact
		}
		else return;												// Let default happen.
		
		e.preventDefault();
	}
	else
	{
		if(e.keyCode==CodeASCII.Slash)
		{
			document.getElementById('searchText').focus(); 			// / : search
			e.preventDefault();
		}
		else if(e.keyCode==CodeASCII.N)								// N : new current thing
		{
			if(isRoute('contact'))
				$('#personModal').modal('show');
			else if(isRoute('cases'))
				showCases();
			else if(isRoute('deals'))
				show_deal();
			else if(isRoute('workflow'))
				App_Workflows.navigate("workflow-add",{trigger:true});
			else if(isRoute('report'))
				App_Reports.navigate("report-add",{trigger:true});
			else if(isRoute('task') || isRoute('calendar'))
				$('#activityModal').modal('show');	
			e.preventDefault();
		}
	}	
}

window.onkeydown = keyHandler;
*/
