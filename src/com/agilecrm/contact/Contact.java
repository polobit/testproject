package com.agilecrm.contact;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.json.JSONArray;

import com.agilecrm.contact.deferred.TagsDeferredTask;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.util.ContactNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.util.ContactTriggerUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Contact</code> class stores the details of a contact (person or
 * company). The properties (name, email, phone, address, custom fields and
 * etc..) of a contact are stored in this class as {@link ContactField} objects,
 * which is embedded to this class.
 * <p>
 * Each contact is added to search document, to make the contact available to
 * search on any value of its properties.
 * <p>
 * <p>
 * Prevents the duplicates, by verifying the email of a contact to be saved.
 * While the contact is getting saved, current domain user key is also stored
 * along with it, as its owner key
 * </p>
 * <p>
 * This class has an annotation @Unindexed to make sure, only the variables with @Indexed
 * annotation get saved into the database.
 * </p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Unindexed
public class Contact extends Cursor
{
    // Key
    @Id
    public Long id;

    /**
     * Type of the contact (person or company)
     * 
     */
    public static enum Type
    {
	PERSON, COMPANY
    };

    /**
     * Specifies type of the contact. @Indexed indicates, this field will get
     * saved into the database
     */
    @Indexed
    public Type type = Type.PERSON;

    /**
     * Created time of the contact
     */
    @Indexed
    public Long created_time = 0L;

    /**
     * Updated time of the contact
     */
    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    /**
     * Viewed time of the contact, in milliseconds
     */
    @NotSaved(IfDefault.class)
    @Indexed
    public Long viewed_time = 0L;

    /**
     * Stores current domain user key as owner, if it is null should not save in
     * database
     */
    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> owner_key = null;

    /**
     * Stores the star value of a contact
     */
    @NotSaved(IfDefault.class)
    public Short star_value = 0;

    /**
     * Lead score of the contact
     */
    @Indexed
    public Integer lead_score = 0;

    /**
     * Set of tags. Not saved in it, it is used to map tags from client
     * requests, which are further processed in pre persist to save in
     * tagsWithTime variable
     */
    @NotSaved
    public LinkedHashSet<String> tags = new LinkedHashSet<String>();

    /**
     * Stores tags with created time.
     */
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public ArrayList<Tag> tagsWithTime = new ArrayList<Tag>();

    /**
     * Stores properties, by embedding the class <code>ContactField</code>. Also
     * includes in the response.
     */
    @XmlElement(name = "properties")
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public List<ContactField> properties = new ArrayList<ContactField>();

    /**
     * Widget properties (twitter, linkedIn etc..) of a contact
     */
    @NotSaved(IfDefault.class)
    public String widget_properties = null;

    /**
     * Used when request is sent using developer js api, to avoid json mapping
     * exception
     */
    @SuppressWarnings("unused")
    @NotSaved
    private DomainUser Owner = null;

    /**
     * Stores the property names in final variables, for reading flexibility of
     * the property values
     */
    public static final String FIRST_NAME = "first_name";
    public static final String LAST_NAME = "last_name";
    public static final String EMAIL = "email";
    public static final String COMPANY = "company";
    public static final String TITLE = "title";
    public static final String NAME = "name";
    public static final String URL = "url";

    // Dao
    public static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(
	    Contact.class);

    /**
     * Default constructor
     */
    public Contact()
    {

    }

    /**
     * Creates a contact with its type, creator name, tags and properties
     * 
     * @param type
     *            type of the contact (person/company)
     * @param creator
     *            creator name of the contact
     * @param tags
     *            tags of a contact
     * @param properties
     *            properties (name, email, address and etc..) of a contact
     */
    public Contact(Type type, LinkedHashSet<String> tags,
	    List<ContactField> properties)
    {
	this.type = type;

	this.tags = tags;
	this.properties = properties;

    }

    /**
     * Gets list of properties of a contact
     * 
     * @return properties as list
     */
    public List<ContactField> getProperties()
    {
	return properties;
    }

    /**
     * Saves (new) or updates (existing) a contact and executes trigger,
     * notification and also adds to search document
     */
    public void save()
    {

	// Stores current contact id in to a temporary variable, to check
	// whether contact is newly created or being edited.
	Long id = this.id;

	Contact oldContact = null;

	if (id != null)
	{
	    oldContact = ContactUtil.getContact(id);

	    // Sets tags into tags, so they can be compared in
	    // notifications/triggers with new tags
	    oldContact.tags = oldContact.getContactTags();
	}

	dao.put(this);

	// Execute trigger for contacts
	ContactTriggerUtil.executeTriggerToContact(oldContact, this);

	// Execute notification for contacts
	ContactNotificationPrefsUtil.executeNotificationToContact(oldContact,
		this);

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

    /**
     * Gets a property (ContactField object) from list of properties based on
     * given name
     * 
     * @param name
     *            name of the property object (first_name, last_name, email and
     *            etc..)
     * @return {@link ContactField} object with the given name
     */
    public ContactField getContactField(String name)
    {
	for (ContactField property : properties)
	{
	    if (name.equalsIgnoreCase(property.name))
		return property;
	}
	return null;
    }

    public ContactField getContactFieldByName(String fieldName)
    {
	for (ContactField field : properties)
	{
	    if (field.name.equals(fieldName))
		return field;
	}
	return null;
    }

    /**
     * Gets value of a ContactField object, matched with the given name
     * 
     * @param name
     *            name of the object to get its value
     * @return value of the matched entity
     */
    public String getContactFieldValue(String name)
    {

	ContactField contactField = getContactField(name);
	if (contactField != null)
	    return contactField.value;

	return null;
    }

    @JsonIgnore
    public ArrayList<Tag> getTagsList()
    {
	return tagsWithTime;
    }

    /**
     * Adds tag(s) to a contact
     * 
     * @param tags
     */
    public void addTags(String[] tags)
    {
	for (String tag : tags)
	{
	    this.tags.add(tag);
	}
	this.save();

    }

    /**
     * Removes tag(s) from a contact, and also from tags database, if no more
     * contacts with that tag
     * 
     * @param tags
     */
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
	TagUtil.deleteTags(tagslist);

    }

    /**
     * Adds score to a contact
     * 
     * @param score
     *            value of the score to be added
     */
    public void addScore(Integer score)
    {

	this.lead_score = this.lead_score + score;
	this.save();

    }

    /**
     * Subtracts score from a contact
     * 
     * @param score
     *            value of the score to be subtracted
     */
    public void subtractScore(Integer score)
    {

	this.lead_score = this.lead_score - score;
	this.save();

    }

    /**
     * Deletes a contact from database and search document by executing a
     * notification and deleting its related notes and tags.
     */
    public void delete()
    {
	// Execute notification when contact is deleted
	ContactNotificationPrefsUtil.executeNotificationForDeleteContact(this);

	dao.delete(this);

	new AppengineSearch<Contact>(Contact.class).delete(id.toString());

	// Delete Notes
	NoteUtil.deleteAllNotes(id);

	// Delete Tags
	TagUtil.deleteTags(tags);

	// Delete Crons.
	CronUtil.removeTask(null, id.toString());

	// Deletes logs of contact.
	LogUtil.deleteSQLLogs(null, id.toString());

	// Deletes TwitterCron
	TwitterQueueUtil.removeTwitterJobs(null, id.toString(),
		NamespaceManager.get());
    }

    /**
     * Creates owner key with the new owner id and changes owner key of the each
     * contact in the bulk and saves the contact. This method is not moved to
     * util, because can not read owner_key from out side of this class
     * 
     * @param contactsJSONArray
     *            JSONArray object containing contact ids
     * @param new_owner
     *            new owner (DomainUser) id
     */
    public static void changeOwnerToContactsBulk(JSONArray contactsJSONArray,
	    String new_owner)
    {
	List<Contact> contacts_list = ContactUtil
		.getContactsBulk(contactsJSONArray);
	if (contacts_list.size() == 0)
	{
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

    /**
     * Sets owner_key to the contact. Annotated with @JsonIgnore to prevent auto
     * execution of this method (conflict with "PUT" request)
     * 
     * @param owner_key
     */
    @JsonIgnore
    public void setContactOwner(Key<DomainUser> owner_key)
    {
	this.owner_key = owner_key;
    }

    /**
     * Returns tags
     * 
     * @return
     */
    @JsonIgnore
    public LinkedHashSet<String> getContactTags()
    {
	if (!tags.isEmpty())
	    return tags;

	System.out.println(tagsWithTime);
	LinkedHashSet<String> tags = new LinkedHashSet<String>();

	for (Tag tag : tagsWithTime)
	{
	    tags.add(tag.tag);
	}

	return tags;
    }

    /**
     * While saving a contact it contains domain user key as owner, but while
     * retrieving includes complete DomainUser object.
     * 
     * @return {@link DomainUser} object
     */
    @XmlElement(name = "owner")
    public DomainUser getOwner()
    {
	if (owner_key != null)
	{
	    // If user is deleted no user is found with key so set user to null
	    // and return null
	    try
	    {
		// return dao.ofy().get(owner_key);
		return DomainUserUtil.getDomainUser(owner_key.getId());
	    }
	    catch (Exception e)
	    {
		owner_key = null;
		return null;
	    }
	}
	return null;
    }

    /**
     * Assigns values to owner_key, created time or updated time and runs
     * deferred task for tags of a contact, before it is getting saved.
     */
    @SuppressWarnings("unused")
    @PrePersist
    private void PrePersist()
    {

	// Set owner, when only the owner_key is null
	if (owner_key == null)
	{
	    // Set lead owner(current domain user)
	    owner_key = new Key<DomainUser>(DomainUser.class, SessionManager
		    .get().getDomainId());
	}

	// Store Created and Last Updated Time Check for id even if created
	// time is 0(To check whether it is update request)
	if (created_time == 0L && id == null)
	{
	    created_time = System.currentTimeMillis() / 1000;
	}
	else
	{
	    updated_time = System.currentTimeMillis() / 1000;
	}
	
	for(Tag tag : tagsWithTime)
	{
	    if (tag.createdTime == 0L)
		tag.createdTime = System.currentTimeMillis();
	}

	System.out.println(tagsWithTime);

	// Update Tags - Create a deferred task
	TagsDeferredTask tagsDeferredTask = new TagsDeferredTask(
		getContactTags());

	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(tagsDeferredTask));

    }

    @PostLoad
    private void postLoad()
    {
	tags = getContactTags();
    }

    @Override
    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " updated_time"
		+ updated_time + " type: " + type + " tags: " + tags
		+ " properties: " + properties;
    }

}