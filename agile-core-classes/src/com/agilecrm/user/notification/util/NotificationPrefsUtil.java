package com.agilecrm.user.notification.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgilePushQueuesUtil;
import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.deferred.MobileNotificationsDeferredTask;
import com.agilecrm.user.notification.deferred.NotificationsDeferredTask;
import com.agilecrm.user.push.AgileUserPushNotificationId;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.JSONUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>NotificationPrefsUtil</code> is the utility class for
 * {@link NotificationPrefs}. It consists of various methods to get current
 * notification preferences with respect to agile user. Gets default
 * notification preferences if there are no notification preferences.
 * 
 * @author Manohar
 * 
 */
public class NotificationPrefsUtil
{
    /**
     * Gets notifications with respect to current agileuser.
     * 
     * @return notification objects with respect to current agileuser.
     */
    public static NotificationPrefs getCurrentUserNotificationPrefs()
    {
	// Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// Get Prefs
	return getNotificationPrefs(agileUser);
    }

    /**
     * Gets notifications with respect to agileuser.
     * 
     * @param agileUser
     *            AgileUser Object.
     * @return notification objects with respect to agileuser.
     */
    public static NotificationPrefs getNotificationPrefs(AgileUser agileUser)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

	NotificationPrefs notifications = ofy.query(NotificationPrefs.class).ancestor(userKey).get();

	if (notifications == null)
	    return getDefaultNotifications(agileUser);

	return notifications;
    }

    /**
     * Gets default notification preferences.
     * 
     * @param agileUser
     *            Agile User object.
     * @return Default notification preferences.
     */
    private static NotificationPrefs getDefaultNotifications(AgileUser agileUser)
    {
	NotificationPrefs notifications = new NotificationPrefs(agileUser.id, true, "ANY_CONTACT", "ANY_CONTACT",
		"ANY_CONTACT", false, true, false, false, false, false, true, "alert_1");
	notifications.save();
	return notifications;
    }

    /**
     * Executes notification in DeferredTask with notification type and object.
     * 
     * @param type
     *            Notification Type.
     * @param object
     *            Objects like Contact,Deal etc.
     **/
    public static void executeNotification(Type type, Object object, JSONObject customValue)
    {
	String domain = null;

	if (object == null)
	    return;

	// Our channel for pubnub is current namespace.
	domain = NamespaceManager.get();

	// Optimizing object to reduce its size. PubNub restricts and costs
	// based on object size.
	JSONObject json = optimizeObjectForNotification(type, object, customValue);

	// If domain is empty return
	if (json == null || (!VersioningUtil.isDevelopmentEnv() && StringUtils.isEmpty(domain)))
	    return;
	
	// Verifies for duplicate notifications in Backend modules
	if(!isValid(type, customValue, domain))
		return;
	
	NotificationsDeferredTask notificationsDeferredTask = new NotificationsDeferredTask(domain, json.toString());
	PullQueueUtil.addToPullQueue(AgileQueues.NOTIFICATION_PULL_QUEUE,
	notificationsDeferredTask, null);
	
	// Add Mobile Notofication
	JSONObject pushMessageJSON = optimizeObjectForMobileNotification(json, domain, type);
	System.out.println("pushMessageJSON= " + pushMessageJSON);
	
	MobileNotificationsDeferredTask mobileTask = new MobileNotificationsDeferredTask("GCM", pushMessageJSON.toString(), domain);
	AgilePushQueuesUtil.addTask("mobile-notification-queue", mobileTask);

	//Queue queue = QueueFactory.getQueue("notification-queue");
	//queue.addAsync(TaskOptions.Builder.withPayload(notificationsDeferredTask));
    }
   

	/**
	 * Returns boolean value
	 * 
	 * @param type - Notification Type
	 * @param customValue - custom json
	 * @param domain - Domain
	 * 
	 * @return boolean
	 */
	private static boolean isValid(Type type, JSONObject customValue, String domain)
	{
		// If not frontend module
//		if(ModuleUtil.isDefaultModule())
//			return true;
		
		// If notifications are not Tag type, return true
		if(type == null || !(type.equals(NotificationPrefs.Type.TAG_ADDED) || type.equals(NotificationPrefs.Type.TAG_DELETED)))
			return true;
		
		try
		{
			if(customValue != null && customValue.has("custom_value"))
			{
				String key = domain + "_" + type + "_" + customValue.getString("custom_value");
				
				System.out.println("Custom value is " + customValue.getString("custom_value"));
				System.out.println("Key is " + key);
				
				if(CacheUtil.getCache(key) != null)
				{
					System.err.println("Returning as it is duplicate notification.");
					return false;
				}
				
				CacheUtil.setCache(key, true, 5 * 60 * 1000);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return true;
	}

    /**
     * Optimizes object size that is sent in notification. PubNub restricts size
     * of object that is sent based on billable, so sending only required
     * content.
     * 
     * @param type
     *            - notification type.
     * @param object
     *            - Object that is sent.
     * @param customValue
     *            - custom value like tag-name, url clicked etc.
     * @return JSONObject
     */
    private static JSONObject optimizeObjectForNotification(Type type, Object object, JSONObject customValue)
    {

	try
	{
	    JSONObject json = getNotificationJSON(object);

	    // Insert notification-type into json
	    json.put("notification", type.toString());

	    if (customValue != null)
		// to insert tag-value and url link in notification
		json.put("custom_value", customValue.getString("custom_value"));

	    // To show notifications for all other users except action
	    // performer. It doesn't works for tags added from campaigns,
	    // browsing, link-clicked and email-opened notifications as there
	    // won't be any session. All users get notifications in these cases.
	    if (SessionManager.get() != null)
	    {
		AgileUser agileUser = AgileUser.getCurrentAgileUser();

		if (agileUser != null)
		    json.put("current_user_name", agileUser.getDomainUser().name);
	    }

	    // System.out.println("Object json of notification: " + json);
	    return json;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got exception while optimising notification " + e.getMessage());
	    return null;
	}

    }

    /**
     * Returns object of notification in json.
     * 
     * @param object
     *            - Object to be sent in notification such as Contact or Deal.
     * @return JSONObject
     */
    public static JSONObject getNotificationJSON(Object object)
    {

	String objectStr = null;

	try
	{
	    ObjectMapper mapper = new ObjectMapper();

	    // Contact
	    if (object instanceof Contact)
	    {
		try
		{
		    objectStr = mapper.writeValueAsString(object);
		    return getContactJSONForNotification(new JSONObject(objectStr));
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	    }

	    // Deals
	    if (object instanceof Opportunity)
	    {
		try
		{
		    objectStr = mapper.writeValueAsString(object);
		    return getDealJSONForNotification(new JSONObject(objectStr));
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}

	    }

	    return new JSONObject(object.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONObject();
	}
    }

    /**
     * Returns JSONObject with required contact fields for notification.
     * 
     * @param contactJSON
     *            - Contact Object JSON.
     * @return JSONObject.
     */
    private static JSONObject getContactJSONForNotification(JSONObject contactJSON)
    {
	JSONObject json = new JSONObject();

	try
	{
	    json.put("id", contactJSON.getString("id"));

	    // to know starred contact i.e., star-value > 0
	    json.put("star_value", contactJSON.getString("star_value"));

	    // PERSON or COMPANY
	    json.put("type", contactJSON.getString("type"));
	    json.put("properties", getContactProperties(contactJSON));

	    if (contactJSON.has("owner") && !contactJSON.isNull("owner"))
			json.put("owner_name", contactJSON.getJSONObject("owner").getString("name"));

	    return json;
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns required contact properties as JSONArray
     * 
     * @param contactJSON
     *            - Contact JSON object.
     * @return JSONArray
     */
    private static JSONArray getContactProperties(JSONObject contactJSON)
    {
	JSONArray propertyArray = new JSONArray();

	try
	{
	    JSONArray properties = contactJSON.getJSONArray("properties");

	    for (int index = 0; index < properties.length(); index++)
	    {
		JSONObject property = properties.getJSONObject(index);

		// Contact properties of type PERSON
		if (contactJSON.getString("type").equals("PERSON"))
		{
		    if (property.getString("name").equals("first_name")
			    || property.getString("name").equals("last_name")
			    || property.getString("name").equals("email") || property.getString("name").equals("image"))
			propertyArray.put(property);
		}

		// Contact properties of type COMPANY
		if (contactJSON.getString("type").equals("COMPANY"))
		{
		    if (property.getString("name").equals("name") || property.getString("name").equals("url"))
			propertyArray.put(property);
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return propertyArray;
    }

    /**
     * Returns Deal JSONObject with required Deal attributes for notification.
     * 
     * @param dealJSON
     *            - Deal Object JSON.
     * @return JSONObject
     */
    private static JSONObject getDealJSONForNotification(JSONObject dealJSON)
    {
	JSONObject json = new JSONObject();
	try
	{
	    json.put("id", dealJSON.getString("id"));
	    json.put("name", dealJSON.getString("name"));
	    json.put("entity_type", dealJSON.getString("entity_type"));
	    // json.put("owner_name", dealJSON.getJSONObject("owner").getString("name"));
	    
	    try {
	    	if(dealJSON.has("owner_id") && dealJSON.has("owner_id")){
		    	DomainUser user = DomainUserUtil.getDomainUser(dealJSON.getLong("owner_id"));
		    	if(user != null)
		    		json.put("owner_name", user.name);
		    }
		} catch (Exception e) {
		}
	    
	    return json;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }
    
    
    /**
     * Optimizes object size that is sent in notification. PubNub restricts size
     * of object that is sent based on billable, so sending only required
     * content.
     * 
     * @param type
     *            - notification type.
     * @param object
     *            - Object that is sent.
     * @param customValue
     *            - custom value like tag-name, url clicked etc.
     * @return JSONObject
     */
    private static JSONObject optimizeObjectForMobileNotification(JSONObject json, String domain, Type type)
    {

    JSONObject notificationJSON = new JSONObject();
	try
	{
		notificationJSON.put("title", getTitle(json.getString("notification").replace("_", " ")));

	    // Insert notification-type into json
		JSONObject dataJSON = getMobileNotificationMessage(json, domain);
		notificationJSON.put("message", JSONUtil.getJSONValue(dataJSON, "message"));
		if(type != null)
			notificationJSON.put("type", type.toString());
		
		if(dataJSON.has("pushURL"))
			notificationJSON.put("url", JSONUtil.getJSONValue(dataJSON, "pushURL"));

	    System.out.println("optimizeObjectForMobileNotification: " + json);
	    return notificationJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got exception while optimising notification " + e.getMessage());
	    return null;
	}

    }
    
    /**
     * Optimizes object size that is sent in notification. PubNub restricts size
     * of object that is sent based on billable, so sending only required
     * content.
     * 
     * @param type
     *            - notification type.
     * @param object
     *            - Object that is sent.
     * @param customValue
     *            - custom value like tag-name, url clicked etc.
     * @return JSONObject
     * @throws JSONException 
     */
    private static JSONObject getMobileNotificationMessage(JSONObject json, String domainName) throws JSONException
    {
    // Response fields
    JSONObject dataJSON = new JSONObject();
    String pushURL = "", hostName = VersioningUtil.getHostURLByApp(domainName);
    
    System.out.println("json = " + json);
	String mssg = "", customVal = "";
	JSONObject customJSON = new JSONObject();
	if(!json.has("notification")){
		return dataJSON.put("message", mssg);
	}
		  
	
	String type = JSONUtil.getJSONValue(json, "type");
	String notification = JSONUtil.getJSONValue(json, "notification");
	switch (notification) {
	case "DEAL_CREATED":
		mssg  = "'" + JSONUtil.getJSONValue(json, "name") + "' Deal Created" + addOwnerInfo(json);
		pushURL = hostName + "#deals/" + JSONUtil.getJSONValue(json, "id");
		break;
	
	case "DEAL_CLOSED":
		mssg = "'" + JSONUtil.getJSONValue(json, "name") + "' Deal Closed" + addOwnerInfo(json);
		break;
		
	case "TAG_ADDED":
		mssg = "'" + JSONUtil.getJSONValue(json, "custom_value") + "' Tag has been Added" + addOwnerInfo(json);
		break;
	
	case "TAG_DELETED":
		mssg = "'" + JSONUtil.getJSONValue(json, "custom_value") + "' Tag has been Deleted" + addOwnerInfo(json);
		break;

	case "CONTACT_ADDED": 
		if(StringUtils.equalsIgnoreCase(type, "PERSON"))
			mssg = getContactName(json) +  " Contact Added" + addOwnerInfo(json);
		else 
			mssg = "'" + getContactPropertyValue(json, "name") + "' Company Added" + addOwnerInfo(json);
		pushURL = hostName + "#contacts/" + JSONUtil.getJSONValue(json, "id");
		break;
	
	case "CONTACT_DELETED": 
		if(StringUtils.equalsIgnoreCase(type, "PERSON"))
			mssg = getContactName(json) + " Contact Deleted" + addOwnerInfo(json);
		else 
			mssg = "'" + getContactPropertyValue(json, "name") + "' Company Deleted" + addOwnerInfo(json);
		break;
		
	case "CAMPAIGN_NOTIFY":
		mssg  = getContactName(json);
		try {
			customVal = JSONUtil.getJSONValue(json, "custom_value");
			try {
				mssg += new JSONObject(customVal).getString("msg");
			} catch (Exception e) {
				mssg += customVal;
			}
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		break;
	
	case "CLICKED_LINK":
		customVal = JSONUtil.getJSONValue(json, "custom_value");
		try {
			customJSON = new JSONObject(customVal);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if(!customJSON.has("workflow_name"))
			mssg = getContactName(json) + "clicked link '" + JSONUtil.getJSONValue(customJSON, "url_clicked") + "'";
		else
			mssg = getContactName(json) + "clicked link '" + JSONUtil.getJSONValue(customJSON, "url_clicked") + "' of campaign '" + JSONUtil.getJSONValue(customJSON, "workflow_name") + "'";
		break;
		
	case "OPENED_EMAIL":
		customVal = JSONUtil.getJSONValue(json, "custom_value");
		try {
			customJSON = new JSONObject(customVal);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		if(customJSON.has("workflow_name"))
			mssg = getContactName(json) + "opened email of campaign '" + JSONUtil.getJSONValue(customJSON, "workflow_name") + "'";
		else
			mssg = getContactName(json) + "opened email with subject '" + JSONUtil.getJSONValue(customJSON, "email_subject") + "'";
		break;
		
	/*
	{{#IS_BROWSING}}
		{{/IS_BROWSING}}
	{{#EVENT_REMINDER}}
	  Coming up at '{{title}}' {{epochToHumanDate "h:MM TT" start}}
	{{/EVENT_REMINDER}}
		break; */

	default:
		break;
	}
	
	dataJSON.put("message", mssg);
	if(StringUtils.isNotBlank(pushURL))
		dataJSON.put("pushURL", pushURL);
	
	return dataJSON;
    }
    
    private static String addOwnerInfo(JSONObject json) {
    	String userName = "";
    	if(json.has("owner_name"))
    		userName = JSONUtil.getJSONValue(json, "owner_name");
    	else if(json.has("current_user_name"))
    		userName = JSONUtil.getJSONValue(json, "current_user_name");
    	
    	if(StringUtils.isNotBlank(userName))
    		return  " by " + userName;
    	
    	return "";
    }
    
    private static String getContactPropertyValue(JSONObject contactJSON, String key){
    	
    	try {
    		JSONArray properties = contactJSON.getJSONArray("properties");
        	for (int i = 0; i < properties.length(); i++) {
        		JSONObject field = properties.getJSONObject(i);
    			if(field.getString("name").equalsIgnoreCase(key))
    				  return field.getString("value");
    		}
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
    	return "";
    }
    
    private static String getContactName(JSONObject json){
    	try {
    		return "'" + getContactPropertyValue(json, "first_name") + " " + getContactPropertyValue(json, "last_name") + "' ";
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
    	return "";
    }
    
    public static boolean isNotificationEnabledToSend(AgileUserPushNotificationId notifierId, JSONObject messageJSON) {
    	System.out.println("isNotificationEnabledToSend = " + messageJSON);
    	
    	if(notifierId == null || messageJSON == null || !messageJSON.has("type"))
    		  return false;
    	
    	AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(notifierId.domainUserId);
    	NotificationPrefs prefs =  NotificationPrefsUtil.getNotificationPrefs(agileUser);
    	if(prefs == null || !prefs.control_notifications || !prefs.push_mobile_notification)
    		return false;
    	
    	System.out.println("type = " + prefs);
    	
    	String type = JSONUtil.getJSONValue(messageJSON, "type");
    	if(StringUtils.isBlank(type))
    		 return false;

    	if(type.equalsIgnoreCase("DEAL_CREATED"))
    		return prefs.deal_created;
    	
    	if(type.equalsIgnoreCase("DEAL_CLOSED"))
  		  	return prefs.deal_closed;
    	
    	if(type.equalsIgnoreCase("TAG_ADDED"))
  		  	return prefs.tag_added;
    	
    	if(type.equalsIgnoreCase("TAG_DELETED"))
  		  	return prefs.tag_deleted;
    	
    	if(type.equalsIgnoreCase("CONTACT_ADDED"))
  		  	return prefs.contact_added;
    	
    	if(type.equalsIgnoreCase("CONTACT_DELETED"))
  		  	return prefs.contact_deleted;
    	
    	if(type.equalsIgnoreCase("CAMPAIGN_NOTIFY"))
  		  	return true;
    	
    	return true;
    }
    
    private static String getTitle(String title){
    	if(StringUtils.isBlank(title))
    		return title;
    	
    	title = title.replace(" ", "_").toUpperCase();
    	
    	switch (title) {
	    	case "CLICKED_LINK":
	    		title = "LINK CLICKED";
	    		break;
	    		
	    	case "OPENED_EMAIL":
	    		title = "EMAIL OPENED";
	    		break;
    	}
    	return title;
    }
}