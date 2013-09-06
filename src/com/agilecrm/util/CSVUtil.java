package com.agilecrm.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.Vector;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
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
    /**
     * Converts csv file data into json objects and returns HashMap() of Array
     * (result) and Error (duplicates). Validates the duplicates based on given
     * "duplicateFieldName".
     * 
     * @param csv
     * @param duplicateFieldName
     * @return hashtable of json objects
     * @throws Exception
     */
    public static Hashtable convertCSVToJSONArray2(String csv, String duplicateFieldName) throws Exception
    {
	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	// Get Header Liner
	String[] headers = reader.readNext();
	if (headers == null)
	{
	    System.out.println("Empty List");
	    new Exception("Empty List");
	}

	// CSV Json Array
	JSONArray csvJSONArray = new JSONArray();

	/*
	 * HashTable of keys to check duplicates - we will store all keys into
	 * this hashtable and if there are any duplicates we will exclude them
	 */
	Vector<String> keys = new Vector();
	Vector<String> duplicates = new Vector();

	String[] csvValues;
	while ((csvValues = reader.readNext()) != null)
	{
	    JSONObject csvJSONObject = new JSONObject();

	    boolean isDuplicate = false;
	    for (int j = 0; j < csvValues.length; j++)
	    {
		// Check if the header is same as duplicate name
		if (duplicateFieldName != null && headers[j].equalsIgnoreCase(duplicateFieldName))
		{
		    System.out.println("If already present " + headers[j] + " " + csvValues[j]);

		    // Check if is already present in already imported items
		    if (keys.contains(csvValues[j]))
		    {
			duplicates.add(csvValues[j]);
			isDuplicate = true;
			break;
		    }

		    keys.add(csvValues[j]);
		}

		csvJSONObject.put(headers[j], csvValues[j]);
	    }

	    if (!isDuplicate)
		csvJSONArray.put(csvJSONObject);
	}

	Hashtable resultHashtable = new Hashtable();
	resultHashtable.put("result", csvJSONArray);

	// Put warning with the duplicate objects
	if (duplicateFieldName != null && duplicates.size() > 0)
	{
	    resultHashtable.put("warning", "Duplicate Values (" + duplicates.size() + ") were not imported "
		    + duplicates);
	}

	System.out.println("Converted csv " + csv + " to " + resultHashtable);
	return resultHashtable;

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

	System.out.println(contacts.size());

	// Counters to count number of contacts saved contacts
	int savedContacts = 0;
	List<String> emails = new ArrayList<String>();

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

		System.out.println(properties.get(j));
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
		if ("note".equals(field.name))
		{
		    System.out.println("note");
		    notes_positions.add(j);
		    continue;
		}

		// To avoid saving ignore field value/ and avoid fields with
		// empty values
		if (field.name == null || StringUtils.isEmpty(field.value))
		    continue;

		field.value = csvValues[j];

		tempContact.properties.add(field);
	    }

	    if (!ContactUtil.isValidFields(tempContact))
		continue;

	    try
	    {
		tempContact.save();
		System.out.println(notes_positions);

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

	System.out.println(savedContacts);
	// Send notification after contacts save complete
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedContacts));

	System.out.println("contact save completed");
    }
}