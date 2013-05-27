package com.campaignio.tasklets.agile;

import java.util.LinkedHashSet;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TagExists</code> represents Tag exists node in workflow. It compares
 * given tags with contact tags. If all given tags are present in contact tags,
 * then branch Yes is processed, otherwise branch No.
 * 
 * @author Naresh
 * 
 */
public class CheckTags extends TaskletAdapter
{
    /**
     * Entered tag value
     */
    public static String TAG_VALUE = "tag_value";

    /**
     * Branch Yes
     */
    public static String BRANCH_YES = "yes";

    /**
     * Branch No
     */
    public static String BRANCH_NO = "no";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Tags
	String tagValue = getStringValue(nodeJSON, subscriberJSON, data,
		TAG_VALUE);

	System.out.println("The given tag values are: " + tagValue);

	// Get Contact Id and Contact
	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	if (contact == null)
	    return;

	String tags = "";

	// remove leading and trailing spaces
	tags = tagValue.trim();

	// Remove trailing comma
	tags = tags.replaceAll(",$", "");

	// Replace ,space with space
	tags = tags.replaceAll(", ", ",");

	String[] tagsArray = tags.split(",");

	// Set to add given tags array
	LinkedHashSet<String> tagsSet = new LinkedHashSet<String>();

	// Add tags to set
	for (String tag : tagsArray)
	    tagsSet.add(tag);

	// Contact tags.
	LinkedHashSet<String> contactTags = contact.getContactTags();

	System.out.println("Contact tags: " + contactTags + " and given tags: "
		+ tagsSet);

	// Check contact tags consists of all given tags.
	if (contactTags.containsAll(tagsSet))
	{
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_YES);
	    return;
	}

	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_NO);
    }
}
