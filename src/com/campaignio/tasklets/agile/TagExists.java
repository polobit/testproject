package com.campaignio.tasklets.agile;

import java.util.LinkedHashSet;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class TagExists extends TaskletAdapter
{
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

	// remove leading and trailing spaces
	tagValue.trim();

	String tags = "";

	// Replace ,space with space
	tags = tagValue.replaceAll(", ", ",");

	String[] tagsArray = tags.split(",");

	LinkedHashSet<String> tagsSet = new LinkedHashSet<String>();

	// Add tags to set
	for (String tag : tagsArray)
	    tagsSet.add(tag);

	LinkedHashSet<String> contactTags = contact.tags;

	System.out.println("Contact tags " + contactTags + " and given tags: "
		+ tagsSet);

	if (contactTags.containsAll(tagsSet))
	{
	    log(campaignJSON, subscriberJSON, "Given tags exist: " + tagsSet);
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_YES);
	    return;
	}

	log(campaignJSON, subscriberJSON, "Given tags doesn't exist: "
		+ tagsSet);
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_NO);
    }
}
