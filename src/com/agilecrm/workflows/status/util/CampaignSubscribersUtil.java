package com.agilecrm.workflows.status.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.status.CampaignStatus;

public class CampaignSubscribersUtil
{

    // Contact Dao
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

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

	// Iterate over contacts and removes campaignStatus
	for (Contact contact : contactList)
	    removeCampaignStatus(contact, campaignId);

    }

    /**
     * Removes campaignStatus from campaignStatus list of given contact having
     * campaign-id.
     * 
     * @param contact
     *            - Contact that subscribed to campaign
     * @param campaignId
     *            - Campaign Id.
     */
    public static void removeCampaignStatus(Contact contact, String campaignId)
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

    /**
     * Returns campaign subscribers for the given status
     * 
     * @param max
     *            - count
     * @param cursor
     *            - cursor offset.
     * @param status
     *            - CampaignStatus (Active or Done)
     * @return List
     */
    public static List<Contact> getSubscribers(int max, String cursor, String status)
    {
	System.out.println("Obtained cursor is asdfasdfasd " + cursor);
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("campaignStatus.status", status);

	return dao.fetchAll(max, cursor, subscribers);
    }

    /**
     * Returns all campaign subscribers
     * 
     * @param status
     *            - CampaignStatus.
     * @return List
     */
    public static List<Contact> getAllCampaignSubscribers(String status)
    {
	return dao.ofy().query(Contact.class).filter("campaignStatus.status", status).list();
    }

    public static JSONArray insertCampaignId(String campaignId, List<Contact> contacts)
    {
	if (contacts == null)
	    return null;

	JSONArray contactsArr = new JSONArray();

	try
	{

	    for (Contact contact : contacts)
	    {
		ObjectMapper mapper = new ObjectMapper();
		String contactStr = mapper.writeValueAsString(contact);

		JSONObject json = new JSONObject(contactStr).put("campaign_id", campaignId);
		contactsArr.put(json);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Got an exception while inserting campaign-id into contacts list " + e.getMessage());
	}

	return contactsArr;
    }
}
