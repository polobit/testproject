package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;

@Path("/api/typeahead")
public class TypeAheadAPI {

	// Typeahead
	@Path("tags")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String typeaheadTags(@QueryParam("q") String keyword) {
		List<Tag> tags = Tag.getTags();
		String[] availableTags = new String[tags.size()];

		int count = 0;

		// Iterate
		for (Tag tag : tags) {
			System.out.println(tag);
			availableTags[count++] = tag.tag;
		}

		try {
			JSONObject result = new JSONObject();
			result.put("availableTags", availableTags);
			return result.toString();
		} catch (Exception e) {
			return "";
		}
	}

	// Typeahead
	@Path("contacts")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String typeaheadContacts(@QueryParam("q") String keyword) {
		List<Contact> contacts = Contact.searchContacts(keyword);
		String[] availableTags = new String[contacts.size()];

		int count = 0;
		// Iterate
		for (Contact contact : contacts) {
			System.out.println(contact);
			availableTags[count++] = contact
					.getContactFieldValue(Contact.FIRST_NAME)
					+ " "
					+ contact.getContactFieldValue(Contact.LAST_NAME);
		}

		try {
			JSONObject result = new JSONObject();
			result.put("availableTags", availableTags);

			return result.toString();
		} catch (Exception e) {
			return "";
		}
	}

}