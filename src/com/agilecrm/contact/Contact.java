package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.core.DomainUser;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deferred.TagsDeferredTask;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.NotificationPrefs;
import com.agilecrm.user.util.NotificationPrefsUtil;
import com.agilecrm.workflows.triggers.util.ContactTriggerUtil;
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

@SuppressWarnings("serial")
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

    // Owner
    @NotSaved
    public String lead_owner = null;

    // Domain User key(owner)
    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> owner_key = null;

    // Creator
    public String creator = "";

    // Stars
    @NotSaved(IfDefault.class)
    public Short star_value = 0;

    // Lead score
    @Indexed
    public Integer lead_score = 0;

    // Dao
    public static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(
	    Contact.class);

    // Search Tokens
    @Indexed
    private Set<String> search_tokens = null;

    // Tags
    @Indexed
    public Set<String> tags = new HashSet<String>();

    // Properties
    // @XmlElementWrapper(name = "properties")
    @XmlElement(name = "properties")
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public List<ContactField> properties = new ArrayList<ContactField>();

    @NotSaved(IfDefault.class)
    public String widget_properties = null;

    // To make property field available for mail templates for reports(not
    // saved)
    @NotSaved
    public Map<String, Object> contact_properties = null;

    public static final String FIRST_NAME = "first_name";
    public static final String LAST_NAME = "last_name";
    public static final String EMAIL = "email";
    public static final String COMPANY = "company";
    public static final String TITLE = "title";
    public static final String NAME = "name";
    public static final String URL = "url";

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

    @Override
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

	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Contact.class).filter("tags", tag).list();
    }

    @PrePersist
    private void PrePersist()
    {

	// Set owner only if owner_key is null
	if (owner_key == null)
	{
	    // Set lead owner(current domain user)
	    owner_key = new Key<DomainUser>(DomainUser.class, SessionManager
		    .get().getDomainId());

	}

	// Store Created and Last Updated Time Check for id even if created
	// time
	// is 0(To check whether it is update request)
	if (created_time == 0L && id == null)
	{
	    System.out.println("New Entity");
	    created_time = System.currentTimeMillis() / 1000;

	}
	else
	{
	    updated_time = System.currentTimeMillis() / 1000;

	}

	/*
	 * 
	 * // Create Search Keyword Values Set<String> tokens = new
	 * HashSet<String>(); for (ContactField contactField : properties) { if
	 * (contactField.value != null)
	 * tokens.add(contactField.value.replace(" ", "")); }
	 * 
	 * if (tokens.size() != 0) search_tokens = Util.getSearchTokens(tokens);
	 * 
	 * System.out.println(search_tokens);
	 */
	// Update Tags - Create a deferred task
	TagsDeferredTask tagsDeferredTask = new TagsDeferredTask(tags);

	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(tagsDeferredTask));

	// Get Lead Owner

    }

    // Delete Contact
    public void delete()
    {

	// Store contact in temporary variable to delete its document after
	// contact delete
	Contact contact = this;

	// Execute notification when contact is deleted
	NotificationPrefsUtil.executeNotification(
		NotificationPrefs.Type.CONTACT_DELETED, this);

	dao.delete(this);

	new AppengineSearch<Contact>(Contact.class).delete(contact.id
		.toString());

	// Delete Notes
	Note.deleteAllNotes(id);

	// Delete Tags
	Tag.deleteTags(tags);

    }

    public void save()
    {

	// Stores current contact id in to a temporary variable, to check
	// whether contact is newly created or being edited.
	Long id = this.id;

	Contact oldContact = null;

	if (id != null)
	    oldContact = Contact.getContact(id);

	dao.put(this);

	// Execute trigger for contacts
	ContactTriggerUtil.executeTriggerToContact(oldContact, this);

	// Enables to build "Document" search on current entity
	AppengineSearch<Contact> search = new AppengineSearch<Contact>(
		Contact.class);

	// If contact is new then add it to document else edit document
	if (id == null)
	{
	    search.add(this);
	    return;
	}
	search.edit(this);
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

    public static List<Contact> getAll(int max, String cursor)
    {
	return dao.fetchAll(max, cursor);
    }

    public static List<Contact> getAllCompanies(int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.COMPANY);
	return dao.fetchAll(max, cursor, searchMap);
    }

    public static List<Contact> getAllContacts(int max, String cursor)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("type", Type.PERSON);
	return dao.fetchAll(max, cursor, searchMap);
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

    /*
     * public static List<Contact> searchContacts(String keyword) { Objectify
     * ofy = ObjectifyService.begin(); return
     * ofy.query(Contact.class).filter("search_tokens", keyword).list(); }
     */

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

    // Add tags
    public void addTags(String[] tags)
    {
	for (String tag : tags)
	{
	    this.tags.add(tag);
	}
	this.save();

    }

    // Remove tags
    public void removeTags(String[] tags)
    {
	Set<String> tagslist = new HashSet<String>();
	for (String tag : tags)
	{
	    this.tags.remove(tag);
	    tagslist.add(tag);
	}

	this.save();

	// Delete tags from Tag class
	Tag.deleteTags(tagslist);

    }

    // Add score
    public void addScore(Integer score)
    {

	this.lead_score = this.lead_score + score;
	this.save();

    }

    // Subtract score
    public void subtractScore(Integer score)
    {

	this.lead_score = this.lead_score - score;
	this.save();

    }

    // Get contacts bulk
    /**
     * Gets list of contacts based on array of ids
     * 
     * @param contactsJSONArray
     *            JSONArray object of contact ids
     * @return List of contacts
     */
    public static List<Contact> getContactsBulk(JSONArray contactsJSONArray)
    {
	Objectify ofy = ObjectifyService.begin();

	List<Key<Contact>> contactKeys = new ArrayList<Key<Contact>>();

	for (int i = 0; i < contactsJSONArray.length(); i++)
	{
	    try
	    {
		contactKeys.add(new Key<Contact>(Contact.class, Long
			.parseLong(contactsJSONArray.getString(i))));
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(contactKeys).values());
	return contacts_list;
    }

    // Change owner to contacts bulk
    /**
     * Creates owner key with the new owner id and changes owner key of the each
     * contact in the bulk and saves the contact
     * 
     * @param contactsJSONArray
     *            JSONArray object containing contact ids
     * @param new_owner
     *            new owner (DomainUser) id
     */
    public static void changeOwnerToContactsBulk(JSONArray contactsJSONArray,
	    String new_owner)
    {
	List<Contact> contacts_list = Contact
		.getContactsBulk(contactsJSONArray);
	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return;
	}

	Key<DomainUser> newOwnerKey = new Key<DomainUser>(DomainUser.class,
		Long.parseLong(new_owner));

	for (Contact contact : contacts_list)
	{
	    contact.owner_key = newOwnerKey;

	    contact.save();
	}
    }

    // Add tags to contacts bulk
    /**
     * Adds each tag in tags_array to each contact in contacts bulk and saves
     * each contact
     * 
     * @param contactsJSONArray
     *            JSONArray object containing contact ids
     * @param tags_array
     *            array of tags
     */
    public static void addTagsToContactsBulk(JSONArray contactsJSONArray,
	    String[] tags_array)
    {

	List<Contact> contacts_list = Contact
		.getContactsBulk(contactsJSONArray);

	if (contacts_list.size() == 0)
	{
	    System.out.println("Null contact");
	    return;
	}

	for (Contact contact : contacts_list)
	{

	    for (String tag : tags_array)
	    {
		contact.tags.add(tag);

	    }

	    contact.save();
	}
    }

    @JsonIgnore
    @XmlElement(name = "domainUser")
    public DomainUser getDomainUser()
    {
	if (owner_key != null)
	{
	    // If user is deleted no user is found with key so set user to null
	    // and return null
	    try
	    {
		// return dao.ofy().get(owner_key);
		return DomainUser.getDomainUser(owner_key.getId());
	    }
	    catch (Exception e)
	    {
		owner_key = null;
		return null;
	    }
	}
	return null;

    }
}