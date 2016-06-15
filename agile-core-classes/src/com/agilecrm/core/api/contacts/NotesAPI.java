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
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;

/**
 * <code>NotesAPI</code> includes REST calls to interact with {@link Note} class
 * to initiate Note Create, Read and Delete operations.
 * <p>
 * It is called from client side to create, update, fetch and delete the notes.
 * It also interacts with {@link NoteUtil} class to fetch the data of Note class
 * from database.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/notes")
public class NotesAPI
{

    /**
     * Creates a note entity and saves it in database.
     * 
     * @param note
     *            Note entity to save
     * @return saved note object
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Note saveNote(Note note)
    {
	note.save();
	if(note.getContact_ids() != null && note.getContact_ids().size() > 0){
		List<String> contactIds = note.getContact_ids();
		for(String s : contactIds){
			try{			
				Contact contact = ContactUtil.getContact(Long.parseLong(s));
				contact.forceSearch = true;
				contact.save();		
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}
	try
	{
	    ActivitySave.createNoteAddActivity(note);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return note;
    }

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
    	try {
			Note oldNote = NoteUtil.getNote(note.id);
			if(oldNote.getContact_ids() != null && oldNote.getContact_ids().size() > 0){
				List<String> contactIds = oldNote.getContact_ids();
				for(String s : contactIds){
					try{			
						Contact contact = ContactUtil.getContact(Long.parseLong(s));
						contact.forceSearch = true;
						contact.save();		
					}catch(Exception e){
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	note.save();
    	try {
			if(note.getContact_ids() != null && note.getContact_ids().size() > 0){
				List<String> contactIds = note.getContact_ids();
				for(String s : contactIds){
					try{			
						Contact contact = ContactUtil.getContact(Long.parseLong(s));
						contact.forceSearch = true ;
						contact.save();		
					}catch(Exception e){
						e.printStackTrace();
					}
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return note;
    }

    /**
     * 
     * @param id
     *            note id
     * @return note object based on id
     */
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Note getNote(@PathParam("id") Long id)
    {
	Note note = NoteUtil.getNote(id);
	System.out.println("note id " + note);
	return note;
    }

    @Path("/my/notes")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Note> getNotesRelatedToCurrentUser()
    {
	return NoteUtil.getNotesRelatedToCurrentUser();
    }
    /**
	 * Saving call info and history.
	 * 
	 * @author prakash
	 * @created 07-12-2015
	 * @return String
	 */
	@Path("save_logPhoneActivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("id") Long id, @FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration,@FormParam("callWidget") String callWidget) {		

		Contact contact  = null;
		
		if (null != id ){
    		contact = ContactUtil.getContact(id);
		}else{
			if(!StringUtils.isBlank(phone)){
				contact = ContactUtil.searchContactByPhoneNumber(phone);
			}
		}
		
		if(null == contact){
			return "";
		}
		
	    		if (direction.equalsIgnoreCase("outbound-dial") || direction.equalsIgnoreCase("Outgoing"))
	    		{
	    			ActivityUtil.createLogForCalls(callWidget, phone, Call.OUTBOUND, status.toLowerCase(), duration);

	    		    // Trigger for outbound
	    			 CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.OUTBOUND, status.toLowerCase(), duration);
	    		}

	    		if (direction.equalsIgnoreCase("inbound") || direction.equalsIgnoreCase("Incoming"))
	    		{
	    			 ActivityUtil.createLogForCalls(callWidget, phone, Call.INBOUND, status.toLowerCase(), duration);
	    			 

	    		    // Trigger for inbound
	    		    CallTriggerUtil.executeTriggerForCall(contact, callWidget, Call.INBOUND, status.toLowerCase(), duration);
	    		}

	   return "";
	}
  
}