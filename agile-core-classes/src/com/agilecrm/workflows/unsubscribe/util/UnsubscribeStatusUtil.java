package com.agilecrm.workflows.unsubscribe.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;

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

		contact.update();
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

	/**
	 * Resubscribes contact if unsubscribed from all campaigns
	 * 
	 * @param contact - Unsubscribed contact
	 * @param campaignId - campaign id
	 */
	public static void resubscribeContact(Contact contact, Long campaignId)
	{
		Workflow workflow = WorkflowUtil.getWorkflow(campaignId);

		// If no contact return
		if (contact == null)
			return;

		String tag = null, contactId = contact.id.toString(), cid = campaignId.toString();

		if (workflow != null)
			tag = workflow.unsubscribe.tag;

		// Remove unsubscribe tag
		if (StringUtils.isNotBlank(tag))
			contact.removeTags(AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', tag).split(","));

		// Remove unsubscribe status
		UnsubscribeStatusUtil.removeUnsubscribeStatus(contact, cid);

		// Remove Unsubscribe logs
		LogUtil.deleteSQLLogs(cid, contactId, LogType.UNSUBSCRIBED);

		// Remove status if null or change it to Done
		if (workflow == null)
			CampaignStatusUtil.removeCampaignStatus(contact, cid);
		else
			CampaignStatusUtil.setStatusOfCampaign(contactId, cid, workflow.name, Status.DONE);
	}
	
	public static void resubscribeContactFromAll(Contact contact, String workflowId)
	{
		if(StringUtils.isBlank(workflowId))
			return;
		
		Set<String> workflowIds = EmailUtil.getStringTokenSet(workflowId, ",");
		
		for(String id : workflowIds)
			resubscribeContact(contact, Long.valueOf(id));
	}
}
