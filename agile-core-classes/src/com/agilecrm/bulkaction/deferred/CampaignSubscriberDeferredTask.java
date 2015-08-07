package com.agilecrm.bulkaction.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.bulkaction.BulkActionAdaptor;
import com.agilecrm.contact.Contact;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskCore;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Key;
import com.thirdparty.Mailgun;

public class CampaignSubscriberDeferredTask extends BulkActionAdaptor
{
    private Long campaignId;

    CampaignSubscriberDeferredTask()
    {

    }

    public CampaignSubscriberDeferredTask(Long domainUserId, Long campaignId, String namespace,
	    Set<Key<Contact>> contactKeySet, UserInfo info)
    {
	this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
	this.campaignId = campaignId;
	this.namespace = namespace;
	this.contactKeySet = contactKeySet;
	this.info = info;
    }

    public boolean isValidTask()
    {
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production
		&& StringUtils.isEmpty(namespace))

	    if (campaignId == null)
		return false;
	if (key == null)
	    return false;

	return true;

    }

    protected void performAction()
    {
	List<Contact> contacts = fetchContacts();

	WorkflowSubscribeUtil.subscribeDeferred(contacts, campaignId);
    }

    @Deprecated
    private void runCampaign(List<Contact> contacts)
    {
	try
	{
	    System.out.println("Executing tasklet in namespace " + NamespaceManager.get());

	    JSONObject campaignJSON = WorkflowUtil.getWorkflowJSON(campaignId);
	    String campaignName = AgileTaskletUtil.getCampaignNameFromJSON(campaignJSON);

	    // Convert Contacts into JSON Array
	    JSONArray subscriberJSONArray = AgileTaskletUtil.getSubscriberJSONArray(contacts, campaignId, null);

	    for (Contact contact : contacts)
	    {
		CampaignStatusUtil.setActiveCampaignStatus(contact, String.valueOf(campaignId), campaignName);
	    }

	    for (int i = 0; i < subscriberJSONArray.length(); i++)
	    {
		try
		{
		    JSONObject subscriberJSON = subscriberJSONArray.getJSONObject(i);
		    // To avoid setting status in Start Node again
		    subscriberJSON.put(TaskCore._ACTIVE_STATUS_SET, true);

		    TaskCore.executeWorkflow(campaignJSON, subscriberJSON);

		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }

	}
	catch (Exception e)
	{
	    Mailgun.sendMail("campaigns@agile.com", "Campaign Error Observer", "yaswanth@agilecrm.com", null, null,
		    "Campaign Initiated in " + NamespaceManager.get() + " , " + campaignId, null,
		    "Hi Naresh,<br><br> Campaign Initiated:<br><br> User id: " + info.getEmail()
			    + "<br><br>Campaign-id: " + campaignId + "<br>", null);

	    System.err.println("Exception occured in TaskletUtilDeferredTask " + e.getMessage());
	    e.printStackTrace();
	}

    }
}
