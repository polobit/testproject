package com.agilecrm.core.api.contacts;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.TagManagement;
import com.agilecrm.contact.deferred.TagManagementDeferredTask;
import com.agilecrm.contact.deferred.TagManagementDeferredTask.Action;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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

    @POST
    @Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void saveTag(Tag tag)
    {
	Set<Tag> tags = new HashSet<Tag>();
	tags.add(tag);
	TagUtil.addTag(tag);
    }

    /**
     * Gets all the contacts which are associated with the given tag and returns
     * as list
     * 
     * @param tag
     *            name of the tag
     * @return list of tags
     */
    @Path("/list/{tag}")
    @POST
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getContactsList(@PathParam("tag") String tag, @FormParam("cursor") String cursor,
	    @FormParam("page_size") String count, @FormParam("global_sort_key") String sortKey)
    {
	try
	{
	    if (count != null)
		return ContactUtil.getContactsForTag(tag, Integer.parseInt(count), cursor, sortKey);

	    return ContactUtil.getContactsForTag(tag, null, null, sortKey);

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
    @Path("/list/{tag}/count")
    @GET
    public int getTaggedContactsCount(@PathParam("tag") String tag)
    {
	try
	{
		return ContactUtil.getContactsCountForTag(tag);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return 0;
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
	    @QueryParam("page_size") String count, @QueryParam("global_sort_key") String sortKey)
    {
	try
	{
	    if (count != null)
		return ContactUtil.getContactsForTag(tag, Integer.parseInt(count), cursor, sortKey);

	    return ContactUtil.getContactsForTag(tag, null, null, sortKey);

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
	return TagUtil.getTags(true);
    }

    @Path("stats2")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Tag> getTagsStats2(@QueryParam("reload") boolean reload, @QueryParam("page_size") String page_size,
	    @QueryParam("cursor") String cursor)
    {
	System.out.println("reload : " + reload);
	if (StringUtils.isEmpty(page_size))
	    return TagUtil.getStatus();
	try
	{
	    int tags_fetch_size = Integer.parseInt(page_size);

	    return TagUtil.getStats(tags_fetch_size, cursor);
	}
	catch (NumberFormatException e)
	{
	    return TagUtil.getStatus();
	}
    }

    /**
     * Returns tag with stats (Number of contacts associated with contacts)
     * 
     * @param tag
     * @return
     */
    @Path("getstats/{tag}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Tag getTagStats(@PathParam("tag") String tag)
    {
	return TagUtil.getTagWithStats(tag);

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

    /**
     * Bulk delete tag operations. If contacts that are to be modified are more
     * than with in 800, task is carried out but front end of tasklet. For cases
     * beyond that limit, backend process will be initialized. Although limits
     * specified are quite less than that the limit that front end instance can
     * handle, but just to make sure running without missing out any contacts,
     * limits are set that way
     * 
     * @param tag
     */
    @SuppressWarnings("deprecation")
    @Path("bulk/delete")
    @DELETE
    public void bulkDeleteTag(@QueryParam("tag") String tag)
    {
	TagManagementDeferredTask tagAction = new TagManagementDeferredTask(new Tag(tag), (Tag) null, Action.DELETE);

	// Fetches count of contacts which are related to that tag
	int count = TagManagement.getAvailableContactsCount(tag);

	// If count is less than 100, task is carried out but frontend instance
	if (count <= 100)
	    TagManagement.removeTag(tag);

	// If count is between 100 to 800, task is carried out by taskqueue.
	else if (count > 100 && count < 800)
	{
	    Queue queue = QueueFactory.getQueue(AgileQueues.BULK_TAGS_QUEUE);

	    // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(tagAction);

	    queue.addAsync(taskOptions);
	}

	// If count is more than 800, tasks are carried out but backends.
	else
	{
	    // Initialize task here
	    Queue queue = QueueFactory.getQueue(AgileQueues.BULK_TAGS_QUEUE);

	    // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(tagAction);

	    queue.add(taskOptions);
	}
    }

    @SuppressWarnings("deprecation")
    @Path("bulk/rename")
    @POST
    public void renameTag(Tag tag, @QueryParam("tag") String newTag, @Context HttpServletRequest request)
    {
	TagManagementDeferredTask tagAction = new TagManagementDeferredTask(tag, new Tag(newTag), Action.RENAME);

	// Fetches count of contacts which are related to that tag
	int count = TagManagement.getAvailableContactsCount(tag.tag);

	// If count is less than 100, task is carried out but frontend instance
	if (count <= 100)
	    tagAction.run();

	// If count is between 100 to 800, task is carried out by taskqueue.
	else if (count > 100 && count < 800)
	{
	    Queue queue = QueueFactory.getQueue(AgileQueues.BULK_TAGS_QUEUE);

	    // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(tagAction);

	    queue.addAsync(taskOptions);
	}

	// If count is more than 800, tasks are carried out but backends.
	else
	{
	    // Initialize task here
	    Queue queue = QueueFactory.getQueue(AgileQueues.BULK_TAGS_QUEUE);

	    // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(tagAction);

	    queue.add(taskOptions);
	}
    }

    /**
     * Checks whether the given user has permission to add the tags.
     * 
     * @param tag
     *            Tag to be added to the contact.
     * @return true if the contact is updated after the given time or else
     *         false.
     */
    @Path("/can_add_tag")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hasTagPermission(@QueryParam("tag") String tagsString)
    {
	if (StringUtils.isEmpty(tagsString))
	    return null;

	String[] tagsArray = null;
	try
	{
	    JSONArray tagsJSONArray = new JSONArray(tagsString);

	    tagsArray = new ObjectMapper().readValue(tagsJSONArray.toString(), String[].class);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    tagsArray = tagsString.split(",");
	}

	if (tagsArray == null)
	    return null;

	System.out.println("---------tags list--------" + tagsArray[0]);
	List<String> newTags = TagUtil.hasTagPermission(tagsArray);

	if (newTags.size() > 0)
	{
	    System.out.println("No Permissions: Can not create new tags.");
	    String str = newTags.get(0);
	    for (int i = 1; i < newTags.size(); i++)
		str += ", " + newTags.get(i);
	    throw new AccessDeniedException("Tag '" + str
		    + "' does not exist. You don't have permissions to create a new Tag.");
	}

	return null;
    }
}