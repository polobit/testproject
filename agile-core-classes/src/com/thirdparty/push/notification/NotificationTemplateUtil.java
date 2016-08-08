package com.thirdparty.push.notification;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.notification.NotificationTemplate;
import com.googlecode.objectify.Query;

/**
 * This <NotificationTemplateUtil> class is used 
 * @author Prashannjet
 *
 */

public class NotificationTemplateUtil
{
	 private static ObjectifyGenericDao<NotificationTemplate> dao = new ObjectifyGenericDao<NotificationTemplate>(NotificationTemplate.class);

	 /**
	  * This method will return list of NotificationTemplate
	  * @return
	  */
	 public static List<NotificationTemplate> getAllNotificationTemplates()
	    {
	    	return NotificationTemplate.dao.fetchAll();
	    }

	 /**
	  * 
	  * @param notificationTemplateId
	  * @returnnotificationTemplate
	  */
	 public static NotificationTemplate getNotificationTemplateById(Long notificationTemplateId)
	    {
			Query<NotificationTemplate> query = dao.ofy().query(NotificationTemplate.class);
			query.filter("id", notificationTemplateId);
			NotificationTemplate notificationTemplate = query.get();
			if (notificationTemplate == null)
			    return null;
			else
			    return notificationTemplate;
	    }
	 /**
	  * Get count of notification template
	  * @returnnotificationTemplate
	  */
	 public static int getNotificationTemplateCount()
	    {
		 return NotificationTemplate.dao.count();
	    }

}
