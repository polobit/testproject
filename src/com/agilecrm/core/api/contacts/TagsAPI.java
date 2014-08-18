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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.TagManagement;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.TagUtil;

/**
 * <code>TagsAPI</code> includes REST calls to interact with {@link Tag} class
 * to initiate Tag CRUD operations and {@link Contact} class to get contacts
 * with particular tags.
 * <p>
 * It is called from client side to create, fetch and delete the notes. It also
 * interacts with {@link TagUtil} class to save, fetch and delete the data of
 * Tag class from database and also with {@link ContactUtil} class to get tag
 * related contacts.
 * </p>
 * 
 * @author
 * 
 */
@Path("/api/tags")
public class TagsAPI
{

    /**
     * Fetches all the tags from database and returns as list.
     * 
     * @return list of tags
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Tag> getTags(@QueryParam("reload") boolean reload)
    {
	try
	{
	    return TagUtil.getTags(reload);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all the contacts which are associated with the given tag and returns
     * as list
     * 
     * @param tag
     *            name of the tag
     * @return list of tags
     */
    @Path("{tag}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContacts(@PathParam("tag") String tag, @QueryParam("cursor") String cursor,
	    @QueryParam("page_size") String count)
    {
	try
	{
	    if (count != null)
		return ContactUtil.getContactsForTag(tag, Integer.parseInt(count), cursor);

	    return ContactUtil.getContactsForTag(tag, null, null);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all the tags and iterates the list to put each tag in a json
     * object (key, value pairs). Here tag name is taken as both key and value,
     * for the purpose of contact filters.
     * 
     * @return tags JSONObject as string
     */
    @Path("filter-tags")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getTagsTOFilterContacts()
    {
	List<Tag> tags = TagUtil.getTags();
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

    /**
     * Returns the statistics of tags and contacts (i.e no.of contacts
     * associated with each tag) as json object (tag name as key and no.of
     * contacts with that tag as value)
     * 
     * @return JSONObject as string
     */
    @Path("stats")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public String getTagsStats(@QueryParam("reload") boolean reload)
    {
	System.out.println("reload : " + reload);
	return TagUtil.getStatus(reload);
    }
    
    /**
     * Returns the statistics of tags and contacts (i.e no.of contacts
     * associated with each tag) as json object (tag name as key and no.of
     * contacts with that tag as value)
     * 
     * @return JSONObject as string
     */
    @Path("stats1")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Tag> getTagsStats1(@QueryParam("reload") boolean reload)
    {
	System.out.println("reload : " + reload);
	return TagUtil.getStats(50, null);
    }

    /**
     * Creates new tags in tags database
     * 
     * @param tags
     *            tags string read as path parameter
     */
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
	TagUtil.updateTags(tagsSet);
    }

    /**
     * Deletes a tag from database, based on its id (tag name)
     * 
     * @param tag
     *            name (id) of the tag to be deleted
     */
    @Path("{tag}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteTags(@PathParam("tag") String tag)
    {
	Set<String> tags = new HashSet<String>();
	tags.add(tag);
	TagUtil.deleteTags(tags);
    }
    
    @Path("bulk/delete")
    @DELETE
    public void bulkDeleteTat(@QueryParam("tag") String tag)
    {
	TagManagement.removeTag(tag);
    }
    
    @Path("bulk/rename")
    @POST
    public void renameTag(Tag tag, @QueryParam("tag") String newTag)
    {
	TagManagement.renameTag(tag.tag, newTag);
    }
    
    
    

}