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
 * Returns true if current-route begins with route
 * @param route - route to test
 * @returns {Boolean}
 */
function isRoute(route)
{
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

/**
 * Handler function fired when any key is pressed.
 * @param e
 */
function keyHandler(e)
{
	if(e.target && e.target.tagName=='INPUT' || isModalVisible())return;
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
