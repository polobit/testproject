package com.agilecrm.contact.util;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

/**
 * <code>ContactUtil</code> is a utility class to process the data of contact
 * class, it processes when fetching the data and saving bulk amount of contacts
 * to contact database.
 * <p>
 * This utility class includes methods needs to return contacts based on id,
 * tags, email and etc..Also includes methods which perform bulk operations on
 * contacts.
 * </p>
 * 
 * @author
 * 
 */
public class ContactUtil
{
    // Dao
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(
	    Contact.class);

    /**
     * Gets the number of contacts (count) present in the database with given
     * tag name
     * 
     * @param tag
     *            name of the tag
     * @return count of the contacts
     */
    public static int getContactsCountForTag(String tag)
    {
	return dao.ofy().query(Contact.class).filter("tags", tag).count();
    }

    /**
     * Gets all the contact objects, associated with the given tag
     * 
     * @param tag
     *            name of the tag
     * @return list of contacts
     */
    public static List<Contact> getContactsForTag(String tag)
    {
	return dao.listByProperty("tags", tag);
    }

    /**
     * Fetches a contact based on its id
     * 
     * @param id
     *            unique id of a contact
     * @return {@link Contact} related to the id
     */
    public static Contact getContact(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all the contacts at once irrespective of their type
     * (person/company)
     * 
     * @return List of contacts
     */
    public static List<Contact> getAllContacts()
    {
	return dao.fetchAll();
    }

    /**
     * Fetches all the contacts but not all at once, step by step based on max
     * parameter value (When scroll bar is scrolled down from client side, "max"
     * no of contacts will be fetched, when only cursor is not null)
     * 
     * @param max
     *            number of contacts to be fetched at once
     * @param cursor
     *            Activates infiniScroll in client side
     * @return list of contacts
     */
    public static List<Contact> getAll(int max, String cursor)
    {
	return dao.fetchAll(max, cursor);
    }

    /**
     * Fetches all the contacts of type company only (step by step)
     * 
     * @param max
     *            number of contacts (of type company) to be fetched at once
     * @param cursor
     *            Activates infiniScroll at client side
     * @return list of contacts (company)
     */
    public static List<Contact> getAllCompanies(int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.COMPANY);
	return dao.fetchAll(max, cursor, searchMap);
    }

    /**
     * Fetches all the contacts of type person only (step by step)
     * 
     * @param max
     *            number of contacts (of type person) to be fetched at once
     * @param cursor
     *            Activates infiniScroll at client side
     * @return list of contacts (person)
     */
    public static List<Contact> getAllContacts(int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.PERSON);
	return dao.fetchAll(max, cursor, searchMap);
    }

    /**
     * Gets a contact based on its email
     * 
     * @param email
     *            email value to get a contact
     * @return {@Contact} related to an email
     */
    public static Contact searchContactByEmail(String email)
    {
	if (email == null)
	    return null;

	return dao.getByProperty("properties.value = ", email);
    }

    /**
     * Get Count of Contacts by Email - should be used in most of the cases
     * unless the real entity is required
     * 
     * @param email
     *            email value to get contact count with this emil
     * @return number of contacts with the given email
     */
    public static int searchContactCountByEmail(String email)
    {
	return dao.ofy().query(Contact.class)
		.filter("properties.name = ", Contact.EMAIL)
		.filter("properties.value = ", email).count();
    }

    /**
     * Gets list of contacts based on array of ids
     * 
     * @param contactsJSONArray
     *            JSONArray object of contact ids
     * @return List of contacts
     */
    public static List<Contact> getContactsBulk(JSONArray contactsJSONArray)
    {
	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();

	for (int i = 0; i < contactsJSONArray.length(); i++)
	{
	    try
	    {
		contactKeys.add(new Key<Contact>(Contact.class, Long
			.parseLong(contactsJSONArray.getString(i))));
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(dao.ofy().get(contactKeys).values());
	return contacts_list;
    }

    /**
     * Adds each tag in tags_array to each contact in contacts bulk and saves
     * each contact
     * 
     * @param contactsJSONArray
     *            JSONArray object containing contact ids
     * @param tags_array
     *            array of tags
     */
    public static void addTagsToContactsBulk(JSONArray contactsJSONArray,
	    String[] tags_array)
    {
	List<Contact> contacts_list = ContactUtil
		.getContactsBulk(contactsJSONArray);

	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return;
	}

	for (Contact contact : contacts_list)
	{

	    for (String tag : tags_array)
	    {
		contact.tags.add(tag);

	    }

	    contact.save();
	}
    }

    /**
     * Converts CSV data in to JSON array, this method converts firt 10 line of
     * csv data as sample information, which is sent back to client to show
     * uploaded sample details
     * 
     * @param csv
     * @param duplicateFieldName
     *            Duplicate field name
     * @return
     * @throws Exception
     */
    public static Hashtable convertCSVToJSONArrayPartially(String csv,
	    String duplicateFieldName) throws Exception
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

	// HashTable of keys to check duplicates - we will store all keys into
	// this hashtable and if there are any - we will exclude them
	Vector<String> keys = new Vector();
	Vector<String> duplicates = new Vector();

	String[] csvValues;

	// Reads first 10 lines of csv data, and converts it into JSON object
	// with heading as its repective keys
	for (int i = 0; i < 10 && (csvValues = reader.readNext()) != null; i++)
	{
	    JSONObject csvJSONObject = new JSONObject();

	    boolean isDuplicate = false;
	    for (int j = 0; j < csvValues.length; j++)
	    {
		// Check if the header is same as duplicate name
		if (duplicateFieldName != null
			&& headers[j].equalsIgnoreCase(duplicateFieldName))
		{
		    System.out.println("If already present " + headers[j] + " "
			    + csvValues[j]);

		    // Check if is already present in already imported items
		    if (keys.contains(csvValues[j]))
		    {
			duplicates.add(csvValues[j]);
			isDuplicate = true;
			break;
		    }

		    keys.add(csvValues[j]);
		}

		// Put field value respective to its heading, into JSON object
		csvJSONObject.put(headers[j], csvValues[j]);
	    }

	    if (!isDuplicate)
		csvJSONArray.put(csvJSONObject);
	}

	Hashtable resultHashtable = new Hashtable();
	resultHashtable.put("result", csvJSONArray);

	// Put warning
	if (duplicateFieldName != null && duplicates.size() > 0)
	{
	    resultHashtable.put("warning",
		    "Duplicate Values (" + duplicates.size()
			    + ") were not imported " + duplicates);
	}

	System.out.println("Converted csv " + csv + " to " + resultHashtable);
	return resultHashtable;

    }

    public static void createContactsFromCSV(String csv, Contact contact,
	    String ownerId) throws IOException
    {

	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	List<String[]> contacts = reader.readAll();

	contact.type = Contact.Type.PERSON;
	List<ContactField> properties = contact.properties;

	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class,
		Long.parseLong(ownerId));

	for (String[] csvValues : contacts)
	{
	    contact.id = null;
	    contact.created_time = 0l;
	    contact.setDomainUser(ownerKey);

	    for (int j = 0; j < csvValues.length; j++)
	    {
		properties.get(j).value = csvValues[j];
	    }
	    contact.save();
	}
    }
}
