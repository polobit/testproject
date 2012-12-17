package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;

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

	return dao.getByProperty("properties.name = ", Contact.EMAIL);

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
}
