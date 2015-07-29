package com.analytics.util;

import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;


/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions. It combines the urls with their timespent.
 * 
 */
public class AnalyticsUtil
{
    /**
     * Merges pagesViews based on session-ids. Mostly urls are different having
     * same session-ids. So it merges all urls separated by commas having same
     * session-ids into one single json-object.
     * 
     * @param pageViews
     *            - pageViews.
     * @return JSONArray
     */
    public static JSONArray mergePageViewsBasedOnSessions(JSONArray pageViews)
    {
	if (pageViews == null)
	    return null;

	// Merge pages based on sid.
	Map<String, JSONObject> mergedPageViewsMap = new LinkedHashMap<String, JSONObject>();

	// JSONArray with {url:'url', time_spent:'seconds'}
	JSONArray urlsWithTimeSpent = new JSONArray();

	// Groups urlsWithTimeSpent JSONArray with respect to sid.
	Map<String, JSONArray> pageSpentWithSid = new LinkedHashMap<String, JSONArray>();

	JSONArray tempJSONArray = new JSONArray();

	try
	{
	    // Iterates over pageViews
	    for (int i = 0, len = pageViews.length(); i < len; i++)
	    {
		JSONObject currentPageView = pageViews.getJSONObject(i);

		String currentSid = currentPageView.getString("sid");

		String currentUrl = currentPageView.getString("url");

		// If not null or empty - remove query params from urls
		if (!StringUtils.isEmpty(currentUrl))
		    currentUrl = StringUtils.split(currentUrl, '?')[0];

		// Retrieves timeSpent of url by subtracting time from next
		// consecutive url.
		if (i < (len - 1))
		{
		    JSONObject nextPageView = pageViews.getJSONObject(i + 1);
		    String nextSid = nextPageView.getString("sid");

		    // Need urls with timespent of same session.
		    if (currentSid.equals(nextSid))
		    {
			long timeSpent = Long.parseLong(nextPageView.getString("created_time")) - Long.parseLong(currentPageView.getString("created_time"));

			// [{url:'http://agilecrm.com',timeSpent:'total_secs'}]
			urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", timeSpent));
		    }
		    else
		    {
			// By Default we are assuming timespent of last url in a
			// session to be 10secs
			urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", 10L));
			tempJSONArray = urlsWithTimeSpent;

			// Reset JSONArray after end of session.
			urlsWithTimeSpent = new JSONArray();
		    }

		    // Adds jsonArray with sid
		    pageSpentWithSid.put(currentSid, tempJSONArray);
		}

		else
		{
		    // inserts last row of pageViews with default timespent
		    // 10secs.
		    pageSpentWithSid.put(currentSid, urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", 10L)));
		}

		// Verify for sid and updates respective sid JSONObject
		if (!mergedPageViewsMap.containsKey(currentSid))
		{
		    currentPageView.put("urls_with_time_spent", pageSpentWithSid.get(currentSid).toString());

		    // Insert new session
		    mergedPageViewsMap.put(currentSid, currentPageView);
		}
		else
		{
		    JSONObject sessionJSON = mergedPageViewsMap.get(currentSid);

		    // Inserts last row's stats_time and created_time of that
		    // session
		    sessionJSON.put("stats_time", currentPageView.getString("stats_time"));

		    // Stats epoch time
		    sessionJSON.put("created_time", currentPageView.getString("created_time"));

		    sessionJSON.put("urls_with_time_spent", pageSpentWithSid.get(currentSid).toString());
		    mergedPageViewsMap.put(currentSid, sessionJSON);
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in AnalyticsUtil " + e.getMessage());
	}

	// Return JSONArray of merged map values
	return new JSONArray(mergedPageViewsMap.values());
    }
    
    /**
     * Verifies whether domain having any web stats
     * 
     * @return boolean
     */
    public static boolean hasJSAPIForDomain()
    {
    	JSONArray pageViews = AnalyticsSQLUtil.getLimitedPageViews(5);
    	
    	if(pageViews != null && pageViews.length() > 0)
    		return true;
    	
    	return false;
    	
    }

}
