package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Score extends TaskletAdapter
{
    // Fields
    public static String TYPE = "type";
    public static String ADD = "add";
    public static String SUBTRACT = "subtract";
    public static String VALUE = "Value";

    // Run
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
	Contact contact = Contact.getContact(Long.parseLong(contactId));

	if (contact != null)
	{
	    // Add score based on contact
	    if (type.equals(ADD))
		contact.addScore(Integer.parseInt(value));
	    else
		contact.subtractScore(Integer.parseInt(value));
	}

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
