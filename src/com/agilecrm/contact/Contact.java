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
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.deferred.TagsDeferredTask;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.util.ContactNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.triggers.util.ContactTriggerUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.NotFoundException;
import com.googlecode.objectify.annotation.AlsoLoad;
import com.googlecode.objectify.annotation.Cached;
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
@Cached
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
    @NotSaved
    public Long viewed_time = 0L;

    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public ViewedDetails viewed = new ViewedDetails();

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

    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public List<CampaignStatus> campaignStatus = new ArrayList<CampaignStatus>();

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

    @NotSaved
    public String entity_type = "contact_entity";

    /**
     * related company key of this person, ignored for company entity, this is
     * stored in db
     */
    @JsonIgnore
    @NotSaved(IfDefault.class)
    @Indexed
    @AlsoLoad("contactCompanyKey")
    public Key<Contact> contact_company_key = null;

    /**
     * related company key, for network communication
     */
    @NotSaved
    public String contact_company_id;

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
    public static final String WEBSITE = "website";
    public static final String ADDRESS = "address";
    // Dao
    public static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

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
    public Contact(Type type, LinkedHashSet<String> tags, List<ContactField> properties)
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
     * Adds {@link ContactField} to properties list.
     * 
     * @param contactField
     */
    public void addProperty(ContactField contactField)
    {
	// Ties to get contact field from existing properties based on new field
	// name.
	ContactField field = this.getContactFieldByName(contactField.name);

	// If field is null then new contact field is added to properties.
	if (field == null)
	{
	    this.properties.add(contactField);
	}
	else
	    field = contactField;
	save();
    }

    public void removeProperty(String propertyName)
    {
	if (getContactField(propertyName) == null)
	    return;

	properties.remove(getContactField(propertyName));
    }

    /**
     * Gets all the contact property fields with given field name. It returns
     * list of matching contact properties
     * 
     * @param {@link {@link List} of {@link ContactField}
     * @return
     */
    public List<ContactField> getContactPropertiesList(String fieldName)
    {
	List<ContactField> fields = new ArrayList<ContactField>();

	// Iterates through all the properties and returns matching property
	for (ContactField field : properties)
	{
	    if (field.name.equals(fieldName))
		fields.add(field);
	}
	return fields;
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

	// Check for already existing email if any,
	// loop through for checking multiple emails
	for (ContactField contactField : this.properties)
	{
	    if (!StringUtils.equalsIgnoreCase(contactField.name, "EMAIL"))
		continue;

	    String myMail = contactField.value;
	    int countEmails = 0; // to allow if this new entry doesn't have
	    // email-id

	    if (myMail != null && !myMail.isEmpty())
		countEmails = dao.getCountByProperty("properties.value = ", myMail);

	    // Throw BAD_REQUEST if countEmails>=2 (sure duplicate contact)
	    // otherwise if countEmails==1, make sure its not due to previous
	    // value of this(current) Contact
	    if (countEmails >= 2 || (countEmails == 1 && (id == null || !oldContact.isEmailExists(myMail))))
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			.entity("Sorry, a contact with this email already exists " + myMail).build());
	}

	dao.put(this);

	// Execute trigger for contacts
	ContactTriggerUtil.executeTriggerToContact(oldContact, this);

	// Execute notification for contacts
	ContactNotificationPrefsUtil.executeNotificationToContact(oldContact, this);

	if (oldContact != null && isDocumentUpdateRequired(oldContact))
	    return;

	// Enables to build "Document" search on current entity
	AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

	// If contact is new then add it to document else edit document
	if (id == null)
	{
	    search.add(this);
	    return;
	}
	search.edit(this);
    }

    /**
     * Checks if search document record is to be updated.
     * 
     * @param object
     * @return
     */
    public boolean isDocumentUpdateRequired(Object object)
    {
	Contact contact = (Contact) object;
	Set<String> currentContactTags = getContactTags();

	// If tags and properties length differ, contact is considered to be
	// changed
	if (contact.tags.size() != currentContactTags.size() || contact.properties.size() != properties.size()
		|| contact.star_value != star_value || contact.lead_score != lead_score)
	    return false;

	// Checks if tags are changed
	for (String tag : contact.tags)
	{
	    if (!currentContactTags.contains(tag))
		return false;
	}

	// Checks of properties has any change
	for (ContactField property : contact.properties)
	{
	    // If name or value is null, this might be erroneous entry from
	    // client-side
	    // Simply ignore these kind of entries
	    if (property.name == null || property.value == null)
		continue;

	    if (!properties.contains(property))
		return false;
	}

	// Checks if owner changed. It should be considered as contact update
	// and update the document with updated time
	if (!contact.owner_key.equals(owner_key))
	    return false;

	return true;
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

    /**
     * Returns {@link ContactField} object based on the field name
     * 
     * @param fieldName
     * @return
     */
    public ContactField getContactFieldByName(String fieldName)
    {
	// Iterates through all the properties and returns matching property
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

    /**
     * Retursn list of tags (list of {@link Tag}).
     * 
     * JsonIgnore is used as get do not want to return this field with contact
     * object
     * 
     * @return
     */
    @JsonIgnore
    public ArrayList<Tag> getTagsList()
    {
	return tagsWithTime;
    }

    /**
     * Adds tag(s) to a contact. It is mostly used from developer API call,
     * where they try to add new tags to existing tags.
     * 
     * @param tags
     */
    public void addTags(String[] tags)
    {
	int oldTagsCount = tagsWithTime.size();

	// Iterates though each tag and checks if tag with the same name exists,
	// add if it a new tag
	for (String tag : tags)
	{
	    Tag tagObject = new Tag(tag);

	    // Check whether tag already exists. Equals method is overridden in
	    // Tag class to use this contains functionality
	    if (!tagsWithTime.contains(tagObject))
		tagsWithTime.add(tagObject);
	}

	// Returns without saving if there is no change in tags list length
	if (oldTagsCount == tagsWithTime.size())
	    return;

	this.save();

    }

    /**
     * Tags tags to existing tags. As tags can either be added in tags or
     * tagsWithTime object, this method takes array of tags object and adds to
     * existing tags
     * 
     * @param tags
     */
    public void addTags(Tag[] tags)
    {

	int oldTagsCount = tagsWithTime.size();
	for (Tag tag : tags)
	{
	    // Adds to list if there it is a new tag
	    if (tagsWithTime.contains(tag))
		continue;

	    tagsWithTime.add(tag);
	}

	// Contact is not saved if tags length is same before and after adding
	// new tags
	if (oldTagsCount == tagsWithTime.size())
	    return;

	this.save();
    }

    /**
     * Removed tags from tagsWithTime object
     * 
     * @param tags
     */
    public void removeTags(Tag[] tags)
    {
	Set<String> tagslist = new HashSet<String>();

	/*
	 * Removes tags from tagsWithTime field
	 */
	for (Tag tag : tags)
	{
	    this.tagsWithTime.remove(tag);

	    tagslist.add(tag.tag);
	}

	// 'tags' field should be cleared as these two fields are compared. if
	// there is an extra tag in 'tags' field, it gets added to tagsWithTime
	// field
	// before saving contact.
	this.tags.clear();
	this.save();

	// Delete tags from Tag class
	TagUtil.deleteTags(tagslist);
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
	    tagsWithTime.remove(new Tag(tag));

	    tagslist.add(tag);

	}

	this.tags.clear();
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

	if (this.lead_score >= 0)
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
	TwitterJobQueueUtil.removeTwitterJobs(null, id.toString(), NamespaceManager.get());
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
     * Checks if email exists, works for even multiple emails.
     * 
     * @param email
     *            - to check if in any of the properties
     * @return
     */
    public boolean isEmailExists(String email)
    {
	for (ContactField field : properties)
	{
	    if (StringUtils.equals(field.name, EMAIL) && StringUtils.equals(field.value, email))
		return true;
	}
	return false;
    }

    /**
     * Assigns values to owner_key, created time or updated time and runs
     * deferred task for tags of a contact, before it is getting saved. <br/>
     * <br/>
     * If a person is associated to a company, he must have
     * contact_company_id/contact_company_key If not, he is not associated with
     * any company No setting properties['name=Company']=CompanyName saves, id
     * is required <br/>
     * <br/>
     * PrePersist checks for erroneous entries <br/>
     * -- if contact_company_id is not set, and has a 'value' in
     * properties['name=Company'], create a new company <br/>
     * -- store only id of company, ignore name ( the company may be edited
     * somewhere else )
     */
    @SuppressWarnings("unused")
    @PrePersist
    private void PrePersist()
    {
	// Set owner, when only the owner_key is null
	if (owner_key == null)
	{
	    // Set lead owner(current domain user)
	    owner_key = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
	}

	if (this.type == Type.PERSON)
	{
	    if (StringUtils.isNotEmpty(contact_company_id))
	    {
		// update id, for existing company
		this.contact_company_key = new Key<Contact>(Contact.class, Long.parseLong(this.contact_company_id));
	    }
	    else if (this.properties.size() > 0)
	    {
		ContactField contactField = this.getContactFieldByName(Contact.COMPANY);

		if (contactField != null && StringUtils.isNotEmpty(contactField.value))
		{
		    // Create new Company
		    Key<Contact> companyKey = ContactUtil.getCompanyByName(contactField.value);

		    if (companyKey != null)
		    {
			// found company by its name, so set it
			this.contact_company_key = companyKey;
		    }
		    else
		    {
			// company name not found, create a new one
			Contact newCompany = new Contact();
			newCompany.properties = new ArrayList<ContactField>();
			newCompany.properties.add(new ContactField(Contact.NAME, contactField.value, null));
			newCompany.type = Type.COMPANY;

			/*
			 * We already have the owner of contact contact, which
			 * should also be owner of contact. Instead of fetching
			 * key from session in prepersist we can use the same.
			 */
			newCompany.setContactOwner(owner_key);
			newCompany.save();

			// assign key, NECESSARY
			this.contact_company_key = new Key<Contact>(Contact.class, newCompany.id);
		    }
		    this.contact_company_id = String.valueOf(contact_company_key.getId());
		    // / assigning here so we can update model after put
		}
		else
		{
		    this.contact_company_key = null;
		}
	    }
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
	    if (viewed_time != 0L)
	    {
		viewed.viewed_time = viewed_time;
		viewed.viewer_id = SessionManager.get().getDomainId();
	    }
	}

	// If tags are not empty, considering they are simple tags and adds them
	// to tagsWithTime
	if (!tags.isEmpty())
	{
	    for (String tag : tags)
	    {
		Tag tagObject = new Tag(tag);
		if (!tagsWithTime.contains(tagObject))
		    tagsWithTime.add(tagObject);
	    }
	}

	for (Tag tag : tagsWithTime)
	{
	    // Check if it is null, it can be null tag is created using
	    // developers api
	    if (tag.createdTime == null || tag.createdTime == 0L)
		tag.createdTime = System.currentTimeMillis();
	}

	System.out.println(tagsWithTime);
	tags = getContactTags();

	// Update Tags - Create a deferred task
	TagsDeferredTask tagsDeferredTask = new TagsDeferredTask(getContactTags());

	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(tagsDeferredTask));

    }

    /**
     * A person must have contact_company_key, if not all company info is
     * removed from properties <br/>
     * --checks if contact_company_key is valid, if not removes it, otherwise
     * get company name & fill in properties['name=company']=CompanyName <br/>
     * --removes blank entries in properties['name=company'] to not confuse UI.
     * Observe that postLoad can take care of company name while loading, its OK
     * if we don't set it in prePersist.
     */
    @PostLoad
    private void postLoad()
    {
	tags = getContactTags();

	ContactField field = this.getContactField("image");
	if (field != null)
	    field.value = LinkedInUtil.changeImageUrl(field.value);

	if (contact_company_key != null) // fill company name in
	// properties['COMPANY']
	{
	    contact_company_id = String.valueOf(contact_company_key.getId());
	    Contact companyContact;
	    try
	    {
		companyContact = dao.get(contact_company_key);
		ContactField contactField = getContactField(COMPANY);
		if (contactField == null)
		    properties.add(new ContactField(Contact.COMPANY, companyContact.getContactFieldValue(Contact.NAME),
			    null));
		else
		    contactField.value = companyContact.getContactFieldValue(Contact.NAME);
	    }
	    catch (EntityNotFoundException e)
	    {
		System.out.println("entity not found exception");
		// contact.
		removeProperty(COMPANY);
		contact_company_id = null;
		contact_company_key = null;
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    catch (NotFoundException e)
	    {
		System.out.println("not found exception");

		// company id not found, remove company association for this
		// contact.
		removeProperty(COMPANY);
		contact_company_id = null;
		contact_company_key = null;
		e.printStackTrace();
	    }
	}
	else
	{
	    // remove any blank 'company' in properties before sending
	    removeProperty(COMPANY);
	}
    }

    @Override
    public String toString()
    {
	return "id: " + id + " created_time: " + created_time + " updated_time" + updated_time + " type: " + type
		+ " tags: " + tags + " properties: " + properties;
    }

}

/**
 * <code>ViewedDetails</code> is used as an embedded field in {@link Contact}
 * class to save recently viewed time and its related user id who viewed it
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
class ViewedDetails
{
    // Viewed time in milli seconds
    public Long viewed_time = 0L;

    // Viewer id
    public Long viewer_id = null;

    public ViewedDetails()
    {

    }
}