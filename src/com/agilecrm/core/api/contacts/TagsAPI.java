package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;

@Path("/api/tags")
public class TagsAPI {

	// Tags
	// Notes
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Tag> getTags() {
		try {
			return Tag.getTags();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// Tags
	// Notes
	@Path("{tag}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Contact> getContacts(@PathParam("tag") String tag) {
		try {
			return Contact.getContactsForTag(tag);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}