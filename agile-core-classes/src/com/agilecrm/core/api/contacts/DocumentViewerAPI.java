package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.DocumentNote;
import com.agilecrm.contact.util.DocumentNoteUtil;
import com.agilecrm.contact.util.NoteUtil;


/**
 * <code>DocumentViewerAPI</code> includes REST calls to interact with {@link DocumentViewer} class
 * to initiate Note Create operation.
 * <p>
 * It is called from client side to create notes.
 * It also interacts with {@link NoteUtil} class to fetch the data of Note class
 * from database.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/documentviewer")
public class DocumentViewerAPI
{

    /**
     * Creates a note entity and saves it in database.
     * 
     * @param note
     *            Note entity to save
     * @return saved note object
     */
    
    /**
     * Creates a note entity and saves it in database.
     * 
     * @param note
     *            Note entity to save
     * @return saved note object
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public DocumentNote updateNote(DocumentNote note)
    {
		note.save();
		return note;
    }
    
	@Path("documents")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<DocumentNote> getDocumentsNotes(@QueryParam("documentid") String documentid,@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
		try{
		return DocumentNoteUtil.getDocumentsNotes(documentid,Integer.parseInt(count), cursor);
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		return null;
    }	

    
    
	
    
  
}