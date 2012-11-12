package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Task
{

    // Category - Call etc.
    public enum Type
    {
	CALL, EMAIL, FOLLOW_UP, MEETING, MILESTONE, SEND, TWEET
    };

    // Priority Type - Default
    public enum PriorityType
    {
	HIGH, NORMAL, LOW
    };

    // Key
    @Id
    public Long id;

    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    // Due
    public Long due = 0L;

    public Long created_time = 0L;

    // Category - Call etc.
    public Type type;

    // If the task has been completed
    public boolean is_complete = false;

    // List of contact id's
    @NotSaved(IfDefault.class)
    @Embedded
    public List<String> contacts = null;

    // Owner
    private Key<AgileUser> owner = null;

    // Dao
    public static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(
	    Task.class);

    // Priority Type - Added - Ram - 08/02/12
    public PriorityType priority_type;

    // Subject - Added - Ram - 08/02/12
    @NotSaved(IfDefault.class)
    public String subject = null;

    @NotSaved
    public String entity_type = "task";

    Task()
    {

    }

    public Task(Type type, Long due, Long agileUserId)
    {
	// Get Current Agile User
	this.type = type;
	this.due = due;

	if (agileUserId != 0)
	    this.owner = new Key<AgileUser>(AgileUser.class, agileUserId);
    }

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
		this.related_contacts.add(new Key<Contact>(Contact.class, Long
			.parseLong(contact_id)));
	    }

	    this.contacts = null;
	}

	// Create owner key
	if (owner == null)
	{
	    AgileUser agileUser = AgileUser.getCurrentAgileUser();
	    if (agileUser != null)
		this.owner = new Key<AgileUser>(AgileUser.class, agileUser.id);
	}
    }

    // Get Event
    public static Task getTask(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Get contact related tasks
    public static List<Task> getContactTasks(Long contactId) throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	return ofy.query(Task.class).filter("related_contacts = ", contactKey)
		.list();
    }

    // Get Tasks
    public static List<Task> getOverdueTasks()
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    System.out.println("check for " + startTime);
	    // Get tasks before today's time and which are not completed
	    return dao.ofy().query(Task.class).filter("due <=", startTime)
		    .filter("is_complete", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Get All Tasks
    public static List<Task> getAllTasks()
    {
	try
	{
	    return dao.ofy().query(Task.class).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Get All Tasks
    public static List<Task> getAllPendingTasks()
    {
	try
	{
	    return dao.ofy().query(Task.class).filter("is_complete", false)
		    .list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Get Event
    public static List<Task> getPendingTasks(int numDays)
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    // Get Date after days days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight()
		    .getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Get end start and endtime
	    return dao.ofy().query(Task.class).filter("due >=", startTime)
		    .filter("due <=", endTime).filter("is_complete", false)
		    .list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Task> getPendingTasksToRemind(int numDays,
	    Key<AgileUser> owner)
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    // Get Date after days days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight()
		    .getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Get end start and endtime
	    return dao.ofy().query(Task.class).filter("owner =", owner)
		    .filter("due >=", startTime).filter("due <=", endTime)
		    .filter("is_complete", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Delete Contact
    public void delete()
    {
	dao.delete(this);
    }

    // Save Contact
    public void save()
    {

	dao.put(this);
    }

    // Save Contact
    public void completeTask()
    {
	is_complete = true;
	save();
    }

    // Contacts related with task
    @XmlElement
    public List<Contact> getContacts()
    {

	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    }

}
