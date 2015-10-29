package com.agilecrm.workflows.status.util;

import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
import com.google.appengine.api.taskqueue.DeferredTask;

public class UnsubscribeEmailDeferredTask implements DeferredTask
{

	private static final long serialVersionUID = 1L;
	
	Long contactId = 0L;
	String campaignIds = null;
	UnsubscribeType type = UnsubscribeType.CURRENT;
	
	public UnsubscribeEmailDeferredTask(Long contactId, String campaignIds, UnsubscribeType type)
	{
		this.contactId = contactId;
		this.campaignIds = campaignIds;
		this.type = type;
	}
	
	@Override
	public void run()
	{
		UnsubscribeEmailUtil.unsubscribeCampaignEmail(contactId, campaignIds, type);
	}

}
