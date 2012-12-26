package com.agilecrm.user.notification.util;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.deferred.NotificationsDeferredTask;
import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.NotificationPrefs.Type;
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
		false, true, true, false, false, false, false, true, true,
		false, true, true, true, true, true);
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
	String jsonData = null;

	// Converting object to json
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    jsonData = mapper.writeValueAsString(object);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}

	NotificationsDeferredTask notificationsDeferredTask = new NotificationsDeferredTask(
		type, jsonData);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(notificationsDeferredTask));
    }
}
