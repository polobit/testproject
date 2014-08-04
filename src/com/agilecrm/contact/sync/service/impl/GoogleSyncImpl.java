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
import com.google.gdata.data.batch.BatchOperationType;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.model.batch.BatchUtils;
import com.google.gdata.util.ServiceException;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.contacts.ContactSyncUtil;
import com.thirdparty.google.contacts.ContactsSynctoGoogle;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.google.groups.util.ContactGroupUtil;

/**
 * <code>GoogleSyncImpl</code> extends TwoWaySyncService provides functionality
 * for sync contact from google and save in agile.
 * 
 * @author jitendra
 */
public class GoogleSyncImpl extends TwoWaySyncService
{

    /** The Constant MAX_FETCH_LIMIT_FOR_GOOGLE. */
    private static final Integer MAX_FETCH_LIMIT_FOR_GOOGLE = 200;

    /** contact service. */
    private ContactsService contactService;

    /** previous_synced_time unix timestamp date object */
    private Long previous_synced_time = 0l;

    /** last_synced_from_client hold date as long ie unix timestamp */
    private Long last_synced_from_client = 0l;
    private int index = 1;

    /**
     * fetch contacts from google.
     */
    public void syncContactFromClient()
    {
	int i = 0;

	/**
	 * Refresh token before starting sync
	 */
	try
	{
	    GoogleServiceUtil.refreshGoogleContactPrefsandSave(prefs);
	    last_synced_from_client = prefs.last_synced_from_client;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	while (i <= MAX_SYNC_LIMIT)
	{

	    /**
	     * Retrieves contacts from google.
	     */
	    List<ContactEntry> entries = fetchContactsFromGoogle();
	    /**
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

	sendNotification(prefs.type.getNotificationEmailSubject());

	updateLastSyncedInPrefs();
    }

    private List<ContactEntry> fetchContactsFromGoogle()
    {
	String accessToken = prefs.token;

	Preconditions.checkEmptyString(accessToken, "Access token is empty");

	/**
	 * Builds service with token
	 */
	try
	{
	    contactService = GoogleServiceUtil.getService(accessToken);
	}
	catch (OAuthException e1)
	{
	    e1.printStackTrace();
	    return new ArrayList<ContactEntry>();
	}

	if (last_synced_from_client > 0 && prefs.last_synced_from_client == last_synced_from_client)
	{
	    // last_synced_from_client += 3000;
	}
	Query myQuery = buildQuery();

	ContactFeed resultFeed = null;

	/**
	 * Retrieves result feed
	 */
	try
	{
	    resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
	catch (ServiceException e)
	{
	    e.printStackTrace();
	}

	Preconditions.checkNotNull(resultFeed, "Result contact feed is null");

	return resultFeed.getEntries();
    }

    /**
     * Builds the query for retrieves google contacts.
     * 
     * @return the query
     */
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
	    e.printStackTrace();
	}

	if (feedUrl == null)
	    return null;

	Query query = null;
	query = new Query(feedUrl);
	query.setStartIndex(index);
	++index;
	if (previous_synced_time == last_synced_from_client)
	{
	    // last_synced_from_client += 4000;
	}

	DateTime dateTime = new DateTime(last_synced_from_client);

	// Build query with URL

	 query.setMaxResults(MAX_FETCH_LIMIT_FOR_GOOGLE);

	query.setUpdatedMin(dateTime);
	query.setStringCustomParameter("access_token", prefs.token);

	/**
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

	/**
	 * To avoid fetching contacts that are already synced, query is set to
	 * fetch contacts that are created/updated after last syced time (which
	 * is created time of last contact fetched from google) Query set to
	 * fetch contacts ordered by last modified time, so saving last contacts
	 * time can be saved in last synced time
	 */
	 query.setStringCustomParameter("orderby", "lastmodified");

	return query;

    }

    /**
     * Save contacts in agile crm.
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
	    System.out.println("___________________________________");
	    created_at = entry.getUpdated().getValue();
	    System.out.println(entry.getId() + " , " + entry.getName());
	    System.out.println(created_at);
	    contact = wrapContactToAgileSchemaAndSave(entry);
	}

	System.out.println("TIME UPDATED" + created_at + ", " + prefs.last_synced_from_client);
	last_synced_from_client = created_at > last_synced_from_client ? created_at : last_synced_from_client;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
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
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	// TODO Auto-generated method stub
	return GoogleContactWrapperImpl.class;
    }

    @Override
    public void saveContactsToClient(List<Contact> contacts)
    {
	try
	{
	    saveContactsToGoogle(contacts);
	}
	catch(Exception e)
	{
	    e.printStackTrace();
	}

    }

    private void saveContactsToGoogle(List<Contact> contacts) throws Exception
    {
	String token = prefs.token;

	// Feed that hold s all the batch request entries.
	ContactFeed requestFeed = new ContactFeed();

	// Feed that hold s all the batch request entries.
	ContactFeed updateFeed = new ContactFeed();

	// Fetches contacts service
	ContactsService contactService = GoogleServiceUtil.getService(token);

	// Gets sync to group set by user, if it is not set then default
	// sync
	// froup will be returned (created and returned if it does not
	// exist)
	GoogleGroupDetails group = ContactGroupUtil.getSyncToGroup(prefs, prefs.sync_to_group);
	URL url = new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token);

	ContactFeed responseFeed = null;

	int limit = 0;
	int contacts_list_size = contacts.size();
	/**
	 * Iterates through each contacts and adds a batch request based on
	 * whether it is new contact or updated contact
	 */
	for (int i = 0; i < contacts_list_size; i++)
	{

	    Contact contact = contacts.get(i);

	    // Create google supported contact entry based on current contact
	    // data
	    ContactEntry createContact = ContactSyncUtil.createContactEntry(contact, group, prefs);

	    // Check if contact saving should be skipped. It is required if last
	    // contact is null then to avoid rest of contacts to being saved

	    boolean skip = false;
	    // Continues to next contact if current contact is already imported
	    // from google
	    if (createContact == null)
	    {
		System.out.println("contact null : " + createContact);

		// Last synced time is still set to avoid current contact being
		// fetched again ang again
		prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
		        : prefs.last_synced_to_client;

		System.out.println(contacts_list_size - 1 + ", " + i);
		skip = true;
	    }

	    if (!skip)
	    {
		BatchUtils.setBatchId(createContact, contact.id.toString());
		if (createContact.getId() != null)
		{
		    BatchUtils.setBatchOperationType(createContact, BatchOperationType.UPDATE);
		    updateFeed.getEntries().add(createContact);
		    updateRequestCount++;
		}
		else
		{
		    BatchUtils.setBatchOperationType(createContact, BatchOperationType.INSERT);
		    requestFeed.getEntries().add(createContact);
		    insertRequestCount++;
		}
	    }
	    if (contacts.size() < 20)
	    {
		System.out.println(i + ", " + (contacts.size() - 1));
		System.out.println((i >= contacts.size() - 1 && insertRequestCount >= 0));
	    }

	    if (insertRequestCount >= 95 || (i >= contacts.size() - 1 && insertRequestCount != 0))
	    {

		System.out.println("inserted" + i + " , " + contacts.size() + ", " + insertRequestCount);

		System.out.println("start time create : " + System.currentTimeMillis());
		// Submit the batch request to the server.
		responseFeed = contactService.batch(url, requestFeed);

		System.out.println("end time create : " + System.currentTimeMillis());

		prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
		        : prefs.last_synced_to_client;

		insertRequestCount = 0;
		requestFeed = new ContactFeed();

	    }

	    if (updateRequestCount >= 95 || ((i >= (contacts.size() - 1) && updateRequestCount != 0)))
	    {
		System.out.println("updated" + i + " , " + contacts.size() + ", " + insertRequestCount);

		System.out.println("Start time update : " + System.currentTimeMillis());

		contactService.batch(new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?"
		        + "access_token=" + token), updateFeed);

		System.out.println("end time :update " + System.currentTimeMillis());

		prefs.last_synced_updated_contacts_to_client = (contact.updated_time != 0 && contact.updated_time > prefs.last_synced_updated_contacts_to_client) ? contact.updated_time
		        : prefs.last_synced_to_client;

		updateRequestCount = 0;
		updateFeed = new ContactFeed();
	    }

	    limit = i;
	}

	System.out.println("total create requests : " + insertRequestCount + " , " + limit);

	System.out.println("total update requests : " + updateRequestCount + " , " + limit);

    }

}
