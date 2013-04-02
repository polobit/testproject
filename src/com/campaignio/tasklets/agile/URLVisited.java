package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.util.StatsUtil;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>URLVisited</code> represents URLVisited node in the workflow. It access
 * given url. If output obtained is JSONObject, the node under branch Yes is
 * processed, otherwise branch No is processed.
 * 
 * @author Naresh
 * 
 */
public class URLVisited extends TaskletAdapter
{
    /**
     * Given URL
     */
    public static String URL = "url";

    /**
     * Branch Yes
     */
    public static String BRANCH_YES = "yes";

    /**
     * Branch No
     */
    public static String BRANCH_NO = "no";

    @SuppressWarnings("deprecation")
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get URL value
	String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
	String domain = NamespaceManager.get();

	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));
	String email = contact.getContactFieldValue(Contact.EMAIL);

	// Gets URL count from table.
	int count = StatsUtil.getCountForGivenURL(url, domain, email);

	if (count == 0)
	{
	    log(campaignJSON, subscriberJSON, "URL Not Visited : " + url);
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_NO);
	    return;
	}

	log(campaignJSON, subscriberJSON, "URL Visited : " + url);
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_YES);
    }
}
