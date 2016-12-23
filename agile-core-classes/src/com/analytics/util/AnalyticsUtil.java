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
    
    public static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);
    
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
    
    /**
     * Fetched emails from Analytics DB w.r.t visitors LHS 
     * filters
     * 
     * @param filterJSON
     * @param startTime
     * @param endTime
     * @param pageSize
     * @param cursor
     * @return
     */
    public static List<String> getEmails(String filterJSON, String startTime, String endTime, String pageSize,
	    String cursor)
    {
	try
	{
	    List<String> emails = new ArrayList<String>();
	    String currentNamespace = NamespaceManager.get();
	    VisitorSegmentationQueryGenerator segmentationQueryGenerator = new VisitorSegmentationQueryGenerator(
		    currentNamespace, filterJSON, startTime, endTime, cursor, pageSize);
	    String segementationQuery = segmentationQueryGenerator.generateSegmentationQuery();
	    JSONArray mergedStats = AnalyticsSQLUtil.getVisitors(segementationQuery);
	    
	    JSONArray contactEmailsJsonArray = new JSONArray(mergedStats.toString());
	    int emailsSize = contactEmailsJsonArray.length();
	    if (emailsSize > 1)
	    {
		for (int i = 0; i < emailsSize - 1; i++)
		{
		    JSONObject contactEmail = contactEmailsJsonArray.getJSONObject(i);
		    emails.add(contactEmail.get("email").toString());
		}
		try
		{
		    JSONObject firstObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 2);
		    JSONObject lastObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 1);
		    String emailCountString = lastObject.get("total_rows_count").toString();
		    String scannedUpto = firstObject.getString("stats_time");
		    // emails.add(firstObject.get("email").toString());
		    emails.add(scannedUpto);
		    emails.add(emailCountString);
		}
		catch (Exception e)
		{
		    System.err.println("exception occured while fetching segmented email count " + e.getMessage());
		}
	    }
	    return emails;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	    return null;
	}
    }
    
    /**
     * Fetches contacts from Datastore DB because customer applied only web
     * filters in visitors page
     * 
     * @param contactEmails
     * @return
     */
    @SuppressWarnings("unchecked")
    public static JSONArray getContactsFromDataStore(List<String> contactEmails)
    {
	JSONArray contactsArray = new JSONArray();
//	String tag = null;
//	String condition = null;
//	boolean hasTagFilter = false;
//	try
//	{
//	    if(tagFilter!=null)
//	    {
//		tag = tagFilter.get("RHS").toString();
//		condition = tagFilter.getString("CONDITION").toString();
//		hasTagFilter = true;
//	    }
//	}
//	catch(Exception e)
//	{
//	    System.err.println(e.getMessage());
//	}
	if (contactEmails != null && contactEmails.size() > 0)
	{
	    try
	    {
			Objectify ofy = ObjectifyService.begin();
			for (int i = 0; i < contactEmails.size(); i++)
			{
			    /**
			     * converting searching email-id into the lowercase and then
			     * it should not be blank
			     * */
			    
			    if (StringUtils.isNotBlank(contactEmails.get(i)))
			    {
					com.googlecode.objectify.Query<Contact> query = ofy.query(Contact.class);
					Map<String, Object> searchMap = new HashMap<String, Object>();
					searchMap.put("type", Contact.Type.PERSON);
					searchMap.put("properties.name", "email");
					searchMap.put("properties.value", contactEmails.get(i).toLowerCase());
		//			if(StringUtils.isNotBlank(tag) && StringUtils.isNotBlank(condition))
		//			{
		//			    if(condition.equalsIgnoreCase("EQUALS"))
		//				searchMap.put("tagsWithTime.tag",tag);
		//			    else
		//			    {
		//			    	searchMap.put("tagsWithTime.tag !",tag);
		//			    }
		//			}
					
					for (String propName : searchMap.keySet())
					    query.filter(propName, searchMap.get(propName));
					System.out.println(query.toString());
					Contact contact = dao.fetch(query);
					if (contact != null)
					{
					    ObjectMapper mapper = new ObjectMapper();
					    String contactString = mapper.writeValueAsString(contact);
					    JSONObject contactJSON = new JSONObject(contactString);
					    contactsArray.put(contactJSON);
					}
					else
					{
					    JSONObject contactJSON = buildVisitorData(contactEmails.get(i));
					    contactsArray.put(contactJSON);
					}
			    }
			}
	    }
	    catch (Exception e)
	    {
	    	System.out.println("Exception occured while fetching contacts for visitors" + e.getMessage());
	    }	    
	}
	return contactsArray;
    }
    
    /**
     * Fetches contacts from TextSearch DB because customer applied contact
     * filter along web filters in visitors page
     * 
     * @param contactEmails
     * @param contactFilterId
     * @param count
     * @return
     */
    @SuppressWarnings("unchecked")
    public static JSONArray getContactsFromTextSearch(List<String> contactEmails, JSONObject tagFilter, int count)
    {
    	JSONArray contactsArray = new JSONArray();
    	String tag = null;
    	String tagCondition = null;
    	List<SearchRule> aclRules = null;
    	try
    	{
    		if(tagFilter!=null)
    		{
    			tag = tagFilter.get("RHS").toString();
    			tagCondition = tagFilter.getString("CONDITION").toString();
    		}
    		// Sets ACL condition
    		aclRules = new ArrayList<SearchRule>();
    		UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
    			UserAccessControl.AccessControlClasses.Contact.toString(),aclRules, null);
    	}
    	catch(Exception e)
    	{
    		System.err.println(e.getMessage());
    	}
    	if (tagFilter!=null)
    	{
    		for (int i = 0; i < contactEmails.size(); i++)
    		{
    			if (StringUtils.isNotBlank(contactEmails.get(i)) && StringUtils.isNotBlank(tag) && StringUtils.isNotBlank(tagCondition))
    			{
    				try
    				{
	    				ContactFilter filter = new ContactFilter();	
	    				//email filter Rule
	    				SearchRule emailRule = new SearchRule();
	    				emailRule.LHS = "email";
	    				emailRule.CONDITION = RuleCondition.EQUALS;
	    				emailRule.RHS = contactEmails.get(i).toLowerCase();
	    				filter.rules.add(emailRule);
	    				//tag filter Rule
	    				SearchRule tagRule = new SearchRule();
	    				tagRule.LHS = "tags";
	    				if(tagCondition.equalsIgnoreCase("EQUALS"))
	    					tagRule.CONDITION = RuleCondition.EQUALS;
	    				else
	    					tagRule.CONDITION = RuleCondition.NOTEQUALS;
	    				tagRule.RHS = tag;
	    				filter.rules.add(tagRule);	
	    				//acl Rules
	    				if(aclRules!=null && aclRules.size() > 0)
	    					filter.rules.addAll(aclRules);
	    					
	    				List<Contact> contacts = new ArrayList<Contact>(filter.queryContacts(count, null, null));
	    				Contact contact = null;
	    				if (contacts != null && contacts.size() > 0)
	    					contact = contacts.get(0);
				
	    				if (contact != null)
	    				{
	    					ObjectMapper mapper = new ObjectMapper();
	    					String contactString = mapper.writeValueAsString(contact);
	    					JSONObject contactJSON = new JSONObject(contactString);
	    					contactsArray.put(contactJSON);
	    				}
    				}
    				catch (Exception e)
    				{
    					System.err.println("Exception occured while fetching contacts for visitors page "
    							+ e.getMessage());
    				}
    			}
    		}
    	}
    	return contactsArray;
    }
    
    /**
     * param email having webstats data w.r.t this domain but not having a
     * contact in Datastore. So creating a JSON object which includes this mail.
     * 
     * @param email
     * @return
     */
    private static JSONObject buildVisitorData(String email)
    {
	JSONObject contact = new JSONObject();
	JSONArray properties = new JSONArray();
	JSONObject emailProperty = new JSONObject();
	try
	{
	    emailProperty.put("type", "SYSTEM");
	    emailProperty.put("name", "email");
	    emailProperty.put("value", email);
	    properties.put(emailProperty);
	    contact.put("properties", properties);
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while building dummy contact " + e.getMessage());
	}
	return contact;
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
     
     public static JSONObject getTagFilter(String filterJsonString) throws JSONException
     {
 	JSONObject tagFilter = null;
 	if (StringUtils.isNotBlank(filterJsonString))
 	{
 	    JSONObject filterJsonObject = new JSONObject(filterJsonString);
 	    JSONArray filters = filterJsonObject.getJSONArray("rules");
 	    for (int i = 0; i < filters.length(); i++)
 	    {
 		JSONObject filter = (JSONObject) filters.get(i);
 		String lhs = filter.get("LHS").toString();
 		if (lhs.equalsIgnoreCase("tags"))
 		{
 		    tagFilter = filter;
 		}
 	    }
 	}
 	return tagFilter;
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
