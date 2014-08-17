package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.google.appengine.api.search.Document.Builder;

/**
 * Tag management on contacts. It has methods to add, remove, and rename tags.
 * 
 * @author yaswanth
 * 
 */
public class TagManagement
{
    /**
     * If tag is not available in Tag DB, new tag is added.
     * 
     * @param tag
     */
    public static void addTag(String tag)
    {
	// Get the count in tag DB to see if tag already exists
	int count = TagUtil.getTagsCount(tag);

	if (count != 0)
	    return;

	Tag.addTag(tag);

    }

    /**
     * Remove tags. Takes tag which is to be removed as an argument and removes
     * it from contacts and them removes it from tag database
     * 
     * @param tag
     */
    public static void removeTag(String tag)
    {
	removeTagsFromContact(tag);
	TagUtil.deleteTag(tag);
    }

    /**
     * Renames tag. Actually, in action it acts as removing tag and adding new
     * tag.
     * 
     * @param tag
     * @param newTagName
     */
    public static void renameTag(String tag, String newTagName)
    {
	replaceTags(tag, newTagName);
    }

    /**
     * Removed all contacts
     * 
     * @param tag
     */
    private static void removeTagsFromContact(String tag)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("tagsWithTime.tag", tag);

	ContactFilterResultFetcher iterator = new ContactFilterResultFetcher(searchMap, "-created_time", 50,
		Integer.MAX_VALUE);

	Tag[] tags = { new Tag(tag) };

	List<Contact> contacts = new ArrayList<Contact>();

	TagUtil.deleteTag(tag);

	AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

	/**
	 * Fetches set of contacts. Each time it fetches 50 contacts and they
	 * are updated in DB as batch update
	 */
	while (iterator.hasNextSet())
	{
	    ContactDocument contactDocuments = new ContactDocument();
	    List<Builder> builderObjects = new ArrayList<Builder>();

	    for (Contact contact : iterator.nextSet())
	    {
		contact.removeTagsWithoutSaving(tags);
		contacts.add(contact);
		builderObjects.add(contactDocuments.buildDocument(contact));
	    }

	    Contact.dao.putAll(contacts);

	    search.index.put(builderObjects.toArray(new Builder[contacts.size() - 1]));

	    contacts.clear();
	}
    }

    private static void replaceTags(String oldTag, String newTag)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("tagsWithTime.tag", oldTag);

	ContactFilterResultFetcher iterator = new ContactFilterResultFetcher(searchMap, "-created_time", 50,
		Integer.MAX_VALUE);

	Tag[] tags = { new Tag(oldTag) };
	Tag newTagObject = new Tag(newTag);

	List<Contact> contacts = new ArrayList<Contact>();

	while (iterator.hasNextSet())
	{
	    for (Contact contact : iterator.nextSet())
	    {
		// Removed tag from contact
		contact.removeTagsWithoutSaving(tags);

		// And add new tag to contact
		contact.addTag(newTagObject);

		contacts.add(contact);
	    }

	    Contact.dao.putAll(contacts);

	    contacts.clear();
	}
    }

}
