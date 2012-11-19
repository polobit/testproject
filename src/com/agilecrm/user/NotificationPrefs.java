package com.agilecrm.user;

import java.net.URLEncoder;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.account.APIKey;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.NotificationPrefs.Type;
import com.agilecrm.util.Util;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class NotificationPrefs
{

    @Id
    public Long id;

    @Parent
    private Key<AgileUser> user;

    // The client checks if the key is not present.. So all default should be
    // true

    @NotSaved(IfDefault.class)
    public boolean contact_browsing = true;

    @NotSaved(IfDefault.class)
    public boolean contact_assigned_browsing = true;

    @NotSaved(IfDefault.class)
    public boolean contact_assigned_starred_browsing = true;

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

    @NotSaved(IfDefault.class)
    public boolean tag_created = true;

    @NotSaved(IfDefault.class)
    public boolean tag_deleted = true;

    @NotSaved(IfDefault.class)
    public boolean contact_created = true;

    @NotSaved(IfDefault.class)
    public boolean contact_deleted = true;

    // Notifications
    public enum Type
    {
	BROWSING, OPENED_EMAIL, CLICKED_LINK, DEAL_CREATED, DEAL_CLOSED, TAG_CREATED, TAG_DELETED, CONTACT_CREATED, CONTACT_DELETED
    };

    // Notification type
    public Type type;

    private static ObjectifyGenericDao<NotificationPrefs> dao = new ObjectifyGenericDao<NotificationPrefs>(
	    NotificationPrefs.class);

    NotificationPrefs(Long userId, boolean contact_browsing,
	    boolean contact_assigned_browsing,
	    boolean contact_assigned_starred_browsing,
	    boolean contact_opened_email,
	    boolean contact_assigned_opened_email,
	    boolean contact_assigned_starred_opened_email,
	    boolean contact_clicked_link,
	    boolean contact_assigned_clicked_link,
	    boolean contact_assigned_starred_clicked_link,
	    boolean deal_created, boolean deal_closed, boolean contact_created,
	    boolean contact_deleted, boolean tag_created, boolean tag_deleted)
    {
	this.contact_browsing = contact_browsing;
	this.contact_assigned_browsing = contact_assigned_browsing;
	this.contact_assigned_starred_browsing = contact_assigned_starred_browsing;
	this.contact_opened_email = contact_opened_email;
	this.contact_assigned_opened_email = contact_assigned_opened_email;
	this.contact_assigned_starred_opened_email = contact_assigned_starred_opened_email;
	this.contact_clicked_link = contact_clicked_link;
	this.contact_assigned_clicked_link = contact_assigned_clicked_link;
	this.contact_assigned_starred_clicked_link = contact_assigned_starred_clicked_link;
	this.deal_created = deal_created;
	this.deal_closed = deal_closed;
	this.contact_created = contact_created;
	this.contact_deleted = contact_deleted;
	this.tag_created = tag_created;
	this.tag_deleted = tag_deleted;

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
	Key<AgileUser> userKey = new Key<AgileUser>(AgileUser.class,
		agileUser.id);

	NotificationPrefs notifications = ofy.query(NotificationPrefs.class)
		.ancestor(userKey).get();
	if (notifications == null)
	    return getDefaultNotifications(agileUser);

	return notifications;
    }

    private static NotificationPrefs getDefaultNotifications(AgileUser agileUser)
    {
	NotificationPrefs notifications = new NotificationPrefs(agileUser.id,
		false, true, true, false, false, false, false, true, true,
		false, true, true, true, true, true);
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

    // Execute Notification
    public static void executeNotification(Type type, Object object)

    {
	String json_data = null;

	System.out.println("Executing notification type" + type
		+ " and notification" + object);

	// Converting object to json
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    json_data = mapper.writeValueAsString(object);
	    System.out.println(json_data);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}

	NotificationsDeferredTask notificationsDeferredTask = new NotificationsDeferredTask(
		type, json_data);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(notificationsDeferredTask));
    }

}

class NotificationsDeferredTask implements DeferredTask
{

    Type type;
    String json_data;
    Long agile_id;
    String url = null;

    NotificationsDeferredTask(Type type, String json_data)
    {
	this.type = type;
	this.json_data = json_data;
    }

    public void run()

    {
	// Get API Key
	APIKey api = APIKey.getAPIKey();
	String apiKey = api.api_key;

	url = "https://stats.agilecrm.com:90/push?custom="
		+ URLEncoder.encode(json_data) + "&agile_id="
		+ URLEncoder.encode(apiKey) + "&type="
		+ URLEncoder.encode(type.toString());

	System.out.println("encoded url " + url);

	String output = Util.accessURL(url);
	System.out.println(output);
    }
}
