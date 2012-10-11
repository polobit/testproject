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
    public static String TAG_NAMES = "tag_names";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Score and Type
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
	    tags = tagNames.replaceAll(", ", " ");

	    // Replace , with spaces
	    tags = tagNames.replaceAll(",", " ");

	    String[] tagsArray = tags.split(" ");

	    // Add Tags based on contact
	    if (type.equals(ADD))
	    {
		contact.addTags(tagsArray);
	    }
	    // Delete Tags based on contact
	    else
	    {
		contact.removeTags(tagsArray);

		// Delete tags from Tag class
		Set<String> tagslist = new HashSet<String>();
		for (String tag : tagsArray)
		{
		    tagslist.add(tag);
		}
		Tag.deleteTags(tagslist);
	    }
	}

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
