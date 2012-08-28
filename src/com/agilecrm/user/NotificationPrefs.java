package com.agilecrm.user;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class NotificationPrefs {

	@Id
	public Long id;

	@Parent
	private Key<AgileUser> user;
	
	
	// The client checks if the key is not present.. So all default should be true
	
	@NotSaved(IfDefault.class)
	public boolean contat_browsing = true;

	@NotSaved(IfDefault.class)
	public boolean contat_assigned_browsing = true;
	
	@NotSaved(IfDefault.class)
	public boolean contat_assigned_starred_browsing = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_opened_email = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_assigned_opened_email = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_assigned_starred_opened_email = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_clicked_link = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_assigned_clicked_link = true;
	
	@NotSaved(IfDefault.class)
	public boolean contact_assigned_starred_clicked_link = true;
	
	@NotSaved(IfDefault.class)
	public boolean deal_created = true;
	
	@NotSaved(IfDefault.class)
	public boolean deal_closed = true;
	
	private static ObjectifyGenericDao<NotificationPrefs> dao = new ObjectifyGenericDao<NotificationPrefs>(NotificationPrefs.class);


	NotificationPrefs(Long userId, boolean contat_browsing, boolean contat_assigned_browsing, boolean contat_assigned_starred_browsing, boolean contact_opened_email,
				  boolean contact_assigned_opened_email,boolean contact_assigned_starred_opened_email, boolean contact_clicked_link, boolean contact_is_updated,
				  boolean contact_assigned_clicked_link, boolean contact_assigned_starred_clicked_link, boolean deal_created, boolean deal_closed)
	{
		this.contat_browsing = contat_browsing;
		this.contat_assigned_browsing = contat_assigned_browsing;
		this.contat_assigned_starred_browsing = contat_assigned_starred_browsing;
		this.contact_opened_email = contact_opened_email;
		this.contact_assigned_opened_email = contact_assigned_opened_email;
		this.contact_assigned_starred_opened_email = contact_assigned_starred_opened_email;
		this.contact_clicked_link = contact_clicked_link;
		this.contact_assigned_clicked_link = contact_assigned_clicked_link;
		this.contact_assigned_starred_clicked_link = contact_assigned_starred_clicked_link;
		this.deal_created = deal_created;
		this.deal_closed = deal_closed;

		this.user = new Key<AgileUser>(AgileUser.class, userId);

	}

	NotificationPrefs()
	{

	}
	
	public static NotificationPrefs getCurrentUserNotificationPrefs()
	{
		// Agile User
		AgileUser agileUser = AgileUser.getCurrentAgileUser();	
		
		// Get Prefs
		return getNotificationPrefs(agileUser);
	}
	
	
	public static NotificationPrefs getNotificationPrefs(AgileUser agileUser)
	{
		Objectify ofy = ObjectifyService.begin();
		Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class, agileUser.id);

		NotificationPrefs notifications = ofy.query(NotificationPrefs.class).ancestor(userKey).get();
		if (notifications == null)
			return getDefaultNotifications(agileUser);

		return notifications;
	}

	private static NotificationPrefs getDefaultNotifications(AgileUser agileUser)
	{
		NotificationPrefs notifications = new NotificationPrefs(agileUser.id, true, true, false, true, true, true, true, true, true, true, true, true);
		notifications.save();
		return notifications;
	}
	
	public void save()
	{				
		dao.put(this);
	}
	
	public void delete()
	{			
		dao.delete(this);
	}
}
