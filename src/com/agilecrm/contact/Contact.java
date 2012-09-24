package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deferred.TagsDeferredTask;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.Util;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
public class Contact extends Cursor
{
    // Key
    @Id
    public Long id;

    // Constants
    public static enum Type
    {
	PERSON, COMPANY
    };

    // Contact Type - Person/Company
    @Indexed
    public Type type = Type.PERSON;

    // Created/Updated Time
    @Indexed
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    @NotSaved(IfDefault.class)
    public Long last_contacted_time = 0L;
    
    // Owner
    @Indexed
    public String lead_owner = "";

    // Creator
    public String creator = "";

    // Stars
    @NotSaved(IfDefault.class)
    public Short star_value = 0;

    // Dao
    private static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(
	    Contact.class);

    // Search Tokens
    @Indexed
    private Set<String> search_tokens = null;

    // Tags
    @Indexed
    Set<String> tags = new HashSet<String>();

    // Properties
    // @XmlElementWrapper(name = "properties")
    @XmlElement(name = "properties")
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    List<ContactField> properties = new ArrayList<ContactField>();

    @NotSaved(IfDefault.class)
    public String widget_properties = null;

    public static final String FIRST_NAME = "first_name";
    public static final String LAST_NAME = "last_name";
    public static final String EMAIL = "email";
    public static final String COMPANY = "company";
    public static final String TITLE = "title";

    public Contact()
    {

    }

    public Contact(Type type, String creator, Set<String> tags,
	    List<ContactField> properties)
    {
	this.type = type;
	this.creator = creator;

	this.tags = tags;
	this.properties = properties;

	System.out.println(this.properties);
    }

    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " updated_time"
		+ updated_time + " type: " + type + " creator:" + creator
		+ " tags: " + tags + " properties: " + properties;
    }

    /* @XmlElement(name="properties2") */
    public List<ContactField> getProperties()
    {
	return properties;
    }

    @XmlElement(name = "tags")
    public Set<String> getTags()
    {
	return tags;
    }

    public static int getContactsCountForTag(String tag)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("tags", tag).count();
    }

    public static List<Contact> getContactsForTag(String tag)
    {
	System.out.println(tag);
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("tags", tag).list();
    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created and Last Updated Time
	if (created_time == 0L)
	{
	    System.out.println("New Entity");
	    created_time = System.currentTimeMillis() / 1000;
	    
		// Assign lead_owner
		UserPrefs userprefs = UserPrefs.getCurrentUserPrefs();
		lead_owner = userprefs.name;
	}
	else
	    updated_time = System.currentTimeMillis() / 1000;
	

	// Create Search Keyword Values
	Set<String> tokens = new HashSet<String>();
	for (ContactField contactField : properties)
	{
	    if (contactField.value != null)
		tokens.add(contactField.value);
	}

	if (tokens.size() != 0)
	    search_tokens = Util.getSearchTokens(tokens);

	System.out.println(search_tokens);

	// Update Tags - Create a deferred task
	TagsDeferredTask tagsDeferredTask = new TagsDeferredTask(tags);

	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(tagsDeferredTask));

    }

    // Delete Contact
    public void delete()
    {
	// Delete Tags
	Tag.deleteTags(tags);

	dao.delete(this);

	// Delete Notes
	Note.deleteAllNotes(id);
    }

    public void save()
    {
	System.out.println("contact saving:" + this);
	dao.put(this);
    }

    public static Contact getContact(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Contact> getAllContacts()
    {
	return dao.fetchAll();
    }

    public static List<Contact> getAllContacts(int max, String cursor)
    {
	return dao.fetchAll(max, cursor);
    }

    public ContactField getContactField(String name)
    {
	for (ContactField property : properties)
	{
	    if (name.equalsIgnoreCase(property.name))
		return property;
	}

	return null;
    }

    public String getContactFieldValue(String name)
    {

	ContactField contactField = getContactField(name);
	if (contactField != null)
	    return contactField.value;

	return null;
    }

    public static List<Contact> searchContacts(String keyword)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("search_tokens", keyword).list();
    }

    // Get Contact by Email
    public static Contact searchContactByEmail(String email)
    {

	if (email == null)
	    return null;

	// Look in the property Class
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("properties.name = ", EMAIL)
		.filter("properties.value = ", email).get();
    }

    // Get Count of Contacts by Email - should be used in most of the cases
    // unless the real entity is required
    public static int searchContactCountByEmail(String email)
    {
	// Look in the property Class
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("properties.name = ", EMAIL)
		.filter("properties.value = ", email).count();
    }

    // Add tags based on email
    public static Contact addTags(String email, String[] tags)
    {

	// Get Contact
	Contact contact = searchContactByEmail(email);
	if (contact == null)
	    return null;

	// Add Tags
	for (String tag : tags)
	{
	    contact.tags.add(tag);
	}

	contact.save();
	return contact;
    }

    // Remove tags based on email
    public static Contact removeTags(String email, String[] tags)
    {

	// Get Contact
	Contact contact = searchContactByEmail(email);
	if (contact == null)
	    return null;

	// Remove Tags
	for (String tag : tags)
	{
	    contact.tags.remove(tag);
	}

	contact.save();
	return contact;
    }

    // Delete contacts bulk
    public static void deleteContactsBulk(String[] id_array)
    {
	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();
	for (String contact_id : id_array)
	{
	    contactKeys.add(new Key<Contact>(Contact.class, Long
		    .parseLong(contact_id)));
	}
	dao.deleteKeys(contactKeys);
    }
}