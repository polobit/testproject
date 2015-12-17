/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.service.TwoWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.GoogleContactWrapperImpl;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.Link;
import com.google.gdata.data.batch.BatchOperationType;
import com.google.gdata.data.batch.IBatchStatus;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.model.batch.BatchUtils;
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
    private static final Integer MAX_FETCH_LIMIT_FOR_GOOGLE = 200;

    public int max = MAX_FETCH_LIMIT_FOR_GOOGLE;

    /** contact service. */
    private ContactsService contactService;

    /** last_synced_from_client hold date as long ie unix timestamp */
    private Long last_synced_from_client = 0l;
    private int start_index = 1;

    private int fetchIndex = 0;

    private int max_limit = MAX_SYNC_LIMIT;

    private JSONObject otherParameters = new JSONObject();

    /**
     * Parameters to check if etag changes
     */
    private String etag = null;
    private int index = 1;
    private String etagFromDB = null;

    private String nextLink = null;

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
	    initParameters();
	    fetchAndSaveContacts();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    finalizeSync();
	}
    }

    private ContactFeed getFeed()
    {
	ContactFeed resultFeed = null;

	if (nextLink != null)
	{
	    try
	    {
		resultFeed = contactService.getFeed(new URL(nextLink + "&access_token=" + prefs.token),
			ContactFeed.class);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	else
	{
	    Query myQuery = buildQuery();
	    myQuery.setStartIndex(start_index);
	    try
	    {
		resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}

	if (resultFeed == null)
	    return null;

	setNextSet(resultFeed);

	return resultFeed;
    }

    private void setNextSet(ContactFeed resultFeed)
    {
	// Sets total contacts in account
	int totalContacts = resultFeed.getTotalResults();

	// Gets resultField start index
	int fetchedContactsSize = resultFeed.getStartIndex();

	// Gets next which can be used to fetch next set of results
	Link nextLinkObject = resultFeed.getNextLink();

	// Calculates number of contacts remaining after current fetch
	int remainingContacts = totalContacts - fetchedContactsSize;

	// Sets previous start index
	start_index = resultFeed.getStartIndex();

	if (nextLinkObject != null)
	    nextLink = nextLinkObject.getHref().toString();
	else if (remainingContacts < max)
	{
	    nextLink = null;

	    // Creates new index based on fetched indexes
	    start_index += resultFeed.getEntries().size();

	    // Builds query without access key
	    Query nextQuery = buildBasicQueryWithoutAccessKey();
	    DateTime dateTime = new DateTime(last_synced_from_client);
	    nextQuery.setUpdatedMin(dateTime);

	    // Sets start index
	    nextQuery.setStartIndex(start_index);
	    if (remainingContacts == 0 || remainingContacts < 0)
	    {
		// start_index++;
		nextQuery.setMaxResults(max);
	    }
	    else
		nextQuery.setMaxResults(remainingContacts);

	    nextLink = nextQuery.getUrl().toString();
	}

	System.out.println("Next link " + nextLink);
	System.out.println("Total results : " + resultFeed.getTotalResults());
	System.out.println("Start index" + resultFeed.getStartIndex());
	System.out.println("fetched size" + resultFeed.getEntries().size());
	if (resultFeed.getPreviousLink() != null)
	    System.out.println("Previous Link " + resultFeed.getPreviousLink().getHref().toString());

	if (resultFeed.getFeedBatchLink() != null)
	    System.out.println("get batch Link " + resultFeed.getFeedBatchLink().getHref().toString());

	System.out.println("############################################################\n\n\n");
    }

    private List<ContactEntry> fetchContactsFromGoogle()
    {

	ContactFeed resultFeed = null;

	/**
	 * Retrieves result feed
	 */
	System.out.println("existing next link " + nextLink);

	resultFeed = getFeed();

	List<ContactEntry> entries = resultFeed.getEntries();

	return entries;

    }

    private Query buildBasicQueryWithoutAccessKey()
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

	query.setMaxResults(getFetchSize());

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

	query.setStringCustomParameter("orderby", "lastmodified");
	query.setStringCustomParameter("sortOrder", "ascending");

	return query;
    }

    private Query buildBasicQuery()
    {

	Query query = buildBasicQueryWithoutAccessKey();

	query.setStringCustomParameter("access_token", prefs.token);

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

    private String getFinalNextLink()
    {
	if (!StringUtils.equals(etag, etagFromDB))
	{
	    Query query = buildBasicQueryWithoutAccessKey();
	    DateTime dateTime = new DateTime(last_synced_from_client);
	    query.setUpdatedMin(dateTime);
	    if (index > 1)
		query.setStartIndex(index);
	    start_index = 0;
	    nextLink = query.getUrl().toString();
	    etagFromDB = etag;
	}
	return nextLink;
    }

    /**
     * Save contacts in agile crm.
     * 
     * @param entries
     *            the entries
     */
    private String currentEtagInSync = null;

    private void saveContactsInAgile(List<ContactEntry> entries)
    {
	Long created_at = 0l;

	if (currentEtagInSync == null)
	    currentEtagInSync = etagFromDB;

	for (ContactEntry entry : entries)
	{
	    etag = entry.getEtag();

	    if (currentEtagInSync == null)
		currentEtagInSync = etagFromDB = etag;

	    if (!StringUtils.equals(etag, currentEtagInSync))
	    {
		index = 2;
		currentEtagInSync = etag;
	    }
	    else
	    {
		index++;
	    }

	    Long new_created_at = entry.getUpdated().getValue();

	    // System.out.println(entry.getEtag() + " : " + entry.getEdited());
	    created_at = new_created_at;
	    // groupInfos.get(0).
	    // System.out.println(entry.getId() + " , " + entry.getName());
	    // System.out.println(created_at);
	    // contact = wrapContactToAgileSchemaAndSave(entry);

	    List<Email> emails = entry.getEmailAddresses();

	    // Added condition to mandate emails. It is added here as other sync
	    // allows contacts without email
	    if (emails == null || emails.size() == 0)
	    {
		syncStatus.put(ImportStatus.EMAIL_REQUIRED, syncStatus.get(ImportStatus.EMAIL_REQUIRED) + 1);
		syncStatus.put(ImportStatus.TOTAL_FAILED, syncStatus.get(ImportStatus.TOTAL_FAILED) + 1);
		continue;
	    }

	   wrapContactToAgileSchemaAndSave(entry);
	}

	System.out.println(NamespaceManager.get() + " , " + etag + " , " + index + " , "
		+ entries.get(entries.size() - 1).getUpdated());

	last_synced_from_client = created_at;
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
    public Class<? extends IContactWrapper> getWrapperService()
    {
	// TODO Auto-generated method stub
	return GoogleContactWrapperImpl.class;
    }

    @Override
    public void saveNewContactsToClient(List<Contact> contacts)
    {
	try
	{
	    saveNewContactsToGoogle(contacts);
	}
	catch (Exception e)
	{
	    System.out.println("Error occured while creating contacts in Google" + e.getMessage());
	}
	
    }
	
	@Override
    public void saveUpdatedContactsToClient(List<Contact> contacts)
    {
	try
	{
	    saveUpdatedContactsToGoogle(contacts);
	}
	catch (Exception e)
	{
		System.out.println("Error occured while updating contacts in Google" + e.getMessage());
	}

    }
	
	/**
	 * Saves newly created agile contacts into Google
	 * 
	 * @param contacts
	 * @throws Exception
	 */
    private void saveNewContactsToGoogle(List<Contact> contacts) throws Exception
    {
	String token = prefs.token;

	// Feed that hold s all the batch request entries.
	ContactFeed requestFeed = new ContactFeed();

	// Fetches contacts service
	ContactsService contactService = GoogleServiceUtil.getService(token);

	// Gets sync to group set by user, if it is not set then default
	// sync group will be returned (created and returned if it does not exist)
		
	GoogleGroupDetails group = ContactGroupUtil.getSyncToGroup(prefs, prefs.sync_to_group);
	URL url = new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token);

	ContactFeed responseFeed = null;

	int limit = 0;
	int contacts_list_size = contacts.size();
	
	boolean contactCreate = true;
	
	for (int i = 0; i < contacts_list_size; i++)
	{

	    Contact contact = contacts.get(i);
	    
	    // Create google supported contact entry based on current contact
	    // data
	    ContactEntry createContact = ContactSyncUtil.createContactEntry(contact, group, prefs,contactCreate);

	    // Check if contact saving should be skipped. It is required if last
	    // contact is null then to avoid rest of contacts to being saved

	    boolean skip = false;
	    // Continues to next contact if current contact is already imported
	    // from google
	    if (createContact == null)
	    {
		// System.out.println("contact null : " + createContact);

		// Last synced time is still set to avoid current contact being
		// fetched again ang again
		prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
			: prefs.last_synced_to_client;
		
		skip = true;
	    }

	    if (!skip)
	    {
		BatchUtils.setBatchId(createContact, contact.id.toString());
		BatchUtils.setBatchOperationType(createContact, BatchOperationType.INSERT);
		BatchUtils.setBatchId(createContact,"create");
		requestFeed.getEntries().add(createContact);
		insertRequestCount++;
	    }

	    if (insertRequestCount >= 95 || (i >= contacts.size() - 1 && insertRequestCount != 0))
	    {
	    
	    Thread.sleep(2000);
		// Submit the batch request to the server.
		responseFeed = contactService.batch(url, requestFeed);
		for(int v=0;v<responseFeed.getEntries().size();v++)
		{
			ContactEntry entry = responseFeed.getEntries().get(v);
			String batchId = BatchUtils.getBatchId(responseFeed.getEntries().get(v));
			IBatchStatus status = BatchUtils.getStatus(entry);
			System.out.println(batchId + ": " + status.getCode() + " (" + status.getReason() + ")");
		}
		
		responseFeed = null;

		prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
			: prefs.last_synced_to_client;

		insertRequestCount = 0;
		requestFeed = new ContactFeed();

	    }
	    limit = i;
	}

	System.out.println("total create requests : " + insertRequestCount + " , " + limit);

    }
    
    /**
     * Saves newly updated Agile contacts into Google.
     * This method is responsible for 
     * @param contacts
     * @throws Exception
     */
    private void saveUpdatedContactsToGoogle(List<Contact> contacts) throws Exception
    {
	String token = prefs.token;

	// Feed that hold s all the batch request entries.
	ContactFeed updateFeed = new ContactFeed();

	// Fetches google contacts service
	ContactsService contactService = GoogleServiceUtil.getService(token);

	// Gets sync to group set by user, if it is not set then default
	// sync group will be returned (created and returned if it does not exist)
	
	GoogleGroupDetails group = ContactGroupUtil.getSyncToGroup(prefs, prefs.sync_to_group);

	ContactFeed responseFeed = null;
	int limit = 0;
	int contacts_list_size = contacts.size();
	
	boolean contactCreate = false;
	
	for (int i = 0; i < contacts_list_size; i++)
	{
	    Contact contact = contacts.get(i);	    
	    // Create google supported contact entry based on current contact
	    // data
	    ContactEntry createContact = ContactSyncUtil.createContactEntry(contact, group, prefs,contactCreate);

	    // Check if contact saving should be skipped. It is required if last
	    // contact is null then to avoid rest of contacts to being saved

	    boolean skip = false;
	    // Continues to next contact if current contact is already imported
	    // from google
		if (createContact == null)
		{
			// Last synced time is still set to avoid current contact being
			// fetched again ang again
			prefs.last_synced_to_client = contact.created_time > prefs.last_synced_to_client ? contact.created_time
				: prefs.last_synced_to_client;
			skip = true;
		}
		if (!skip)
		{
			if(createContact.getId()!=null)
			{
				BatchUtils.setBatchId(createContact, contact.id.toString());
				BatchUtils.setBatchOperationType(createContact, BatchOperationType.UPDATE);
				updateFeed.getEntries().add(createContact);
				updateRequestCount++;
			}
		}
		    
		if (updateRequestCount >= 95 || ((i >= (contacts.size() - 1) && updateRequestCount != 0)))
		{
		    Thread.sleep(2000);
			responseFeed = contactService.batch(new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?"
				+ "access_token=" + token), updateFeed);
			for(int v=0;v<responseFeed.getEntries().size();v++)
			{
				ContactEntry entry = responseFeed.getEntries().get(v);
				String batchId = BatchUtils.getBatchId(responseFeed.getEntries().get(v));
				IBatchStatus status = BatchUtils.getStatus(entry);
				System.out.println(batchId + ": " + status.getCode() + " (" + status.getReason() + ")");
			}
			responseFeed = null;
			prefs.last_synced_updated_contacts_to_client = (contact.updated_time != 0 && contact.updated_time > prefs.last_synced_updated_contacts_to_client) ? contact.updated_time
				: prefs.last_synced_to_client;
			updateRequestCount = 0;
			updateFeed = new ContactFeed();
		}
		limit = i;
	}
	System.out.println("total update requests : " + updateRequestCount + " , " + limit);
    }

    /**
     * Refreshes access token, initializes contacts service object to connect to
     * google. It also fetches extra parameters that are saved in contact prefs
     * 
     * @throws Exception
     */
    private void initParameters() throws Exception
    {
	GoogleServiceUtil.refreshGoogleContactPrefsandSave(prefs);

	/**
	 * Sets service object which is used to perform operations on google
	 * contacts. It works like a corrector to google contacts
	 */
	contactService = GoogleServiceUtil.getService(prefs.token);

	// Sets request timeout time
	contactService.setReadTimeout(60000);

	// Other parameters are additional parameters that are saved in prefs
	if (prefs.othersParams != null)
	{
	    try
	    {
		
		prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group, "utf-8");
		otherParameters = new JSONObject(prefs.othersParams);
		// Start index where last sync stopped.

		if (otherParameters.has(prefs.sync_from_group))
		{
		    JSONObject object = otherParameters.getJSONObject(prefs.sync_from_group);
		    start_index = Integer.parseInt(object.getString("start_index"));
		    nextLink = object.getString("nextLink");
		    etagFromDB = object.getString("etagFromDB");
		    
		    if(otherParameters.has("start_index"))
			    otherParameters.remove("start_index");
		    
		    if(object.has("last_synced"))
		    {
			prefs.last_synced_from_client = object.getLong("last_synced");
		    }
		    
		}
		else if(otherParameters.has("start_index"))
		{
		   
		    nextLink = otherParameters.getString("nextLink");
		    etagFromDB = otherParameters.getString("etagFromDB");
		    
			
		    JSONObject json = new JSONObject();
		    
		    json.put("start_index", start_index);
		    json.put(prefs.sync_from_group, json);
		    json.put("etagFromDB", etagFromDB);
		    json.put("nextLink", nextLink);
		    prefs.last_synced_from_client = 0l;
		    json.put("last_synced", prefs.last_synced_from_client);
		   
		    json.put(prefs.sync_from_group, json);
		    // Removes old parameters
		    otherParameters.remove("start_index");
		    otherParameters.remove("nextLink");
		    otherParameters.remove("etagFromDB");
		}
		

		etag = etagFromDB;
		
		// totalContacts =
		// otherParameters.getString(("totalContacts");
	    }
	    catch (JSONException e)
	    {

	    }
	    catch (NumberFormatException e)
	    {
		e.printStackTrace();
	    }
	}

	last_synced_from_client = prefs.last_synced_from_client;
    }

    /**
     * Calls fetch functionality and save function if sync is allowed (ACLs and
     * billing restriction).
     */
    private void fetchAndSaveContacts()
    {
	while (canSync() && (fetchIndex < max_limit))
	{

	    /**
	     * Retrieves contacts from google.
	     */
	    List<ContactEntry> entries = fetchContactsFromGoogle();

	    /**
	     * If entries are null then method should either return or break
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

	    // If fetched contacts size is less than 200, next request is not
	    // sent to fetch next set of results
	    if (entries.size() < max)
		break;

	    fetchIndex += entries.size();

	    System.out.println(otherParameters);
	}
    }

    private void updateOtherParameters()
    {
	try
	{
	    JSONObject obj = new JSONObject();
	    obj.put("start_index", start_index);
	    obj.put("nextLink", getFinalNextLink());
	    obj.put("etagFromDB", etag);
	    obj.put("last_synced", prefs.last_synced_from_client);
	    otherParameters.put(prefs.sync_from_group, obj);
	    
	    prefs.othersParams = otherParameters.toString();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    private void finalizeSync()
    {
	prefs.inProgress = false;
	updateLastSyncedInPrefs();
	updateOtherParameters();
	sendNotification(prefs.type.getNotificationEmailSubject());
    }

}