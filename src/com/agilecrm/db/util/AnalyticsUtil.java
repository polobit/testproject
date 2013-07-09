package com.agilecrm.db.util;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions.
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

	// HashMap having sid as key and respective pageView JSON as Value.
	Map<String, JSONObject> mergedPageViewsMap = new HashMap<String, JSONObject>();

	try
	{
	    // Iterates over pageViews
	    for (int i = 0; i < pageViews.length(); i++)
	    {
		JSONObject pageView = pageViews.getJSONObject(i);

		String sid = pageView.getString("sid");

		// Verify for sid and updates respective sid JSONObject
		if (mergedPageViewsMap.containsKey(sid))
		{
		    JSONObject sessionJSON = mergedPageViewsMap.get(sid);

		    String url = sessionJSON.getString("url");
		    url += ", " + pageView.getString("url");

		    // Updates with urls, latest stats_time and created_time of
		    // that session
		    sessionJSON.put("url", url);
		    sessionJSON.put("stats_time", pageView.getString("stats_time"));
		    sessionJSON.put("created_time", pageView.getString("created_time"));

		    mergedPageViewsMap.put(sid, sessionJSON);
		}
		else
		    // Insert new session
		    mergedPageViewsMap.put(sid, pageView);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// Return JSONArray of merged map values
	return new JSONArray(mergedPageViewsMap.values());
    }
}
