package com.agilecrm.user;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>NotificationPrefs</code> is the base class for notifications.User can
 * set required notifications by selecting notification preferences at client
 * side.NotificationPrefs set true to those notifications selected.
 * 
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
public class NotificationPrefs
{

    /**
     * Id of a notification.Each notification has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * AgileUser Key
     */
    @Parent
    private Key<AgileUser> user;

    // The client checks if the key is not present.. So all default should be
    // true

    /**
     * Contact browsing notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_browsing = true;

    /**
     * Contact assigned browsing notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_browsing = true;

    /**
     * Contact assigned and starred browsing notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_starred_browsing = true;

    /**
     * Contact opened email notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_opened_email = true;

    /**
     * Contact assigned opened email notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_opened_email = true;

    /**
     * Contact assigned and starred opened email notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_starred_opened_email = true;

    /**
     * Contact clicked link notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_clicked_link = true;

    /**
     * Contact assigned clicked link notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_clicked_link = true;

    /**
     * Contact assigned and starred clicked link notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_assigned_starred_clicked_link = true;

    /**
     * Deal created notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean deal_created = true;

    /**
     * Deal closed notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean deal_closed = true;

    /**
     * Tag created notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean tag_created = true;

    /**
     * Tag deleted notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean tag_deleted = true;

    /**
     * Contact created notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_created = true;

    /**
     * Contact deleted notification - default true
     */
    @NotSaved(IfDefault.class)
    public boolean contact_deleted = true;

    // Notifications
    /**
     * Notification types
     * 
     */
    public enum Type
    {
	BROWSING, OPENED_EMAIL, CLICKED_LINK, DEAL_CREATED, DEAL_CLOSED, TAG_CREATED, TAG_DELETED, CONTACT_CREATED, CONTACT_DELETED
    };

    // Notification type
    public Type type;

    /**
     * ObjectifyGenericDao for Notifications.
     */
    private static ObjectifyGenericDao<NotificationPrefs> dao = new ObjectifyGenericDao<NotificationPrefs>(
	    NotificationPrefs.class);

    /**
     * Default NotificationPrefs
     */
    NotificationPrefs()
    {

    }

    /**
     * Constructs a new {@link NotificationPrefs}
     * 
     * @param userId
     *            AgileUser Id
     * @param contact_browsing
     *            Contact Browsing status
     * @param contact_assigned_browsing
     *            Contact assigned Browsing status
     * @param contact_assigned_starred_browsing
     *            Contact assigned and starred Browsing status
     * @param contact_opened_email
     *            Contact opened Email status
     * @param contact_assigned_opened_email
     *            Contact assigned opened email status
     * @param contact_assigned_starred_opened_email
     *            Contact assigned and starred opened email status
     * @param contact_clicked_link
     *            Contact clicked link status
     * @param contact_assigned_clicked_link
     *            Contact assigned clicked link status
     * @param contact_assigned_starred_clicked_link
     *            Contact assigned and starred clicked link status
     * @param deal_created
     *            Deal created status
     * @param deal_closed
     *            Deal deleted status
     * @param contact_created
     *            Contact created status
     * @param contact_deleted
     *            Contact deleted status
     * @param tag_created
     *            Tag created status
     * @param tag_deleted
     *            Tag deleted status
     */
    public NotificationPrefs(Long userId, boolean contact_browsing,
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

    /**
     * Gets user preferences with respect to agile user.
     * 
     * @return userprefs as an xml element
     * 
     * @throws Exception
     *             NullPointerException
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
     * Saves NotificationPrefs
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes NotificationPrefs
     */
    public void delete()
    {
	dao.delete(this);
    }

}
