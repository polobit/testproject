package com.campaignio.tasklets.agile;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

public class ChangeDealMilestone extends TaskletAdapter
{
    /**
     * Current milestone
     */
    public static String CURRENT_MILESTONE = "current_milestone";

    /**
     * Any milestone
     */
    public static String ANY_MILESTONE = "any_milestone";

    /**
     * Milestone to be converted
     */
    public static String NEW_MILESTONE = "new_milestone";

    /**
     * Owner Id
     */
    public static String OWNER_ID = "owner_id";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	String fromMilestone = getStringValue(nodeJSON, subscriberJSON, data, CURRENT_MILESTONE);
	String toMilestone = getStringValue(nodeJSON, subscriberJSON, data, NEW_MILESTONE);
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);

	    // Get Contact Owner Id.
	    Long contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

	    if (contactOwnerId == null)
	    {
		System.out.println("No owner");

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }

	    // Change milestone with given values
	    changeMilestoneToRelatedDeals(contactId, fromMilestone, toMilestone, AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while changing milestone..." + e.getMessage());
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    private void changeMilestoneToRelatedDeals(String contactId, String currentMilestone, String newMilestone, Long ownerId)
    {

	// If any milestone return null
	if (StringUtils.equals(currentMilestone, ANY_MILESTONE))
	    currentMilestone = null;

	List<Opportunity> deals = OpportunityUtil.getDeals(Long.parseLong(contactId), currentMilestone, ownerId);

	System.out.println("Deals size id " + deals.size());

	for (Opportunity opportunity : deals)
	{
	    opportunity.milestone = newMilestone;
	    opportunity.save();
	}
    }
}
