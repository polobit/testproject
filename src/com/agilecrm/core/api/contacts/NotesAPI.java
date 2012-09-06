package com.agilecrm.core.api.contacts;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Note;

@Path("/api/notes")
public class NotesAPI
{

    // Note related to contact
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Note saceNote(Note note)
    {
	note.save();
	return note;
    }
}
