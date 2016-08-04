package com.agilecrm.workflows.status.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.status.CampaignStatus.Status;

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
     * Returns list of contacts based on cursor.
     * 
     * @param max
     *            - limit per request
     * @param cursor
     *            - Cursor
     * @param campaignId
     *            - workflow id.
     * @return
     */
    public static List<Contact> getContactsByCampaignId(int max, String cursor, String campaignId)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("campaignStatus.campaign_id", campaignId);

	return dao.fetchAll(max, cursor, subscribers, true, false);
    }
    
    /**
     * Returns list of contacts count based on cursor.
     * 
     * @param max
     *            - limit per request
     * @param cursor
     *            - Cursor
     * @param campaignId
     *            - workflow id.
     * @return
     */
    public static Integer getContactsCountByCampaignId(String campaignId)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("campaignStatus.campaign_id", campaignId);

	return dao.getCountByProperty(subscribers);
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
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("campaignStatus.status", status);

	return dao.fetchAll(max, cursor, subscribers, true, false);
    }
    
    /**
     * Returns campaign subscribers count for the given status
     * 
     * @param max
     *            - count
     * @param cursor
     *            - cursor offset.
     * @param status
     *            - CampaignStatus (Active or Done)
     * @return List
     */
    public static Integer getSubscribersCount(String status)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("campaignStatus.status", status);

	return dao.getCountByProperty(subscribers);
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

    /**
     * Returns bounced contacts list
     * 
     * 
     * @param max
     *            - count
     * @param cursor
     *            - cursor offset.
     * @param emailBounceType
     *            - HardBounce or SoftBounce
     * @return List
     */
    public static List<Contact> getBoucedContactsByCampaignId(int max, String cursor, EmailBounceType emailBounceType,
	    String campaignId)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("emailBounceStatus.emailBounceType", emailBounceType);
	subscribers.put("emailBounceStatus.campaign_id", campaignId);
	subscribers.put("campaignStatus.campaign_id", campaignId);

	return dao.fetchAll(max, cursor, subscribers, true, false);
    }
    
    /**
     * Returns bounced contacts count
     * 
     * 
     * @param max
     *            - count
     * @param cursor
     *            - cursor offset.
     * @param emailBounceType
     *            - HardBounce or SoftBounce
     * @return List
     */
    public static Integer getBoucedContactsCountByCampaignId(EmailBounceType emailBounceType,
	    String campaignId)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("emailBounceStatus.emailBounceType", emailBounceType);
	subscribers.put("emailBounceStatus.campaign_id", campaignId);
	subscribers.put("campaignStatus.campaign_id", campaignId);

	return dao.getCountByProperty(subscribers);
    }
    


    /**
     * Returns contacts count based on Campaign status
     * 
     * @param emailBounceType
     *            - Hard or Soft
     * @param startTime
     *            - start time
     * @param endTime
     *            - end time
     * @return int value
     */
    public static int getContactCountByCampaignStats(String campaignStatus, Long startTime)
    {
	HashMap<String, Object> properties = new HashMap<String, Object>();
	properties.put("campaignStatus.status", campaignStatus);
	properties.put("campaignStatus.start_time >=", startTime);

	return dao.getCountByProperty(properties);
    }

	


}
