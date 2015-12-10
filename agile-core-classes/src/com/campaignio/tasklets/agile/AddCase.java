package com.campaignio.tasklets.agile;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AddCase</code> represents add case node in workflow. It creates new
 * case w.r.t subscribed contact with given details.
 * 
 * @author Naresh
 * 
 */
public class AddCase extends TaskletAdapter
{
    /**
     * Title of Case
     */
    public static String TITLE = "title";

    /**
     * OPEN or CLOSED
     */
    public static String STATUS = "status";

    /**
     * Owner Id
     */
    public static String OWNER_ID = "owner_id";

    /**
     * Case description
     */
    public static String DESCRIPTION = "description";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Gets given parameters
	String title = getStringValue(nodeJSON, subscriberJSON, data, TITLE);
	String status = getStringValue(nodeJSON, subscriberJSON, data, STATUS);
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);
	String description = getStringValue(nodeJSON, subscriberJSON, data, DESCRIPTION);

	try
	{
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);

	    // Get Contact Owner Id.
	    Long contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));

	    // Add Case with given values
	    addCase(title, status, description, contactId, AgileTaskletUtil.getOwnerId(givenOwnerId, contactOwnerId));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding Case..." + e.getMessage());
	}

	// Creates log for case
	LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Title: "
	        + title + "<br>Status: " + StringUtils.capitalize(status.toLowerCase()), LogType.ADD_CASE.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Saves case with the given parameters
     * 
     * @param title
     *            - title of case
     * @param status
     *            - status of case
     * @param description
     *            - description of case
     * @param contactId
     *            - Subscriber contact id.
     * @param ownerId
     *            - Selected owner id
     */
    private void addCase(String title, String status, String description, String contactId, Long ownerId)
    {
	Case agileCase = new Case();
	agileCase.title = title;
	agileCase.status = Case.Status.valueOf(status);
	agileCase.description = description;
	agileCase.addContactToCase(contactId);
	agileCase.owner_id = ownerId == null ? null : ownerId.toString();

	agileCase.save();
    }
}
