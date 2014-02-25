package com.thirdparty.google;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactGroupEntry;
import com.google.gdata.data.contacts.ContactGroupFeed;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.ExtendedProperty;
import com.google.gdata.data.extensions.Im;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.PhoneNumber;
import com.google.gdata.data.extensions.StructuredPostalAddress;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs.Duration;
import com.thirdparty.google.utl.ContactPrefsUtil;

public class GoogleContactToAgileContact
{

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
				if (entry.getOrganizations().get(0).hasOrgName()
						&& entry.getOrganizations().get(0).getOrgName().hasValue())
					fields.add(new ContactField(Contact.COMPANY, entry.getOrganizations().get(0).getOrgName()
							.getValue(), null));

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
							if (im.getProtocol().indexOf("#") >= 0
									&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
											.equalsIgnoreCase("SKYPE"))
								subType = "SKYPE";
							if (im.getProtocol().indexOf("#") >= 0
									&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
											.equalsIgnoreCase("GOOGLE_TALK"))
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
			System.out.println("Contact's ETag: " + entry.getEtag());
			System.out.println("----------------------------------------");
		}

		// notifies user after adding contacts
		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_IMPORT, String.valueOf(counter));

	}

	public static boolean hasGroup(ContactEntry entry, String group)
	{
		if (entry.hasEmailAddresses())
		{
			for (Email email : entry.getEmailAddresses())
			{

				System.out.println(email.getAddress());
			}
		}
		List<GroupMembershipInfo> infos = entry.getGroupMembershipInfos();
		System.out.println(infos.size());
		for (GroupMembershipInfo info : infos)
		{

			System.out.println(info.getHref());
			System.out.println(group);
			if (StringUtils.equals(group, info.getHref()))
				return true;
		}

		return false;
	}

	/**
	 * If access token is expired, calls method in
	 * {@link GoogleContactToAgileContactUtil} to refresh access token and
	 * updates it in db
	 * 
	 * @param contactPrefs
	 *            {@link ContactPrefs}
	 * @throws Exception
	 */
	public static void refreshGoogleContactPrefsandSave(ContactPrefs contactPrefs) throws Exception
	{
		System.out.println("in refresh token of google contact prefs");
		String response = GoogleContactToAgileContactUtil.refreshTokenInGoogle(contactPrefs.refreshToken);

		// Creates HashMap from response JSON string
		HashMap<String, Object> properties = new ObjectMapper().readValue(response,
				new TypeReference<HashMap<String, Object>>()
				{
				});
		System.out.println(properties.toString());

		if (properties.containsKey("error"))
			throw new Exception(String.valueOf(properties.get("error")));
		else if (properties.containsKey("access_token"))
		{
			contactPrefs.token = String.valueOf(properties.get("access_token"));
			contactPrefs.expires = Long.parseLong(String.valueOf(properties.get("expires_in")));
			System.out.println("domiain user key in refresh token method: " + contactPrefs.getDomainUser());
			contactPrefs.save();
		}

	}

	public static void importGoogleContacts(ContactPrefs contactPrefs, Key<DomainUser> key) throws Exception
	{

		String nameSpace = DomainUserUtil.getDomainUser(key.getId()).domain;
		System.out.println("namespace " + nameSpace);

		NamespaceManager.set(nameSpace);
		System.out.println(contactPrefs.token);
		// refreshGoogleContactPrefsandSave(contactPrefs);
		System.out.println(contactPrefs.token);

		// printAllGroups(contactPrefs.token);
		importGoogleContacts(contactPrefs);

	}

	public static void printAllGroups(String token) throws Exception
	{
		// Request the feed
		URL feedUrl = new URL("https://www.google.com/m8/feeds/groups/default/full" + "?access_token=" + token);
		System.out.println(feedUrl);
		System.out.println(token);
		System.out.println("**********************************");
		Query myQuery = new Query(feedUrl);

		ContactsService service = GoogleContactToAgileContactUtil.getService(token);
		ContactGroupFeed resultFeed = service.query(myQuery, ContactGroupFeed.class);

		for (ContactGroupEntry groupEntry : resultFeed.getEntries())
		{
			System.out.println("Atom Id: " + groupEntry.getId());
			System.out.println("Group Name: " + groupEntry.getTitle().getPlainText());
			System.out.println("Last Updated: " + groupEntry.getUpdated());

			System.out.println("Extended Properties:");
			for (ExtendedProperty property : groupEntry.getExtendedProperties())
			{
				if (property.getValue() != null)
				{
					System.out.println("  " + property.getName() + "(value) = " + property.getValue());
				}
				else if (property.getXmlBlob() != null)
				{
					System.out.println("  " + property.getName() + "(xmlBlob) = " + property.getXmlBlob().getBlob());
				}
			}
			System.out.println("Self Link: " + groupEntry.getSelfLink().getHref());
			if (!groupEntry.hasSystemGroup())
			{
				// System groups do not have an edit link
				System.out.println("Edit Link: " + groupEntry.getEditLink().getHref());
				System.out.println("ETag: " + groupEntry.getEtag());
			}
			if (groupEntry.hasSystemGroup())
			{
				System.out.println("System Group Id: " + groupEntry.getSystemGroup().getId());
			}
		}
	}

	public static List<GoogleGroupDetails> getGroups(String token) throws Exception
	{

		if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
			refreshGoogleContactPrefsandSave(contactPrefs);

		ContactsService service = GoogleContactToAgileContactUtil.getService(token);

		// Request the feed
		URL feedUrl = new URL("https://www.google.com/m8/feeds/groups/default/full" + "?access_token=" + token);
		Query myQuery = new Query(feedUrl);

		ContactGroupFeed resultFeed = service.query(myQuery, ContactGroupFeed.class);

		List<GoogleGroupDetails> groupsList = new ArrayList<GoogleGroupDetails>();

		System.out.println("_********************************************************sdfSDFSDF"
				+ resultFeed.getEntries().size());

		for (ContactGroupEntry groupEntry : resultFeed.getEntries())
		{
			System.out.println("here");
			System.out.println(groupEntry);
			GoogleGroupDetails details = new GoogleGroupDetails(groupEntry);
			groupsList.add(details);
		}
		return groupsList;
	}

	public static void importGoogleContacts(ContactPrefs contactPrefs) throws Exception
	{
		if ((contactPrefs.expires - 60000) <= System.currentTimeMillis())
			refreshGoogleContactPrefsandSave(contactPrefs);

		System.out.println("contactprefs token : " + contactPrefs.token);
		List<ContactEntry> entries = GoogleContactToAgileContactUtil.retrieveContacts(contactPrefs);

		saveGoogleContactsInAgile(entries, contactPrefs);
		contactPrefs.last_synched = System.currentTimeMillis();
		contactPrefs.save();

	}

	public static void importGoogleContacts(String namespace, Duration duration)

	{
		String oldNamespace = NamespaceManager.get();
		try
		{

			NamespaceManager.set(namespace);
			List<ContactPrefs> prefs = ContactPrefsUtil.getprefs(duration);

			if (prefs == null || prefs.isEmpty())
				return;
			for (ContactPrefs contactPrefs : prefs)
			{
				try
				{
					importGoogleContacts(contactPrefs);
				}
				catch (Exception e)
				{

					// TODO Auto-generated catch block
					e.printStackTrace();
					continue;
				}
			}
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

	}
}
