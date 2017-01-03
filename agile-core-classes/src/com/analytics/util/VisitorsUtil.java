package com.analytics.util;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.access.UserAccessControl;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.visitors.VisitorSegmentationQueryGenerator;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * 
 * @author Ramesh Rudra Class contains utility methods related to visitors.
 *
 */
public class VisitorsUtil
{
    
    public static ObjectifyGenericDao<Contact> contactDAO = new ObjectifyGenericDao<Contact>(Contact.class);
    
    public static ContactFilter getContactFilter(String filterJsonString) throws JSONException
    {
	ContactFilter contactFilter = new ContactFilter();
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
		    String tag = filter.get("RHS").toString();
		    String tagCondition = filter.getString("CONDITION").toString();
		    SearchRule tagRule = new SearchRule();
		    tagRule.LHS = "tags";
		    tagRule.RHS = tag;
		    if (tagCondition.equalsIgnoreCase("EQUALS"))
			tagRule.CONDITION = RuleCondition.EQUALS;
		    else
			tagRule.CONDITION = RuleCondition.NOTEQUALS;
		    contactFilter.rules.add(tagRule);
		}
	    }
	}
	return contactFilter;
    }
    
    public static List<String> getEmailsFromWebStatsServer(String filterJSON, String startTime, String endTime,
	    String pageSize, String cursor)
    {
	try
	{
	    String statsServerUrl = "https://agilecrm-web-stats.appspot.com/visitors";
	    Map<String, String> params = new LinkedHashMap<String, String>();
	    params.put("filter_json", filterJSON);
	    params.put("cursor", cursor);
	    params.put("page_size", pageSize);
	    params.put("start_time", startTime);
	    params.put("end_time", endTime);
	    params.put("domain", NamespaceManager.get());
	    params.put("psd", AnalyticsUtil.STATS_SEREVR_HTTP_REQUEST_PWD);
	    
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
	    for (int i = 0; i < contactEmailsJsonArray.length(); i++)
	    {
		JSONObject contactEmail = contactEmailsJsonArray.getJSONObject(i);
		emails.add(contactEmail.get("email").toString());
	    }
	    try
	    {
		JSONObject firstObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 1);
		//JSONObject lastObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 1);
		//String emailCountString = lastObject.get("total_rows_count").toString();
		String scannedUpto = firstObject.getString("stats_time");
		// emails.add(firstObject.get("email").toString());
		emails.add(scannedUpto);
		//emails.add(emailCountString);
	    }
	    catch (Exception e)
	    {
		System.err.println("exception occured while fetching segmented email count " + e.getMessage());
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
	// String tag = null;
	// String condition = null;
	// boolean hasTagFilter = false;
	// try
	// {
	// if(tagFilter!=null)
	// {
	// tag = tagFilter.get("RHS").toString();
	// condition = tagFilter.getString("CONDITION").toString();
	// hasTagFilter = true;
	// }
	// }
	// catch(Exception e)
	// {
	// System.err.println(e.getMessage());
	// }
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
			// if(StringUtils.isNotBlank(tag) &&
			// StringUtils.isNotBlank(condition))
			// {
			// if(condition.equalsIgnoreCase("EQUALS"))
			// searchMap.put("tagsWithTime.tag",tag);
			// else
			// {
			// searchMap.put("tagsWithTime.tag !",tag);
			// }
			// }
			
			for (String propName : searchMap.keySet())
			    query.filter(propName, searchMap.get(propName));
			System.out.println(query.toString());
			Contact contact = contactDAO.fetch(query);
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
    public static JSONArray getContactsFromTextSearch(List<String> contactEmails, ContactFilter filter, int count)
    {
	JSONArray contactsArray = new JSONArray();
	List<SearchRule> aclRules = null;
	try
	{
	    // Sets ACL condition
	    aclRules = new ArrayList<SearchRule>();
	    UserAccessControlUtil.checkReadAccessAndModifyTextSearchQuery(
		    UserAccessControl.AccessControlClasses.Contact.toString(), aclRules, null);
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	if (filter != null && filter.rules.size() > 0)
	{
	    for (int i = 0; i < contactEmails.size(); i++)
	    {
		if (StringUtils.isNotBlank(contactEmails.get(i)))
		{
		    try
		    {
			ContactFilter contactFilter = new ContactFilter();
			contactFilter.rules.addAll(filter.rules);
			// email filter Rule
			SearchRule emailRule = new SearchRule();
			emailRule.LHS = "email";
			emailRule.CONDITION = RuleCondition.EQUALS;
			emailRule.RHS = contactEmails.get(i).toLowerCase();
			contactFilter.rules.add(emailRule);
			// acl Rules
			if (aclRules != null && aclRules.size() > 0)
			    contactFilter.rules.addAll(aclRules);
			
			List<Contact> contacts = new ArrayList<Contact>(contactFilter.queryContacts(count, null, null));
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
//    public static List<String> getEmails(String filterJSON, String startTime, String endTime, String pageSize,
//	    String cursor)
//    {
//	try
//	{
//	    List<String> emails = new ArrayList<String>();
//	    String currentNamespace = "our";
//	    VisitorSegmentationQueryGenerator segmentationQueryGenerator = new VisitorSegmentationQueryGenerator(
//		    currentNamespace, filterJSON, startTime, endTime, cursor, pageSize);
//	    String segementationQuery = segmentationQueryGenerator.generateSegmentationQuery();
//	    JSONArray mergedStats = AnalyticsSQLUtil.getVisitors(segementationQuery);
//	    
//	    JSONArray contactEmailsJsonArray = new JSONArray(mergedStats.toString());
//	    int emailsSize = contactEmailsJsonArray.length();
//	    if (emailsSize > 1)
//	    {
//		for (int i = 0; i < emailsSize - 1; i++)
//		{
//		    JSONObject contactEmail = contactEmailsJsonArray.getJSONObject(i);
//		    emails.add(contactEmail.get("email").toString());
//		}
//		try
//		{
//		    JSONObject firstObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 2);
//		    JSONObject lastObject = contactEmailsJsonArray.getJSONObject(contactEmailsJsonArray.length() - 1);
//		    String emailCountString = lastObject.get("total_rows_count").toString();
//		    String scannedUpto = firstObject.getString("stats_time");
//		    // emails.add(firstObject.get("email").toString());
//		    emails.add(scannedUpto);
//		    emails.add(emailCountString);
//		}
//		catch (Exception e)
//		{
//		    System.err.println("exception occured while fetching segmented email count " + e.getMessage());
//		}
//	    }
//	    return emails;
//	}
//	catch (Exception e)
//	{
//	    e.printStackTrace();
//	    System.err.println(e.getMessage());
//	    return null;
//	}
//    }
}
