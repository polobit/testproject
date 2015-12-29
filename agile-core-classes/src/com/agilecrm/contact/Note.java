package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.Contact;
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
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Note</code> class stores notes with their related contacts. A contact
 * can be described by adding some notes related to that contact.
 * <p>
 * Each note can be related to a single contact or multiple contacts.
 * <code>Task</code> class provides methods to create, update delete and get the
 * tasks.
 * </p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class Note extends Cursor
{
    // Key
    @Id
    public Long id;

    /**
     * Created time of the note
     */
    public Long created_time = 0L;

    /**
     * Subject of the note, if null is the value don't save in the database
     */
    @NotSaved(IfDefault.class)
    public String subject = null;

    /**
     * Description of the note
     */
    public String description;

    /**
     * List of contact ids, a note related to
     * 
     */
    @NotSaved
    private List<String> contact_ids = new ArrayList<String>();

    @NotSaved
    public List<String> deal_ids = new ArrayList<String>();

    /**
     * Owner key of AgileUser id.
     */
    @NotSaved(IfDefault.class)
    private Key<AgileUser> owner = null;

    /**
     * DomainUser Id who adds note.
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Owner Key object of DomainUser id.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> domain_owner = null;

    /**
     * List of contact keys, a note related to
     */
    @NotSaved(IfDefault.class)
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Separates note from bulk of other models at client side (For timeline
     * purpose). And no queries run on this, so no need to save in the database.
     */
    @NotSaved
    public String entity_type = "note";

    
    //added some variable for logcall which is a special type of note//
    
    /**
     * phoneNumber of the related contact
     */
    @NotSaved(IfDefault.class)
    public String phone = null;
    

    /**
     * callType of the logPhone
     */
    @NotSaved(IfDefault.class)
    public String callType = null;
    
    /**
     * status of the logPhone
     */
    @NotSaved(IfDefault.class)
    public String status = null;
    
    /**
     * duration of the logPhone
     */
    @NotSaved(IfDefault.class)
    public Long duration = null;
    
    
    
    
    // Dao
    public static ObjectifyGenericDao<Note> dao = new ObjectifyGenericDao<Note>(Note.class);

    /**
     * Default constructor
     */
    public Note()
    {

    }

    /**
     * Creates a note object with subject and description
     * 
     * @param subject
     *            subject of the note
     * @param description
     *            description of the note
     * 
     */
    public Note(String subject, String description)
    {
	this.description = description;
	if (subject != null)
	    this.subject = subject;
    }

    /**
     * Saves a note in the database
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Sets note owner. Used for 'AddNote' of campaigns
     * 
     * @param owner
     */
    @JsonIgnore
    public void setOwner(Key<AgileUser> owner)
    {
	this.owner = owner;
    }

    /**
     * Remove related contact owner. Used for delete note of specific contact. 
     * 
     * @param contactKey
     */
    @JsonIgnore
    public void removeRelatedContacts(Key<Contact> contactKey)
    {
	this.related_contacts.remove(contactKey);
    }

    @JsonIgnore
    public void addRelatedContacts(String contactId)
    {
	contact_ids.add(contactId);
    }

    /**
     * Creates contact keys by iterating note related contact ids and assigns
     * created time, if it is 0L.
     */
    @PrePersist
    private void PrePersist()
    {
	System.out.println("contacts before saving : " + contact_ids);

	// Create list of contact keys
	for (Object contact_id : this.contact_ids)
	{
			this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id.toString())));
	}

	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
		
	/**
	 * Commented because not to fill AgileUser as owner for new notes.
	 */
	/*
	 * if (owner == null) owner = new Key<AgileUser>(AgileUser.class,
	 * AgileUser.getCurrentAgileUser().id);
	 */

	// If owner_id is null
	if (owner_id == null)
	{
	    UserInfo userInfo = SessionManager.get();
	    if (userInfo == null)
		return;

	    owner_id = SessionManager.get().getDomainId().toString();
	}

	// Saves domain user key
	domain_owner = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));
	
    }

    /**
     * Gets contacts related with Notes.
     * 
     * @return list of contact objects as xml element related with a deal.
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    }

    public void addContactIds(String id)
    {
	if (contact_ids == null)
	    contact_ids = new ArrayList<String>();

	contact_ids.add(id);
    }

    /**
     * Returns contact ids related to note.
     * 
     * @return
     */
    @XmlElement(name = "contact_ids")
    public List<String> getContact_ids()
    {
	contact_ids = new ArrayList<String>();

	for (Key<Contact> contactKey : related_contacts)
	    contact_ids.add(String.valueOf(contactKey.getId()));

	return contact_ids;
    }

    /**
     * Returns {@link UserPrefs} Object related to current note
     * 
     * @return
     * @throws Exception
     */
    @XmlElement(name = "Prefs")
    public UserPrefs getPrefs() throws Exception
    {
	if (owner != null)
	{
	    Objectify ofy = ObjectifyService.begin();
	    try
	    {
		return ofy.query(UserPrefs.class).ancestor(owner).get();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "domainOwner")
    public DomainUser getDomainOwner() throws Exception
    {
	if (domain_owner != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(domain_owner.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
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
	    if (domain_owner != null)
		agileuser = AgileUser.getCurrentAgileUserFromDomainUser(domain_owner.getId());

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
     * Returns hours to logphone.
     * 
     * @return
     */
    @XmlElement(name = "hour")
    public Long getHour()
    {
    	try{
        	Long timeInSec = this.duration;
        	Long hour = timeInSec/3600;
        	return hour;
    	}catch(Exception e){
    		return null;
    	}
    	


    }
    /**
     * Returns minutes to logphone.
     * 
     * @return
     */
    @XmlElement(name = "min")
    public Long getMin()
    {
    	try{
        	
        	Long timeInSec = this.duration;
    	    Long hour = timeInSec/3600;
    	    Long min = (timeInSec - (hour*3600))/60;
        	return min;
    	}catch(Exception e){
    		return null;
    	}

    	
	    
    }
    /**
     * Returns second to logphone.
     * 
     * @return
     */
    @XmlElement(name = "sec")
    public Long getSec()
    {
    	try{
        	Long timeInSec = this.duration;
    	    Long hour = timeInSec/3600;
    	    Long min = (timeInSec - (hour*3600))/60;
    	    Long sec = timeInSec - (hour*3600) - (min*60);
        	return sec;
    	}catch(Exception e){
    		return null;
    	}
    	

	    
    }
    
    @Override
    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " subj" + subject + " description: " + description;
    }
}