package com.thirdparty.push.notification;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.notification.NotificationTemplate;
import com.googlecode.objectify.Query;

/**
 * This <NotificationTemplateUtil> is a utility class to process the data of
 * Push Notification Template class, it processes when fetching the data and
 * saving bulk amount of Notification Template to database.
 * <p>
 * This utility class includes methods needs to return Notification Template
 * based on id, etc..Also includes methods which perform bulk operations on
 * Notification Template.
 * </p>
 * 
 * @author Prashannjet
 * 
 */

public class NotificationTemplateUtil {
	private static ObjectifyGenericDao<NotificationTemplate> dao = new ObjectifyGenericDao<NotificationTemplate>(
			NotificationTemplate.class);

	/**
	 * This method will return list of NotificationTemplate
	 * 
	 * @return
	 */
	public static List<NotificationTemplate> getAllNotificationTemplates() {
		return NotificationTemplate.dao.fetchAll();
	}

	/**
	 * 
	 * @param notificationTemplateId
	 * @returnnotificationTemplate
	 */
	public static NotificationTemplate getNotificationTemplateById(
			Long notificationTemplateId) {
		Query<NotificationTemplate> query = dao.ofy().query(
				NotificationTemplate.class);
		query.filter("id", notificationTemplateId);
		NotificationTemplate notificationTemplate = query.get();
		if (notificationTemplate == null)
			return null;
		else
			return notificationTemplate;
	}

	/**
	 * Get count of notification template
	 * 
	 * @returnnotificationTemplate
	 */
	public static int getNotificationTemplateCount() {
		try {
			return NotificationTemplate.dao.count();
		} catch (Exception e) {
			return 0;
		}

	}
	
	
	/**
	 * Get count of notification template
	 * 
	 * @returnnotificationTemplate
	 */
	public static int getNotificationTemplateCountByName(String notificationName) {
		try {
			return NotificationTemplate.dao.ofy().query(NotificationTemplate.class).filter("notificationName", notificationName).count();
		} catch (Exception e) {
			return 0;
		}

	}

}
