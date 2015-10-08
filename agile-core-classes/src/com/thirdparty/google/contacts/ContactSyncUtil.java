package com.thirdparty.google.contacts;

import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.client.Query;
import com.google.gdata.client.contacts.ContactsService;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.ContactFeed;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.City;
import com.google.gdata.data.extensions.Country;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.FamilyName;
import com.google.gdata.data.extensions.FullName;
import com.google.gdata.data.extensions.GivenName;
import com.google.gdata.data.extensions.Im;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.OrgTitle;
import com.google.gdata.data.extensions.Organization;
import com.google.gdata.data.extensions.PhoneNumber;
import com.google.gdata.data.extensions.PostCode;
import com.google.gdata.data.extensions.Region;
import com.google.gdata.data.extensions.Street;
import com.google.gdata.data.extensions.StructuredPostalAddress;
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
		// Refreshes token
		GoogleServiceUtil.refreshGoogleContactPrefsandSave(contactPrefs);

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
			// contactPrefs.last_synced_from_client =
			// System.currentTimeMillis();
			ContactsSynctoGoogle.updateContacts(contactPrefs);
			// contactPrefs.last_synced_to_client = System.currentTimeMillis();
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
		ContactField googleContactfield = contact.getContactFieldByName("Contact type");

		// Does not create contact if it is already imported form google
		if (googleContactfield != null && "Google".equals(googleContactfield.value))
		{
			return null;
		}

		// Retrieves contact based on contact emails
		List<ContactEntry> entries = retrieveContactBasedOnEmailFromGoogle(contact, prefs);
		// List<ContactEntry> entries = new ArrayList<ContactEntry>();

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

		addEmailsToGoogleContact(contact, createContact);
		addPhoneNumbersToGoogleContact(contact, createContact);
		addOrganizationDetailsToGoogleContact(contact, createContact);
		addAddressToGoogleContact(contact, createContact);

		// If group is defined then group id is added which save contact in
		// specified group.
		if (groupEntry != null)
		{
			createContact.addGroupMembershipInfo(new GroupMembershipInfo(false, groupEntry.atomId));
		}

		return createContact;
	}

	public static void addEmailsToGoogleContact(Contact contact, ContactEntry googleContactEntry)
	{
		List<ContactField> emailFields = contact.getContactPropertiesList(Contact.EMAIL);
		List<ContactField> newEmails = new ArrayList<ContactField>();

		boolean isNewContact = StringUtils.isEmpty(googleContactEntry.getId());

		if (!isNewContact)
		{
			// Sets Emails to contact
			for (ContactField field : emailFields)
			{
				boolean isNew = true;
				for (Email email : googleContactEntry.getEmailAddresses())
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
		}
		else
		{
			newEmails = emailFields;
		}

		for (ContactField field : newEmails)
		{
			Email primaryMail = new Email();
			primaryMail.setAddress(field.value);
			if (!StringUtils.isEmpty(field.subtype))
				primaryMail.setRel("http://schemas.google.com/g/2005#"
						+ StringUtils.lowerCase(field.subtype.toLowerCase()));
			else
				primaryMail.setRel("http://schemas.google.com/g/2005#work");

			googleContactEntry.addEmailAddress(primaryMail);
		}
	}

	public static void addPhoneNumbersToGoogleContact(Contact contact, ContactEntry googleContactEntry)
	{
		List<ContactField> phoneNumberList = contact.getContactPropertiesList(Contact.PHONE);
		List<ContactField> newPhoneNumbersToAdd = new ArrayList<ContactField>();

		boolean isNewContact = StringUtils.isEmpty(googleContactEntry.getId());

		if (!isNewContact)
		{
			// Sets Emails to contact
			for (ContactField field : phoneNumberList)
			{
				boolean isNew = true;
				for (PhoneNumber phoneNumber : googleContactEntry.getPhoneNumbers())
				{
					if (StringUtils.equals(phoneNumber.getPhoneNumber(), field.value))
					{
						isNew = false;
						break;
					}
				}
				if (isNew)
				{
					newPhoneNumbersToAdd.add(field);
				}
			}
		}
		else
		{
			newPhoneNumbersToAdd = phoneNumberList;
		}

		for (ContactField field : newPhoneNumbersToAdd)
		{
			PhoneNumber primaryPhone = new PhoneNumber();
			primaryPhone.setPhoneNumber(field.value);
			if (!StringUtils.isEmpty(field.subtype))
				primaryPhone.setRel("http://schemas.google.com/g/2005#"
						+ StringUtils.lowerCase(field.subtype.toLowerCase()));
			else
				primaryPhone.setRel("http://schemas.google.com/g/2005#work");

			googleContactEntry.addPhoneNumber(primaryPhone);
		}
	}

	/**
	 * This method is responsible for adding organization details to a Google
	 * contact.
	 * 
	 * @param contact
	 * @param createContact
	 */
	public static void addOrganizationDetailsToGoogleContact(Contact contact, ContactEntry createContact)
	{
		try
		{
			// Adds Organization details to contact
			ContactField companyField = contact.getContactField(Contact.COMPANY);
			if (companyField != null && !StringUtils.isEmpty(companyField.value))
			{
				List<Organization> organizations = createContact.getOrganizations();
				Organization company = new Organization(null, false, "http://schemas.google.com/g/2005#work");
				com.google.gdata.data.extensions.OrgName name = new com.google.gdata.data.extensions.OrgName(
						companyField.value);
				company.setOrgName(name);
				ContactField jobTitleField = contact.getContactField(Contact.TITLE);
				if (jobTitleField != null && StringUtils.isNotBlank(jobTitleField.value))
				{
					company.setOrgTitle(new OrgTitle(jobTitleField.value));
				}
				if (organizations != null & organizations.size() > 0)
				{
					if (organizations.size() == 1)
						organizations.set(0, company);// updating the existing
														// organization
					else
						createContact.addOrganization(company);// creating new
																// organization for
																// a contact
				}
				else
					createContact.addOrganization(company);
			}
		}
		catch(Exception e)
		{
			System.out.println("Error occured while adding organization details "+e.getMessage());
		}
	}

	/**
	 * Adds Structural postal address into Google contact
	 * 
	 * @param contact
	 * @param googleContactEntry
	 */
	public static void addAddressToGoogleContact(Contact contact, ContactEntry googleContactEntry)
	{
		try
		{
			// Adds Address for contact
			ContactField addressField = contact.getContactField(Contact.ADDRESS);
			if (addressField != null && !StringUtils.isEmpty(addressField.value))
			{
				StructuredPostalAddress structuredPostalAddress = new StructuredPostalAddress();
				try
				{
					List<StructuredPostalAddress> postalAddresses = googleContactEntry.getStructuredPostalAddresses();
					org.json.JSONObject addressJSON = new org.json.JSONObject(addressField.value);
					if (addressJSON.has("address") && StringUtils.isNotBlank(addressJSON.getString("address")))
						structuredPostalAddress.setStreet(new Street(addressJSON.getString("address")));

					if (addressJSON.has("city") && StringUtils.isNotBlank(addressJSON.getString("city")))
						structuredPostalAddress.setCity(new City(addressJSON.getString("city")));

					if (addressJSON.has("country") && StringUtils.isNotBlank(addressJSON.getString("country")))
						structuredPostalAddress.setCountry(new Country(null, addressJSON.getString("country")));

					if (addressJSON.has("state") && StringUtils.isNotBlank(addressJSON.getString("state")))
						structuredPostalAddress.setRegion(new Region(addressJSON.getString("state")));

					if (addressJSON.has("zip") && StringUtils.isNotBlank(addressJSON.getString("zip")))
						structuredPostalAddress.setPostcode(new PostCode(addressJSON.getString("zip")));

					String addressSubType = addressField.subtype;

					if (StringUtils.isNotBlank(addressSubType))
					{
						if (addressSubType.equalsIgnoreCase("HOME"))
							structuredPostalAddress.setRel("http://schemas.google.com/g/2005#"
									+ addressSubType.toLowerCase());
						else if (addressSubType.equalsIgnoreCase("WORK"))
							structuredPostalAddress.setRel("http://schemas.google.com/g/2005#"
									+ addressSubType.toLowerCase());
						else
							structuredPostalAddress.setLabel("Postal");
					}
					else
						structuredPostalAddress.setLabel("Postal");

					if (postalAddresses != null & postalAddresses.size() > 0)
						postalAddresses.set(0, structuredPostalAddress);
					else
						googleContactEntry.addStructuredPostalAddress(structuredPostalAddress);
				}
				catch (org.json.JSONException e)
				{
					e.printStackTrace();
				}
			}
		}
		catch (Exception e)
		{
			System.out.println("Error occured in adding address to google contact" + e.getMessage());
		}
	}

	/**
	 * Retrieves contacts from google based on emails in the contact. Used to
	 * check if contact to be update is new or existing one in google
	 * 
	 * @param contact
	 * @param prefs
	 * @return
	 */
	public static List<ContactEntry> retrieveContactBasedOnEmailFromGoogle(Contact contact, ContactPrefs prefs)
	{
		List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
		String query_text = "";

		if (emails == null || emails.isEmpty())
			return new ArrayList<ContactEntry>();

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
	public static List<ContactEntry> retrieveContactBasedOnQuery(String query_text, ContactPrefs prefs)
			throws Exception
	{
		ContactsService service = GoogleServiceUtil.getService(prefs.token);
		URL feelURL = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?access_token="
				+ prefs.token);

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

		Long time = pref.last_synced_updated_contacts_to_client;
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("updated_time > ", time);

		if (pref.my_contacts)
			queryMap.put("owner_key", pref.getDomainUser());

		queryMap.put("type", Type.PERSON);

		return Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "updated_time");
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
		queryMap.put("created_time > ", time);

		if (pref.my_contacts)
			queryMap.put("owner_key", pref.getDomainUser());

		queryMap.put("type", Type.PERSON);

		System.out.println(queryMap);
		System.out.println("contacts count :" + Contact.dao.getCountByProperty(queryMap));
		List<Contact> contacts = Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "created_time");

		System.out.println("contacts available" + contacts.size());

		return contacts;
	}

	public static Contact mergeContact(ContactEntry entry, Contact contact, ContactPrefs prefs)
	{
		if (prefs.conflict.equals(null))
		{
			return CopyFromAgileContact(entry, contact);

		}
		return CopyFromGoogleContact(entry, contact);
	}

	public static Contact createContactInAgile(ContactEntry googleContactEntry)
	{
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

		if (isDuplicateContact)
		{
			Contact existingAgileContact = ContactUtil.searchContactByEmail(duplicateEmail);
			agileContact.id = existingAgileContact.id;
			if (!agileContact.isDocumentUpdateRequired(existingAgileContact))
				return null;

			agileContact = mergeContacts(agileContact, existingAgileContact, null);
		}

		return agileContact;
	}

	public static String getSubtypeFromGoogleContactsRel(String rel)
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

	public static Contact mergeContacts(Contact newContact, Contact oldContact, ContactPrefs prefs)
	{
		return ContactUtil.mergeContactFeilds(newContact, oldContact);
	}

	public static Contact CopyFromGoogleContact(ContactEntry entry, Contact contact)
	{

		return null;
	}

	public static Contact CopyFromAgileContact(ContactEntry entry, Contact contact)
	{

		return null;
	}

	public static List<ContactEntry> convertToGoogleContactsFormat(List<Contact> contacts, ContactPrefs prefs)
	{

		if (contacts == null)
			return new ArrayList<ContactEntry>();

		try
		{
			return retrieveContactBasedOnQuery(constructEmailsQueryForGoogle(contacts), prefs);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<ContactEntry>();
		}
	}

	public static String constructEmailsQueryForGoogle(List<Contact> contacts)
	{
		String email = "";
		for (Contact contact : contacts.subList(0, 40))
		{
			List<ContactField> emailsFields = contact.getContactPropertiesList(Contact.EMAIL);

			for (ContactField field : emailsFields)
			{
				email = email + " " + field.value;
			}
		}
		System.out.println(email);
		return email;
	}
}
