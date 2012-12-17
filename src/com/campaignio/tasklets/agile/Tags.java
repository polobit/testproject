package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Tags</code> represents tags node in a workflow.Tags class is used to
 * add or delete tags from the contact that subscribes to campaign.
 * 
 * @author Manohar
 * 
 */
public class Tags extends TaskletAdapter
{
    // Fields
    /**
     * Type - Add/Delete
     */
    public static String TYPE = "type";
    /**
     * Type Add for adding tags
     */
    public static String ADD = "add";
    /**
     * Type Delete for deleting tags
     */
    public static String DELETE = "delete";
    /**
     * Tags that are added
     */
    public static String TAG_NAMES = "tag_names";

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

	// Get Tags and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String tagNames = getStringValue(nodeJSON, subscriberJSON, data,
		TAG_NAMES);

	System.out
		.println("Given Tag Type " + type + "and TagName " + tagNames);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

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
		log(campaignJSON, subscriberJSON, "Added tags are: "
			+ tagsArray);
	    }
	    // Delete Tags based on contact
	    else
	    {
		contact.removeTags(tagsArray);
		log(campaignJSON, subscriberJSON, "Deleted tags are: "
			+ tagsArray);
	    }
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
