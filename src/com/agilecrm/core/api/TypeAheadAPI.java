package com.agilecrm.core.api;

import java.util.Collection;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.search.AppengineSearch;

/**
 * <code>TypeAheadAPI</code> includes REST calls to interact with Tags and
 * Contacts classes to return data.
 * <p>
 * For tags the data is returned as json object (tag index as key, tag name as
 * value)
 * </p>
 * <p>
 * For contacts the data is returned as json object (contact index as key, name
 * (first and last) as value)
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/typeahead")
public class TypeAheadAPI
{

    /**
     * Fetches all the tags and returns as json object
     * 
     * @param keyword
     *            letters of a tag read as query parameter
     * @return tags json object as string
     */
    @Path("tags")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String typeaheadTags(@QueryParam("q") String keyword)
    {
	List<Tag> tags = TagUtil.getTags();
	String[] availableTags = new String[tags.size()];

	int count = 0;

	// Iterate
	for (Tag tag : tags)
	{
	    availableTags[count++] = tag.tag;
	}

	try
	{
	    JSONObject result = new JSONObject();
	    result.put("availableTags", availableTags);
	    return result.toString();
	}
	catch (Exception e)
	{
	    return "";
	}
    }

    // Typeahead
    /**
     * Fetches the contacts matched to the query parameter and creates a json
     * object with index and name of the contact to return.
     * 
     * @param keyword
     *            a part of contact related field value
     * @return json object as string
     */
    @Path("contacts")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String typeaheadContacts(@QueryParam("q") String keyword,
	    @QueryParam("page_size") String size,
	    @QueryParam("cursor") String cursor)
    {
	Collection contacts = new AppengineSearch<Contact>(Contact.class)
		.getSimpleSearchResults(keyword, Integer.parseInt(size), cursor);

	String[] availableTags = new String[contacts.size()];

	int count = 0;
	// Iterate
	for (Object contactObject : contacts)
	{
	    Contact contact = (Contact) contactObject;
	    System.out.println(contact);
	    availableTags[count++] = contact
		    .getContactFieldValue(Contact.FIRST_NAME)
		    + " "
		    + contact.getContactFieldValue(Contact.LAST_NAME);
	}

	try
	{
	    JSONObject result = new JSONObject();
	    result.put("availableTags", availableTags);

	    return result.toString();
	}
	catch (Exception e)
	{
	    return "";
	}
    }
}