package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;
import com.agilecrm.email.wrappers.ContactEmailWrapper;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.thirdparty.mandrill.EmailContentLengthLimitExceededException;


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
    public Note updateNote(Note note)
    {
		note.save();
	/*	try
		{
			ContactEmailWrapper contactEmail=new ContactEmailWrapper();
			contactEmail.setMessage(note.description);
			List<String> contact_ids=note.getContact_ids();
			List<Contact> contacts=note.getContacts();
			
			contactEmail.setTo(note.owner_id);
			contactEmail.setFrom(contact_ids.get(0));
			contactEmail.setFrom_name(contacts.get(0).name);
			contactEmail.setSubject(note.subject);
			
		    if (MandrillUtil.isEmailContentSizeValid(contactEmail.getMessage(), contactEmail.getDocument_key()))
		    {
		    	ContactEmailUtil.buildContactEmailAndSend(contactEmail);
	
		    }
	
		}
		catch (EmailContentLengthLimitExceededException e)
		{
		    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
			    .entity(e.getMessage()).build());
		}
		catch (Exception e)
		{
		    
		}
*/
		
		
		return note;
    }

    
    
	
    
  
}