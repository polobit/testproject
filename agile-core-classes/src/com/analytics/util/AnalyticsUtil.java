package com.analytics.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.visitors.VisitorSegmentationQueryGenerator;
import com.analytics.VisitorFilter;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.Query;

/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions. It combines the urls with their timespent.
 * 
 */
public class AnalyticsUtil
{
    public static final String STATS_SEREVR_HTTP_REQUEST_PWD = "blAster432";
    public static final String STATS_SERVER_URL = "https://agilecrm-web-stats.appspot.com";
    
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
	String statsServerUrl = "https://agilecrm-web-stats.appspot.com/stats?domain=" + domain + "&psd="
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
    
    
    
    
    
   
    
    public static int getIntegerValue(String value, int defaultValue)
    {
	int result = defaultValue;
	if (StringUtils.isNotBlank(value))
	{
	    try
	    {
		result = Integer.parseInt(value);
	    }
	    catch (Exception e)
	    {
		result = defaultValue;
		return result;
	    }
	}
	return result;
    }
    /**
     * Returns url for the mysql database
     * 
     * @param domain
     * 
     * @param startDate
     *              -epoch Time
     * @param endDate
     *            -epoch Time
     * @return
     *        -url for mysql database
     */       
    
    public static String getStatsUrlForVisitsCount(String domain, String startDate, String endDate, String timeZone)
    {
    	String url = null;
    	String hostUrl = STATS_SERVER_URL+"/reports?domain="+domain+"&psd="+STATS_SEREVR_HTTP_REQUEST_PWD;
    	url = hostUrl + "&action=VISITS_COUNT&start_date="+startDate+"&end_date="+endDate+"&time_zone="+timeZone;
    	return url;
    }

    public static List<VisitorFilter> getAllSegmentFilters(Key<DomainUser> domainUserKey)
    {
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("owner_key", domainUserKey);
		
		return VisitorFilter.dao.listByProperty(searchMap);
    }
    
    
    public static void deleteSegmentFilter(long id) 
    {
		VisitorFilter.dao.ofy().delete(VisitorFilter.class, id);
    }

     public static String getUrlForRefferalurlCount(String domain, String startDate, String endDate) throws UnsupportedEncodingException
       {
        	String url = null;
        	//String hostUrl = getStatsServerUrl(domain);
        	String hostUrl=STATS_SERVER_URL+"/reports?domain="+domain+"&psd="+STATS_SEREVR_HTTP_REQUEST_PWD;
        	startDate=URLEncoder.encode(startDate, "UTF-8");
        	endDate=URLEncoder.encode(endDate, "UTF-8");
        	url = hostUrl + "&action=REFURL_COUNT&start_time="+startDate+"&end_time="+endDate;
        	return url;
        }
     
     public static int getTotalEmailCount(String emailCountString)
     {
 	try
 	{
 	    int totalEmailCount = Integer.parseInt(emailCountString);
 	    return totalEmailCount;
 	}
 	catch (Exception e)
 	{
 	    System.out.println("Exception occured while converting segmentation email count string to int "
 		    + e.getMessage());
 	    return 0;
 	}
     }
     
    
     
     public static JSONArray parseResultSet(ResultSet rs) throws Exception
     {
 	// JSONArray for each record
 	JSONArray agentDetailsArray = new JSONArray();
 	
 	// get the resultset metadata object to get the column names
 	ResultSetMetaData resultMetadata = rs.getMetaData();
 	
 	// get the column count in the resultset object
 	int numColumns = resultMetadata.getColumnCount();
 	
 	// variable for get the name of the column
 	String columnName = null;
 	
 	try
 	{
 	    // iterate the ResultSet object
 	    while (rs.next())
 	    {
 		try
 		{
 		    // create JSONObject for each record
 		    JSONObject eachAgentJSON = new JSONObject();
 		    
 		    // Get the column names and put
 		    // eachAgent record in agentJSONArray
 		    for (int i = 1; i < numColumns + 1; i++)
 		    {
 			// Get the column names
 			columnName = resultMetadata.getColumnName(i);
 			
 			// put column name and value in json array
 			eachAgentJSON.put(columnName, "" + rs.getString(columnName));
 		    }
 		    
 		    // place result data in agentDetailsArray
 		    agentDetailsArray.put(eachAgentJSON);
 		}
 		catch (Exception e)
 		{
 		    System.out.println("Exception while iterating result set " + e.getMessage());
 		}
 	    }
 	}
 	catch (Exception e)
 	{
 	    e.printStackTrace();
 	    System.out.println("Exception while mapping result set" + e);
 	    return agentDetailsArray;
 	}
 	return agentDetailsArray;
     }
     
     
    
}
