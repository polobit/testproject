package com.campaignio.tasklets.agile;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.util.DBUtil;
import com.agilecrm.util.HTTPUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

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
	String subscriberId = DBUtil.getId(subscriberJSON);

	// Get API Key from campaignJSON domainUser Id.
	String apiKey = APIKey.getAPIKeyFromCampaignJSON(campaignJSON);

	if (StringUtils.isEmpty(apiKey))
	{
	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, null);
	    return;
	}

	url += "&agile_id=" + URLEncoder.encode(apiKey) + "&subscriber_id="
		+ URLEncoder.encode(subscriberId);

	// Access given URL
	String output = HTTPUtil.accessURL(url);

	// Checks whether output string can be converted to JSONObject
	boolean validJSON = isValidJSON(output);

	// Execute Next One in Loop
	if (validJSON)
	{
	    log(campaignJSON, subscriberJSON, "URL Visited : " + url);
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		    nodeJSON, BRANCH_YES);
	    return;
	}

	log(campaignJSON, subscriberJSON, "URL Not Visited : " + url);
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_NO);
    }

    /**
     * Returns true if output is converted to JSONObject successfully, otherwise
     * false
     * 
     * @param output
     *            - Output string obtained by accessing given url.
     * @return boolean value
     */
    private boolean isValidJSON(String output)
    {
	try
	{
	    JSONObject jsonURL = new JSONObject(output);
	    System.out.println(jsonURL);
	    return true;
	}
	catch (JSONException e)
	{
	    System.out.println("Exception occured : " + e);
	    return false;
	}
    }
}
