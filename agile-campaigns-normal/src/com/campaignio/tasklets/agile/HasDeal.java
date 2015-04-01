package com.campaignio.tasklets.agile;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>HasDeal</code> represents has_deal node in campaigns. It verifies
 * whether deal exists with given milestone and deal owner
 * 
 * @author Naresh
 * 
 */
public class HasDeal extends TaskletAdapter
{
    /**
     * Selected milestone value
     */
    public static String MILESTONE = "milestone";

    /**
     * Owner Id
     */
    public static String OWNER_ID = "owner_id";

    /**
     * Branch Yes
     */
    public static String BRANCH_YES = "yes";

    /**
     * Branch No
     */
    public static String BRANCH_NO = "no";

    /**
     * Any milestone
     */
    public static String ANY_MILESTONE = "any_milestone";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	String milestone = getStringValue(nodeJSON, subscriberJSON, data, MILESTONE);
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);

	    // Get Contact Owner Id.
	    Long contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

	    // If milestone is any, then make it null
	    if (StringUtils.equals(milestone, ANY_MILESTONE))
		milestone = null;

	    int count = OpportunityUtil.getDealsCount(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)),
		    milestone, AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId));

	    System.out.println("Count of deals is " + count);

	    if (count != 0)
	    {
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
		return;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting deals count..." + e.getMessage());
	}

	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
    }
}
