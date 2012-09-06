package com.agilecrm.contact;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Note
{
    // Key
    @Id
    public Long id;

    // Contact Parent
    @Parent
    private Key<Contact> contact;

    // Date
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public String subject = null;

    public String note;

    @NotSaved(IfDefault.class)
    public String contact_id = null;

    // Dao
    private static ObjectifyGenericDao<Note> dao = new ObjectifyGenericDao<Note>(
	    Note.class);

    public Note()
    {

    }

    public Note(Long contactId, String subject, String note)
    {
	this.contact = new Key<Contact>(Contact.class, contactId);
	this.note = note;
	if (subject != null)
	    this.subject = subject;
    }

    @PrePersist
    private void PrePersist()
    {

	// Create contact key
	if (contact_id != null)
	    contact = new Key<Contact>(Contact.class,
		    Long.parseLong(contact_id));

	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
    }

    public static List<Note> getNotes(Long contactId) throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	return ofy.query(Note.class).ancestor(contactKey).list();
    }

    // Return note from contact id and Note Id
    public static Note getNote(Long contactId, Long noteId)
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	try
	{
	    return dao.get(new Key<Note>(contactKey, Note.class, noteId));
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();

	}

	return null;
    }

    public static void deleteAllNotes(Long contactId)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	Iterable<Key<Note>> keys = ofy.query(Note.class).ancestor(contactKey)
		.fetchKeys();
	ofy.delete(keys);
    }

    public static void deleteNote(Long noteId, Long contactId)
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	Key<Note> noteKey = new Key<Note>(contactKey, Note.class, noteId);
	ofy.delete(noteKey);
    }

    @Override
    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " subj"
		+ subject + " note: " + note + " contact:" + contact;
    }

    public void save()
    {
	dao.put(this);
    }
}
