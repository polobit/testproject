package com.agilecrm.workflows.status.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.bulkaction.deferred.CampaignStatusUpdateDeferredTask;
import com.agilecrm.bulkaction.deferred.CampaignSubscriberDeferredTask;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.UserInfo;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.QueryResultIterable;
import com.google.appengine.api.datastore.QueryResultIterator;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>CampaignStatusUtil</code> is the utility class for CampaignStatus. It
 * sets CampaignStatus based on campaign-id. When Start node of workflow runs,
 * campaign-status is set to ACTIVE. At the end of campaign, campaign-status is
 * set to DONE from {@link TaskletUtil}.
 * 
 */
public class CampaignStatusUtil
{
	/**
	 * Sets status of campaign. Start Node of campaign call this method each
	 * time it gets executed, to set status ACTIVE. When campaign completes,
	 * TaskletUtil set DONE status.
	 * 
	 * @param contactId
	 *            - Contact id.
	 * @param campaignId
	 *            - Campaign id.
	 * @param status
	 *            - Campaign Status.
	 */
	public static void setStatusOfCampaign(String contactId, String campaignId, String campaignName, Status status)
	{
		setStatusOfCampaignWithName(contactId, campaignId, campaignName, status);
	}

	/**
	 * Sets status of campaign. Start Node of campaign call this method each
	 * time it gets executed, to set status ACTIVE. When campaign completes,
	 * TaskletUtil set DONE status. Returns name of the campaign
	 * 
	 * @param contactId
	 *            - Contact id.
	 * @param campaignId
	 *            - Campaign id.
	 * @param status
	 *            - Campaign Status.
	 */
	public static String setStatusOfCampaignWithName(String contactId, String campaignId, String campaignName,
			Status status)
	{

		if (StringUtils.isBlank(contactId) || StringUtils.isBlank(campaignId))
			return null;

		// If campaign name is null or empty, get name
		if (StringUtils.isEmpty(campaignName))
			campaignName = WorkflowUtil.getCampaignName(campaignId);

		try
		{
			Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

			if (contact == null)
				return null;

			// ACTIVE status
			if (status.equals(Status.ACTIVE))
			{
				setActiveCampaignStatus(contact, campaignId, campaignName);
				return campaignName;
			}

			// DONE or REMOVED
			setEndCampaignStatus(contact, campaignId, campaignName, status);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.print("Exception occured while setting campaign-status " + e.getMessage());
		}
		return campaignName;

	}

	/**
	 * Sets campaign-status of contact to ACTIVE, when contact subscribes to
	 * campaign. The active status is set in Start node of campaign.
	 * <p>
	 * Here we have two conditions: 1. When contact subscribes to campaign for
	 * the first-time. 2. When contact subscribes once again to the same
	 * campaign.
	 * </p>
	 * 
	 * @param contact
	 *            - Contact subscribed to campaign.
	 * @param campaignId
	 *            - CampaignId of active campaign.
	 */
	public static void setActiveCampaignStatus(Contact contact, String campaignId, String campaignName)
	{
		boolean isNew = true;

		long statusTime = System.currentTimeMillis() / 1000;

		List<CampaignStatus> campaignStatusList = contact.campaignStatus;

		// if subscribed once again, update campaign status.
		for (CampaignStatus campaignStatus : campaignStatusList)
		{

			// if null
			if (campaignStatus == null)
				continue;

			if (campaignId.equals(campaignStatus.campaign_id))
			{
				campaignStatus.start_time = statusTime;
				campaignStatus.end_time = 0L;
				campaignStatus.status = campaignId + "-" + Status.ACTIVE;
				campaignStatus.campaign_name = campaignName;

				// False to avoid new CampaignStatus to be created
				isNew = false;
				break;
			}
		}

		// if subscribed first-time, add campaignStatus to the list.
		if (isNew)
		{
			CampaignStatus campaignStatus = new CampaignStatus(statusTime, 0, campaignId, campaignName, (campaignId
					+ "-" + Status.ACTIVE));
			contact.campaignStatus.add(campaignStatus);
		}

		saveContact(contact);
	}

	/**
	 * Sets campaign-status of contact to DONE or REMOVED, when campaign
	 * completed or cancelled for that contact respectively. Campaign status
	 * done is set when campaign came to hang-up node which is set in
	 * TaskletUtil. REMOVED is set when active contacts are removed from
	 * campaign.
	 * 
	 * @param contact
	 *            - Contact subscribed to campaign.
	 * @param campaignId
	 *            - CampaignId of done campaign.
	 */
	private static void setEndCampaignStatus(Contact contact, String campaignId, String campaignName, Status status)
	{
		long statusTime = System.currentTimeMillis() / 1000;

		List<CampaignStatus> campaignStatusList = contact.campaignStatus;

		// Sets end-time and updates status from ACTIVE to given status
		for (CampaignStatus campaignStatus : campaignStatusList)
		{
			if (campaignStatus == null)
				continue;

			if (campaignId.equals(campaignStatus.campaign_id))
			{
				campaignStatus.campaign_name = campaignName;
				campaignStatus.end_time = statusTime;
				campaignStatus.status = (campaignStatus.campaign_id) + "-" + status;
				break;
			}
		}

		saveContact(contact);
	}

	public static boolean isActive(Contact contact, Long workflowId)
	{
		if (workflowId == null)
			return false;

		String currentWorkflowId = workflowId.toString();

		String activeStatus = currentWorkflowId + "-" + Status.ACTIVE;
		CampaignStatus currentcampaignStatus = new CampaignStatus(0l, 0l, currentWorkflowId, "", activeStatus);

		return isActive(contact, currentcampaignStatus);
	}

	public static boolean isActive(Contact contact, CampaignStatus currentcampaignStatus)
	{
		return contact.campaignStatus.contains(currentcampaignStatus);
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

		Query<Contact> query = Contact.dao.ofy().query(Contact.class)
				.filter("campaignStatus.campaign_id", campaignId);

		QueryResultIterator<Contact> iterator = query.iterator();

		while (iterator.hasNext())
		{
			Contact contact = iterator.next();

			removeCampaignStatus(contact, campaignId);
		}
			
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
		saveContact(contact);
	}

	/**
	 * Updates updated time and saves contact
	 * 
	 * @param contact
	 *            - Contact object with updated campaign statuses
	 */
	private static void saveContact(Contact contact)
	{
		try
		{
			contact.updated_time = System.currentTimeMillis() / 1000;
			contact.update();
		}
		catch(Exception e)
		{
			System.err.println("Exception occured while updating campaign Status of contact..." + e.getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * Removes all scheduled subscribers from Cron and change status from Active
	 * to Removed
	 * 
	 * @param campaignId
	 *            - given workflow id
	 * 
	 * @return Active Subscribers count to be converted
	 */
	public static int removeBulkSubscribersFromCampaign(String campaignId)
	{
		// Removes Cron entities
		CronUtil.removeTask(campaignId, null);

		return setRemoveCampaignStatus(campaignId);
	}

	/**
	 * Changes campaign status of Active subscribers from Active to Remove
	 * 
	 * @param campaignId
	 *            - Workflow id
	 * 
	 * @return subscribers count
	 */
	private static int setRemoveCampaignStatus(String campaignId)
	{
		int count = 0;
		
		try
		{
			String campaignName = WorkflowUtil.getCampaignName(campaignId);

			Query<Contact> query = Contact.dao.ofy().query(Contact.class)
					.filter("campaignStatus.status", campaignId + "-" + CampaignStatus.Status.ACTIVE);
			
			count = query.count();
			
//			String cursor = null;
			int limit = 200;
 
			Set<Key<Contact>> contactKeys = null;
			
				contactKeys = new HashSet<Key<Contact>>();
				int index = 0;
//				query = query.limit(limit);
				
//				if(cursor != null)
//					query = query.startCursor(Cursor.fromWebSafeString(cursor));
			
				QueryResultIterator<Key<Contact>> iterator = query.fetchKeys().iterator();
			
				while (iterator.hasNext())
				{
					contactKeys.add(iterator.next());
					
					++index;
					
					if(index == limit)
					{
//						System.out.println("Index " + index + " limit " + limit);
//						cursor = iterator.getCursor().toWebSafeString();
						
						CampaignStatusUpdateDeferredTask task = new CampaignStatusUpdateDeferredTask(Long.parseLong(campaignId), campaignName,
								NamespaceManager.get(), contactKeys);

						// Add to queue
						Queue queue = QueueFactory.getQueue(AgileQueues.WORKFLOWS_RELATED_QUEUE);
						queue.add(TaskOptions.Builder.withPayload(task));
						
						System.out.println("Index size is..."+index);
						contactKeys.clear();
						index = 0;
					}
				}
				
				if(contactKeys.size() > 0)
				{

					CampaignStatusUpdateDeferredTask task = new CampaignStatusUpdateDeferredTask(Long.parseLong(campaignId), campaignName,
							NamespaceManager.get(), contactKeys);

					// Add to queue
					Queue queue = QueueFactory.getQueue(AgileQueues.WORKFLOWS_RELATED_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(task));
					
					System.out.println("Index size is..."+index);
				}
				
			return count;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while converting campaign status from Active..." + e.getMessage());
			return count;
		}
	}
	
	public static void setRemoveStatus(List<Contact> contacts, String campaignId, String campaignName)
	{
		for(Contact contact: contacts)
			setEndCampaignStatus(contact, campaignId, campaignName, Status.REMOVED);
	}

}