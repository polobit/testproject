package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Tags extends TaskletAdapter
{
    // Fields
    public static String TYPE = "type";
    public static String ADD = "add";
    public static String DELETE = "delete";
    public static String TAG_NAMES = "tag_names";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Tags and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String tagNames = getStringValue(nodeJSON, subscriberJSON, data,
		TAG_NAMES);

	System.out
		.println("Given Tag Type " + type + "and TagName " + tagNames);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = Contact.getContact(Long.parseLong(contactId));

	if (contact != null)
	{
	    String tags = "";
	    // Replace multiple space with single space
	    tags = tagNames.trim().replaceAll(" +", " ");

	    // Replace ,space with space
	    tags = tagNames.replaceAll(", ", ",");

	    String[] tagsArray = tags.split(",");

	    // Add Tags based on contact
	    if (type.equals(ADD))
	    {
		contact.addTags(tagsArray);
	    }
	    // Delete Tags based on contact
	    else
	    {
		contact.removeTags(tagsArray);
	    }
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
