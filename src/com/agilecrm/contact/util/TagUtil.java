package com.agilecrm.contact.util;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Tag;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
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
    private static ObjectifyGenericDao<Tag> dao = new ObjectifyGenericDao<Tag>(Tag.class);

    /**
     * Creates a tag in database, by verifying its existence in database.
     * 
     * Called when a contact is created
     * 
     * @param tags
     */
    public static void updateTags(Set<String> tags)
    {
	// Add to tags Library
	for (String tagName : tags)
	{
	    // Checks for empty or null or whitespace(\s*) tag.
	    if (StringUtils.isBlank(tagName))
		continue;

	    // Check if already present
	    int count = getTagsCount(tagName);
	    System.out.println("tags count :" + count);
	    if (count == 0)
	    {
		// Add tag to db
		Tag.addTag(tagName);
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
	// Add to tags Library
	for (String tagName : tags)
	{
	    if (StringUtils.isBlank(tagName))
		continue;

	    // Check if there is any contact with this tag
	    int count = ContactUtil.getContactsCountForTag(tagName);
	    if (count == 0)
	    {
		// Delete this tag
		Key<Tag> tagKey = new Key<Tag>(Tag.class, tagName);

		dao.deleteKey(tagKey);
	    }
	}
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
	return dao.fetchAll(size, cursor);
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
	// If force reload is not there, it tries to fetch it from cache
	if (!forceLoad)
	{
	    String stats = (String) CacheUtil.getCache(NamespaceManager.get() + "_tags_stats");

	    System.out.println("stats from cache : " + stats);
	    if (stats != null)
		return stats;
	}

	List<Tag> tags = TagUtil.getTags(100, null);
	JSONObject result = new JSONObject();
	long startTime = System.currentTimeMillis();
	int previousSize = 0;

	do
	{

	    // Iterates though first 100 tags to calculate stats
	    for (int i = previousSize; i < tags.size(); i++)
	    {
		Tag tag = tags.get(i);
		String tagString = tag.tag;
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

	    Cursor cursor = (Cursor) tags.get(tags.size() - 1);

	    if (cursor == null || StringUtils.isEmpty(cursor.cursor) || cursor.count <= tags.size()
		    || cursor.cursor == null
		    || System.currentTimeMillis() - startTime > Globals.REQUEST_LIMIT_MILLIS - 1000)
		break;

	    previousSize = tags.size();
	    tags.addAll(TagUtil.getTags(100, cursor.cursor));

	} while (true);

	CacheUtil.setCache(NamespaceManager.get() + "_tags_stats", result.toString(), 2 * 60 * 60 * 1000);
	return result.toString();

    }
}
