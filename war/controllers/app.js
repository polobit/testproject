// All Routers are global
var App_Contacts, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings;

$(function () 
{
	App_Contacts = new ContactsRouter();
	App_Workflows = new WorkflowsRouter();
	App_Deals = new DealsRouter();
	App_Admin_Settings = new AdminSettingsRouter();
	App_Settings = new SettingsRouter();
	App_Calendar = new CalendarRouter();
	App_Subscription = new SubscribeRouter();
    
	// For infinite page scrolling
	Backbone.history.bind("all", currentRoute)
    
    Backbone.history.start();
});


var Current_Route;
function currentRoute(route)
{
	Current_Route =  window.location.hash.split("#")[1];
	console.log("in app/js : " + Current_Route);
	activateInfiniScroll();
}