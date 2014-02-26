package com.thirdparty.google.contacts;

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
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.contacts.GroupMembershipInfo;
import com.google.gdata.data.extensions.Email;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.SYNC_TYPE;
import com.thirdparty.google.deferred.GoogleContactsSyncDeferredTask;
import com.thirdparty.google.groups.GoogleGroupDetails;

public class ContactSyncUtil
{
	public static void syncContacts(ContactPrefs contactPrefs) throws Exception
	{
		if (contactPrefs.sync_type == SYNC_TYPE.CLIENT_TO_AGILE)
			ContactsSyncToAgile.importGoogleContacts(contactPrefs);
		else if (contactPrefs.sync_type == SYNC_TYPE.AGILE_TO_CLIENT)
		{
			ContactsSynctoGoogle.updateContacts(contactPrefs);
		}
		else if (contactPrefs.sync_type == SYNC_TYPE.TWO_WAY)
		{
			ContactsSyncToAgile.importGoogleContacts(contactPrefs);
			ContactsSynctoGoogle.updateContacts(contactPrefs);
		}

	}

	public static void syncContactsDeferredTask(Long id)
	{
		GoogleContactsSyncDeferredTask task = new GoogleContactsSyncDeferredTask(id);

		// Add to queue
		Queue queue = QueueFactory.getQueue("contact-sync-queue");
		queue.add(TaskOptions.Builder.withPayload(task));

	}

	public static ContactEntry createContactEntry(Contact contact, GoogleGroupDetails groupEntry, ContactPrefs prefs)
	{
		List<ContactEntry> entries = ContactsSynctoGoogle.retrieveContactBasedOnQuery(contact, prefs);

		System.out.println("duplicates " + entries);
		ContactEntry createContact = null;
		if (entries.size() > 0)
		{
			// Create a ContactGroupEntry for the create request.
			createContact = entries.get(0);
		}
		else
			createContact = new ContactEntry();

		final String NO_YOMI = null;
		com.google.gdata.data.extensions.Name contactTwoName = new com.google.gdata.data.extensions.Name();

		String firstName = contact.getContactFieldValue(Contact.FIRST_NAME);
		String lastName = contact.getContactFieldValue(Contact.LAST_NAME);

		String fullName = "";
		if (!StringUtils.isEmpty(firstName))
		{
			fullName += firstName;
			contactTwoName.setGivenName(new com.google.gdata.data.extensions.GivenName(firstName, NO_YOMI));
		}

		if (!StringUtils.isEmpty(lastName))
		{
			fullName += " " + lastName;
			contactTwoName.setFamilyName(new com.google.gdata.data.extensions.FamilyName(lastName, NO_YOMI));
		}

		contactTwoName.setFullName(new com.google.gdata.data.extensions.FullName(fullName, NO_YOMI));

		if (contactTwoName.hasGivenName())
			createContact.setName(contactTwoName);

		List<ContactField> emailFields = contact.getContactPropertiesList(Contact.EMAIL);
		List<Email> emails = createContact.getEmailAddresses();
		List<ContactField> newEmails = new ArrayList<ContactField>();

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
				primaryMail.setRel("http://schemas.google.com/g/2005#"
						+ StringUtils.lowerCase(field.subtype.toLowerCase()));
			else
				primaryMail.setRel("http://schemas.google.com/g/2005#work");

			System.out.println(primaryMail);
			createContact.addEmailAddress(primaryMail);
		}

		if (groupEntry != null)
		{
			createContact.addGroupMembershipInfo(new GroupMembershipInfo(false, groupEntry.atomId));
		}

		return createContact;
	}

	public static ContactEntry mergeContacts(ContactEntry entry, Contact contact, ContactPrefs prefs)
	{
		return null;
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

	public static List<Contact> fetchUpdatedContactsToSync(ContactPrefs pref, Integer page, String cursor)
	{
		Long time = pref.last_synched;
		Map<String, Object> queryMap = new HashMap<String, Object>();
		// queryMap.put("updated_time", time);

		if (pref.my_contacts)
			queryMap.put("owner_key", pref.getDomainUser());

		return Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "-updated_time");
	}

	public static List<Contact> fetchNewContactsToSync(ContactPrefs pref, Integer page, String cursor)
	{
		Long time = pref.last_synched;
		Map<String, Object> queryMap = new HashMap<String, Object>();
		// queryMap.put("created_time", time);

		if (pref.my_contacts)
			queryMap.put("owner_key", pref.getDomainUser());

		return Contact.dao.fetchAllByOrder(page, cursor, queryMap, true, false, "-created_time");
	}
}
