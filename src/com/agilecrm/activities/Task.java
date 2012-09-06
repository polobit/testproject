package com.agilecrm.activities;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
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
	DEFAULT, HIGH, MEDIUM, LOW
    };

    // Key
    @Id
    public Long id;

    // Due
    public Long due = 0L;

    // Category - Call etc.
    public Type type;

    // If the task has been completed
    public boolean is_complete = false;

    // Related Contact
    @NotSaved(IfDefault.class)
    private Key<Contact> contact = null;

    // Owner
    private Key<AgileUser> owner = null;

    // Dao
    private static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(
	    Task.class);

    // Priority Type - Added - Ram - 08/02/12
    public PriorityType priority_type;

    // Subject - Added - Ram - 08/02/12
    @NotSaved(IfDefault.class)
    public String subject = null;

    @NotSaved(IfDefault.class)
    public String contact_id = null;

    Task()
    {

    }

    public Task(Type type, Long due, Long contactId, Long agileUserId)
    {
	// Get Current Agile User
	this.type = type;
	this.due = due;
	if (contactId != 0)
	    this.contact = new Key<Contact>(Contact.class, contactId);

	if (agileUserId != 0)
	    this.owner = new Key<AgileUser>(AgileUser.class, agileUserId);
    }

    @PrePersist
    private void PrePersist()
    {
	if (contact_id != null)
	    contact = new Key<Contact>(Contact.class,
		    Long.parseLong(contact_id));
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

}
