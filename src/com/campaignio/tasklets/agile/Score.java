package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Score</code>represents Score node in the workflow.Add or subtract score
 * to the subscriber.Customers can be sorted based on score.Score class checks
 * for given type whether to add or subtract score and act accordingly
 * 
 * 
 * @author Naresh
 * 
 */
public class Score extends TaskletAdapter
{
    // Fields
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

    // Run
    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	System.out.println("campaignJson" + campaignJSON + "subscriberJSON"
		+ subscriberJSON + "data" + data + "nodeJSON" + nodeJSON);

	// Get Score and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String value = getStringValue(nodeJSON, subscriberJSON, data, VALUE);

	System.out.println("Given Score Type " + type + "and Value" + value);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	if (contact != null)
	{
	    // Add score based on contact
	    if (type.equals(ADD))
	    {
		contact.addScore(Integer.parseInt(value));

		// Creates log when score is added
		log(campaignJSON, subscriberJSON, "Score added by : " + value);
	    }
	    else
	    {
		contact.subtractScore(Integer.parseInt(value));

		// Creates log when score is subtracted
		log(campaignJSON, subscriberJSON, "Score subtracted by : "
			+ value);

	    }
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
