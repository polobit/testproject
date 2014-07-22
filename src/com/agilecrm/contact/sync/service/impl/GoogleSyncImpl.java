/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.service.TwoWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.GoogleContactWrapperImpl;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.OAuthException;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.util.ServiceException;
import com.thirdparty.google.GoogleServiceUtil;

// TODO: Auto-generated Javadoc
/**
 * <code>GoogleSyncImpl</code> provide service to upload contacts from agile to
 * google and retrieve contacts from google.
 * 
 * @author jitendra
 */
public class GoogleSyncImpl extends TwoWaySyncService
{
    private static final Integer MAX_FETCH_LIMIT_FOR_GOOGLE = 200;

    /** The contact service. */
    private ContactsService contactService;
    private Long previous_synced_time = 0l;
    private Long last_synced_from_client = 0l;

    /**
     * fetch contacts from google.
     */
    public void syncContactFromClient()
    {
	int i = 0;

	// Refresh token before starting sync
	try
	{
	    GoogleServiceUtil.refreshGoogleContactPrefsandSave(prefs);
	    last_synced_from_client = prefs.last_synced_from_client;
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	while (i <= MAX_SYNC_LIMIT)
	{

	    // Retrieves contacts from google.
	    List<ContactEntry> entries = fetchContactsFromGoogle();
	    /*
	     * If entires are null then method should either return or break
	     * loop. If it is first set of results then saving contact prefs is
	     * not necessary as not atleast single set of 200 contacts are
	     * fetched
	     */
	    if (entries == null || entries.size() == 0)
	    {
		// If fetching returned null in first attempt to fetch 200
		// contacts then returns with out updating contact prefs last
		// updated time
		if (i == 0)
		    return;
		else
		    break;
	    }

	    if (last_synced_from_client > 0)
		previous_synced_time = last_synced_from_client;

	    // Saves contacts in agile matching accordingly based on entity
	    // names
	    saveContactsInAgile(entries);

	    // If fetched contacts size is less than 200, next request is not
	    // sent to fetch next set of results
	    if (entries.size() < MAX_FETCH_LIMIT_FOR_GOOGLE)
		break;

	    i += entries.size();
	}

	sendNotification(prefs.client.getNotificationEmailSubject());

	updateLastSyncedInPrefs();
    }

    private List<ContactEntry> fetchContactsFromGoogle()
    {
	String accessToken = prefs.token;

	Preconditions.checkEmptyString(accessToken, "Access token is empty");

	// Builds service with token
	try
	{
	    contactService = GoogleServiceUtil.getService(accessToken);
	}
	catch (OAuthException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	    return new ArrayList<ContactEntry>();
	}

	if (last_synced_from_client > 0 && prefs.last_synced_from_client == last_synced_from_client)
	{
	    last_synced_from_client += 3000;
	}
	Query myQuery = buildQuery();

	ContactFeed resultFeed = null;

	// Retrieves result feed
	try
	{
	    resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (ServiceException e)
	{
	    e.printStackTrace();
	}

	Preconditions.checkNotNull(resultFeed, "Result contact feed is null");

	return resultFeed.getEntries();
    }

    private Query buildQuery()
    {
	// myQuery.setUpdatedMin(dateTime);
	URL feedUrl = null;
	try
	{
	    feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full");
	}
	catch (MalformedURLException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	if (feedUrl == null)
	    return null;

	Query query = null;

	if (previous_synced_time == last_synced_from_client)
	{
	    last_synced_from_client += 4000;
	}

	DateTime dateTime = new DateTime(last_synced_from_client);

	// Build query with URL
	query = new Query(feedUrl);
	query.setMaxResults(MAX_FETCH_LIMIT_FOR_GOOGLE);

	query.setUpdatedMin(dateTime);
	query.setStringCustomParameter("access_token", prefs.token);

	/*
	 * If sync from group is not null then considering user chose a group to
	 * sync from instead of default "My contacts" group. If it is null then
	 * , by default, contacts are fetched from My contacts group.
	 */
	if (prefs.sync_from_group != null)
	{
	    prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group);

	    // Setting group query
	    query.setStringCustomParameter("group", prefs.sync_from_group);
	}

	/*
	 * To avoid fetching contacts that are already synced, query is set to
	 * fetch contacts that are created/updated after last syced time (which
	 * is created time of last contact fetched from google)
	 */

	/*
	 * Query set to fetch contacts ordered by last modified time, so saving
	 * last contacts time can be saved in last synced time
	 */
	query.setStringCustomParameter("orderby", "lastmodified");

	return query;

    }

    /**
     * Save contacts in agile.
     * 
     * @param entries
     *            the entries
     */
    private void saveContactsInAgile(List<ContactEntry> entries)
    {
	Contact contact;
	Long created_at = 0l;
	for (ContactEntry entry : entries)
	{
	    created_at = entry.getUpdated().getValue();
	    System.out.println(created_at);
	    contact = wrapContactToAgileSchemaAndSave(entry);
	}

	System.out.println("TIME UPDATED" + created_at + ", " + prefs.last_synced_from_client);
	last_synced_from_client = created_at > last_synced_from_client ? created_at : last_synced_from_client;
    }

    @Override
    protected void updateLastSyncedInPrefs()
    {
	prefs.last_synced_from_client = last_synced_from_client > 0 ? last_synced_from_client
		: prefs.last_synced_from_client;

	prefs.save();
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.TwoWaySyncService#fetchNewContactsFromAgile
     * ()
     */
    @Override
    public List<Contact> fetchNewContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.TwoWaySyncService#
     * fetchUpdatedContactsFromAgile()
     */
    @Override
    public List<Contact> fetchUpdatedContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.TwoWaySyncService#uploadContactsToClient
     * (java.util.List)
     */
    @Override
    public void uploadContactsToClient(List<Contact> contacts)
    {
	// TODO Auto-generated method stub

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return GoogleContactWrapperImpl.class;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */

}
