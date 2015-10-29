package com.agilecrm.core.api.campaigns;


import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.util.UnsubscribeEmailUtil;
import com.agilecrm.workflows.status.util.EmailSubscriptionDeferredTask.SubscriptionType;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.agilecrm.workflows.util.WorkflowUtil;

@Path("/api/unsubscribe")
public class UnsubscribeEmailAPI
{

	@POST
	public void unsubscribeCampaignEmail(@FormParam("campaign_id") String campaignIds, @FormParam("contact_id") Long contactId,@FormParam("type") UnsubscribeType type)
	{
		UnsubscribeEmailUtil.emailSubscriptionByQueue(contactId, campaignIds, type, SubscriptionType.UNSUBSCRIBE);
	}
	
}
