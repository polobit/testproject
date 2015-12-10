package com.agilecrm.cases.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

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
	try
	{
	    return dao.fetchAll();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Case> getCases(int max, String cursor, String fieldName)
    {

	if (max != 0)
	{
	    return dao.fetchAllByOrder(max, cursor, null, true, false, fieldName);
	}
	return getCases();
    }

    /**
     * Returns cases based on contactId or case status or owner-id or by all
     * conditions
     * 
     * @param contactId
     *            - related contact of a case.
     * @param status
     *            - Case status(OPEN/CLOSE)
     * @param ownerId
     *            - Case owner
     * @return List
     */
    public static List<Case> getCases(Long contactId, Case.Status status, Long ownerId)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	if (contactId != null)
	    conditionsMap.put("related_contacts_key", new Key<Contact>(Contact.class, contactId));

	if (status != null)
	    conditionsMap.put("status", status);

	if (ownerId != null)
	    conditionsMap.put("owner_key", new Key<DomainUser>(DomainUser.class, ownerId));

	return dao.listByProperty(conditionsMap);
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

    /**
     * Returns cases based on contactId conditions
     * 
     * @param contactId
     *            - related contact of a case.
     */
    public static List<Case> getCases(Long contactId)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();

	if (contactId != null)
	    conditionsMap.put("related_contacts_key", new Key<Contact>(Contact.class, contactId));

	return dao.listByProperty(conditionsMap);
    }
}