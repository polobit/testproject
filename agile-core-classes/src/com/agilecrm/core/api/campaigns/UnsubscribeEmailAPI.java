package com.agilecrm.core.api.campaigns;


import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.util.UnsubscribeEmailUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.agilecrm.workflows.util.WorkflowUtil;

@Path("/api/unsubscribe")
public class UnsubscribeEmailAPI
{

	@POST
	public void unsubscribeCampaignEmail(@FormParam("campaign_id") String campaignIds, @FormParam("contact_id") Long contactId,@FormParam("type") UnsubscribeType type)
	{
		UnsubscribeEmailUtil.unsubscribeCampaignEmailByQueue(contactId, campaignIds, type);
	}
	
	@Path("/resubscribe")
	@POST
	public void resubscribeCampaignEmail(@FormParam("campaign_id") Long campaignId, @FormParam("contact_id") Long contactId)
	{
		 UnsubscribeStatusUtil.resubscribeContact(ContactUtil.getContact(contactId), campaignId);
	}
}
