package com.thirdparty.google.contacts;

import java.net.URL;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.batch.BatchOperationType;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.model.batch.BatchUtils;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.groups.GoogleGroupDetails;
import com.thirdparty.google.groups.util.ContactGroupUtil;

public class ContactsSynctoGoogle
{
    static int MAX_FETCH_SIZE = 1000;

    /**
     * Fetches both new and updated contacts in agile and calls method to send
     * save request to google
     * 
     * @param prefs
     */
    public static void updateContacts(ContactPrefs prefs)
    {
	try
	{
	    /*
	     * Fetches new contacts created up to max size set in subsets of 200
	     * as max size for batch request
	     */
	    synCreatedContacts(prefs, 200, null);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	try
	{
	    // Fetches updated contacts up to max size set in subsets of 200 as
	    // max size
	    // for batch request
	    synUpdatedContacts(prefs, 200, null);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Fetch newly created contacts after last synced time.
     * 
     * @param prefs
     * @param page
     * @param cursor
     */
    public static void synCreatedContacts(ContactPrefs prefs, Integer page, String cursor)
    {

	int fetched = 0;
	System.out.println("fetching fetching fetching");

	// Fetches first set of contacts up to page size
	List<Contact> contacts_list = ContactSyncUtil.fetchNewContactsToSync(prefs, page, cursor);

	System.out.println("fetch newly created contacts :" + contacts_list.size());

	if (contacts_list.isEmpty())
	    return;

	// Fetches sets of contats of size of page size up to Max fetch size
	String currentCursor = null;
	String previousCursor = null;
	do
	{
	    // Gets number of contacts fetched
	    fetched += contacts_list.size();

	    // sets cursor to preview cursor
	    previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;
	    System.out.println(previousCursor);

	    try
	    {
		// Updates fetched contacts
		updateContacts(contacts_list, prefs);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    /*
	     * If cursor is not empty next set of contacts are fetched and
	     * cursor is set to current cursorl; it will be compared with
	     * previous cursor, if both are same loop will exit to avoid
	     * infinite loop if contact list constantly sets same cursor on last
	     * contact
	     */
	    if (!StringUtils.isEmpty(previousCursor))
	    {
		contacts_list = ContactSyncUtil.fetchNewContactsToSync(prefs, page, previousCursor);

		currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor : null;
		continue;
	    }

	    break;
	}
	while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor) && fetched <= MAX_FETCH_SIZE);
    }

    public static void synUpdatedContacts(ContactPrefs prefs, Integer page, String cursor)
    {
	int MAX_FETCH_SIZE = 1000;
	int fetched = 0;
	List<Contact> contacts_list = ContactSyncUtil.fetchUpdatedContactsToSync(prefs, page, cursor);

	System.out.println(contacts_list);
	if (contacts_list.isEmpty())
	    return;

	String currentCursor = null;
	String previousCursor = null;
	do
	{
	    System.out.println(fetched);
	    fetched += contacts_list.size();
	    previousCursor = contacts_list.get(contacts_list.size() - 1).cursor;

	    try
	    {
		updateContacts(contacts_list, prefs);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    if (!StringUtils.isEmpty(previousCursor))
	    {
		contacts_list = ContactSyncUtil.fetchUpdatedContactsToSync(prefs, 500, previousCursor);

		currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor : null;
		continue;
	    }

	    break;
	}
	while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor) && fetched <= MAX_FETCH_SIZE);
    }

    /**
     * Updates/Creates contacts in google contacts in user specied group of
     * default/recommended group "Agile"
     * 
     * @param contacts
     * @param prefs
     * @throws Exception
     */
    public static void updateContacts(List<Contact> contacts, ContactPrefs prefs) throws Exception
    {
	String token = prefs.token;

	// Feed that hold s all the batch request entries.
	ContactFeed requestFeed = new ContactFeed();

	// Feed that hold s all the batch request entries.
	ContactFeed updateFeed = new ContactFeed();

	// Fetches contacts service
	ContactsService contactService = GoogleServiceUtil.getService(token);

	// Gets sync to group set by user, if it is not set then default sync
	// froup will be returned (created and returned if it does not exist)
	GoogleGroupDetails group = ContactGroupUtil.getSyncToGroup(prefs, "Agile");

	// Insert contact and updated contact are recorded as batch request to
	// create/update is limited to 100 per request.
	int insertRequestCount = 0;
	int updateRequestCount = 0;

	ContactFeed responseFeed = null;

	/**
	 * Iterates through each contacts and adds a batch request based on
	 * whether it is new contact or updated contact
	 */
	for (int i = 0; i < contacts.size(); i++)
	{
	    Contact contact = contacts.get(i);

	    if (contact.getContactFieldValue("Contact type") != null && contact.updated_time <= prefs.last_synced_to_client)
		continue;

	    ContactEntry createContact = ContactSyncUtil.createContactEntry(contact, group, prefs);

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

	    if (insertRequestCount >= 95 || i >= contacts.size() - 1)
	    {
		// Submit the batch request to the server.
		responseFeed = contactService.batch(new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token),
			requestFeed);
		insertRequestCount = 0;
		requestFeed = new ContactFeed();
	    }

	    if (updateRequestCount >= 95 || i >= contacts.size() - 1)
	    {
		contactService.batch(new URL("https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token), updateFeed);
		updateRequestCount = 0;
		updateFeed = new ContactFeed();
	    }

	}

	// Check the status of each operation.
	for (ContactEntry entry : responseFeed.getEntries())
	{
	    String batchId = BatchUtils.getBatchId(entry);
	    com.google.gdata.data.batch.BatchStatus status = com.google.gdata.data.batch.BatchUtils.getBatchStatus(entry);
	    System.out.println(batchId + ": " + status.getCode() + " (" + status.getReason() + ")");
	}
    }
}
