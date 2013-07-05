package com.agilecrm.core;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class JerseyApplication extends Application
{
    public Set<Class<?>> getClasses()
    {
	Set<Class<?>> s = new HashSet<Class<?>>();

	s.add(org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JacksonJsonProvider.class);
	s.add(org.codehaus.jackson.jaxrs.JsonParseExceptionMapper.class);
	s.add(org.codehaus.jackson.jaxrs.JsonMappingExceptionMapper.class);
	s.add(com.agilecrm.core.api.ObjectMapperProvider.class);
	s.add(com.agilecrm.core.api.JSAPI.class);
	s.add(com.agilecrm.core.api.campaigns.CampaignsAPI.class);
	s.add(com.agilecrm.core.api.subscription.SubscriptionApi.class);
	s.add(com.agilecrm.core.api.contacts.TagsAPI.class);
	s.add(com.agilecrm.core.api.prefs.NotificationsAPI.class);
	s.add(com.agilecrm.core.api.reports.ReportsApi.class);
	s.add(com.agilecrm.core.api.calendar.TasksAPI.class);
	s.add(com.agilecrm.core.api.prefs.UserPrefsAPI.class);
	s.add(com.agilecrm.core.api.contacts.customview.CustomViewAPI.class);
	s.add(com.agilecrm.core.api.contacts.ContactsAPI.class);
	s.add(com.agilecrm.core.api.deals.DealsAPI.class);
	s.add(com.agilecrm.core.api.contacts.ContactFilterAPI.class);
	s.add(com.agilecrm.core.api.contacts.NotesAPI.class);
	s.add(com.agilecrm.core.api.contacts.CustomFieldsAPI.class);
	s.add(com.agilecrm.core.api.prefs.AccountPrefsAPI.class);
	s.add(com.agilecrm.core.api.deals.MilestoneAPI.class);
	s.add(com.agilecrm.core.api.prefs.IMAPAPI.class);
	s.add(com.agilecrm.core.api.campaigns.CampaignStatsAPI.class);
	s.add(com.agilecrm.core.api.prefs.EmailTemplatesPrefsAPI.class);
	s.add(com.agilecrm.core.api.search.SearchAPI.class);
	s.add(com.agilecrm.core.api.campaigns.TriggersAPI.class);
	s.add(com.agilecrm.core.api.calendar.EventsAPI.class);
	s.add(com.agilecrm.core.api.campaigns.WorkflowsAPI.class);
	s.add(com.agilecrm.core.api.prefs.SocialPrefsAPI.class);
	s.add(com.agilecrm.core.api.UsersAPI.class);
	s.add(com.agilecrm.core.api.TypeAheadAPI.class);
	s.add(com.agilecrm.core.api.API.class);
	s.add(com.agilecrm.core.api.widgets.WidgetsAPI.class);
	s.add(com.agilecrm.core.api.bulkactions.backends.BulkActionsAPI.class);
	s.add(com.agilecrm.core.api.bulkactions.backends.BulkOperationsAPI.class);
	s.add(com.agilecrm.core.api.EmailsAPI.class);
	s.add(com.agilecrm.core.api.StatsAPI.class);

	return s;
    }
}
