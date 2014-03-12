package com.thirdparty.google.contacts;

import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.DateTime;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.Im;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.PhoneNumber;
import com.google.gdata.data.extensions.StructuredPostalAddress;
import com.google.gdata.util.ServiceException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.GoogleServiceUtil;

public class ContactsSyncToAgile
{
    // Max results to be fetched from google
    public static Integer MAX_FETCH_SIZE = 200;

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
	// Checks if token is expired and refreshes it based on expiry time
	// saved.
	if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
	    GoogleServiceUtil.refreshGoogleContactPrefsandSave(contactPrefs);

	int i = 0;
	while (i <= MAX_FETCH_SIZE)
	{
	    // Retrieves contacts from google.
	    List<ContactEntry> entries = ContactsSyncToAgile.retrieveContacts(contactPrefs);

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
	    if (entries.size() < 200)
		break;

	    i += 200;
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
    public static List<ContactEntry> retrieveContacts(ContactPrefs prefs) throws Exception
    {

	String accessToken = prefs.token;

	// Builds service with token
	ContactsService contactService = GoogleServiceUtil.getService(accessToken);
	URL feedUrl = null;
	Query myQuery = null;

	try
	{
	    // Sets feed url
	    feedUrl = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?access_token=" + accessToken);
	}
	catch (MalformedURLException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	// Build query with URL
	myQuery = new Query(feedUrl);

	/*
	 * If sync from group is not null then considering user chose a group to
	 * sync from instead of default "My contacts" group. If it is null then
	 * , by default, contacts are fetched from My contacts group.
	 */
	if (prefs.sync_from_group != null)
	{
	    prefs.sync_from_group = URLDecoder.decode(prefs.sync_from_group);
	    System.out.println(prefs.sync_from_group);

	    // Setting group query
	    myQuery.setStringCustomParameter("group", prefs.sync_from_group);
	}

	// Fetches only max 200 contacts from goole
	myQuery.setMaxResults(MAX_FETCH_SIZE);

	/*
	 * To avoid fetching contacts that are already synced, query is set to
	 * fetch contacts that are created/updated after last syced time (which
	 * is created time of last contact fetched from google)
	 */
	DateTime dateTime = new DateTime(prefs.last_synced_from_client);
	myQuery.setUpdatedMin(dateTime);

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

	System.out.println(resultFeed.getEntries());

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
	main: for (ContactEntry entry : entries)
	{
	    System.out.println("new contact");
	    System.out.println(entry.getId());
	    /*
	     * if (!hasGroup(entry, prefs.sync_from_group)) continue;
	     */
	    Contact agileContact = new Contact();

	    List<ContactField> fields = new ArrayList<ContactField>();

	    System.out.println(entry.getId());
	    if (entry.hasName())
	    {
		System.out.println(entry.getName());
	    }
	    else
	    {
		System.out.println("hello hello hello hello hello hello hello ");
	    }
	    // checks if google contact has email and skips it
	    if ((!entry.hasEmailAddresses() || entry.getEmailAddresses().size() == 0)
		    || (entry.getEmailAddresses().size() == 1 && entry.getEmailAddresses().get(0).getAddress() == null))
		continue;

	    for (Email email : entry.getEmailAddresses())
		if (email.getAddress() != null)
		{
		    System.out.println("Email: " + email.getAddress());

		    // checks for duplicate emails and skips contact
		    if (ContactUtil.isExists(email.getAddress()))
			continue main;

		    fields.add(new ContactField(Contact.EMAIL, email.getAddress(), null));
		}

	    if (entry.hasName())
	    {
		Name name = entry.getName();

		System.out.println("name" + name);
		if (name.hasGivenName() && name.hasFamilyName())
		{
		    System.out.println(name.hasFamilyName());
		    System.out.println(name.hasGivenName());
		    System.out.println(name.hasFullName());
		    if (name.hasFamilyName())
			fields.add(new ContactField(Contact.LAST_NAME, name.getFamilyName().getValue(), null));

		    if (name.hasGivenName())
			fields.add(new ContactField(Contact.FIRST_NAME, name.getGivenName().getValue(), null));
		}
		else if (name.hasFullName())
		    fields.add(new ContactField(Contact.FIRST_NAME, name.getFullName().getValue(), null));

	    }

	    if (entry.hasOrganizations())
		if (entry.getOrganizations().get(0).hasOrgName() && entry.getOrganizations().get(0).getOrgName().hasValue())
		    fields.add(new ContactField(Contact.COMPANY, entry.getOrganizations().get(0).getOrgName().getValue(), null));

	    if (entry.hasPhoneNumbers())
		for (PhoneNumber phone : entry.getPhoneNumbers())
		    if (phone.getPhoneNumber() != null)
			fields.add(new ContactField("phone", entry.getPhoneNumbers().get(0).getPhoneNumber(), null));

	    if (entry.hasStructuredPostalAddresses())
		for (StructuredPostalAddress address : entry.getStructuredPostalAddresses())
		{
		    System.out.println("in structured address");

		    JSONObject json = new JSONObject();
		    String addr = "";
		    if (address.hasStreet())
			addr = addr + address.getStreet().getValue();
		    if (address.hasSubregion())
			addr = addr + ", " + address.getSubregion().getValue();
		    if (address.hasRegion())
			addr = addr + ", " + address.getRegion().getValue();

		    System.out.println(addr);
		    try
		    {
			if (!StringUtils.isBlank(addr))
			    json.put("address", addr);

			if (address.hasCity() && address.getCity().hasValue())
			    json.put("city", address.getCity().getValue());

			if (address.hasCountry() && address.getCountry().hasValue())
			    json.put("country", address.getCountry().getValue());

			if (address.hasPostcode() && address.getPostcode().hasValue())
			    json.put("zip", address.getPostcode().getValue());
		    }
		    catch (JSONException e)
		    {
			continue;
		    }

		    fields.add(new ContactField("address", json.toString(), null));

		}

	    if (entry.hasImAddresses())
		for (Im im : entry.getImAddresses())
		{
		    if (im.hasAddress())
		    {
			String subType = "";
			if (im.hasProtocol() && im.getProtocol() != null)
			{
			    if (im.getProtocol().indexOf("#") >= 0 && im.getProtocol().substring(im.getProtocol().indexOf("#") + 1).equalsIgnoreCase("SKYPE"))
				subType = "SKYPE";
			    if (im.getProtocol().indexOf("#") >= 0
				    && im.getProtocol().substring(im.getProtocol().indexOf("#") + 1).equalsIgnoreCase("GOOGLE_TALK"))
				subType = "GOOGLE-PLUS";
			    System.out.println("subtype: " + subType);
			}

			if (!StringUtils.isBlank(subType))
			    fields.add(new ContactField("website", im.getAddress(), subType));
			else
			    fields.add(new ContactField("website", im.getAddress(), null));

		    }

		}

	    LinkedHashSet<String> tags = new LinkedHashSet<String>();
	    tags.add("Gmail contact");
	    fields.add(new ContactField("Contact type", "Google", null));

	    agileContact.tags = tags;
	    // title is not given as job description instead displaying name
	    // from google
	    // if (entry.getTitle() != null
	    // && entry.getTitle().getPlainText() != null)
	    // {
	    // System.out.println("title " + entry.getTitle().getPlainText());
	    // fields.add(new ContactField("title", null, entry.getTitle()
	    // .getPlainText()));
	    // }

	    agileContact.properties = fields;

	    System.out.println(agileContact);
	    agileContact.setContactOwner(ownerKey);
	    agileContact.save();
	    counter++;

	    Long created_at = entry.getUpdated().getValue();

	    prefs.last_synced_from_client = created_at > prefs.last_synced_from_client ? created_at : prefs.last_synced_from_client;

	    System.out.println("Contact's ETag: " + entry.getEtag());
	    System.out.println("----------------------------------------");
	}

	// notifies user after adding contacts
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT, String.valueOf(counter));

    }

}
