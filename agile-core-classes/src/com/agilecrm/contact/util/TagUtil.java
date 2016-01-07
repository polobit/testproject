package com.agilecrm.contact.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.deferred.TagStatsDeferredTask;
import com.agilecrm.contact.deferred.TagsDeferredTask;
import com.agilecrm.contact.deferred.tags.TagDBUpdateDeferredTask;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.validator.TagValidator;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskAlreadyExistsException;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.apphosting.utils.config.ApplicationXml.Modules.Web;
import com.googlecode.objectify.Key;

/**
 * <code>TagUtil</code> is utility class used to process data of {@link Tag}
 * class. It processes when adding, fetching and deleting the data from
 * <code>Tag<code> class
 * <p>
 * This utility class includes methods needed to save, return and delete tag(s) 
 * of a contact.
 * </p>
 * 
 */
public class TagUtil
{
    // Dao
    public static ObjectifyGenericDao<Tag> dao = new ObjectifyGenericDao<Tag>(Tag.class);

    /**
     * Creates a tag in database, by verifying its existence in database.
     * 
     * Called when a contact is created
     * 
     * @param tags
     */
    public static void updateTags(Set<String> tags)
    {

	List<Key<Tag>> tagKeys = null;

	// If tags exist, fetch tagKeys
	if (tags.size() != 0)
	    tagKeys = dao.listAllKeys();

	boolean newTags = false;

	// Add to tags Library
	for (String tagName : tags)
	{

	    // Checks for empty or null or whitespace(\s*) tag.
	    if (StringUtils.isBlank(tagName))
		continue;

	    if (tagKeys.indexOf(new Key<Tag>(Tag.class, tagName)) == -1)
	    {
		// Add tag to db
		Tag.addTag(tagName);

		newTags = true;
	    }
	}

	// Remove tags from cache
	if (newTags)
	    CacheUtil.deleteCache(NamespaceManager.get() + "_tags");

    }

    public static void addTag(Tag tag)
    {
	Tag oldTag = getTag(tag.tag);
	if (oldTag != null)
	    return;

	tag.addTag(tag.tag);

    }

    /**
     * Updates tags database based on tracker. If there is a tracker, assuming
     * it is a bulk action and it is run with custom task name
     * 
     * @param tags
     * @param tracker
     */
    public static void runUpdateDeferedTask(List<Tag> tags, String tracker)
    {
	if (StringUtils.isEmpty(tracker))
	{
	    Set<String> tagsSet = new HashSet<String>();

	    for (Tag tag : tags)
	    {
		tagsSet.add(tag.tag);
	    }
	    // Update Tags - Create a deferred task
	    TagsDeferredTask tagsDeferredTask = new TagsDeferredTask(tagsSet);
	    Queue queue = QueueFactory.getQueue(AgileQueues.TAG_ENTITY_QUEUE);
	    queue.addAsync(TaskOptions.Builder.withPayload(tagsDeferredTask));
	    return;
	}

	Queue queue = QueueFactory.getQueue(AgileQueues.TAG_ENTITY_QUEUE);
	for (Tag tag : tags)
	{
	    TagDBUpdateDeferredTask task = new TagDBUpdateDeferredTask(tag, tracker);

	    String tagName = SearchUtil.normalizeString(tag.tag) + "_" + NamespaceManager.get() + "_" + tracker;

	    try
	    {
		System.out.println("tag name : " + tagName);
		queue.addAsync(TaskOptions.Builder.withPayload(task).taskName(tagName));
	    }
	    catch (TaskAlreadyExistsException e)
	    {

		e.printStackTrace();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}

    }

    /**
     * Deletes tags one by one (by iterating the set of tags) from database, if
     * there is no more contacts with the tag.
     * 
     * @param tags
     *            Set of tag names
     */
    public static void deleteTags(Set<String> tags)
    {

	boolean tagsDeleted = false;
	// Add to tags Library
	for (String tagName : tags)
	{
	    tagsDeleted = deleteTag(tagName);
	}

	if (tagsDeleted)
	    CacheUtil.deleteCache(NamespaceManager.get() + "_tags");

    }

    public static boolean deleteTag(String tagName)
    {
	if (StringUtils.isBlank(tagName))
	    return false;

	// Check if there is any contact with this tag
	int count = ContactUtil.getContactsCountForTag(tagName);
	if (count == 0)
	{
	    // Delete this tag
	    Key<Tag> tagKey = new Key<Tag>(Tag.class, tagName);

	    dao.deleteKey(tagKey);
	    return true;
	}

	return false;

    }

    /**
     * Gets a tag based on its tag name (id), if no tag is found with the id
     * returns null
     * 
     * @param tagName
     *            id of the tag entity
     * @return {@link Tag} entity
     */
    public static Tag getTag(String tagName)
    {
	Key<Tag> tagKey = new Key<Tag>(Tag.class, tagName);

	try
	{
	    return dao.get(tagKey);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public static Tag getTagWithStats(String tag)
    {
	Key<Tag> tagKey = new Key<Tag>(Tag.class, tag);

	try
	{
	    Tag tagObject = dao.get(tagKey);
	    int count = ContactUtil.getContactsCountForTag(tagObject.tag);
	    tagObject.availableCount = count;

	    return tagObject;

	}
	catch (Exception e)
	{
	    return null;
	}

    }

    /**
     * Fetches all the tags from the database and returns as list
     * 
     * @return list of tags
     */
    public static List<Tag> getTags()
    {
	try
	{
	    return dao.fetchAll();
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public static List<Tag> getTags(int size, String cursor)
    {
	return dao.fetchAll(size, cursor, null, true, true);

    }

    /**
     * Fetches tags from database only if they are not available in memcache are
     * hard reload is chosen. When tags are fetched from database they are
     * stored in memcache
     * 
     * @param fetchFromDB
     * @return
     */
    public static List<Tag> getTags(boolean fetchFromDB)
    {
	List<Tag> tags = null;
	// If it is not hardreload, we check for tags in memcache. If tags
	// are are in memcache those tags are returned without fetching from
	// DB
	if (!fetchFromDB)
	    tags = (List<Tag>) CacheUtil.getCache(NamespaceManager.get() + "_tags");

	if (tags != null)
	    return tags;

	tags = TagUtil.getTags();

	// Sets tags in memcache for with expiry of 1 hour
	CacheUtil.setCache(NamespaceManager.get() + "_tags", tags, 2 * 60 * 60 * 1000);

	return tags;
    }

    public static int getTagsCount(String tag)
    {
	return dao.getCountByProperty("tag", tag);
    }

    public static String getStatus(boolean forceLoad)
    {
	long startTime = System.currentTimeMillis();
	// If force reload is not there, it tries to fetch it from cache
	if (!forceLoad)
	{
	    String stats = (String) CacheUtil.getCache(NamespaceManager.get() + "_tag_stats");

	    System.out.println("namespace : " + NamespaceManager.get() + "_tag_stats");
	    System.out.println("stats from cache : " + stats);
	    if (stats != null)
		return stats;
	}

	List<Tag> tags = TagUtil.getTags(100, null);
	JSONObject result = new JSONObject();

	int previousSize = 0;
	if (tags.size() == 0)
	    return result.toString();

	Cursor cursor = (Cursor) tags.get(0);
	int availableTags = cursor.count == null ? tags.size() : cursor.count;
	boolean abort = false;
	do
	{

	    // Iterates though first 100 tags to calculate stats
	    for (int i = previousSize; i < tags.size(); i++)
	    {
		Tag tag = tags.get(i);
		String tagString = tag.tag;

		if (System.currentTimeMillis() - startTime > Globals.REQUEST_LIMIT_MILLIS - 5000)
		{

		    abort = true;

		    System.out.println("completed : " + tags.size());
		    break;
		}
		int count = ContactUtil.getContactsCountForTag(tag.tag);

		try
		{
		    result.put(tagString, count);

		}
		catch (JSONException e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
	    }

	    cursor = (Cursor) tags.get(tags.size() - 1);

	    if (cursor == null || StringUtils.isEmpty(cursor.cursor) || availableTags <= tags.size()
		    || cursor.cursor == null
		    || System.currentTimeMillis() - startTime > Globals.REQUEST_LIMIT_MILLIS - 5000 || abort)
		break;

	    previousSize = tags.size();
	    tags.addAll(TagUtil.getTags(100, cursor.cursor));

	} while (true);

	System.out.println("total tags fetched : " + tags.size() + "total found : " + availableTags);

	CacheUtil.setCache(NamespaceManager.get() + "_tag_stats", result.toString(), 2 * 60 * 60 * 1000);

	if (abort)
	{

	    TagStatsDeferredTask task = new TagStatsDeferredTask(cursor, availableTags);

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.addAsync(TaskOptions.Builder.withPayload(task));
	}

	return result.toString();

    }

    public static List<Tag> getStatus()
    {
	List<Tag> tags = TagUtil.getTags(100, null);

	if (tags.size() == 0)
	    return tags;

	Cursor cursor = (Cursor) tags.get(0);

	List<Tag> allTags = new ArrayList<Tag>();

	do
	{
	    for (Tag tag : tags)
	    {
		int count = ContactUtil.getContactsCountForTag(tag.tag);
		tag.availableCount = count;

		allTags.add(tag);
	    }

	    Cursor currentCursor = (Cursor) tags.get(0);

	    if (cursor.cursor == null || cursor.cursor.equals(currentCursor.cursor))
		break;

	    tags = TagUtil.getTags(100, currentCursor.cursor);

	} while (true);

	return allTags;
    }

    public static List<Tag> getStats(int page_size, String cursor)
    {

	List<Tag> tags = getTags(page_size, cursor);

	return fillStats(tags);
    }

    public static List<Tag> fillStats(List<Tag> tags)
    {
	for (Tag tag : tags)
	{
	    tag.availableCount = ContactUtil.getContactsCountForTag(tag.tag);
	}

	return tags;
    }

    public static boolean isValidTag(String tagString)
    {
	return tagString.matches("^(?U)[\\p{Alpha}][\\p{Alpha}\\_ \\d]+");
    }

    /**
     * Util method will test string is valid tag or not it replace all special
     * character with space and replace hiphen with underscore
     * 
     * @param tagString
     * @return
     */
    public static String getValidTag(String tagString)
    {
	tagString = trimSpecialCharsAtStart(tagString);

	if (tagString == null)
	    return null;

	if (!isValidTag(tagString))
	    tagString = tagString.trim().replaceAll("[^\\p{L}\\d\\s_]", "_");
	return tagString;
    }

    public static void validateTag(String tag) throws WebApplicationException
    {
	System.out.println("validating tag " + tag);
	if (!TagValidator.getInstance().validate(tag))
	{
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, Tag name should start with an alphabet and can not contain special characters other than underscore and space - "
				    + tag).build());
	}
    }

    public static String trimSpecialCharsAtStart(String tag)
    {
	StringBuilder tagBuilder = new StringBuilder(tag);

	if (Character.isLetter(tag.charAt(0)))
	    return tagBuilder.toString();
	else
	{
	    if (tagBuilder.length() == 1)
		return null;
	    tagBuilder.deleteCharAt(0);
	}
	return trimSpecialCharsAtStart(tagBuilder.toString());
    }

    public static boolean hasTagPermission(Contact contact)
    {
	// Do not check for backends.
	if (!ModuleUtil.getCurrentModuleName().equals("default"))
	    return true;

	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	if (user.is_admin)
	    return true;
	AccountPrefs prefs = AccountPrefsUtil.getAccountPrefs();
	if (prefs.tagsPermission != null && !prefs.tagsPermission)
	{
	    Set<String> newTagSet = new HashSet<String>();
	    // If tags are not empty, considering they are simple tags and adds
	    // them
	    // to tagsWithTime
	    if (!contact.tags.isEmpty())
	    {
		for (String tag : contact.tags)
		{

		    Tag tagObject = new Tag(tag);
		    if (!contact.tagsWithTime.contains(tagObject))
		    {
			newTagSet.add(tag);
		    }
		}
	    }

	    boolean newTag = false;

	    for (Tag tag : contact.tagsWithTime)
	    {
		// Check if it is null, it can be null tag is created using
		// developers api
		if (tag.createdTime == null || tag.createdTime == 0L)
		{
		    newTagSet.add(tag.tag);
		}
	    }

	    for (String tag : newTagSet)
	    {
		if (getTag(tag) == null)
		    return false;
	    }
	}

	return true;

    }

    public static List<String> hasTagPermission(String[] tags)
    {
	List<String> newTags = new ArrayList<String>();
	// Do not check for backends.
	if (!ModuleUtil.getCurrentModuleName().equals("default"))
	    return newTags;

	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	if (user.is_admin)
	    return newTags;
	AccountPrefs prefs = AccountPrefsUtil.getAccountPrefs();
	if (prefs.tagsPermission != null && !prefs.tagsPermission)
	{
	    for (String tag : tags)
	    {
		if (getTag(tag) == null)
		    newTags.add(tag);
	    }
	}
	return newTags;
    }

    public static boolean hasTagPermission(Tag[] tags)
    {
	// Do not check for backends.
	if (!ModuleUtil.getCurrentModuleName().equals("default"))
	    return true;

	DomainUser user = DomainUserUtil.getCurrentDomainUser();
	if (user.is_admin)
	    return true;
	AccountPrefs prefs = AccountPrefsUtil.getAccountPrefs();
	if (prefs.tagsPermission != null && !prefs.tagsPermission)
	{
	    for (Tag tag : tags)
	    {
		if (getTag(tag.tag) == null)
		    return false;
	    }
	}
	return true;
    }
}