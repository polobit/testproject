package com.agilecrm.core.api.prefs;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.NotificationPrefs;

@Path("/api/notifications")
public class NotificationsAPI {

	// Notifications
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NotificationPrefs getNotifications() {
		try {
			return NotificationPrefs.getCurrentUserNotificationPrefs();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public NotificationPrefs saveNotifications(NotificationPrefs notify) {
		try {
			// Get UserId of person who is logged in
			NotificationPrefs notifications = NotificationPrefs
					.getCurrentUserNotificationPrefs();

			notifications.contat_browsing = notify.contat_browsing;
			notifications.contat_assigned_browsing = notify.contat_assigned_browsing;
			notifications.contat_assigned_starred_browsing = notify.contat_assigned_starred_browsing;
			notifications.contact_opened_email = notify.contact_opened_email;
			notifications.contact_assigned_opened_email = notify.contact_assigned_opened_email;
			notifications.contact_assigned_starred_opened_email = notify.contact_assigned_starred_opened_email;
			notifications.contact_clicked_link = notify.contact_clicked_link;
			notifications.contact_assigned_clicked_link = notify.contact_assigned_clicked_link;
			notifications.contact_assigned_starred_clicked_link = notify.contact_assigned_starred_clicked_link;
			notifications.deal_created = notify.deal_created;
			notifications.deal_closed = notify.deal_closed;

			notifications.save();

			return notifications;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}