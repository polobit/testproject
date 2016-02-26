package com.agilecrm.contact.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Note;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Query;
import com.agilecrm.contact.DocumentNote;
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
public class DocumentNoteUtil
{
    // Dao
    private static ObjectifyGenericDao<DocumentNote> dao = new ObjectifyGenericDao<DocumentNote>(DocumentNote.class);

    /**
     * Gets all the notes related to a contact
     * 
     * @param contactId
     *            contact id to get its notes
     * @return list of notes related to a contact
     * @throws Exception
     */

    public static List<DocumentNote> getDocumentsNotes(String document_id,int max, String cursor) throws Exception
    {
    	
    	if(document_id!=null)
    	{
    		return dao.ofy().query(DocumentNote.class).filter("document_id =", document_id).order("-document_id").order("-created_time").list();
    	}	
    	Query<DocumentNote> query = dao.ofy().query(DocumentNote.class).order("-created_time");
    	return dao.fetchAllWithCursor(max, cursor, query, false, false);
    	//return dao.ofy().query(Note.class).filter("document_id !=", null).order("-document_id").order("-created_time").list();
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




    
    
    
    
}
