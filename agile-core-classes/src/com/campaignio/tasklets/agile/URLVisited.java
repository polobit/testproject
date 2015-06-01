package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.analytics.util.AnalyticsSQLUtil;
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
	public static String URL_VALUE = "url_value";

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

	/**
	 * Number of days or hours to be considered
	 */
	public static final String DURATION = "duration";

	/**
	 * Days or Hours
	 */
	public static final String DURATION_TYPE = "duration_type";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get URL value and type
		String url = getStringValue(nodeJSON, subscriberJSON, data, URL_VALUE);
		String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

		int count = 0;
		String email = null;

		try
		{

			// Gets email from subscriberJSON
			if (subscriberJSON.getJSONObject("data").has("email"))
				email = subscriberJSON.getJSONObject("data").getString("email");

			// Gets URL count from table.
			count = AnalyticsSQLUtil.getCountForGivenURL(url, NamespaceManager.get(), email, type, duration,
					durationType);

			if (count == 0)
			{
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
				return;
			}

		}
		catch (Exception e)
		{
			System.out.println("Exception occuredin URL Visited node..." + e.getMessage());

		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);

	}
}