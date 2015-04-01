package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Score</code>represents Score node in the workflow. Add or subtract
 * score to the subscriber. Customers can be sorted based on score. Score class
 * checks for given type whether to add or subtract score and act accordingly.
 * 
 * @author Naresh
 * 
 */
public class Score extends TaskletAdapter
{
    /**
     * Type - Add/Subtract
     */
    public static String TYPE = "type";

    /**
     * Add score
     */
    public static String ADD = "add";

    /**
     * Subtract score
     */
    public static String SUBTRACT = "subtract";

    /**
     * Score value
     */
    public static String VALUE = "Value";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Score and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String value = getStringValue(nodeJSON, subscriberJSON, data, VALUE);

	try
	{
	    // Get Contact Id and Contact
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);
	    Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	    if (contact != null)
	    {

		// Add score based on contact
		if (type.equals(ADD))
		{
		    contact.addScore(Integer.parseInt(value));

		    // Creates log when score is added
		    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Score increased by " + value,
			    LogType.SCORE.toString());
		}
		else
		{
		    contact.subtractScore(Integer.parseInt(value));

		    // Creates log when score is subtracted
		    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "Score decreased by " + value,
			    LogType.SCORE.toString());

		}

		// Update subscriberJSON
		subscriberJSON = AgileTaskletUtil.getUpdatedSubscriberJSON(contact, subscriberJSON);
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Score tasklet..." + e.getMessage());
	    e.printStackTrace();
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}