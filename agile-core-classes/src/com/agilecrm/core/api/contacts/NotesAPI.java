package com.agilecrm.core.api.contacts;

import java.util.ArrayList;
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
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.user.access.util.UserAccessControlUtil;
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
	List<String> conIds = note.contact_ids;
    List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    {
    	throw new AccessDeniedException("Note cannot be added because you do not have permission to update associated contact(s).");
    }
	note.save();
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
    Note oldNote = null;
    try 
    {
		oldNote = NoteUtil.getNote(note.id);
	} 
    catch (Exception e) 
    {
		e.printStackTrace();
	}
    if(oldNote != null)
    {
    	List<String> conIds = oldNote.getContact_ids();
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Note cannot be updated because you do not have permission to update associated contact(s).");
    	}
    }
	List<String> conIds = note.contact_ids;
	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
	{
		throw new AccessDeniedException("Note cannot be updated because you do not have permission to update associated contact(s).");
	}
	note.save();
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
	
	/**
     * Deletes all selected notes of a particular contact.
     * 
     * @param model_ids
     *            array of note ids as String
     * @throws JSONException
     */
    @Path("/bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces({ MediaType.APPLICATION_JSON })
    public List<String> deleteNotes(@FormParam("ids") String model_ids) throws JSONException
    {
		JSONArray notesJSONArray = new JSONArray(model_ids);
		JSONArray notesArray = new JSONArray();
		List<String> contactIdsList = new ArrayList<String>();
		if(notesJSONArray!=null && notesJSONArray.length()>0){
			for (int i = 0; i < notesJSONArray.length(); i++) {
				Note note =  NoteUtil.getNote(Long.parseLong(notesJSONArray.get(i).toString()));
				
				List<String> conIds = note.getContact_ids();
				List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
				if(conIds == null || modifiedConIds == null || conIds.size() == modifiedConIds.size())
				{
					notesArray.put(notesJSONArray.getString(i));
					contactIdsList.addAll(modifiedConIds);
				}
				
				try {
					List<Opportunity>deals = OpportunityUtil.getOpportunitiesByNote(note.id);
					for(Opportunity opp : deals){
						opp.save();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		Note.dao.deleteBulkByIds(notesArray);
		return contactIdsList;
    }
  
}