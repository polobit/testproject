package com.thirdparty.google.contacts;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.google.gdata.client.Query;
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

	public static List<ContactEntry> retrieveContactBasedOnQuery(Contact contact, ContactPrefs prefs)
	{
		List<ContactField> emails = contact.getContactPropertiesList(Contact.EMAIL);
		String query_text = "";
		for (ContactField email : emails)
		{
			query_text = " " + email.value;
		}

		// query_text = query_text + " " +
		// contact.getContactFieldValue(Contact.FIRST_NAME) + " "
		// + contact.getContactFieldValue(Contact.LAST_NAME);
		try
		{

			return ContactsSynctoGoogle.retrieveContactBasedOnQuery(query_text, prefs);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<ContactEntry>();
		}
	}

	public static List<ContactEntry> retrieveContactBasedOnQuery(String query_text, ContactPrefs prefs)
			throws Exception
	{
		ContactsService service = GoogleServiceUtil.getService(prefs.token);
		URL feelURL = new URL(GoogleServiceUtil.GOOGLE_CONTACTS_BASE_URL + "contacts/default/full?access_token="
				+ prefs.token);

		Query query = new Query(feelURL);
		System.out.println(prefs.sync_to_group);
		query.setStringCustomParameter("group", prefs.sync_to_group);
		query.setStringCustomParameter("q", query_text);
		query.setMaxResults(1);

		ContactFeed feed = service.getFeed(query, ContactFeed.class);

		return feed.getEntries();

	}

	public static void updateContacts(ContactPrefs prefs)
	{
		try
		{
			synCreatedContacts(prefs, 500, null);

		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		try
		{
			synUpdatedContacts(prefs, 500, null);
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static void synUpdatedContacts(ContactPrefs prefs, Integer page, String cursor)
	{
		int MAX_FETCH_SIZE = 5000;
		int fetched = 0;
		List<Contact> contacts_list = ContactSyncUtil.fetchUpdatedContactsToSync(prefs, page, cursor);

		System.out.println(contacts_list);
		if (contacts_list.isEmpty())
			return;

		String currentCursor = null;
		String previousCursor = null;
		do
		{
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
		} while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor)
				&& fetched <= MAX_FETCH_SIZE);
	}

	public static void synCreatedContacts(ContactPrefs prefs, Integer page, String cursor)
	{
		int MAX_FETCH_SIZE = 5000;
		int fetched = 0;
		List<Contact> contacts_list = ContactSyncUtil.fetchNewContactsToSync(prefs, page, cursor);

		System.out.println("fetch newly created contacts :" + contacts_list);

		if (contacts_list.isEmpty())
			return;

		String currentCursor = null;
		String previousCursor = null;
		do
		{
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
				contacts_list = ContactSyncUtil.fetchNewContactsToSync(prefs, page, cursor);

				currentCursor = contacts_list.size() > 0 ? contacts_list.get(contacts_list.size() - 1).cursor : null;
				continue;
			}

			break;
		} while (contacts_list.size() > 0 && !StringUtils.equals(previousCursor, currentCursor)
				&& fetched <= MAX_FETCH_SIZE);
	}

	public static void updateContacts(List<Contact> contacts, ContactPrefs prefs) throws Exception
	{
		String token = prefs.token;

		// Feed that hold s all the batch request entries.
		ContactFeed requestFeed = new ContactFeed();

		// Feed that hold s all the batch request entries.
		ContactFeed updateFeed = new ContactFeed();

		ContactsService contactService = GoogleServiceUtil.getService(token);

		GoogleGroupDetails group = ContactGroupUtil.createGroup(prefs, "Agile");

		int insertRequestCount = 0;
		int updateRequestCount = 0;
		ContactFeed responseFeed1 = null;
		ContactFeed responseFeed = null;
		// contacts = new ArrayList<Contact>();
		for (int i = 0; i < contacts.size(); i++)
		{
			Contact contact = contacts.get(i);

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

			if (insertRequestCount >= 90 || i >= contacts.size() - 1)
			{
				// Submit the batch request to the server.
				responseFeed = contactService.batch(new URL(
						"https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token),
						requestFeed);
				insertRequestCount = 0;
				requestFeed = new ContactFeed();
			}

			if (updateRequestCount >= 90 || i >= contacts.size() - 1)
			{
				responseFeed1 = contactService.batch(new URL(
						"https://www.google.com/m8/feeds/contacts/default/full/batch?" + "access_token=" + token),
						updateFeed);
				updateRequestCount = 0;
				updateFeed = new ContactFeed();
			}

		}

		// Check the status of each operation.
		for (ContactEntry entry : responseFeed.getEntries())
		{
			String batchId = BatchUtils.getBatchId(entry);
			com.google.gdata.data.batch.BatchStatus status = com.google.gdata.data.batch.BatchUtils
					.getBatchStatus(entry);
			System.out.println(batchId + ": " + status.getCode() + " (" + status.getReason() + ")");
		}
	}
}
