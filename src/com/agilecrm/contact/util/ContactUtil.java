package com.agilecrm.contact.util;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import au.com.bytecode.opencsv.CSVReader;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.bulk.BulkActionNotifications;
import com.agilecrm.contact.util.bulk.BulkActionNotifications.BulkAction;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
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
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

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
	return dao.ofy().query(Contact.class).filter("tagsWithTime.tag = ", tag).count();
    }

    /**
     * Gets all the contact objects, associated with the given tag
     * 
     * @param tag
     *            name of the tag
     * @return list of contacts
     */
    public static List<Contact> getContactsForTag(String tag, Integer count, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("tagsWithTime.tag", tag);
	if (count != null)
	    return dao.fetchAll(count, cursor, searchMap);

	return dao.listByProperty(searchMap);
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
	if (max != 0)
	    return dao.fetchAll(max, cursor, searchMap);

	return dao.listByProperty(searchMap);
    }

    /**
     * Fetch all contacts, which are related to Company-companyId,i.e.
     * 
     * @param companyId
     *            - id of company whose related contacts we wanna fetch
     * @param max
     *            - max number of results
     * @param cursor
     *            - objectify cursor to continue where we left off last time
     * @return List of Contacts(PERSON) which have this company in
     *         Company/Organization Field
     */
    public static List<Contact> getAllContactsOfCompany(String companyId, int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.PERSON);
	searchMap.put("contact_company_key", new Key<Contact>(Contact.class, Long.valueOf(companyId)));
	if (max != 0)
	    return dao.fetchAll(max, cursor, searchMap);

	return dao.listByProperty(searchMap);
    }

    public static List<Key<Contact>> getAllContactKey()
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.PERSON);
	return dao.listKeysByProperty(searchMap);
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

    public static boolean isExists(String email)
    {
	if (email == null)
	    return false;

	return dao.getCountByProperty("properties.value = ", email) != 0 ? true : false;
    }

    /**
     * Get Count of Contacts by Email - should be used in most of the cases
     * unless the real entity is required
     * 
     * @param email
     *            email value to get contact count with this email
     * @return number of contacts with the given email
     */
    public static int searchContactCountByEmail(String email)
    {
	return dao.ofy().query(Contact.class).filter("properties.name = ", Contact.EMAIL)
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
		contactKeys.add(new Key<Contact>(Contact.class, Long.parseLong(contactsJSONArray.getString(i))));
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

    public static List<Contact> getContactsBulk(List<Long> contactsArray)
    {
	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();

	for (Long id : contactsArray)
	{
	    contactKeys.add(new Key<Contact>(Contact.class, id));
	}
	System.out.println(dao.fetchAllByKeys(contactKeys));

	return dao.fetchAllByKeys(contactKeys);
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
    public static void addTagsToContactsBulk(JSONArray contactsJSONArray, String[] tags_array)
    {
	List<Contact> contacts_list = ContactUtil.getContactsBulk(contactsJSONArray);

	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return;
	}

	for (Contact contact : contacts_list)
	{

	    contact.addTags(tags_array);
	}

	dao.putAll(contacts_list);
    }

    public static void addTagsToContactsBulk(List<Contact> contacts_list, String[] tags_array)
    {
	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return;
	}

	for (Contact contact : contacts_list)
	{

	    contact.addTags(tags_array);
	}

	dao.putAll(contacts_list);
    }

    /**
     * Converts CSV data in to JSON array, this method converts first 10 line of
     * csv data as sample information, which is sent back to client to show
     * uploaded sample details
     * 
     * @param csv
     * @param duplicateFieldName
     *            Duplicate field name
     * @return
     * @throws Exception
     */
    public static Hashtable convertCSVToJSONArrayPartially(String csv, String duplicateFieldName) throws Exception
    {

	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	// Get Header Liner
	String[] headers = reader.readNext();

	if (headers == null)
	{
	    System.out.println("Empty List");
	    new Exception("Empty List");
	}

	// If heading are left blank, the data will be lost as headings will be
	// replaced in map.
	for (int i = 0; i < headers.length; i++)
	{
	    // If header is blank then index is set as a header
	    if (StringUtils.isBlank(headers[i]))
		headers[i] = String.valueOf(i);
	}

	// CSV Json Array. Used JSONArray to maintain order of the fields, as
	// normal JSON order is unpredictable
	org.codehaus.jettison.json.JSONArray csvArray = new org.codehaus.jettison.json.JSONArray();

	// HashTable of keys to check duplicates - we will store all keys into
	// this hashtable and if there are any - we will exclude them
	Vector<String> keys = new Vector();
	Vector<String> duplicates = new Vector();

	String[] csvValues;

	// Reads first 10 lines of csv data, and converts it into JSON object
	// with heading as its repective keys
	for (int i = 0; i < 10 && (csvValues = reader.readNext()) != null; i++)
	{
	    Map<String, String> csvMap = new LinkedHashMap<String, String>();

	    System.out.println(csvValues.length);
	    // System.out.println(csvValues);
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

		System.out.println(headers[j] + ", " + csvValues[j]);
		// Put field value respective to its heading, into JSON object
		csvMap.put(headers[j], csvValues[j]);
	    }

	    // Have to use jettison JSON as net JSON is changing the order of
	    // the elements
	    if (!isDuplicate)
		csvArray.put(new org.codehaus.jettison.json.JSONObject(csvMap));

	}

	Hashtable resultHashtable = new Hashtable();

	System.out.println(csvArray);
	System.out.println(csvArray);
	resultHashtable.put("result", csvArray);

	System.out.println(resultHashtable);
	// Put warning
	if (duplicateFieldName != null && duplicates.size() > 0)
	{
	    resultHashtable.put("warning", "Duplicate Values (" + duplicates.size() + ") were not imported "
		    + duplicates);
	}

	System.out.println("Converted csv " + csv + " to " + resultHashtable);
	return resultHashtable;

    }

    /**
     * Creates contacts from CSV string using a contact prototype built from
     * import page. It takes owner id to sent contact owner explicitly instead
     * of using session manager, as there is a chance of getting null in
     * backends.
     * 
     * Contact is saved only if there is email exists and it is a valid email
     * 
     * @param csv
     * @param contact
     * @param ownerId
     * @throws IOException
     */
    public static void createContactsFromCSV(String csv, Contact contact, String ownerId) throws IOException
    {

	CSVReader reader = new CSVReader(new StringReader(csv.trim()));
	// StringWriter s = new StringWriter();
	// CSVWriter writer = new CSVWriter(new BufferedWriter(s));
	// writer.

	List<String[]> contacts = reader.readAll();

	contact.type = Contact.Type.PERSON;
	List<ContactField> properties = contact.properties;

	// Creates domain user key, which is set as a contact owner
	Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(ownerId));

	// Counters to count number of contacts saved contacts
	int savedContacts = 0;
	for (String[] csvValues : contacts)
	{
	    System.out.println(csvValues.length);
	    System.out.println(csvValues);

	    contact.id = null;
	    contact.created_time = 0l;

	    // Sets owner of contact explicitly. If owner is not set, contact
	    // prepersist
	    // tries to read it from session, and session is not shared with
	    // backends
	    contact.setContactOwner(ownerKey);

	    contact.properties = new ArrayList<ContactField>();
	    for (int j = 0; j < csvValues.length; j++)
	    {
		System.out.println(csvValues[j]);

		ContactField field = properties.get(j);

		// To avoid saving ignore field value/ and avoid fields with
		// empty values
		if (field == null || field.name == null || StringUtils.isEmpty(field.value))
		    continue;

		// This is hardcoding but found no way to know how to get tags
		// from the CSV file
		if (field.name.equals("tags"))
		{
		    contact.tags.add(csvValues[j]);
		    System.out.println("field name " + field.name);
		    continue;
		}

		field.value = csvValues[j];

		contact.properties.add(field);
	    }

	    System.out.println(contact.getContactFieldValue(Contact.EMAIL));

	    // If contact has no email address or duplicate email address,
	    // contact is not saved
	    if (StringUtils.isEmpty(contact.getContactFieldValue(Contact.EMAIL))
		    || ContactUtil.isExists(contact.getContactFieldValue(Contact.EMAIL)))
		continue;

	    // If contact has an invalid email address contact is not saved
	    if (!ContactUtil.validateEmail(contact.getContactFieldValue(Contact.EMAIL)))
		continue;

	    contact.save();

	    // Increase counter on each contact save
	    savedContacts++;
	}

	// Send notification after contacts save complete
	BulkActionNotifications.publishconfirmation(BulkAction.CONTACTS_CSV_IMPORT, String.valueOf(savedContacts));

	System.out.println("contact save completed");
    }

    /**
     * Returns contact firstname and lastname from contact-id.
     * 
     * @param contactId
     *            - Contact Id.
     * @return Contact Name.
     */
    public static String getContactNameFromId(Long contactId)
    {
	Contact contact = getContact(contactId);

	if (contact == null)
	    return "?";

	String contactName = contact.getContactFieldValue(Contact.FIRST_NAME) + " "
		+ contact.getContactFieldValue(Contact.LAST_NAME);

	return contactName;
    }

    public static List<Contact> getRecentContacts(String page_size)
    {
	return dao.ofy().query(Contact.class).filter("viewed.viewer_id", SessionManager.get().getDomainId())
		.order("-viewed.viewed_time").limit(Integer.parseInt(page_size)).list();
    }

    /**
     * Returns total contacts count that are subscribed to a campaign having
     * given status.
     * 
     * @param campaignId
     *            - CampaignId.
     * @param status
     *            - Active or Done.
     * @return int
     */
    public static int getSubscribersCount(String campaignId, String status)
    {
	return dao.ofy().query(Contact.class).filter("campaignStatus.status", status).count();
    }

    public static void deleteContactsbyList(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	    contact.delete();
    }

    /**
     * Returns Key of a company by its name.
     * 
     * @param name
     *            - Company Name , show match exactly.
     * @return Key<Contact> - Corresponding DataStore key
     */
    public static Key<Contact> getCompanyByName(String companyName)
    {
	return dao.ofy().query(Contact.class).filter("type", "COMPANY").filter("properties.name", "name")
		.filter("properties.value", companyName).getKey();

    }

    /**
     * Creates owner key with the new owner id and changes owner key of the each
     * contact in the bulk and saves the contact.
     * 
     * @param contactsJSONArray
     *            JSONArray object containing contact ids
     * @param new_owner
     *            new owner (DomainUser) id
     */
    public static void changeOwnerToContactsBulk(JSONArray contactsJSONArray, String new_owner)
    {
	List<Contact> contacts_list = getContactsBulk(contactsJSONArray);
	if (contacts_list.size() == 0)
	{
	    return;
	}

	Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(new_owner));

	for (Contact contact : contacts_list)
	{
	    contact.setContactOwner(newOwnerKey);
	}

	Contact.dao.putAll(contacts_list);

    }

    public static void changeOwnerToContactsBulk(List<Contact> contacts_list, String new_owner)
    {
	if (contacts_list.size() == 0)
	{
	    return;
	}

	Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(new_owner));

	for (Contact contact : contacts_list)
	{
	    contact.setContactOwner(newOwnerKey);

	}
	Contact.dao.putAll(contacts_list);

    }

    /**
     * Validate hex with regular expression
     * 
     * @param hex
     *            hex for validation
     * @return true valid hex, false invalid hex
     */
    public static boolean validateEmail(final String hex)
    {

	String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
		+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

	Pattern pattern = Pattern.compile(EMAIL_PATTERN);

	Matcher matcher = pattern.matcher(hex);
	return matcher.matches();

    }
}
