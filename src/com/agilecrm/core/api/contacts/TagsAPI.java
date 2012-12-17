package com.agilecrm.core.api.contacts;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;

@Path("/api/tags")
public class TagsAPI
{

    // Tags
    // Notes
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Tag> getTags()
    {
	try
	{
	    return Tag.getTags();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Tags
    // Notes
    @Path("{tag}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContacts(@PathParam("tag") String tag)
    {
	try
	{
	    return ContactUtil.getContactsForTag(tag);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Remote tags
    @Path("filter-tags")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getTagsTOFilterContacts()
    {
	List<Tag> tags = Tag.getTags();
	JSONObject result = new JSONObject();

	// Iterate
	try
	{
	    for (Tag tag : tags)
	    {
		result.put(tag.tag, tag.tag);
	    }
	    return result.toString();
	}
	catch (Exception e)
	{
	    return "";
	}
    }

    // Stats
    @Path("stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getTagsStats()
    {
	List<Tag> tags = Tag.getTags();
	JSONObject result = new JSONObject();

	// Iterate
	try
	{
	    for (Tag tag : tags)
	    {
		result.put(tag.tag, ContactUtil.getContactsCountForTag(tag.tag));
	    }
	    return result.toString();
	}
	catch (Exception e)
	{
	    return "";
	}
    }

    @Path("{tags}")
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public void addTags(@PathParam("tags") String tags)
    {

	String tagsArray[] = tags.split(",");

	Set<String> tagsSet = new HashSet<String>();
	for (int index = 0; index < tagsArray.length; index++)
	{
	    tagsSet.add(tagsArray[index]);
	}
	// Update Tags - Create a deferred task
	Tag.updateTags(tagsSet);
    }

    @Path("{tag}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteTags(@PathParam("tag") String tag)
    {
	Set<String> tags = new HashSet<String>();
	tags.add(tag);
	Tag.deleteTags(tags);
    }

}