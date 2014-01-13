package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.googlecode.objectify.Key;

/**
 * <code>CSVUtil</code> is a utility class, which converts the given data of a
 * csv file into an array of json objects (each row of the file as a json
 * object).
 * <p>
 * Corresponding headers are taken as keys for the values. Also validates the
 * duplicates in the given data.
 * </p>
 * 
 * @author
 * 
 */
public class CSVUtil
{
	public static enum ImportStatus
	{
		TOTAL, SAVED_CONTACTS, DUPLICATE_CONTACT, NAME_MANDATORY, EMAIL_REQUIRED, INVALID_EMAIL, TOTAL_FAILED
	}

	/**
	 * Returns CSV headings from stream object. Reads first line
	 * 
	 * @param stream
	 * @return
	 * @throws Exception
	 */
	public static List<String> getCSVHeadings(InputStream stream) throws Exception
	{
		// Reads blob data line by line upto first 10 line of file
		LineIterator iterator = IOUtils.lineIterator(stream, "UTF-8");

		if (!iterator.hasNext())
			throw new Exception("Invalid CSV file");

		// Reads the first line
		String csv = iterator.nextLine();

		System.out.println(csv);

		// Creates csv reader from headings
		CSVReader reader = new CSVReader(new StringReader(csv.trim()));

		// Get Header Liner
		String[] headers = reader.readNext();
		if (headers == null)
		{
			System.out.println("Empty List");
			throw new Exception("Empty CSV");
		}

		// Creates list of headings
		List<String> headersList = new ArrayList<String>(Arrays.asList(headers));

		return headersList;

	}

	/**
	 * Creates contacts from CSV string using a contact prototype built from
	 * import page. It takes owner id to sent contact owner explicitly instead
	 * of using session manager, as there is a chance of getting null in
	 * backends.
	 * 
	 * Contact is saved only if there is email exists and it is a valid email
	 * 
	 * @param blobStream
	 * @param contact
	 * @param ownerId
	 * @throws IOException
	 */
	public static void createContactsFromCSV(InputStream blobStream, Contact contact, String ownerId)
			throws IOException
	{

		// Reads blob data line by line upto first 10 line of file
		Reader csvStream = new InputStreamReader(blobStream, "UTF-8");

		System.out.println(contact);
		CSVReader reader = new CSVReader(csvStream);

		List<String[]> contacts = reader.readAll();

		if (contacts.isEmpty())
			return;

		String[] headings = contacts.remove(0);

		contact.type = Contact.Type.PERSON;

		LinkedHashSet<String> tags = new LinkedHashSet<String>();

		tags.addAll(contact.tags);

		List<ContactField> properties = contact.properties;

		// Creates domain user key, which is set as a contact owner
		Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

		AgileUser user = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey.getId());
		DomainUser domainUser = DomainUserUtil.getDomainUser(ownerKey.getId());

		System.out.println(contacts.size());

		// Counters to count number of contacts saved contacts
		int savedContacts = 0;
		List<String> emails = new ArrayList<String>();
		Map<ImportStatus, Integer> status = new HashMap<ImportStatus, Integer>();

		for (String[] csvValues : contacts)
		{
			Set<Integer> notes_positions = new TreeSet<Integer>();

			Contact tempContact = new Contact();
			tempContact.tags = (LinkedHashSet<String>) contact.tags.clone();
			tempContact.properties = contact.properties;

			// Sets owner of contact explicitly. If owner is not set,
			// contact
			// prepersist
			// tries to read it from session, and session is not shared with
			// backends
			tempContact.setContactOwner(ownerKey);

			tempContact.properties = new ArrayList<ContactField>();

			for (int j = 0; j < csvValues.length; j++)
			{

				if (StringUtils.isBlank(csvValues[j]))
					continue;

				csvValues[j] = csvValues[j].trim();

				ContactField field = properties.get(j);

				// This is hardcoding but found no way to get
				// tags
				// from the CSV file
				if (field == null)
				{
					continue;
				}

				if ("tags".equals(field.name))
				{
					// Multiple tags are supported. Multiple tags are added
					// split at , or ;
					String[] tagsArray = csvValues[j].split("[,;]+");

					for (String tag : tagsArray)
						tempContact.tags.add(tag);
					continue;
				}
				if (Contact.ADDRESS.equals(field.name))
				{
					ContactField addressField = tempContact.getContactField(contact.ADDRESS);

					JSONObject addressJSON = new JSONObject();

					try
					{
						if (addressField != null && addressField.value != null)
						{
							addressJSON = new JSONObject(addressField.value);
							addressJSON.put(field.value, csvValues[j]);
							addressField.value = addressJSON.toString();
						}
						else
						{
							addressJSON.put(field.value, csvValues[j]);
							tempContact.properties.add(new ContactField(Contact.ADDRESS, addressJSON.toString(),
									field.type.toString()));
						}

					}
					catch (JSONException e)
					{
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					continue;
				}
				if ("note".equals(field.name))
				{
					notes_positions.add(j);
					continue;
				}

				// To avoid saving ignore field value/ and avoid fields with
				// empty values
				if (field.name == null || StringUtils.isEmpty(field.value))
					continue;

				field.value = csvValues[j];

				tempContact.properties.add(field);

				System.out.println("**********************" + field.name + " *********************");
				System.out.println("******************" + field.value + "******************");
			}

			System.out.println(contact.properties);

			if (!ContactUtil.isValidFields(tempContact, status))
				continue;

			// If contact is duplicate, it fetches old contact and updates data.
			if (ContactUtil.isDuplicateContact(tempContact))
			{
				tempContact = ContactUtil.mergeContactFields(tempContact);
			}

			try
			{

				tempContact.save();

				// Creates notes, set CSV heading as subject and value as
				// description.
				for (Integer i : notes_positions)
				{
					Note note = new Note();
					note.subject = headings[i];
					note.description = csvValues[i];
					note.addRelatedContacts(String.valueOf(tempContact.id));

					note.setOwner(new Key<AgileUser>(AgileUser.class, tempContact.id));
					note.save();
				}
			}
			catch (Exception e)
			{
				System.out.println("exception while saving contacts");
				e.printStackTrace();
			}
			// Increase counter on each contact save
			savedContacts++;
		}

		calculateTotalFailedContacts(status);

		buildCSVImportStatus(status, ImportStatus.TOTAL, contacts.size());
		buildCSVImportStatus(status, ImportStatus.SAVED_CONTACTS, savedContacts);

		SendMail.sendMail(domainUser.email, SendMail.CSV_IMPORT_NOTIFICATION_SUBJECT, SendMail.CSV_IMPORT_NOTIFICATION,
				new Object[] { domainUser, status });
		// Send notification after contacts save complete
		BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedContacts));

		System.out.println("contact save completed");
	}

	public static void buildCSVImportStatus(Map<ImportStatus, Integer> statusMap, ImportStatus status, Integer count)
	{
		if (statusMap.containsKey(status))
		{
			statusMap.put(status, statusMap.get(status) + count);
			statusMap.get(status);
			return;
		}

		statusMap.put(status, count);
	}

	public static void calculateTotalFailedContacts(Map<ImportStatus, Integer> status)
	{
		int total = 0;
		for (int i : status.values())
		{
			System.out.println(i);
			total += i;
		}
		System.out.println(total);
		status.put(ImportStatus.TOTAL_FAILED, total);
	}
}