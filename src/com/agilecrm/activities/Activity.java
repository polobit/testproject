package com.agilecrm.activities;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Cached
public class Activity extends Cursor
{

    // Key
    @Id
    public Long id;

    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> user = null;

    /**
     * Name of the user performing the activity.
     */
    @NotSaved(IfDefault.class)
    private String user_name = null;

    /**
     * Type of the entity used in the activity.
     * 
     */
    public static enum EntityType
    {
	CONTACT, DEAL, TASK, EVENT, CAMPAIGN, DOCUMENT
    };

    /**
     * Type of the activity.
     * 
     */
    public static enum ActivityType
    {
	TASK_ADD, TASK_EDIT, TASK_PROGRESS_CHANGE, TASK_OWNER_CHANGE, TASK_STATUS_CHANGE, EVENT_EDIT, CLICK, TASK_COMPLETED, EVENT_DELETE, TASK_DELETE,

	CAMPAIGN, BULK_ACTION, BULK_DELETE, EVENT_RELATED_CONTACTS, TASK_RELATED_CONTACTS, DEAL_RELATED_CONTACTS, BULK_EMAIL_SENT, DEAL_LOST, TAG_ADD, EMAIL_SENT, EVENT_ADD, DEAL_CHANGE, DEAL_ADD, DEAL_EDIT, DEAL_DELETE, DEAL_OWNER_CHANGE, DEAL_MILESTONE_CHANGE, DEAL_CLOSE, DOCUMENT_ADD, NOTE_ADD
    };

    /**
     * Type of the entity.
     */
    @NotSaved(IfDefault.class)
    public EntityType entity_type = null;

    /**
     * Type of the activity.
     */
    @NotSaved(IfDefault.class)
    public ActivityType activity_type = null;

    /**
     * Id of the entity.
     */
    @Indexed
    public Long entity_id;

    /**
     * The value of the unique field in the entity to identify it.
     */
    @NotSaved(IfDefault.class)
    public String label = null;

    /**
     * Time of activity performed.
     */
    @Indexed
    public Long time = 0L;

    @NotSaved(IfDefault.class)
    public String custom1 = null;

    @NotSaved(IfDefault.class)
    public String custom2 = null;

    @NotSaved(IfDefault.class)
    public String custom3 = null;

    // Dao
    private static ObjectifyGenericDao<Activity> dao = new ObjectifyGenericDao<Activity>(Activity.class);

    public Activity()
    {

    }

    /*
     * @JsonIgnore public void setUser(Key<DomainUser> user) { this.user = user;
     * }
     */
    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "user")
    public DomainUser getUser() throws Exception
    {
	if (user != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(user.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    @XmlElement(name = "userPic")
    public String getUserPic() throws Exception
    {
	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try
	{
	    // Get owner pic through agileuser prefs
	    agileuser = AgileUser.getCurrentAgileUserFromDomainUser(user.getId());
	    if (agileuser != null)
		userprefs = UserPrefsUtil.getUserPrefs(agileuser);
	    if (userprefs != null)
		return userprefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return "";
    }

    /**
     * Deletes the task from database
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Saves the new task or even updates the existing one.
     */
    public void save()
    {
	dao.put(this);
    }

    @PrePersist
    private void prePersist()
    {

	if (time == 0L && id == null)
	{
	    time = System.currentTimeMillis() / 1000;
	}

	if (user == null)
	{
	    UserInfo userInfo = SessionManager.get();
	    if (userInfo == null)
		return;
	    user_name = userInfo.getName();
	    user = new Key<DomainUser>(DomainUser.class, userInfo.getDomainId());
	}
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
	StringBuilder builder = new StringBuilder();
	builder.append("Activity [id=").append(id).append(", user=").append(user).append(", user_name=")
	        .append(user_name).append(", entity_type=").append(entity_type).append(", activity_type=")
	        .append(activity_type).append(", entity_id=").append(entity_id).append(", label=").append(label)
	        .append(", time=").append(time).append(", custom1=").append(custom1).append("]");
	return builder.toString();
    }

}