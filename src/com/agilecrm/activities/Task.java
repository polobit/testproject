package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Task</code> class stores tasks with its owner and related contacts.
 * Tasks are like To-Dos. These are result oriented. You can assign a category
 * such as call, email, meeting etc. to these tasks.
 * <p>
 * Each task can be related to a single contact or multiple contacts. Also tasks
 * have current agile user as owner.
 * </p>
 * <p>
 * Tasks can be filtered based on their status of completion. Available statuses
 * are 'pending', 'completed' and 'overdue' tasks. By default, the tasks are
 * marked as 'pending' tasks while creating. User can change the status to
 * 'completed' if desired by setting the is_complete variable to true.
 * </p>
 * <p>
 * <code>Task</code> class provides methods to create, update, delete and get
 * the tasks.
 * </p>
 * 
 * @author Rammohan
 * 
 */
@XmlRootElement
public class Task extends Cursor
{
    // Key
    @Id
    public Long id;

    /**
     * Type of the task (category)
     */
    public enum Type
    {
	CALL, EMAIL, FOLLOW_UP, MEETING, MILESTONE, SEND, TWEET, OTHER
    };

    /**
     * Specifies type of the task
     */
    public Type type;

    /**
     * Priority type of the task, indicates the Urgency. Available priorities
     * are high, normal and low.
     * 
     */
    public enum PriorityType
    {
	HIGH, NORMAL, LOW
    };

    /**
     * Sets the priority as specified.
     */
    public PriorityType priority_type;

    /**
     * List of contact keys related to a task
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Due date of the task
     */
    public Long due = 0L;

    /**
     * Created time of task
     */
    public Long created_time = 0L;

    /**
     * If the task has been completed, is_complete sets to true.
     */
    public boolean is_complete = false;

    /**
     * List of contact ids related to a task
     */
    @NotSaved(IfDefault.class)
    public List<String> contacts = null;

    /**
     * DomainUser Id who created Deal.
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner = null;

    /**
     * Says what the task is. If it is null shouldn't save in database.
     */
    @NotSaved(IfDefault.class)
    public String subject = null;

    /**
     * Separates task from bulk of other models at client side (For timeline
     * purpose). And no queries run on this, so no need to save in the database.
     */
    @NotSaved
    public String entity_type = "task";

    public int progress;
    public String descrption = null;

    public enum Status
    {
	NOT_STARTED, IN_PROGRESS, COMPLETED, PAUSED
    };

    public Status status;

    // Dao
    public static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(Task.class);

    /**
     * Default constructor
     */
    public Task()
    {

    }

    /**
     * Creates a task with it's type, due date and owner id
     * 
     * @param type
     *            Type of the task (call, email, meeting etc..)
     * @param due
     *            Due date of the task
     * @param agileUserId
     *            Agile user id to create owner
     */
    public Task(Type type, Long due, int progress, String descrption, Status status)
    {
	this.type = type;
	this.due = due;

	this.progress = progress;
	this.descrption = descrption;
	this.status = status;
	// if (agileUserId != 0)
	// this.agileUser = new Key<AgileUser>(AgileUser.class, agileUserId);
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

    /**
     * Turns the pending task as completed task
     */
    public void completeTask()
    {
	is_complete = true;
	save();
    }

    @JsonIgnore
    public void setOwner(Key<DomainUser> user)
    {
	owner = user;
    }

    /**
     * While saving a task it contains list of contact keys, but while
     * retrieving includes complete contact object.
     * 
     * @return List of contact objects
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	return Contact.dao.fetchAllByKeys(this.related_contacts);
    }

    public void addContacts(String id)
    {
	if (contacts == null)
	    contacts = new ArrayList<String>();

	contacts.add(id);
    }

    /**
     * Returns list of contacts related to task.
     * 
     * @param id
     *            - Task Id.
     * @return list of Contacts
     */
    public List<Contact> getContacts(Long id)
    {
	Task task = TaskUtil.getTask(id);
	return task.getContacts();
    }

    /**
     * Gets picture of owner who created deal. Owner picture is retrieved from
     * user prefs of domain user who created deal and is used to display owner
     * picture in deals list.
     * 
     * @return picture of owner.
     * @throws Exception
     *             when agileuser doesn't exist with respect to owner key.
     */
    @XmlElement(name = "ownerPic")
    public String getOwnerPic() throws Exception
    {
	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try
	{
	    // Get owner pic through agileuser prefs
	    agileuser = AgileUser.getCurrentAgileUserFromDomainUser(owner.getId());
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
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "taskOwner")
    public DomainUser getTaskOwner() throws Exception
    {
	if (owner != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(owner.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Assigns created time for the new one, creates task related contact keys
     * list with their ids and owner key with current agile user id.
     */
    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	if (this.contacts != null)
	{
	    // Create list of Contact keys
	    for (String contact_id : this.contacts)
	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	    }

	    this.contacts = null;
	}
	System.out.println("Owner_id : " + this.owner_id);

	// Saves domain user key
	if (owner_id != null)
	    owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

	System.out.println("Owner : " + this.owner);
    }
}