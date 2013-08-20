package com.agilecrm.cases.util;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * Provides additional functions for interacting with {@link Case}
 * 
 * @author Chandan
 * 
 */
public class CaseUtil
{
    // dao
    private static ObjectifyGenericDao<Case> dao = new ObjectifyGenericDao<Case>(Case.class);

    /**
     * Gets Case Entity base on id
     * 
     * @param id
     *            - id of Case Entity to fetch
     * @return Case entity
     */
    public static Case getCase(Long id)
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
     * Fetch All Cases
     * 
     * @return Cases as List
     */
    public static List<Case> getCases()
    {
	return dao.fetchAll();
    }

    /**
     * Saves the entity
     * 
     * @param newCase
     *            - entity to save
     * @return - null if save fails
     */

    /**
     * Gets all cases related to a contact, i.e. all cases which have this
     * contact in 'Relate to' field. Necessary for showing in Contact/Company
     * details page
     * 
     * @param id
     *            - id of contact
     * @return list of contacts
     */
    public static List<Case> getCasesByContact(Long id)
    {
	Objectify ofy = ObjectifyService.begin();
	List<Case> casesList = ofy.query(Case.class)
		.filter("related_contacts_key = ", new Key<Contact>(Contact.class, id)).list();
	return casesList;
    }

    /**
     * Deletes a Case entity, specified by id
     * 
     * @param id
     *            - id of case to delete
     */
    public static void delete(Long id)
    {
	dao.deleteKey(Key.create(Case.class, id));
    }

    /**
     * Gets counts of status enums.
     * 
     * @return - map with key as status, value as count of such entities.
     */
    public static JSONObject getStatusCount()
    {
	JSONObject stats = new JSONObject();

	// OPEN status is not stored, count is found by total-<status:close>

	int total = dao.count();
	int close = dao.getCountByProperty("status", "CLOSE");

	try
	{
	    stats.put(Case.Status.OPEN.toString(), total - close);
	    stats.put(Case.Status.CLOSE.toString(), close);

	    return stats;
	}
	catch (Exception ex)
	{
	    return new JSONObject();
	}
    }
}