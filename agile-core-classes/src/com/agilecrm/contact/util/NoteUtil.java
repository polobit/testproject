package com.agilecrm.contact.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Event;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>NoteUtil</code> is utility class used to process data of {@link Note}
 * class. It processes only when fetching and deleting the data from
 * <code>Note<code> class
 * <p>
 * This utility class includes methods needed to return and delete note(s) of a contact.
 * </p>
 * 
 * @author
 * 
 */
public class NoteUtil
{
    // Dao
    private static ObjectifyGenericDao<Note> dao = new ObjectifyGenericDao<Note>(Note.class);

    /**
     * Gets all the notes related to a contact
     * 
     * @param contactId
     *            contact id to get its notes
     * @return list of notes related to a contact
     * @throws Exception
     */
    public static List<Note> getNotes(Long contactId) throws Exception
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	return dao.ofy().query(Note.class).filter("related_contacts = ", contactKey).order("-created_time").list();
    }


    /**
     * Gets all the notes related to a contact.
     * 
     * @param contactId
     *            contact id to get its notes
     * @param count
     *            maximum number of notes per page.
     * @param cursor
     *            cursor for next page.
     * @return list of notes related to a contact.
     * @throws Exception
     */
    public static List<Note> getNotes(Long contactId, String count, String cursor) throws Exception
    {

	// If user didn't send the page size, initialize with size 10.
	if (count == null)
	    count = "10";

	Integer max = Integer.parseInt(count);

	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("related_contacts", new Key<Contact>(Contact.class, contactId));

	if (max != 0)
	    return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "-created_time");

	return dao.listByProperty(searchMap);
    }

    /**
     * Gets all the notes related to a deal
     * 
     * @param dealid
     *            dealid deal id to get its notes
     * @return list of notes related to a deal
     * @throws Exception
     */
    public static List<Note> getDealNotes(Long dealid) throws Exception
    {
	Key<Opportunity> dealKey = new Key<Opportunity>(Opportunity.class, dealid);

	return dao.ofy().query(Note.class).filter("related_deals = ", dealKey).order("-created_time").list();
    }

    /**
     * Returns a note based on its id and its related to contact (as parent key)
     * id
     * 
     * @param contactId
     * @param noteId
     * @return
     */
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

    /**
     * gets note object based on id
     * 
     * @param id
     * @return
     */
    public static Note getNote(Long id)
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

    /**
     * Deletes all notes related to a contact (as parent)
     * 
     * @param contactId
     *            contact id to delete its notes
     */
    public static void deleteAllNotes(Long contactId)
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	Iterable<Key<Note>> keys = dao.ofy().query(Note.class).ancestor(contactKey).fetchKeys();
	dao.deleteKeys(keys);
    }

    /**
     * Delete a note, which is related to a contact
     * 
     * @param noteId
     *            note id to create note key
     * @param contactId
     *            contact id to create parent key
     */
    public static void deleteNote(Long noteId, Long contactId)
    {
	Note note = NoteUtil.getNote(noteId);
	List<String> contact_ids = note.getContact_ids();
	if (contact_ids.size() == 1)
	{
	    if (contact_ids.contains(String.valueOf(contactId)))
	    {
		Key<Note> noteKey = new Key<Note>(Note.class, noteId);
		dao.deleteKey(noteKey);
	    }

	}
	else
	{
	    String[] contact_idsArr = new String[contact_ids.size()];
	    contact_idsArr = contact_ids.toArray(contact_idsArr);
	    for (String id : contact_idsArr)
	    {

		if (id.equals(String.valueOf(contactId)))
		{
		    Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
		    note.removeRelatedContacts(contactKey);
		    note.getContact_ids().removeAll(contact_ids);
		    note.save();
		}

	    }

	}
    }

    public static List<Note> getNotesRelatedToCurrentUser()
    {
	return dao.ofy().query(Note.class)
		.filter("owner", new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUser().id))
		.order("-created_time").limit(10).list();
    }

    /**
     * Gets count of the notes related to a contact
     * 
     * @param contactId
     *            contact id to get its notes
     * @return list of notes related to a contact
     * @throws Exception
     */
    public static int getNotesCount(Long contactId) throws Exception
    {
	Query<Note> query = dao.ofy().query(Note.class)
		.filter("related_contacts =", new Key<Contact>(Contact.class, contactId));

	return query.count();
    }

    /**
     * Deletes notes bulk
     * 
     * @param notes_ids
     *            notes ids
     * @return
     * @throws JSONException
     */
    public static void deleteBulkNotes(List<Note> list) throws JSONException
    {
	Note.dao.deleteAll(list);
    }
    
}
