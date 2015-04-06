package com.agilecrm.user.notification;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>NotificationPrefs</code> is the base class for notifications. User can
 * set required notifications by selecting notification preferences at client
 * side. NotificationPrefs set true to those notifications selected.
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Cached
public class NotificationPrefs
{
    /**
     * Id of a notification.Each notification has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * AgileUser Key.
     */
    @Parent
    private Key<AgileUser> user;

    /**
     * The client checks whether the key is present, if not all default values
     * should be true.
     */

    /**
     * ON/OFF notifications
     */
    @NotSaved(IfDefault.class)
    public boolean control_notifications = true;

    /**
     * Browsing
     */
    @NotSaved(IfDefault.class)
    public String browsing = null;

    /**
     * Email Opened
     */
    @NotSaved(IfDefault.class)
    public String email_opened = null;

    /**
     * Link Clicked
     */
    @NotSaved(IfDefault.class)
    public String link_clicked = null;

    /**
     * Deal created notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean deal_created = true;

    /**
     * Deal closed notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean deal_closed = true;

    /**
     * Tag created notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean tag_added = true;

    /**
     * Tag deleted notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean tag_deleted = true;

    /**
     * Contact created notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean contact_added = true;

    /**
     * Contact deleted notification - default true.
     */
    @NotSaved(IfDefault.class)
    public boolean contact_deleted = true;

    @NotSaved(IfDefault.class)
    public boolean call = true;

    /**
     * Notification types.
     * 
     */
    public enum Type
    {
	IS_BROWSING, OPENED_EMAIL, CLICKED_LINK, DEAL_CREATED, DEAL_CLOSED, TAG_ADDED, TAG_DELETED, CONTACT_ADDED, CONTACT_DELETED, CAMPAIGN_NOTIFY
    };

    /** Notification type. */
    public Type type;

    @NotSaved(IfDefault.class)
    public String notification_sound = null;

    /**
     * ObjectifyGenericDao for Notifications.
     */
    private static ObjectifyGenericDao<NotificationPrefs> dao = new ObjectifyGenericDao<NotificationPrefs>(
	    NotificationPrefs.class);

    /**
     * Default NotificationPrefs.
     */
    NotificationPrefs()
    {

    }

    /**
     * Constructs a new {@link NotificationPrefs}.
     * 
     * @param userId
     *            AgileUser Id.
     * @param contact_browsing
     *            Contact Browsing status.
     * @param contact_assigned_browsing
     *            Contact assigned Browsing status.
     * @param contact_assigned_starred_browsing
     *            Contact assigned and starred Browsing status.
     * @param contact_opened_email
     *            Contact opened Email status.
     * @param contact_assigned_opened_email
     *            Contact assigned opened email status.
     * @param contact_assigned_starred_opened_email
     *            Contact assigned and starred opened email status.
     * @param contact_clicked_link
     *            Contact clicked link status.
     * @param contact_assigned_clicked_link
     *            Contact assigned clicked link status.
     * @param contact_assigned_starred_clicked_link
     *            Contact assigned and starred clicked link status.
     * @param deal_created
     *            Deal created status.
     * @param deal_closed
     *            Deal deleted status.
     * @param contact_added
     *            Contact added status.
     * @param contact_deleted
     *            Contact deleted status.
     * @param tag_added
     *            Tag added status.
     * @param tag_deleted
     *            Tag deleted status.
     */
    public NotificationPrefs(Long userId, boolean control_notifications, String browsing, String email_opened,
	    String link_clicked, boolean deal_created, boolean deal_closed, boolean contact_added,
	    boolean contact_deleted, boolean tag_added, boolean tag_deleted, boolean call, String notification_sound)
    {
	this.control_notifications = control_notifications;
	this.browsing = browsing;
	this.email_opened = email_opened;
	this.link_clicked = link_clicked;
	this.deal_created = deal_created;
	this.deal_closed = deal_closed;
	this.contact_added = contact_added;
	this.contact_deleted = contact_deleted;
	this.tag_added = tag_added;
	this.tag_deleted = tag_deleted;
	this.call = call;
	this.notification_sound = notification_sound;

	this.user = new Key<AgileUser>(AgileUser.class, userId);
    }

    /**
     * Gets user preferences with respect to agile user.
     * 
     * @return userprefs as an xml element.
     * 
     * @throws Exception
     *             NullPointerException.
     */
    @XmlElement(name = "Prefs")
    public UserPrefs getPrefs() throws Exception
    {
	if (user != null)
	{
	    Objectify ofy = ObjectifyService.begin();
	    try
	    {
		return ofy.query(UserPrefs.class).ancestor(user).get();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Saves NotificationPrefs.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes NotificationPrefs.
     */
    public void delete()
    {
	dao.delete(this);
    }
}