package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
	ContactFilterResultFetcher iterator = getfetcher(tag);

	Tag[] tags = { new Tag(tag) };

	List<Contact> contacts = new ArrayList<Contact>();

	deleteTag(tag);

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

	    if (contacts.size() == 0)
		break;

	    Contact.dao.putAll(contacts);

	    try
	    {
		search.index.put(builderObjects.toArray(new Builder[contacts.size() - 1]));
	    }
	    catch (Exception e)
	    {
		search.index.put(builderObjects.toArray(new Builder[contacts.size() - 1]));
	    }

	    contacts.clear();
	}

	TagUtil.deleteTag(tag);
    }

    private static ContactFilterResultFetcher getfetcher(String tag)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("tagsWithTime.tag", tag);

	ContactFilterResultFetcher iterator = new ContactFilterResultFetcher(searchMap, "-created_time", 50,
		Integer.MAX_VALUE);

	return iterator;
    }

    private static int getAvailableContacts(ContactFilterResultFetcher fetcher)
    {
	return fetcher.getAvailableContacts();
    }

    public static int getAvailableContactsCount(String tag)
    {
	return getAvailableContacts(getfetcher(tag));
    }

    private static void deleteTag(String tag)
    {
	Tag tagObject = new Tag(tag);
	deleteTag(tagObject);
    }

    private static void deleteTag(Tag tag)
    {
	TagUtil.dao.delete(tag);
    }

    private static void replaceTags(String oldTag, String newTag)
    {
	ContactFilterResultFetcher iterator = getfetcher(oldTag);

	Tag oldTagObject = new Tag(oldTag);
	Tag[] tags = { oldTagObject };
	Tag newTagObject = new Tag(newTag);

	deleteTag(oldTag);

	Set<String> newTagsSet = new HashSet<String>();
	newTagsSet.add(newTag);
	TagUtil.updateTags(newTagsSet);

	List<Contact> contacts = new ArrayList<Contact>();

	AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

	while (iterator.hasNextSet())
	{
	    ContactDocument contactDocuments = new ContactDocument();
	    List<Builder> builderObjects = new ArrayList<Builder>();

	    for (Contact contact : iterator.nextSet())
	    {
		for (Tag tag : tags)
		{
		    // Iterates in contacts list to find tag match and repace it
		    for (Tag tagObject : contact.getTagsList())
		    {
			if (tagObject.equals(tag))
			{
			    replaceTag(newTagObject, tagObject);
			    break;
			}
		    }
		}
		contacts.add(contact);

		builderObjects.add(contactDocuments.buildDocument(contact));
	    }

	    if (contacts.size() == 0)
		break;

	    Contact.dao.putAll(contacts);

	    try
	    {
		search.index.put(builderObjects.toArray(new Builder[contacts.size() - 1]));
	    }
	    catch (Exception e)
	    {
		search.index.put(builderObjects.toArray(new Builder[contacts.size() - 1]));
	    }

	    contacts.clear();
	}

	TagUtil.deleteTag(oldTag);
    }

    public static void replaceTag(Tag newTag, Tag OldTag)
    {
	OldTag.tag = newTag.tag.trim();
    }

}
