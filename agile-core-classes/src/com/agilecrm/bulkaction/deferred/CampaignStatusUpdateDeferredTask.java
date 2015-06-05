package com.agilecrm.bulkaction.deferred;

import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.googlecode.objectify.Key;

public class CampaignStatusUpdateDeferredTask extends BulkActionAdaptor
{
    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;
    private Long campaignId;
    private String campaignName;

    CampaignStatusUpdateDeferredTask()
    {

    }

    public CampaignStatusUpdateDeferredTask(Long campaignId, String campaignName, String namespace,
	    Set<Key<Contact>> contactKeySet)
    {
	this.campaignId = campaignId;
	this.campaignName = campaignName;
	this.namespace = namespace;
	this.contactKeySet = contactKeySet;
    }

    public boolean isValidTask()
    {
	if (StringUtils.isEmpty(namespace))
	    return false;
	if (campaignId == null)
	    return false;

	return true;

    }

    private void updateCampaignStatus()
    {
	String id = campaignId.toString();

	CampaignStatusUtil.setRemoveStatus(fetchContacts(), id, campaignName);
    }

    @Override
    protected void performAction()
    {
	updateCampaignStatus();
	// TODO Auto-generated method stub

    }
}
