package com.agilecrm.user.notification.util;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

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
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		agileUser.id);

	NotificationPrefs notifications = ofy.query(NotificationPrefs.class)
		.ancestor(userKey).get();

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
	NotificationPrefs notifications = new NotificationPrefs(agileUser.id,
		true, false, true, true, false, false, false, false, true,
		true, false, true, true, true, true, true, "alert_1");
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
    public static void executeNotification(Type type, Object object)
    {
	String objectJson = null;
	JSONObject json = null;
	String domain = null;

	if (object == null)
	    return;

	try
	{
	    // Converting object to json
	    ObjectMapper mapper = new ObjectMapper();
	    objectJson = mapper.writeValueAsString(object);

	    // Including type into json object as notification key
	    json = new JSONObject(objectJson);
	    json.put("notification", type.toString());

	    if (SessionManager.get() != null)
	    {
		AgileUser agileUser = AgileUser.getCurrentAgileUser();
		json.put("current_user", mapper.writeValueAsString(agileUser));
	    }

	    System.out.println("object: " + json);

	    json = reduceObjectSize(json, type);

	    System.out.println("Object json of notification: " + json);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}

	// Our channel for pubnub is current namespace.
	domain = NamespaceManager.get();

	System.out.println("Namespace in NotificationPrefsUtil: " + domain);

	// If domain is empty return
	if (StringUtils.isEmpty(domain))
	    return;

	NotificationsDeferredTask notificationsDeferredTask = new NotificationsDeferredTask(
		domain, json.toString());
	Queue queue = QueueFactory.getQueue("notification-queue");
	queue.add(TaskOptions.Builder.withPayload(notificationsDeferredTask));
    }

    /**
     * Optimising object to reduce it's size, before sending to pubnub.
     * 
     * @param json
     *            - Contact or Deal Object.
     * @param type
     *            - Notification Type.
     * @return JSONObject.
     */
    private static JSONObject reduceObjectSize(JSONObject json, Type type)
    {
	try
	{
	    // Deletes related contacts list and prefs of deals to reduce
	    // message size.
	    if (type == Type.DEAL_CREATED || type == Type.DEAL_CLOSED)
	    {
		if (json.getString("contacts") != null)
		    json.remove("contacts");

		if (json.getString("prefs") != null)
		    json.remove("prefs");

		return json;
	    }

	    // Remove other fields except first-name,last-name, email, image and
	    // owner.
	    if (json.getString("tagsWithTime") != null)
		json.remove("tagsWithTime");

	    if (json.getString("tags") != null)
		json.remove("tags");

	    if (json.getString("widget_properties") != null)
		json.remove("widget_properties");

	    if (json.getString("campaignStatus") != null)
		json.remove("campaignStatus");

	    JSONObject ownerJSON = new JSONObject();
	    if (json.getString("owner") != null)
	    {
		JSONObject owner = json.getJSONObject("owner");
		json.remove("owner");

		ownerJSON.put("id", owner.getString("id"));
		ownerJSON.put("domain", owner.getString("domain"));
		ownerJSON.put("name", owner.getString("name"));
		ownerJSON.put("email", owner.getString("email"));
	    }
	    json.put("owner", ownerJSON);

	    if (json.getString("properties") != null)
	    {
		JSONArray properties = json.getJSONArray("properties");
		json.remove("properties");

		JSONArray propertyArray = new JSONArray();

		for (int index = 0; index < properties.length(); index++)
		{
		    JSONObject property = properties.getJSONObject(index);

		    if (json.getString("type").equals("PERSON"))
		    {
			if (property.getString("name").equals("first_name")
				|| property.getString("name").equals(
					"last_name")
				|| property.getString("name").equals("email")
				|| property.getString("name").equals("image"))
			    propertyArray.put(property);
		    }

		    if (json.getString("type").equals("COMPANY"))
		    {
			if (property.getString("name").equals("name"))
			    propertyArray.put(property);
		    }

		}
		json.put("properties", propertyArray);
	    }

	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return json;
    }
}
