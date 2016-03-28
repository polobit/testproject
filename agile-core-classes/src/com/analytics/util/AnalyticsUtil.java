package com.analytics.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions. It combines the urls with their timespent.
 * 
 */
public class AnalyticsUtil
{
    public static final String STATS_SEREVR_HTTP_REQUEST_PWD = "blAster432";
    
    public static String getEmails(Set<String> emails)
    {
	String emailString = "";
	
	if (emails == null || emails.size() == 0)
	    return emailString;
	
	for (String email : emails)
	{
	    if (StringUtils.isNotBlank(email))
		emailString += GoogleSQLUtil.encodeSQLColumnValue(email) + ",";
	}
	
	return StringUtils.removeEnd(emailString, ",");
	
    }
    
    public static String getCompositeString(Set<String> emails)
    {
	String emailString = "";
	
	if (emails == null || emails.size() == 0)
	    return emailString;
	
	for (String email : emails)
	{
	    if (StringUtils.isNotBlank(email))
		emailString += email + ",";
	}
	
	return StringUtils.removeEnd(emailString, ",");
    }
    
    /**
     * Verifies whether domain having any web stats
     * 
     * @return boolean
     */
    public static boolean hasJSAPIForDomain()
    {
	JSONArray pageViews = AnalyticsSQLUtil.getLimitedPageViews(5);
	
	if (pageViews != null && pageViews.length() > 0)
	    return true;
	
	return false;
	
    }
    
    /**
     * This method responsible for building url for fetching all page views
     * related to specific contact email
     * 
     * @return
     */
    public static String getStatsUrlForFetchLimitedRows(int limit)
    {
	String url = null;
	String domain = NamespaceManager.get();
	String hostUrl = getStatsServerUrl(domain);
	url = hostUrl + "&action=FETCH_XLIMITED_VIEWS&limit=" + limit;
	return url;
    }
    
    /**
     * This method responsible for building url for fetching all page views
     * related to specific contact email
     * 
     * @return
     */
    public static String getStatsUrlForFetch(String searchEmail, String domain)
    {
	String url = null;
	String hostUrl = getStatsServerUrl(domain);
	url = hostUrl + "&action=fetch_pageviews&search_email=" + searchEmail;
	return url;
    }
    
    /**
     * This method responsible for building url to execute Non Query
     * 
     * @return
     */
    public static String getStatsUrlForDeleteDomainStats(String domain)
    {
	String hostUrl = getStatsServerUrl(domain);
	String url = null;
	url = hostUrl + "&action=ERADICATEX";
	return url;
    }
    
    /**
     * This method responsible for building url for fetching all page views
     * related to specific contact email
     * 
     * @return
     */
    public static String getStatsUrlForPageViewsOfEmail(String searchEmail, String domain)
    {
	String url = null;
	String hostUrl = getStatsServerUrl(domain);
	url = hostUrl + "&action=FETCH_PAGE_XVIEWS&search_email=" + searchEmail;
	return url;
    }
    
    /**
     * This method responsible for fetching all contact activities related to
     * page views.
     * 
     * @param offset
     * @param limit
     * @return
     */
    public static String getStatsUrlForContactsPageViews(String offset, String limit, String domain)
    {
	String hostUrl = getStatsServerUrl(domain);
	String url = null;
	url = hostUrl + "&action=FETCH_XACTIVITIES&offset=" + offset + "&limit=" + limit;
	return url;
    }
    
    /**
     * This method responsible for fetching all activities related to
     * page views.
     * 
     * @param offset
     * @param limit
     * @return
     */
    public static String getStatsUrlForAllPageViews(String offset, String limit, String domain)
    {
	String hostUrl = getStatsServerUrl(domain);
	String url = null;
	url = hostUrl + "&action=FETCH_NEW_PAGEVIEWS&offset=" + offset + "&limit=" + limit;
	return url;
    }
    
    public static String getStatsUrlForFetchingUrlVisitedCount(String url, String domain, String email, String type,
	    String duration, String durationType)
    {
	String hostUrl = getStatsServerUrl(domain);
	String statsServerUrl = null;
	if (StringUtils.isNotBlank(url))
	    try
	    {
		url = URLEncoder.encode(url, "UTF-8");
	    }
	    catch (UnsupportedEncodingException e)
	    {
		System.out.println("exception while url encode " + url);
	    }
	statsServerUrl = hostUrl + "&action=URL_VISITED_XCOUNT&url=" + url + "&email=" + email + "&type=" + type
		+ "&duration=" + duration + "&durationType=" + durationType;
	return statsServerUrl;
    }
    
    public static String getStatsUrlForPageViewsCount(String domain)
    {
	String hostUrl = getStatsServerUrl(domain);
	String url = null;
	url = hostUrl + "&action=page_views_count";
	return url;
    }
    
    /**
     * Build base url of stats server
     * 
     * @return
     */
    public static String getStatsServerUrl(String domain)
    {
	String statsServerUrl = "https://1-2-dot-agilecrm-web-stats.appspot.com/stats?domain=" + domain + "&psd="
		+ STATS_SEREVR_HTTP_REQUEST_PWD;
	return statsServerUrl;
    }
    
    /**
     * Merged two JSON arrays into one JSON array
     * 
     * @param array1
     * @param array2
     * @return
     */
    public static JSONArray getMergedJSONArray(JSONArray array1, JSONArray array2)
    {
	if (array1 != null && array2 != null)
	{
	    try
	    {
		for (int i = 0; i < array1.length(); i++)
		    array2.put(array1.get(i));
	    }
	    catch (Exception e)
	    {
		System.out.println("Exception occured while merging contact activities JSON Arrays " + e.getMessage());
		return null;
	    }
	    return array2;
	}
	else if (array1 == null && array2 != null)
	    return array2;
	else if (array1 != null && array2 == null)
	    return array1;
	else
	    return null;
    }
    
}
