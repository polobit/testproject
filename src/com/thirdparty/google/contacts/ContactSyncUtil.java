package com.thirdparty.google.contacts;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.FamilyName;
import com.google.gdata.data.extensions.FullName;
import com.google.gdata.data.extensions.GivenName;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.Organization;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.SYNC_TYPE;
import com.thirdparty.google.GoogleServiceUtil;
import com.thirdparty.google.deferred.GoogleContactsSyncDeferredTask;
import com.thirdparty.google.groups.GoogleGroupDetails;

public class ContactSyncUtil
{
    /**
     * Initializes deferred task with contacts prefs id which initializes
     * backeds task to start and start sync process
     * 
     * @param id
     */
    public static void syncContactsDeferredTask(Long id)
    {
	GoogleContactsSyncDeferredTask task = new GoogleContactsSyncDeferredTask(id);

	Queue queue = QueueFactory.getQueue("contact-sync-queue");
	queue.add(TaskOptions.Builder.withPayload(task));
    }

    /**
     * Calls sync methods based on sync type chosen.
     * 
     * @param contactPrefs
     * @throws Exception
     */
    public static void syncContacts(ContactPrefs contactPrefs) throws Exception
    {
	System.out.println("syn started");

	if (contactPrefs.sync_type == SYNC_TYPE.CLIENT_TO_AGILE)
	{
	    ContactsSyncToAgile.importGoogleContacts(contactPrefs);
	}
	else if (contactPrefs.sync_type == SYNC_TYPE.AGILE_TO_CLIENT)
	{
	    System.out.println("sync type " + contactPrefs.sync_type);
	    ContactsSynctoGoogle.updateContacts(contactPrefs);
	}
	else if (contactPrefs.sync_type == SYNC_TYPE.TWO_WAY)
	{
	    ContactsSyncToAgile.importGoogleContacts(contactPrefs);
	    contactPrefs.last_synced_from_client = System.currentTimeMillis();
	    ContactsSynctoGoogle.updateContacts(contactPrefs);
	    contactPrefs.last_synced_to_client = System.currentTimeMillis();
	}

	// Contacts prefs save to persist sync times
	contactPrefs.save();

    }

    /**
     * Creates contact entry to be saved/updated in google contacts. Before
     * creating contact it searches for existing contact with given email in
     * google. If it is a duplicate contact then contact id is set to new
     * contact entry and it will be added on update request
     * 
     * @param contact
     * @param groupEntry
     * @param prefs
     * @return
     */
    public static ContactEntry createContactEntry(Contact contact, GoogleGroupDetails groupEntry, ContactPrefs prefs)
    {
	// Retrieves contact based on contact emails
	List<ContactEntry> entries = retrieveContactBasedOnEmailFromGoogle(contact, prefs);

	System.out.println("duplicates " + entries);
	ContactEntry createContact = null;

	// If duplicate contacts exists first contact is considered as perfect
	// match.
	if (entries.size() > 0)
	{
	    createContact = entries.get(0);
	}
	else
	    createContact = new ContactEntry();

	final String NO_YOMI = null;

	// Sets first name Last name to contact
	Name contactName = new Name();
	String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
	String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

	String fullName = "";
	if (!StringUtils.isEmpty(firstName))
	{
	    fullName += firstName;
	    contactName.setGivenName(new GivenName(firstName, NO_YOMI));
	}

	if (!StringUtils.isEmpty(lastName))
	{
	    fullName += " " + lastName;
	    contactName.setFamilyName(new FamilyName(lastName, NO_YOMI));
	}

	contactName.setFullName(new FullName(fullName, NO_YOMI));

	if (contactName.hasGivenName())
	    createContact.setName(contactName);

	List<ContactField> emailFields = contact.getContactPropertiesList(Contact.EMAIL);
	List<Email> emails = createContact.getEmailAddresses();
	List<ContactField> newEmails = new ArrayList<ContactField>();

	// Sets Emails to contact
	for (ContactField field : emailFields)
	{
	    boolean isNew = true;
	    for (Email email : emails)
	    {
		if (StringUtils.equals(email.getAddress(), field.value))
		{
		    isNew = false;
		    break;
		}
	    }
	    if (isNew)
	    {
		newEmails.add(field);
	    }
	}

	for (ContactField field : newEmails)
	{
	    Email primaryMail = new Email();
	    primaryMail.setAddress(field.value);
	    if (!StringUtils.isEmpty(field.subtype))
		primaryMail.setRel("http://schemas.google.com/g/2005#" + StringUtils.lowerCase(field.subtype.toLowerCase()));
	    else
		primaryMail.setRel("http://schemas.google.com/g/2005#work");

	    System.out.println(primaryMail);
	    createContact.addEmailAddress(primaryMail);
	}

	// Adds Company to contact
	ContactField companyField = contact.getContactField(Contact.COMPANY);
	if (companyField != null)
	{
	    Organization company = new Organization(companyField.value, true, "http://schemas.google.com/g/2005#work");
	    createContact.addOrganization(company);
	}

	// If group is defined then group id is added which save contact in
	// specified group.
	if (groupEntry != null)
	{
	    createContact.addGroupMembershipInfo(new GroupMembershipInfo(false, groupEntry.atomId));
	}

	return createContact;
    }

    /**
     * Retrieves contacts from google based on emails in the contact
     * 
     * @param contact
     * @param prefs
     * @return
     */
    public static List<ContactEntry> retrieveContactBasedOnEmailFromGoogle(Contact contact, ContactPrefs prefs)
    {
	List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
	String query_text = "";

	// Creates a query string with emails
	for (ContactField email : emails)
	{
	    query_text = " " + email.value;
	}

	try
	{

	    // Queries in google contact based on query string built with emails
	    return retrieveContactBasedOnQuery(query_text, prefs);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new ArrayList<ContactEntry>();
	}
    }

    /**
     * Queries contacts in google based on query string sent
     * 
     * @param query_text
     * @param prefs
     * @return
     * @throws Exception
     */
    public static List<ContactEntry> retrieveContactBasedOnQuery(String query_text, ContactPrefs prefs) throws Exception
    {
	ContactsService service = GoogleServiceUtil.getService(prefs.token);
	URL feelURL = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?access_token=" + prefs.token);

	Query query = new Query(feelURL);

	/*
	 * Checks if sync from group is specified and sets query to search in
	 * that group. At this point of time sync from group will always be set.
	 * Even if user did not set group, it gets set prefs in initial states
	 * for saving contacts
	 */
	if (prefs.sync_from_group != null)
	    query.setStringCustomParameter("group", prefs.sync_to_group);
	query.setStringCustomParameter("q", query_text);
	query.setMaxResults(1);

	// Fetches matching reqeust based on query and returns feed entires
	// i.e.., {@Link ContactEntry}
	ContactFeed feed = service.getFeed(query, ContactFeed.class);

	return feed.getEntries();

    }

    /**
     * Fetches updated contacts after last synced time to client
     * 
     * @param pref
     * @param page
     * @param cursor
     * @return
     */
    public static List<Contact> fetchUpdatedContactsToSync(ContactPrefs pref, Integer page, String cursor)
    {
	if (page == null || page == 0)
	{
	    page = 500;
	}

	Long time = pref.last_synced_to_client;
	Map<String, Object> queryMap = new HashMap<String, Object>();
	queryMap.put("updated_time > ", time / 1000);

	if (pref.my_contacts)
	    queryMap.put("owner_key", pref.getDomainUser());

	return Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "-updated_time");
    }

    /**
     * Fetches newly created contacts after last synced time in contact prefs
     * 
     * @param pref
     * @param page
     * @param cursor
     * @return
     */
    public static List<Contact> fetchNewContactsToSync(ContactPrefs pref, Integer page, String cursor)
    {
	if (page == null || page == 0)
	{
	    page = 500;
	}
	Long time = pref.last_synced_to_client;
	Map<String, Object> queryMap = new HashMap<String, Object>();
	System.out.println(time / 1000);
	queryMap.put("created_time >", time / 1000);

	if (pref.my_contacts)
	    queryMap.put("owner_key", pref.getDomainUser());

	System.out.println(queryMap);
	System.out.println("fetching");

	System.out.println(Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "-created_time"));
	List<Contact> contacts = Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "-created_time");

	System.out.println("contacts fount : " + contacts.size());
	return contacts;
    }

    public static Contact mergeContact(ContactEntry entry, Contact contact, ContactPrefs prefs)
    {
	if (prefs.conflict.equals(ContactPrefs.AGILE))
	{
	    return CopyFromAgileContact(entry, contact);

	}
	return CopyFromGoogleContact(entry, contact);
    }

    public static Contact CopyFromGoogleContact(ContactEntry entry, Contact contact)
    {
	return null;
    }

    public static Contact CopyFromAgileContact(ContactEntry entry, Contact contact)
    {

	return null;
    }

}
