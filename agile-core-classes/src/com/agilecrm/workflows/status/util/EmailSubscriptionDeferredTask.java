package com.agilecrm.workflows.status.util;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class EmailSubscriptionDeferredTask implements DeferredTask
{

	private static final long serialVersionUID = 1L;
	public enum SubscriptionType {
		UNSUBSCRIBE, RESUBSCRIBE
	}
	
	Long contactId = 0L;
	String campaignIds = null;
	UnsubscribeType type = UnsubscribeType.CURRENT;
	SubscriptionType subscriptionType = SubscriptionType.UNSUBSCRIBE;
	
	public EmailSubscriptionDeferredTask(Long contactId, String campaignIds, UnsubscribeType type, SubscriptionType subscriptionType)
	{
		this.contactId = contactId;
		this.campaignIds = campaignIds;
		this.type = type;
		this.subscriptionType = subscriptionType;
	}
	
	@Override
	public void run()
	{
		if(subscriptionType.equals(SubscriptionType.RESUBSCRIBE))
		{
			UnsubscribeStatusUtil.resubscribeContactFromAll(ContactUtil.getContact(contactId), campaignIds);
			return;
		}
		
		UnsubscribeEmailUtil.unsubscribeCampaignEmail(contactId, campaignIds, type);
	}

}
