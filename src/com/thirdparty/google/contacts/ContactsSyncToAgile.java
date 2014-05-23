package com.thirdparty.google.contacts;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.util.ServiceException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;

public class ContactsSyncToAgile
{
    // Max results to be fetched from google
    public static Integer MAX_FETCH_SIZE = 1000;

    public static Integer MAX_FETCH_SIZE_FROM_GOOGLE = 1000;

    /**
     * Fetches contacts from google based on access token in contact prefs.
     * Checks if token is expired before fetching contacts and refreshes tokens
     * and sends fetch request
     * 
     * @param contactPrefs
     * @throws Exception
     */
    public static void importGoogleContacts(ContactPrefs contactPrefs) throws Exception
    {

	int i = 0;
	int page = 1;
	while (i <= MAX_FETCH_SIZE)
	{

	    // Retrieves contacts from google.
	    List<ContactEntry> entries = ContactsSyncToAgile.retrieveContacts(contactPrefs, page);
	    page++;
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

	    // Saves contacts in agile matching accordingly based on entity
	    // names
	    saveGoogleContactsInAgile(entries, contactPrefs);

	    // If fetched contacts size is less than 200, next request is not
	    // sent to fetch next set of results
	    if (entries.size() < MAX_FETCH_SIZE_FROM_GOOGLE)
		break;

	    i += entries.size();
	}

	// Saves contact preferences to save last synced time
	contactPrefs.save();
    }

    /**
     * Retrieves contacts from Google querying for my contacts
     * 
     * @param accessToken
     *            {@link String} access token retrieved from oauth
     * @return {@link List} of {@link ContactEntry}
     * @throws Exception
     */
    public static List<ContactEntry> retrieveContacts(ContactPrefs prefs, int page) throws Exception
    {

	String accessToken = prefs.token;

	// Builds service with token
	ContactsService contactService = GoogleServiceUtil.getService(accessToken);
	URL feedUrl = null;
	Query myQuery = null;

	try
	{

	    // myQuery.setUpdatedMin(dateTime);
	    feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full");

	    /*
	     * // Sets feed url feedUrl = new
	     * URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL +
	     * "contacts/default/full");
	     */
	}
	catch (MalformedURLException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	DateTime dateTime = new DateTime(prefs.last_synced_from_client);
	// Build query with URL
	myQuery = new Query(feedUrl);
	myQuery.setMaxResults(MAX_FETCH_SIZE_FROM_GOOGLE);

	System.out.println(dateTime);
	myQuery.setUpdatedMin(dateTime);
	myQuery.setStringCustomParameter("access_token", prefs.token);

	System.out.println(myQuery.getQueryUri());

	/*
	 * If sync from group is not null then considering user chose a group to
	 * sync from instead of default "My contacts" group. If it is null then
	 * , by default, contacts are fetched from My contacts group.
	 */
	if (prefs.sync_from_group != null)
	{
	    prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group);

	    // Setting group query
	    myQuery.setStringCustomParameter("group", prefs.sync_from_group);
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
	myQuery.setStringCustomParameter("orderby", "lastmodified");

	ContactFeed resultFeed = null;
	try
	{
	    // Retrieves result feed
	    resultFeed = contactService.getFeed(myQuery, ContactFeed.class);
	}
	catch (ServiceException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	System.out.println("total results from google " + resultFeed.getEntries().size());
	return resultFeed.getEntries();
    }

    /**
     * Maps google contact with agile contact and saves contact in agile.
     * 
     * @param entries
     *            {@link List} of {@link ContactEntry}
     * @param ownerKey
     *            domain user key
     */
    public static void saveGoogleContactsInAgile(List<ContactEntry> entries, ContactPrefs prefs)
    {
	Key<DomainUser> ownerKey = prefs.getDomainUser();

	int counter = 0;
	Long created_at = 0l;
	System.out.println("SAVING CONTACTS FETCHED FROM GOOGLE : " + entries.size());
	for (ContactEntry entry : entries)
	{

	    created_at = entry.getUpdated().getValue();

	    System.out.println(entry.getId());
	    /*
	     * if (!hasGroup(entry, prefs.sync_from_group)) continue;
	     */
	    Contact agileContact = ContactSyncUtil.createContactInAgile(entry);

	    if (agileContact == null)
		continue;
	    agileContact.setContactOwner(prefs.getDomainUser());

	    try
	    {
		agileContact.save();
	    }
	    catch (Exception e)
	    {

		continue;
	    }
	    counter++;

	}

	System.out.println("TIME UPDATED" + created_at + ", " + prefs.last_synced_from_client);
	prefs.last_synced_from_client = created_at > prefs.last_synced_from_client ? created_at
		: prefs.last_synced_from_client;

	// notifies user after adding contacts
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT, String.valueOf(counter));

    }
}
