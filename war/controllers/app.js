// All Routers are global
var App_Contacts, App_Workflows, App_Deals, App_Admin_Settings, App_Calendar, App_Settings;

$(function () 
{
	App_Contacts = new ContactsRouter();
	App_Workflows = new WorkflowsRouter();
	App_Deals = new DealsRouter();
	App_Admin_Settings = new AdminSettingsRouter();
	App_Calendar = new SettingsRouter();
	App_Settings = new CalendarRouter();
    
	// For infinite page scrolling
	App_Contacts.bind("all", currentRoute);
	App_Workflows.bind("all", currentRoute);
	App_Deals.bind("all", currentRoute);
	App_Admin_Settings.bind("all", currentRoute);
	App_Calendar.bind("all", currentRoute);
	App_Settings.bind("all", currentRoute);
    
    Backbone.history.start();
});


var Current_Route;
function currentRoute(route)
{
	Current_Route = (route.split(":")[1]);
}