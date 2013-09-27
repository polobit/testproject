package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.CSVUtil.ImportStatus;
import com.agilecrm.workflows.status.CampaignStatus;
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
	if (StringUtils.isBlank(email))
	    return null;

	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("properties.name", Contact.EMAIL);
	searchMap.put("properties.value", email);

	return dao.getByProperty(searchMap);
    }

    public static boolean isExists(String email)
    {

	if (StringUtils.isBlank(email))
	    return false;

	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("properties.name", Contact.EMAIL);
	searchMap.put("properties.value", email);
	System.out.println(dao.getCountByProperty(searchMap) != 0 ? true : false);
	return dao.getCountByProperty(searchMap) != 0 ? true : false;
    }

    /**
     * Checks if contact have any duplicate email addresses. It iterates though
     * all the email property fields if any of that email exists already. If
     * contact is old, then it fetches old contact check whether duplicate email
     * is newly added in to current contact
     * 
     * @param contact
     * @return
     */
    public static boolean isDuplicateContact(Contact contact)
    {
	// Hold old contact if contact is not new.
	Contact oldContact = null;

	// Iterates though all email fields
	for (ContactField emailField : contact.getContactPropertiesList(Contact.EMAIL))
	{
	    // In case email field value is empty it removes property from
	    // contact and continue

	    if (StringUtils.isBlank(emailField.value) || !ContactUtil.isValidEmail(emailField.value))
	    {
		System.out.println("it is blank");
		System.out.println(contact.properties.contains(emailField));
		contact.properties.remove(emailField);
		continue;
	    }

	    // If email is not available, then it iterates though other emails
	    if (!isExists(emailField.value))
		continue;

	    // If count is not 0 and contact is new, then contact is contact is
	    // duplicate and true is returned
	    if (contact.id == null)
		return true;

	    // If contact is not new, then it checks if email exists in current
	    // contact sent.
	    if (contact.isEmailExists(emailField.value))
	    {
		if (oldContact == null)
		    oldContact = ContactUtil.getContact(contact.id);

		// If email exists in old contact, then it is not considered
		// duplicate contact
		if (oldContact.isEmailExists(emailField.value))
		    continue;
	    }

	    return true;
	}

	return false;
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

    public static Map<String, Object> getMapFromContact(Contact contact)
    {
	try
	{
	    Map<String, Object> mp = new HashMap<String, Object>();
	    mp = new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(contact),
		    new TypeReference<HashMap<String, Object>>()
		    {
		    });
	    return mp;
	}
	catch (Exception e)
	{
	    return new HashMap<String, Object>();
	}
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

    public static void deleteContactsbyListSupressNotification(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	    contact.delete(false);
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
     * Checks if company with given name exists.
     * 
     * @param companyName
     * @return
     */
    public static boolean companyExists(String companyName)
    {

	Map<String, Object> searchFields = new HashMap<String, Object>();
	searchFields.put("properties.name", Contact.NAME);
	searchFields.put("properties.value", companyName);
	System.out.println("contact count" + dao.getCountByProperty(searchFields));

	if (dao.getCountByProperty(searchFields) != 0)
	    return true;

	return false;
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

    public static boolean isValidFields(Contact contact, Map<ImportStatus, Integer> statusMap)
    {
	if (StringUtils.isBlank(contact.getContactFieldValue(contact.FIRST_NAME))
		&& StringUtils.isBlank(contact.getContactFieldValue(contact.LAST_NAME)))
	{
	    CSVUtil.buildCSVImportStatus(statusMap, ImportStatus.NAME_MANDATORY, 1);
	    return false;
	}

	if (isDuplicateContact(contact))
	{
	    CSVUtil.buildCSVImportStatus(statusMap, ImportStatus.DUPLICATE_CONTACT, 1);
	    return false;
	}

	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
	{
	    CSVUtil.buildCSVImportStatus(statusMap, ImportStatus.EMAIL_REQUIRED, 1);
	    return false;
	}

	Iterator<ContactField> iterator = contact.properties.iterator();
	while (iterator.hasNext())
	{
	    ContactField field = iterator.next();
	    if (Contact.WEBSITE.equals(field.name) && !isValidURL(field.value))
		iterator.remove();
	}

	return true;
    }

    public static boolean isValidFields(Contact contact)
    {
	if (StringUtils.isBlank(contact.getContactFieldValue(contact.FIRST_NAME))
		&& StringUtils.isBlank(contact.getContactFieldValue(contact.LAST_NAME)))
	{
	    return false;
	}

	if (isDuplicateContact(contact))
	    return false;

	if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
	    return false;

	Iterator<ContactField> iterator = contact.properties.iterator();
	while (iterator.hasNext())
	{
	    ContactField field = iterator.next();
	    if (Contact.WEBSITE.equals(field.name) && !isValidURL(field.value))
		iterator.remove();
	}

	return true;
    }

    /**
     * Validate hex with regular expression
     * 
     * @param hex
     *            hex for validation
     * @return true valid hex, false invalid hex
     */
    public static boolean isValidEmail(final String hex)
    {

	String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
		+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

	Pattern pattern = Pattern.compile(EMAIL_PATTERN);

	Matcher matcher = pattern.matcher(hex);
	return matcher.matches();

    }

    /**
     * Validates url
     * 
     * @param hex
     * @return
     */
    public static boolean isValidURL(final String hex)
    {
	String URL_PATTERN = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]";
	Pattern pattern = Pattern.compile(URL_PATTERN);

	Matcher matcher = pattern.matcher(hex);
	return matcher.matches();

    }

    /**
     * Returns list of contacts having campaignId in the campaignStatus.
     * 
     * @param campaignId
     *            - Campaign Id
     * @return List<Contact>
     */
    public static List<Contact> getContactsByCampaignId(String campaignId)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("campaignStatus.campaign_id", campaignId);
	return dao.listByProperty(conditionsMap);
    }

    /**
     * Removes campaignStatus from Contact when corresponding workflow is
     * deleted.
     * 
     * @param campaignId
     *            - CampaignId of campaign that gets deleted.
     */
    public static void removeCampaignStatus(String campaignId)
    {

	// Gets list of contacts whose campaignId matches in campaignStatus
	List<Contact> contactList = getContactsByCampaignId(campaignId);

	if (contactList == null)
	    return;

	// Iterate over contacts
	for (Contact contact : contactList)
	{
	    Iterator<CampaignStatus> campaignStatusIterator = contact.campaignStatus.listIterator();

	    // Iterates over campaignStatus list.
	    while (campaignStatusIterator.hasNext())
	    {
		if (!StringUtils.isEmpty(campaignId) && campaignId.equals(campaignStatusIterator.next().campaign_id))
		{
		    campaignStatusIterator.remove();
		    break;
		}
	    }

	    // save changes
	    contact.save();
	}
    }
}
