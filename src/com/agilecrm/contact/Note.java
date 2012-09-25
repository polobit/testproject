package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.annotations.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Note
{
    // Key
    @Id
    public Long id;

    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    // Date
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public String subject = null;

    public String description;

    // List of contact id's
    @NotSaved(IfDefault.class)
    @Embedded
    public List<String> contacts = null;

    @NotSaved
    public String entity_type = "note";

    // Dao
    private static ObjectifyGenericDao<Note> dao = new ObjectifyGenericDao<Note>(
	    Note.class);

    public Note()
    {

    }

    public Note(String subject, String description)
    {
	this.description = description;
	if (subject != null)
	    this.subject = subject;
    }

    @PrePersist
    private void PrePersist()
    {
	// Create list of contact keys
	for (String contact_id : this.contacts)
	{
	    this.related_contacts.add(new Key<Contact>(Contact.class, Long
		    .parseLong(contact_id)));
	}

	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
    }

    public static List<Note> getNotes(Long contactId) throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	return ofy.query(Note.class).filter("related_contacts = ", contactKey)
		.list();
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
		+ subject + " description: " + description;
    }

    public void save()
    {
	dao.put(this);
    }

}
