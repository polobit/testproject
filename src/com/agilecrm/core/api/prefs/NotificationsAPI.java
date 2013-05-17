package com.agilecrm.core.api.prefs;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.notification.NotificationPrefs;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;

/**
 * <code>NotificationsAPI</code> is used to perform GET and PUT operations on
 * {@link NotificationPrefs}. It replaces notification preferences with updated
 * whenever notification preferences are updated at client side.
 * <p>
 * {@link NotificationPrefsUtil} is used to fetch and update current
 * notification preferences. It fetches notification preferences with respect to
 * agile user.
 * </p>
 * 
 * @author Manohar
 * 
 */
@Path("/api/notifications")
public class NotificationsAPI
{
    /**
     * Gets notification preferences with respect to current user.
     * 
     * @return notification preferences of current user.
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public NotificationPrefs getNotifications()
    {
	try
	{
	    return NotificationPrefsUtil.getCurrentUserNotificationPrefs();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Updates notification preferences of current user.
     * 
     * @param notify
     *            Existing notification preferences.
     * @return Updated notification preferences, otherwise return null if
     *         exception occurs.
     */
    @PUT
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public NotificationPrefs saveNotifications(NotificationPrefs notify)
    {
	try
	{
	    // Get Notifications of user who logged in
	    NotificationPrefs notifications = NotificationPrefsUtil
		    .getCurrentUserNotificationPrefs();

	    notifications.control_notifications = notify.control_notifications;
	    notifications.contact_browsing = notify.contact_browsing;
	    notifications.contact_assigned_browsing = notify.contact_assigned_browsing;
	    notifications.contact_assigned_starred_browsing = notify.contact_assigned_starred_browsing;
	    notifications.contact_opened_email = notify.contact_opened_email;
	    notifications.contact_assigned_opened_email = notify.contact_assigned_opened_email;
	    notifications.contact_assigned_starred_opened_email = notify.contact_assigned_starred_opened_email;
	    notifications.contact_clicked_link = notify.contact_clicked_link;
	    notifications.contact_assigned_clicked_link = notify.contact_assigned_clicked_link;
	    notifications.contact_assigned_starred_clicked_link = notify.contact_assigned_starred_clicked_link;
	    notifications.deal_created = notify.deal_created;
	    notifications.deal_closed = notify.deal_closed;
	    notifications.contact_created = notify.contact_created;
	    notifications.contact_deleted = notify.contact_deleted;
	    notifications.tag_created = notify.tag_created;
	    notifications.tag_deleted = notify.tag_deleted;
	    notifications.notification_sound = notify.notification_sound;

	    notifications.save();
	    return notifications;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}