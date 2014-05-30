package com.agilecrm.workflows.unsubscribe.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;

public class UnsubscribeStatusUtil
{

    // Contact Dao
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

    public static void removeUnsubscribeStatus(Contact contact, String campaignId)
    {
	List<UnsubscribeStatus> statusList = contact.unsubscribeStatus;

	Iterator<UnsubscribeStatus> itr = statusList.listIterator();

	while (itr.hasNext())
	{
	    if (!StringUtils.isBlank(campaignId) && campaignId.equals(itr.next().campaign_id))
	    {
		itr.remove();
		break;
	    }
	}

	contact.save();
    }

    public static void addUnsubscribeLog(String campaignId, String contactId, String message)
    {
	// Add log
	LogUtil.addLogToSQL(campaignId, contactId, message, LogType.UNSUBSCRIBED.toString());
    }

    /**
     * Returns list of contacts having campaignId in the campaignStatus.
     * 
     * @param campaignId
     *            - Campaign Id
     * @return List<Contact>
     */
    public static List<Contact> getUnsubscribeContactsByCampaignId(String campaignId)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("unsubscribeStatus.campaign_id", campaignId);
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
    public static List<Contact> getUnsubscribeContactsByCampaignId(int max, String cursor, String campaignId)
    {
	Map<String, Object> subscribers = new HashMap<String, Object>();
	subscribers.put("unsubscribeStatus.campaign_id", campaignId);

	return dao.fetchAll(max, cursor, subscribers, true, false);
    }
}
