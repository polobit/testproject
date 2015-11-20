package com.agilecrm.core;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class JerseyApplication extends Application
{
    @Override
    public Set<Class<?>> getClasses()
    {
	Set<Class<?>> s = new HashSet<Class<?>>();

	s.add(org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JacksonJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JsonParseExceptionMapper.class);
	s.add(org.codehaus.jackson.jaxrs.JsonMappingExceptionMapper.class);
	s.add(com.agilecrm.core.api.ObjectMapperProvider.class);
	s.add(com.agilecrm.core.api.JSAPI.class);
	s.add(com.agilecrm.core.api.PHPAPI.class);
	s.add(com.agilecrm.core.api.campaigns.CampaignsAPI.class);
	s.add(com.agilecrm.core.api.subscription.SubscriptionApi.class);
	s.add(com.agilecrm.core.api.contacts.TagsAPI.class);
	s.add(com.agilecrm.core.api.prefs.NotificationsAPI.class);
	s.add(com.agilecrm.core.api.reports.ReportsAPI.class);
	s.add(com.agilecrm.core.api.calendar.TasksAPI.class);
	s.add(com.agilecrm.core.api.prefs.UserPrefsAPI.class);
	s.add(com.agilecrm.core.api.prefs.ContactViewPrefsAPI.class);
	s.add(com.agilecrm.core.api.contacts.customview.CustomViewAPI.class);
	s.add(com.agilecrm.core.api.contacts.ContactsAPI.class);
	s.add(com.agilecrm.core.api.deals.DealsAPI.class);
	s.add(com.agilecrm.core.api.contacts.ContactFilterAPI.class);
	s.add(com.agilecrm.core.api.contacts.NotesAPI.class);
	s.add(com.agilecrm.core.api.contacts.CustomFieldsAPI.class);
	s.add(com.agilecrm.core.api.prefs.AccountPrefsAPI.class);
	s.add(com.agilecrm.core.api.deals.MilestoneAPI.class);
	s.add(com.agilecrm.core.api.prefs.IMAPAPI.class);
	s.add(com.agilecrm.core.api.prefs.OfficePrefsAPI.class);
	s.add(com.agilecrm.core.api.campaigns.CampaignReportsAPI.class);
	s.add(com.agilecrm.core.api.prefs.EmailTemplatesPrefsAPI.class);
	s.add(com.agilecrm.core.api.search.SearchAPI.class);
	s.add(com.agilecrm.core.api.campaigns.TriggersAPI.class);
	s.add(com.agilecrm.core.api.calendar.EventsAPI.class);
	s.add(com.agilecrm.core.api.campaigns.WorkflowsAPI.class);
	s.add(com.agilecrm.core.api.campaigns.WorkflowTemplatesAPI.class);
	s.add(com.agilecrm.core.api.prefs.SocialPrefsAPI.class);
	s.add(com.agilecrm.core.api.UsersAPI.class);
	s.add(com.agilecrm.core.api.API.class);
	s.add(com.agilecrm.core.api.widgets.WidgetsAPI.class);
	s.add(com.agilecrm.core.api.bulkactions.backends.BulkActionsAPI.class);
	s.add(com.agilecrm.core.api.bulkactions.backends.BulkOperationsAPI.class);
	s.add(com.agilecrm.core.api.EmailsAPI.class);
	s.add(com.agilecrm.core.api.analytics.AnalyticsAPI.class);
	s.add(com.agilecrm.core.api.cases.CasesAPI.class);
	s.add(com.agilecrm.core.api.prefs.MenuSettingAPI.class);
	s.add(com.agilecrm.core.api.contacts.ContactPrefsAPI.class);
	s.add(com.agilecrm.core.api.contacts.UploadContactsAPI.class);
	s.add(com.agilecrm.core.api.contacts.VCardAPI.class);
	s.add(com.agilecrm.core.api.widgets.ClickDeskWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.FreshBooksWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.LinkedInTwitterWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.RapleafWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.StripeWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.TwilioWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.ZendeskWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.HelpScoutWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.XeroWidgetsAPI.class);
	s.add(com.agilecrm.core.api.widgets.QuickBooksWidgetAPI.class);
	s.add(com.agilecrm.core.api.widgets.FacebookWidgetsApi.class);
	s.add(com.agilecrm.core.api.widgets.ChargifyWidgetsAPI.class);
	s.add(com.agilecrm.core.api.account.AccountDeletionAPI.class);
	s.add(com.agilecrm.core.api.account.NamespaceStatsAPI.class);
	s.add(com.agilecrm.core.api.document.DocumentsAPI.class);
	s.add(com.socialsuite.StreamAPI.class);
	s.add(com.socialsuite.cron.ScheduledUpdateAPI.class);
	s.add(com.thirdparty.salesforce.SalesforceImportAPI.class);
	s.add(com.thirdparty.zoho.ZohoImportAPI.class);
	s.add(com.thirdparty.stripe.StripeDataService.class);
	s.add(com.thirdparty.freshbooks.FreshbooksDataAPI.class);
	s.add(com.thirdparty.quickbook.QuickBookController.class);
	s.add(com.thirdparty.xero.XeroController.class);
	s.add(com.thirdparty.shopify.ShopifyImportAPI.class);
	s.add(com.agilecrm.gmap.GmapQueryAPI.class);
	s.add(com.agilecrm.core.api.webrule.WebRuleAPI.class);
	s.add(com.agilecrm.core.api.TemplatesAPI.class);
	s.add(com.agilecrm.core.api.calendar.GoogleCalendarPrefsAPI.class);
	s.add(com.agilecrm.core.api.calendar.WebCalendarEventsAPI.class);
	s.add(com.agilecrm.core.api.AdminPanelAPI.class);
	s.add(com.agilecrm.core.api.EmailGatewayAPI.class);
	s.add(com.agilecrm.core.api.widgets.ShopifyWidgetAPI.class);
	s.add(com.agilecrm.core.api.subscription.addon.AddonSubscriptionAPI.class);
	s.add(com.agilecrm.core.api.ActivityApi.class);
	s.add(com.agilecrm.core.api.SMSGatewayAPI.class);
	s.add(com.agilecrm.core.api.shopify.ShopifyAppAPI.class);
	s.add(com.agilecrm.core.api.portlets.PortletsAPI.class);
	s.add(com.agilecrm.core.api.reports.ActivityReportsAPI.class);
	s.add(com.agilecrm.core.api.OnlineCalendarPrefsApi.class);
	s.add(com.agilecrm.core.api.voicemail.VoiceMailAPI.class);
	s.add(com.agilecrm.core.api.deals.DealsBulkActionsAPI.class);
	s.add(com.agilecrm.core.api.forms.FormsAPI.class);
	s.add(com.agilecrm.core.api.WebhooksAPI.class);
	s.add(com.agilecrm.core.api.RestAPI.class);
	s.add(com.agilecrm.core.api.OfficeCalendar365API.class);
	s.add(com.agilecrm.core.api.calendar.CategoriesAPI.class);
	// s.add(com.agilecrm.core.api.webpage.WebPageAPI.class);
	
	// Ticket Rest classes
	s.add(com.agilecrm.ticket.rest.TicketsRest.class);
	s.add(com.agilecrm.ticket.rest.TicketGroupRest.class);
	s.add(com.agilecrm.ticket.rest.TicketsRest.class);
	s.add(com.agilecrm.ticket.rest.TicketNotesRest.class);
	s.add(com.agilecrm.ticket.rest.TicketGroupRest.class);
	s.add(com.agilecrm.ticket.rest.TicketCannedMessagesRest.class);
	s.add(com.agilecrm.ticket.rest.TicketFiltersRest.class);
	s.add(com.agilecrm.ticket.rest.TicketBulkActionsRest.class);
	s.add(com.agilecrm.ticket.rest.TicketBulkActionsBackendsRest.class);
	s.add(com.agilecrm.ticket.rest.TicketLabelsRest.class);

		return s;
	}
}