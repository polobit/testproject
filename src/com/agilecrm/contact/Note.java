package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
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
public class Note
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
    @NotSaved(IfDefault.class)
    public List<String> contacts = null;

    @NotSaved(IfDefault.class)
    private Key<AgileUser> owner = null;

    /**
     * List of contact keys, a note related to
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Separates note from bulk of other models at client side (For timeline
     * purpose). And no queries run on this, so no need to save in the database.
     */
    @NotSaved
    public String entity_type = "note";

    // Dao
    public static ObjectifyGenericDao<Note> dao = new ObjectifyGenericDao<Note>(
	    Note.class);

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
     * Creates contact keys by iterating note related contact ids and assigns
     * created time, if it is 0L.
     */
    @PrePersist
    private void PrePersist()
    {
	// Create list of contact keys
	for (String contact_id : this.contacts)
	{
	    this.related_contacts.add(new Key<Contact>(Contact.class, Long
		    .parseLong(contact_id)));
	}

	owner = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
    }

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

    @Override
    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " subj"
		+ subject + " description: " + description;
    }
}
