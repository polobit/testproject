package com.agilecrm.workflows.status.util;

import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.EmailSubscriptionDeferredTask.SubscriptionType;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.triggers.util.EmailTrackingTriggerUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class UnsubscribeEmailUtil
{

	public static void unsubscribeCampaignEmail(Long contactId, String campaignIds, UnsubscribeType type)
	{

		Contact contact = ContactUtil.getContact(contactId);

		Set<String> campaignIdSet = EmailUtil.getStringTokenSet(campaignIds, ",");
		Workflow workflow = null;

		for (String campaignId : campaignIdSet)
		{
			try
			{
				workflow = WorkflowUtil.getWorkflow(Long.valueOf(campaignId));

				if (workflow == null)
					continue;

				UnsubscribeEmailUtil.unsubscribeCampaignEmail(contact, workflow, type);
			}
			catch (Exception e)
			{
				System.err.println("Exception occured while unsubscribing campaign email..." + e.getMessage());
				continue;
			}
		}
	}

	public static void unsubscribeCampaignEmail(Contact contact, Workflow workflow, UnsubscribeType type)
	{

		boolean isNew = true;

		String campaignId = String.valueOf(workflow.id);
		String contactId = String.valueOf(contact.id);
		String tag = workflow.unsubscribe.tag;
		String campaignName = workflow.name;

		setUnsubscribeStatus(contact, type, isNew, campaignId);

		// Add unsubscribe tag
		if (!StringUtils.isBlank(tag))
			contact.addTags(AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', tag).split(","));

		// Add Removed status to contact
		CampaignStatusUtil.setStatusOfCampaign(contact.id.toString(), campaignId, campaignName, Status.REMOVED);

		// Delete Related Crons.
		CronUtil.removeTask(campaignId, contact.id.toString());

		String msg = "Unsubscribed from all campaigns";

		if (type.equals(UnsubscribeType.CURRENT))
			msg = "Unsubscribed from campaign " + campaignName;

		// Add unsubscribe log
		UnsubscribeStatusUtil.addUnsubscribeLog(campaignId, contactId, msg);

		// Trigger Unsubscribe
		EmailTrackingTriggerUtil.executeTrigger(contactId, campaignId, null, Type.UNSUBSCRIBED);
	}

	private static void setUnsubscribeStatus(Contact contact, UnsubscribeType type, boolean isNew, String campaignId)
	{
		// Update older one having same campaign id
		for (UnsubscribeStatus uns : contact.unsubscribeStatus)
		{
			if (uns == null)
				continue;

			if (campaignId.equals(uns.campaign_id))
			{
				uns.unsubscribeType = type;
				isNew = false;
				break;
			}
		}

		// First time unsubscribe
		if (isNew)
		{
			UnsubscribeStatus unsubscribeStatus = new UnsubscribeStatus(campaignId, type);
			contact.unsubscribeStatus.add(unsubscribeStatus);
		}

		contact.update();
	}

	public static void emailSubscriptionByQueue(Long contactId, String campaignIds, UnsubscribeType type, SubscriptionType subType)
	{
		EmailSubscriptionDeferredTask task = new EmailSubscriptionDeferredTask(contactId, campaignIds, type, subType);

		Queue queue = QueueFactory.getQueue(AgileQueues.CAMPAIGN_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));
	}
	
}
