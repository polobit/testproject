/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.sync.service.TwoWaySyncService;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.client.Query;
import com.google.gdata.client.authn.oauth.OAuthException;
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
import com.thirdparty.google.GoogleServiceUtil;

/**
 * @author jitendra
 * 
 */
public class GoogleSyncImpl extends TwoWaySyncService
{
    private ContactsService contactService;

    @Override
    public Contact wrapContactToAgileSchema(Object object)
    {
	if (!(object instanceof ContactEntry))
	    return null;

	ContactEntry googleContactEntry = (ContactEntry) object;
	// checks if google contact has email and skips it
	if ((!googleContactEntry.hasEmailAddresses() || googleContactEntry.getEmailAddresses().size() == 0)
		|| (googleContactEntry.getEmailAddresses().size() == 1 && googleContactEntry.getEmailAddresses().get(0)
			.getAddress() == null))
	    return null;

	List<ContactField> fields = new ArrayList<ContactField>();

	Contact agileContact = new Contact();
	boolean isDuplicateContact = false;
	String duplicateEmail = "";
	for (Email email : googleContactEntry.getEmailAddresses())
	    if (email.getAddress() != null)
	    {
		// checks for duplicate emails and skips contact
		if (ContactUtil.isExists(email.getAddress()))
		{
		    duplicateEmail = email.getAddress();
		    isDuplicateContact = true;
		}

		String subType = getSubtypeFromGoogleContactsRel(email.getRel());

		fields.add(new ContactField(Contact.EMAIL, email.getAddress(), subType));
	    }

	if (googleContactEntry.hasName())
	{
	    Name name = googleContactEntry.getName();

	    if (name.hasGivenName() && name.hasFamilyName())
	    {
		if (name.hasFamilyName())
		    fields.add(new ContactField(Contact.LAST_NAME, name.getFamilyName().getValue(), null));

		if (name.hasGivenName())
		    fields.add(new ContactField(Contact.FIRST_NAME, name.getGivenName().getValue(), null));
	    }
	    else if (name.hasFullName())
		fields.add(new ContactField(Contact.FIRST_NAME, name.getFullName().getValue(), null));

	}

	if (googleContactEntry.hasOrganizations())
	    if (googleContactEntry.getOrganizations().get(0).hasOrgName()
		    && googleContactEntry.getOrganizations().get(0).getOrgName().hasValue())
		fields.add(new ContactField(Contact.COMPANY, googleContactEntry.getOrganizations().get(0).getOrgName()
			.getValue(), null));

	if (googleContactEntry.hasPhoneNumbers())
	    for (PhoneNumber phone : googleContactEntry.getPhoneNumbers())
		if (phone.getPhoneNumber() != null)
		{
		    String subType = getSubtypeFromGoogleContactsRel(phone.getRel());
		    fields.add(new ContactField("phone", phone.getPhoneNumber(), subType));
		}

	if (googleContactEntry.hasStructuredPostalAddresses())
	    for (StructuredPostalAddress address : googleContactEntry.getStructuredPostalAddresses())
	    {

		JSONObject json = new JSONObject();
		String addr = "";
		if (address.hasStreet())
		    addr = addr + address.getStreet().getValue();
		if (address.hasSubregion())
		    addr = addr + ", " + address.getSubregion().getValue();
		if (address.hasRegion())
		    addr = addr + ", " + address.getRegion().getValue();

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

	if (googleContactEntry.hasImAddresses())
	    for (Im im : googleContactEntry.getImAddresses())
	    {
		if (im.hasAddress())
		{
		    String subType = "";
		    if (im.hasProtocol() && im.getProtocol() != null)
		    {
			if (im.getProtocol().indexOf("#") >= 0
				&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
					.equalsIgnoreCase("SKYPE"))
			    subType = "SKYPE";
			if (im.getProtocol().indexOf("#") >= 0
				&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
					.equalsIgnoreCase("GOOGLE_TALK"))
			    subType = "GOOGLE-PLUS";
		    }

		    if (!StringUtils.isBlank(subType))
			fields.add(new ContactField("website", im.getAddress(), subType));
		    else
			fields.add(new ContactField("website", im.getAddress(), null));

		}

	    }

	LinkedHashSet<String> tags = new LinkedHashSet<String>();
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

	return agileContact;
    }

    private String getSubtypeFromGoogleContactsRel(String rel)
    {
	if (StringUtils.isEmpty(rel))
	    return "work";

	String type = rel.split("#")[1];

	if (StringUtils.isEmpty(type))
	    return "work";

	if (type.equalsIgnoreCase("work"))
	    return "work";

	if (type.equalsIgnoreCase("home"))
	    return "home";

	if (type.equalsIgnoreCase("mobile"))
	    return type;

	if (type.equalsIgnoreCase("main"))
	    return type;

	if (type.equalsIgnoreCase("work_fax"))
	    return "work fax";

	if (type.equalsIgnoreCase("home_fax"))
	    return "home fax";

	return "work";

    }

    public void syncContactFromClient()
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
	    return;
	}
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
	myQuery.setMaxResults(MAX_SYNC_LIMIT);

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

	System.out.println("total results from google " + resultFeed.getEntries().size());
	saveContactsInAgile(resultFeed.getEntries());
    }

    private void saveContactsInAgile(List<ContactEntry> entries)
    {
	for (ContactEntry entry : entries)
	{

	    wrapContactToAgileSchemaAndSave(entry);
	}
	isLimitExceeded();
    }

    @Override
    public List<Contact> fetchNewContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public List<Contact> fetchUpdatedContactsFromAgile()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public void uploadContactsToClient(List<Contact> contacts)
    {
	// TODO Auto-generated method stub

    }

}
