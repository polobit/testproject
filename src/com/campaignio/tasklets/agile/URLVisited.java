package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.analytics.util.AnalyticsSQLUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
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
     * Given URL type
     */
    public static String TYPE = "type";

    /**
     * Exact URL type
     */
    public static String EXACT_MATCH = "exact_match";

    /**
     * Like URL type
     */
    public static String CONTAINS = "contains";

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
	// Get URL value and type
	String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
	String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
	String domain = NamespaceManager.get();

	String contactId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));
	String email = contact.getContactFieldValue(Contact.EMAIL);

	// Gets URL count from table.
	int count = AnalyticsSQLUtil.getCountForGivenURL(url, domain, email, type);

	if (count == 0)
	{
	    System.out.println("Node JSON in url visited is: " + nodeJSON);
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_NO);
	    return;
	}

	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_YES);
    }
}
