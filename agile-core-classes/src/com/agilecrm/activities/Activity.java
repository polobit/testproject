package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Activity</code> class represents the Activities performed by user
 * <p>
 * The Activity entity includes time and username and user id and
 * </p>
 * <p>
 * This class implements {@link AgileUser} to create key and to store the key as
 * the User id as owner.
 * </p>
 * <p>
 * The <code>Activity</code> class provides methods to create the Activities.
 * </p>
 * 
 * @author Saikiran
 * 
 */

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

    public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	/**
     * List of contact ids related to a task
     */
    @NotSaved(IfDefault.class)
    public List<String> contacts = null;

    /**
     * List of contact keys related to a task
     */
    public List<Key<Contact>> contacts_related = new ArrayList<Key<Contact>>();

    /**
     * While saving an event it contains list of contact keys, but while
     * retrieving includes complete contact object.
     * 
     * @return List of contact objects
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	return Contact.dao.fetchAllByKeys(this.contacts_related);
    }

    /**
     * Type of the entity used in the activity.
     * 
     */
    public static enum EntityType
    {
	CONTACT, DEAL, TASK, EVENT, CAMPAIGN, DOCUMENT, TICKET
    };

    /**
     * Type of the activity.
     * 
     */
    public static enum ActivityType
    {
	TASK_ADD, TASK_EDIT, TASK_PROGRESS_CHANGE, TASK_OWNER_CHANGE, TASK_STATUS_CHANGE, EVENT_EDIT, CLICK, TASK_COMPLETED, EVENT_DELETE, TASK_DELETE,

	DOCUMENT_REMOVE, CAMPAIGN, BULK_ACTION, BULK_DELETE, EVENT_RELATED_CONTACTS, TASK_RELATED_CONTACTS, DEAL_RELATED_CONTACTS, BULK_EMAIL_SENT, DEAL_LOST, TAG_ADD, TAG_REMOVE, EMAIL_SENT, EVENT_ADD, DEAL_CHANGE, DEAL_ADD, DEAL_EDIT, DEAL_DELETE, DEAL_OWNER_CHANGE, DEAL_MILESTONE_CHANGE, DEAL_CLOSE, DOCUMENT_ADD, NOTE_ADD, CALL, CONTACT_OWNER_CHANGE,

	CONTACT_CREATE, COMPANY_CREATE, CONTACT_DELETE, COMPANY_DELETE, DEAL_ARCHIVE, DEAL_RESTORE, CONTACT_IMPORT, CONTACT_EXPORT, COMPANY_IMPORT, COMPANY_EXPORT, DEAL_IMPORT, DEAL_EXPORT, CAMPAIGN_CREATE, CAMPAIGN_EDIT, CAMPAIGN_DELETE, MERGE_CONTACT,
	TICKET_CREATED, TICKET_DELETED, TICKET_ASSIGNED, TICKET_ASSIGNEE_CHANGED, TICKET_GROUP_CHANGED, TICKET_STATUS_CHANGE, TICKET_PRIORITY_CHANGE, TICKET_TYPE_CHANGE, TICKET_LABEL_ADD, TICKET_LABEL_REMOVE, TICKET_ASSIGNEE_REPLIED, TICKET_REQUESTER_REPLIED, TICKET_PRIVATE_NOTES_ADD, TICKET_MARKED_FAVORITE, TICKET_MARKED_UNFAVORITE, TICKET_MARKED_SPAM, TICKET_MARKED_UNSPAM, BULK_ACTION_MANAGE_LABELS, BULK_ACTION_CHANGE_ASSIGNEE, BULK_ACTION_EXECUTE_WORKFLOW, BULK_ACTION_CLOSE_TICKETS, BULK_ACTION_DELETE_TICKETS, TICKET_TAG_ADD, TICKET_TAG_REMOVE, SET_DUE_DATE, DUE_DATE_CHANGED, DUE_DATE_REMOVED,TICKET_CC_EMAIL_ADD, TICKET_CC_EMAIL_REMOVE, TICKET_NOTES_FORWARD, BULK_ACTION_FAVORITE_TICKETS, BULK_ACTION_SPAM_TICKETS
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

    /**
     * stores modified values
     */
    @NotSaved(IfDefault.class)
    public String custom1 = null;
    /**
     * stores old values
     */
    @NotSaved(IfDefault.class)
    public String custom2 = null;

    /**
     * stores modified fields
     */
    @NotSaved(IfDefault.class)
    public String custom3 = null;

    /**
     * stores deal owner id for deal entity
     */
    @NotSaved(IfDefault.class)
    public String custom4 = null;

    /**
     * stores related contact ids for each activity
     */
    @NotSaved(IfDefault.class)
    public String related_contact_ids;
    
	/**
	 * Util attributes to send data to client when changed group
	 */
	@NotSaved
	public TicketGroups old_group = null, new_group = null;

	/**
	 * Util attributes to send data to client when label added/removed
	 */
	@NotSaved
	public TicketLabels ticket_label = null;
	
	/**
	 * saves domain user who performed the operation
	 */
	/*@NotSaved
	public DomainUser domainUser = null;*/
	
	/**
	 * saves domain user id who performed the operation
	 */
	@NotSaved
	public Long domainUserID = null;

    // Dao
    private static ObjectifyGenericDao<Activity> dao = new ObjectifyGenericDao<Activity>(Activity.class);

    public Activity()
    {

    }

    /*
     * @JsonIgnore public void setUser(Key<DomainUser> user) { this.user = user;
     * }
     */
    /*  *//**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    
      public DomainUserPartial getdomainUser() throws Exception 
      {
    	  if (user != null)
    	  { 
    		  try
    		  { 
			  	return DomainUserUtil.getPartialDomainUser(user.getId());
			  } 
    		  catch (Exception e)
    		  {
    			  System.out.println(ExceptionUtils.getFullStackTrace(e));
    		  }
    	  } 
    	  
    	  return null; 
      }

    /*  *//**
     * 
     * @return user pic of the user who performed activity
     * @throws Exception
     */
    /*
     * @XmlElement(name = "userPic") public String getUserPic() throws Exception
     * { AgileUser agileuser = null; UserPrefs userprefs = null;
     * 
     * try { // Get owner pic through agileuser prefs agileuser =
     * AgileUser.getCurrentAgileUserFromDomainUser(user.getId()); if (agileuser
     * != null) userprefs = UserPrefsUtil.getUserPrefs(agileuser); if (userprefs
     * != null) return userprefs.pic; } catch (Exception e) {
     * e.printStackTrace();
     * 
     * }
     * 
     * return ""; }
     */

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

    /**
     * 
     * @return entity object based id of activity intracts with
     *         {@link DaoActivity} wrapper to get entities
     * @throws Exception
     */
    @XmlElement
    public Object getEntityObject() throws Exception
    {
	if (entity_type == null || entity_id == null)
	    return null;
	Object obj = DaoActivity.getInstace(entity_type.toString(), entity_id);
	return obj;
    }

    /**
     * called this method before activity getting saved
     */
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
    
    @PostLoad
	private void postLoad()
	{
		if (user != null)
			domainUserID = user.getId();
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
