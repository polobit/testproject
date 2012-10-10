package com.agilecrm.tasklets;

import java.util.HashSet;
import java.util.Set;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Tags extends TaskletAdapter
{
    // Fields
    public static String TYPE = "type";
    public static String ADD = "add";
    public static String DELETE = "delete";
    public static String TAG_NAME = "tag_name";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Score and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String tagNames = getStringValue(nodeJSON, subscriberJSON, data,
		TAG_NAME);

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
	    tags = tagNames.replaceAll(", ", " ");

	    // Replace , with spaces
	    tags = tagNames.replaceAll(",", " ");

	    String[] tagsArray = tags.split(" ");

	    // Add Tags based on contact
	    if (type.equals(ADD))
	    {
		for (String tag : tagsArray)
		{
		    contact.tags.add(tag);
		}

		contact.save();
	    }
	    // Delete Tags based on contact
	    else
	    {

		Set<String> tagslist = new HashSet<String>();
		for (String tag : tagsArray)
		{
		    contact.tags.remove(tag);
		    tagslist.add(tag);
		}
		Tag.deleteTags(tagslist);
		contact.save();

	    }
	}

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
