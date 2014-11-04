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

import org.json.JSONException;
import org.json.JSONObject;
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
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.contacts.ContactSyncUtil;
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
    private static final Integer MAX_FETCH_LIMIT_FOR_GOOGLE = 50;

    /** contact service. */
    private ContactsService contactService;

    /** previous_synced_time unix timestamp date object */
    private Long previous_synced_time = 0l;

    /** last_synced_from_client hold date as long ie unix timestamp */
    private Long last_synced_from_client = 0l;
    private int start_index = 1;
    private int start_index_from_db = 1;

    private int fetchIndex = 0;

    private boolean importedContacts = false;
    /**
     * Note contact times
     */
    private long first_contact_time = 0l;
    private long last_contact_time = 0l;

    private int max_limit = MAX_SYNC_LIMIT - 800;

    private String baseon_index = "false";

    private JSONObject otherParameters = new JSONObject();

    /**
     * fetch contacts from google.
     */
    public void syncContactFromClient()
    {

	/**
	 * Refresh token before starting sync
	 */
	try
	{
	    GoogleServiceUtil.refreshGoogleContactPrefsandSave(prefs);

	    previous_synced_time = last_synced_from_client;

	    if (prefs.othersParams != null)
	    {
		try
		{
		    otherParameters = new JSONObject(prefs.othersParams);
		    start_index = Integer.parseInt(otherParameters.getString("start_index"));
		    start_index_from_db = start_index;
		    baseon_index = otherParameters.getString("baseon_index");
		}
		catch (JSONException e)
		{

		}
		catch (NumberFormatException e)
		{
		    e.printStackTrace();
		}
	    }
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
		return;
	    }

	    last_synced_from_client = prefs.last_synced_from_client;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	while (canSync() && (fetchIndex < max_limit || (isImportSync() && fetchIndex < 500)))
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
		if (fetchIndex == 0)
		    return;
		else
		    break;
	    }

	    // Saves contacts in agile matching accordingly based on entity
	    // names
	    saveContactsInAgile(entries);

	    setStartAndEnd(entries);

	    start_index += entries.size();

	    // If fetched contacts size is less than 200, next request is not
	    // sent to fetch next set of results
	    if (entries.size() < MAX_FETCH_LIMIT_FOR_GOOGLE)
		break;

	    fetchIndex += entries.size();

	    System.out.println(otherParameters);
	}

	try
	{
	    // Sets index
	    start_index_from_db += total_synced_contact;

	    if (isImportSync())
	    {
		otherParameters.put("baseon_index", "true");
		prefs.last_synced_from_client++;
	    }
	    else
		otherParameters.put("baseon_index", "false");

	    otherParameters.put("start_index", start_index_from_db);

	    prefs.othersParams = otherParameters.toString();
	    prefs.last_synced_from_client++;
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    updateLastSyncedInPrefs();
	    prefs.inProgress = false;
	    updateLastSyncedInPrefs();

	    sendNotification(prefs.type.getNotificationEmailSubject());

	}

    }

    private void setStartAndEnd(List<ContactEntry> entries)
    {
	if (entries.size() == 1)
	    return;

	setStartContactTime(entries.get(0));
	setLastContactTime(entries.get(entries.size() - 1));
    }

    private void setStartContactTime(ContactEntry entry)
    {
	first_contact_time = entry.getUpdated().getValue();
    }

    private void setLastContactTime(ContactEntry entry)
    {
	last_contact_time = entry.getUpdated().getValue();
    }

    /**
     * Returns true if all contacts in current iteration has same created time
     * 
     * @return
     */
    private boolean isImportSync()
    {
	if ("true".equals(baseon_index))
	    return true;

	return importedContacts;
    }

    private List<ContactEntry> fetchContactsFromGoogle()
    {

	Query myQuery = null;

	if (importedContacts)
	    myQuery = buildQueryWithIndex();
	else
	    myQuery = buildQuery();

	ContactFeed resultFeed = null;

	/**
	 * Retrieves result feed
	 */
	try
	{
	    resultFeed = contactService.getFeed(myQuery, ContactFeed.class);

	    List<ContactEntry> entries = resultFeed.getEntries();

	    System.out.println(resultFeed.getTotalResults());
	    System.out.println(resultFeed.getStartIndex());
	    return entries;
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

	return new ArrayList<ContactEntry>();
    }

    private Query buildQueryWithIndex()
    {
	Query query = buildBasicQuery();

	query.setStartIndex(start_index);

	return query;
    }

    private Query buildBasicQuery()
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

	// Build query with URL

	query.setMaxResults(MAX_FETCH_LIMIT_FOR_GOOGLE);

	query.setStringCustomParameter("access_token", prefs.token);

	// query.setStrict(true);

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

	System.out.println(query.getFullTextQuery());
	System.out.println(query.getMaxResults());

	query.setStringCustomParameter("orderby", "lastmodified");
	query.setStringCustomParameter("sortOrder", "ascending");

	return query;
    }

    /**
     * Builds the query for retrieves google contacts.
     * 
     * @return the query
     */
    private Query buildQuery()
    {
	DateTime dateTime = new DateTime(last_synced_from_client);

	Query query = buildBasicQuery();

	query.setUpdatedMin(dateTime);

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
	int matches = 0;
	importedContacts = false;
	for (ContactEntry entry : entries)
	{
	    Long new_created_at = entry.getUpdated().getValue();
	    if (new_created_at.equals(created_at))
	    {
		importedContacts = true;
		matches++;
	    }
	    else
	    {
		importedContacts = false;
	    }

	    created_at = new_created_at;
	    System.out.println(entry.getId() + " , " + entry.getName());
	    System.out.println(created_at);
	    contact = wrapContactToAgileSchemaAndSave(entry);
	}

	System.out.println("TIME UPDATED" + created_at + ", " + prefs.last_synced_from_client + ", matches :" + matches
		+ ", boolean" + importedContacts);

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
	catch (Exception e)
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

	    if (insertRequestCount >= 95 || (i >= contacts.size() - 1 && insertRequestCount != 0))
	    {

		// Submit the batch request to the server.
		responseFeed = contactService.batch(url, requestFeed);

		prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
			: prefs.last_synced_to_client;

		insertRequestCount = 0;
		requestFeed = new ContactFeed();

	    }

	    if (updateRequestCount >= 95 || ((i >= (contacts.size() - 1) && updateRequestCount != 0)))
	    {

		contactService.batch(new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?"
			+ "access_token=" + token), updateFeed);

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
