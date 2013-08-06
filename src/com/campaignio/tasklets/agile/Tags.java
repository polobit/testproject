package com.campaignio.tasklets.agile;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Tags</code> represents tags node in a workflow. Tags class is used to
 * add or delete tags from the contact that subscribes to campaign.
 * 
 * @author Manohar
 * 
 */
public class Tags extends TaskletAdapter
{
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

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Tags and Type
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String tagNames = getStringValue(nodeJSON, subscriberJSON, data, TAG_NAMES);

	try
	{

	    // Get Contact Id and Contact
	    String contactId = DBUtil.getId(subscriberJSON);
	    Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	    // Execute next node if contact is null and given tags are empty.
	    if (contact != null && !StringUtils.isEmpty(tagNames))
	    {
		String tags = "";
		tags = DBUtil.normalizeStringSeparatedByDelimiter(',', tagNames);

		System.out.println("Normalized tags are " + tags);

		String[] tagsArray = tags.split(",");

		// Add Tags based on contact
		if (type.equals(ADD))
		{
		    contact.addTags(tagsArray);
		    LogUtil.addLogToSQL(DBUtil.getId(campaignJSON), DBUtil.getId(subscriberJSON), "Tags added - " + tagNames, LogType.TAGS.toString());

		}

		// Delete Tags based on contact
		else
		{
		    contact.removeTags(tagsArray);
		    LogUtil.addLogToSQL(DBUtil.getId(campaignJSON), DBUtil.getId(subscriberJSON), "Tags deleted - " + tagNames, LogType.TAGS.toString());
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got an exception in Tags tasklet " + e.getMessage());
	}
	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}
