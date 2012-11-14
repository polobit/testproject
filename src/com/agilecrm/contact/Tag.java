package com.agilecrm.contact;

import java.util.List;
import java.util.Set;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Trigger;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class Tag
{
    // Key
    @Id
    public String tag;

    // Dao
    private static ObjectifyGenericDao<Tag> dao = new ObjectifyGenericDao<Tag>(
	    Tag.class);

    // Called when a contact is created
    public static void updateTags(Set<String> tags)
    {
	// Add to tags Library
	for (String tagName : tags)
	{
	    // Check if already present
	    Tag tag = getTag(tagName);
	    if (tag == null)
	    {
		// Add tag to db
		addTag(tagName);
	    }



	// Get triggers
	List<Trigger> triggerslist = null;

	try
	{

	    triggerslist = Trigger
		    .getTriggersByCondition(Trigger.Type.TAG_IS_ADDED);
	    System.out.println("Triggers should execute" + triggerslist);
	    if (triggerslist != null)
	    {
		for (Trigger triggers : triggerslist)

		{

		    if (triggers.tags != null)
		    {
			System.out.println("Triggers should execute"
				+ triggers.tags);
			    String tagsSplit = "";

			// Replace multiple space with single space
			    tagsSplit = triggers.tags.trim().replaceAll(" +",
				    " ");

			// Replace ,space with space
			    tagsSplit = triggers.tags.replaceAll(", ", ",");

			    String[] tagsArray = tagsSplit.split(",");

			    for (String taglist : tagsArray)
			    {

				if (taglist.equals(tagName))
				{
				    // Fetch contacts filter by tags
			Objectify ofy = ObjectifyService.begin();
			List<Contact> contacts = ofy.query(Contact.class)
					    .filter("tags =", taglist).list();

			System.out.println("Contacts related to tags"
				+ contacts);

			// Execute trigger for contacts having given tags
			for (Contact contactslist : contacts)
			    Trigger.executeTrigger(contactslist.id,
					Trigger.Type.TAG_IS_ADDED);
				}
			    }
		    }
		}
	    }
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}
	}

    }

    // Called when a contact is created
    public static void deleteTags(Set<String> tags)
    {
	// Add to tags Library
	for (String tagName : tags)
	{
	    // Check if there is any contact with this tag
	    int count = Contact.getContactsCountForTag(tagName);
	    if (count == 0)
	    {
		// Delete this tag
		Key<Tag> tagKey = new Key<Tag>(Tag.class, tagName);

		dao.deleteKey(tagKey);
	    }
	}

    }

    Tag()
    {

    }

    Tag(String tag)
    {
	this.tag = tag;
    }

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

    // Add tag
    public static Tag addTag(String tagName)
    {
	Tag tag = new Tag(tagName);

	dao.put(tag);
	return tag;
    }

    @Override
    public String toString()
    {
	return "id: " + tag;
    }
}
