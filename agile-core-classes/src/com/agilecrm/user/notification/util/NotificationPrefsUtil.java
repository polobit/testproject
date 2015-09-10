package com.agilecrm.user.notification.util;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.deferred.NotificationsDeferredTask;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
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
	if (StringUtils.isEmpty(domain) || json == null)
	    return;

	NotificationsDeferredTask notificationsDeferredTask = new NotificationsDeferredTask(domain, json.toString());
	// PullQueueUtil.addToPullQueue(AgileQueues.NOTIFICATION_PULL_QUEUE,
	// notificationsDeferredTask, null);

	Queue queue = QueueFactory.getQueue("notification-queue");
	queue.addAsync(TaskOptions.Builder.withPayload(notificationsDeferredTask));
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
	    json.put("owner_name", dealJSON.getJSONObject("owner").getString("name"));
	    return json;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }
}