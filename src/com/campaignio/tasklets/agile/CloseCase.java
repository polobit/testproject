package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.cases.Case;
import com.agilecrm.cases.util.CaseUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>CloseCase</code> represents close case node of campaigns. It closes all
 * OPEN cases of subscribed contact.
 * 
 * @author Naresh
 * 
 */
public class CloseCase extends TaskletAdapter
{
    /**
     * Owner Id
     */
    public static String OWNER_ID = "owner_id";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    Long contactId = Long.parseLong(AgileTaskletUtil.getId(subscriberJSON));

	    // Get Contact Owner Id.
	    Long contactOwnerId = ContactUtil.getContactOwnerId(contactId);

	    // Close Case
	    closeCase(contactId, AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while closing Case..." + e.getMessage());
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Close all related cases
     * 
     * @param contactId
     *            - campaign subscriber id
     * @param ownerId
     *            - Case owner id
     */
    private void closeCase(Long contactId, Long ownerId)
    {
	// Get all OPEN cases
	List<Case> cases = CaseUtil.getCases(contactId, null, ownerId);

	System.out.println("Cases size is " + cases.size());

	for (Case agileCase : cases)
	{
	    agileCase.status = Case.Status.CLOSE;
	    agileCase.save();
	}

    }
}
