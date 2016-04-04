package com.analytics.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.util.HTTPUtil;
import com.analytics.Analytics;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions. It combines the urls with their timespent.
 * 
 */
public class AnalyticsUtil
{
    public static final String STATS_SEREVR_HTTP_REQUEST_PWD = "blAster432";
    
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);
    
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
    public static String getStatsUrlForAllPageViews(String searchEmail, String domain)
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
	String statsServerUrl = "http://localhost:8080/stats?domain=" + domain + "&psd="
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
    
    public static List<String> getEmails(String filterJSON, String startTime, String endTime, String pageSize,
	    String cursor)
    {
	try
	{
	    String statsServerUrl = "https://1-2-dot-agilecrm-web-stats.appspot.com/visitors";
	    Map<String, String> params = new LinkedHashMap<String, String>();
	    params.put("filter_json", filterJSON);
	    params.put("cursor", cursor);
	    params.put("page_size", pageSize);
	    params.put("start_time", startTime);
	    params.put("end_time", endTime);
	    params.put("domain", NamespaceManager.get());
	    params.put("psd", STATS_SEREVR_HTTP_REQUEST_PWD);
	    
	    StringBuilder postData = new StringBuilder();
	    for (Map.Entry<String, String> param : params.entrySet())
	    {
		if (postData.length() != 0)
		    postData.append('&');
		postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
		postData.append('=');
		postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
	    }
	    String postDataBytes = postData.toString();
	    
	    String mergedStats = HTTPUtil.accessURLUsingPost(statsServerUrl, postDataBytes);
	    JSONArray contactEmailsJsonArray = new JSONArray(mergedStats);
	    List<String> emails = new ArrayList<String>();
	    for (int i = 0; i < contactEmailsJsonArray.length() - 1; i++)
	    {
		JSONObject contactEmail = contactEmailsJsonArray.getJSONObject(i);
		emails.add(contactEmail.get("email").toString());
	    }
	    try
	    {
		JSONObject emailCountObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 1);
		String emailCountString = emailCountObject.get("total_rows_count").toString();
		emails.add(emailCountString);
	    }
	    catch (Exception e)
	    {
		System.out.println("exception occured while fetching segmented email count "+ e.getMessage());
	    }
	    return emails;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    return null;
	}
    }
    
    @SuppressWarnings("unchecked")
    public static List<Contact> getContacts(List<String> contactEmails)
    {
	List<Contact> contacts = null;
	int emailCount = 0;
	if (contactEmails != null && contactEmails.size() > 0)
	{
	    try
	    {
		String emailCountString = contactEmails.get(contactEmails.size() - 1);
		emailCount = Integer.parseInt(emailCountString);
	    }
	    catch (Exception e)
	    {
		System.out.println("Exception occured while converting segmentation email count string to int "
			+ e.getMessage());
	    }
	    Objectify ofy = ObjectifyService.begin();
	    com.googlecode.objectify.Query<Contact> query = ofy.query(Contact.class);
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("type", Contact.Type.PERSON);
	    searchMap.put("properties.name", "email");
	    searchMap.put("properties.value IN", contactEmails);
	    for (String propName : searchMap.keySet())
	    {
		query.filter(propName, searchMap.get(propName));
	    }
	    System.out.println(query.toString());
	    contacts = dao.fetchAll(query);
	    Contact contact = contacts.get(contacts.size() - 1);
	    contact.count = emailCount;
	}
	// for (String propName : .keySet())
	// {
	// q.filter(propName, map.get(propName));
	// }
	// contacts =
	// ofy.query(Contact.class).filter("type",Contact.Type.PERSON).filter("properties.name","email").filter("properties.value IN",contactEmails).list();
	return contacts;
    }
    
}
