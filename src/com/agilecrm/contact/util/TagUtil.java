package com.agilecrm.contact.util;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Tag;
import com.agilecrm.db.ObjectifyGenericDao;
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

    public static int getTagsCount(String tag)
    {
	return dao.getCountByProperty("tag", tag);
    }
}
