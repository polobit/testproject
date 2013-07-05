package com.agilecrm.db.util;

import org.apache.commons.lang.StringUtils;
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

	JSONArray mergedJSONArray = new JSONArray();

	try
	{
	    // Iterates over pageViews
	    for (int i = 0; i < pageViews.length(); i++)
	    {
		JSONObject pageView = pageViews.getJSONObject(i);

		// Insert pageViews with is_new not empty into separate
		// jsonArray
		if (!StringUtils.isEmpty(pageView.getString("is_new")))
		    mergedJSONArray.put(pageView);

		// Iterate over mergeJSONArray
		for (int j = 0; j < mergedJSONArray.length(); j++)
		{
		    // Merge urls with is_new urls
		    if (mergedJSONArray.getJSONObject(j).getString("sid")
			    .equals(pageView.getString("sid"))
			    && StringUtils
				    .isEmpty(pageView.getString("is_new")))
		    {
			String mergeUrls = mergedJSONArray.getJSONObject(j)
				.getString("url");
			mergeUrls += ", " + pageView.getString("url");
			mergedJSONArray.getJSONObject(j).put("url", mergeUrls);
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// If all pageViews having is_new empty, then return without
	// merging
	if (mergedJSONArray.length() == 0)
	    return pageViews;

	return mergedJSONArray;
    }
}
