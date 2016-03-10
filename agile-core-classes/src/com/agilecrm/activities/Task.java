package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
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
@Cached
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
    public String type;

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
     * completed time of task
     */
    public Long task_completed_time = 0L;

    /**
     * start date of the task
     * 
     */
    public Long task_start_time = 0L;

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

    /*********************** new fields *****************************/
    /**
     * List of note keys related to a task
     */
    private List<Key<Note>> related_notes = new ArrayList<Key<Note>>();

    /**
     * List of note ids related to a task
     */
    @NotSaved(IfDefault.class)
    public List<String> notes = null;

    /**
     * Note id's of related task for a deal Ghanshyam.
     */
    @NotSaved
    private List<String> note_ids = new ArrayList<String>();

    /**
     * note's description related to a task
     */
    @NotSaved(IfDefault.class)
    public String note_description = null;
    
  //Description about  the task
    @NotSaved(IfDefault.class)
    public String taskDescription = null;

    public int progress = 0;

    public enum Status
    {
	YET_TO_START, IN_PROGRESS, COMPLETED
    };

    public Status status = Status.YET_TO_START;

    /**
     * Deal ids of related deals for a document.
     */
    @NotSaved
    private List<String> deal_ids = new ArrayList<String>();

    /**
     * Related deal objects fetched using deal ids.
     */
    private List<Key<Opportunity>> related_deals = new ArrayList<Key<Opportunity>>();
    /**************************************************************/

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
    public Task(String type, Long due)
    {
	this.type = type;
	this.due = due;

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
	    if (owner != null)
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

	if (this.id != null)
	{
	    Task oldtask = TaskUtil.getTask(this.id);
	    task_start_time = oldtask.task_start_time;
	    if (oldtask.progress == 0)
	    {
		if (this.progress > 0)
		    task_start_time = System.currentTimeMillis() / 1000;
	    }
	}

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

	// If owner_id is null
	if (owner_id == null)
	{
	    UserInfo userInfo = SessionManager.get();
	    if (userInfo == null)
		return;

	    owner_id = SessionManager.get().getDomainId().toString();
	}
	// Saves domain user key
	if (owner_id != null)
	    owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));

	System.out.println("Owner : " + this.owner);

	/************* New added code @author jagadeesh ******************/

	if (this.is_complete == true || this.progress == 100 || this.status == status.COMPLETED)
	{
	    task_completed_time = System.currentTimeMillis() / 1000;
	}

	/************* New added code ******************/

	// If new note is added to task
	if (this.note_description != null)
	{
	    if (!this.note_description.trim().isEmpty())
	    {
		// Create note
		Note note = new Note(null, this.note_description);

		// Save note
		note.save();

		// Add note to task
		this.related_notes.add(new Key<Note>(Note.class, note.id));
	    }

	    // Make temp note null
	    this.note_description = null;
	}

	if (this.notes != null)
	{
	    // Create list of Note keys
	    for (String note_id : this.notes)
	    {
		this.related_notes.add(new Key<Note>(Note.class, Long.parseLong(note_id)));
	    }

	    this.notes = null;
	}

	if (deal_ids != null)
	{
	    for (String deal_id : this.deal_ids)
		this.related_deals.add(new Key<Opportunity>(Opportunity.class, Long.parseLong(deal_id)));
	}

	// Setting note_ids from api calls
	setRelatedNotes();
    }

    /************************ New task view methods ******************************/
    /**
     * While saving a task it contains list of notes keys, but while retrieving
     * includes complete note object.
     * 
     * @return List of note objects
     */
    @XmlElement
    public List<Note> getNotes()
    {
	return Note.dao.fetchAllByKeys(this.related_notes);
    }

    public void addNotes(String id)
    {
	if (notes == null)
	    notes = new ArrayList<String>();

	notes.add(id);
    }

    /**
     * Returns list of notes related to task.
     * 
     * @param id
     *            - Task Id.
     * @return list of Notes
     */
    public List<Note> getNotes(Long id)
    {
	Task task = TaskUtil.getTask(id);
	return task.getNotes();
    }

    /**
     * While saving a task it contains list of deal keys, but while retrieving
     * includes complete deal object.
     * 
     * @return List of deal objects
     */
    @XmlElement
    public List<Opportunity> getDeals()
    {
	return Opportunity.dao.fetchAllByKeys(this.related_deals);
    }

    /**
     * Gets deals related with document.
     * 
     * @return list of deal objects as xml element related with a document.
     */
    @XmlElement(name = "deal_ids")
    public List<String> getDeal_ids()
    {
	deal_ids = new ArrayList<String>();

	for (Key<Opportunity> dealKey : related_deals)
	    deal_ids.add(String.valueOf(dealKey.getId()));

	return deal_ids;
    }

    @XmlElement(name = "note_ids")
    public List<String> getNote_ids()
    {
	note_ids = new ArrayList<String>();

	for (Key<Note> noteKey : related_notes)
	    note_ids.add(String.valueOf(noteKey.getId()));

	return note_ids;
    }

    /**
     * Set related notes to the Case. Annotated with @JsonIgnore to prevent auto
     * execution of this method (conflict with "PUT" request)
     * 
     * @param owner_key
     */
    @JsonIgnore
    public void setRelatedNotes()
    {
	Set<String> notesSet = null;
	if (this.notes != null && !this.notes.isEmpty())
	{
	    notesSet = new HashSet<String>(notes);

	}
	else if (this.note_ids != null && !this.note_ids.isEmpty())
	{
	    notesSet = new HashSet<String>(note_ids);
	}
	if (notesSet != null)
	{

	    // Create list of Note keys
	    for (String note_id : notesSet)
	    {
		this.related_notes.add(new Key<Note>(Note.class, Long.parseLong(note_id)));
	    }

	    this.notes = null;
	}
    }

    public void addContactIdsToTask(List<String> contact_idList)
    {
	List<String> al = new ArrayList<String>();
	for (String contact_id : contact_idList)
	{

	    /*
	     * if (!this.get.contains(contact_id)) { al.add(contact_id); }
	     */
	    for (Contact c : getContacts())
	    {
		if (!c.id.equals(contact_id))
		    al.add(contact_id);
	    }
	}

	contacts = al;
	save();

    }

    /***************************************************************************/
}