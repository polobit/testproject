package com.agilecrm.core.api.contacts;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

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
	

	// Remote tags
	@Path("filter-tags")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getTagsTOFilterContacts() {
		List<Tag> tags = Tag.getTags();
		JSONObject result = new JSONObject();

		// Iterate
		try {
		for (Tag tag : tags) {
			result.put(tag.tag, tag.tag);
		} 
		return result.toString();
		}catch (Exception e) {
			return "";
		}
	}

}