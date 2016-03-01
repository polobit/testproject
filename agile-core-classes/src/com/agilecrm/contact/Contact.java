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

import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.util.EmailBounceStatusUtil;
import com.agilecrm.contact.util.CompanyUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.social.linkedin.LinkedInUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.notification.util.ContactNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.triggers.util.ContactTriggerUtil;
import com.agilecrm.workflows.unsubscribe.UnsubscribeStatus;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
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

    @JsonIgnore
    @Indexed
    public String first_name = "";

    @JsonIgnore
    @Indexed
    public String last_name = "";

    @JsonIgnore
    @Indexed
    public String name = "";

    /**
     * Created time of the contact
     */
    @Indexed
    public Long created_time = 0L;

    /**
     * Updated time of the contact
     */
    @Indexed
    public Long updated_time = 0L;

    @Indexed
    public Long last_contacted = 0L;

    @Indexed
    public Long last_emailed = 0L;

    @Indexed
    public Long last_campaign_emaild = 0L;

    @Indexed
    public Long last_called = 0L;

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
    @Indexed
    public Short star_value = 0;

    /**
     * Lead score of the contact
     */
    @Indexed
    public Integer lead_score = 0;

    /**
     * Schema version of the contact used for updating schema
     */
    @Indexed
    @JsonIgnore
    public Integer schema_version = 1;

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
    public static final String PHONE = "phone";
    public static final String SKYPEPHONE = "skypePhone";
    public static final String IMAGE = "image";
    public static final String UTM_SOURCE = "utm_source";
    public static final String UTM_MEDIUM = "utm_medium";
    public static final String UTM_CAMPAIGN = "utm_campaign";
    public static final String UTM_TERM = "utm_term";
    public static final String UTM_CONTENT = "utm_content";
    public static final String SHOPIFY_SYNC = "shopifySyncId";
    public static final String QUICKBOOK_SYNC = "quickbookSyncId";

    /**
     * Unsubscribe status
     */
    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public List<UnsubscribeStatus> unsubscribeStatus = new ArrayList<UnsubscribeStatus>();// Dao

    @NotSaved(IfDefault.class)
    @Embedded
    @Indexed
    public List<EmailBounceStatus> emailBounceStatus = new ArrayList<EmailBounceStatus>();

    @Indexed
    @NotSaved(IfDefault.class)
    public Long formId = 0L;

    public static ObjectifyGenericDao<Contact> dao = new ObjectifyGenericDao<Contact>(Contact.class);

    @JsonIgnore
    @NotSaved
    public String bulkActionTracker = "";

    /**
     * To update text document forcably
     */
    @JsonIgnore
    @NotSaved
    public boolean forceSearch = false;

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

    public ContactField addpropertyWithoutSaving(ContactField contactField)
    {
	// Ties to get contact field from existing properties based on new field
	// name.
	System.out.println("The contact field is " + contactField);
	ContactField field = this.getContactFieldByName(contactField.name);
	System.out.println("The contact field is " + field);
	String fieldName = field == null ? contactField.name : field.name;
	System.out.println("The fieldName is " + fieldName);
	FieldType type = FieldType.CUSTOM;
	System.out.println("The FieldType is " + type);
	if (fieldName.equals(FIRST_NAME) || fieldName.equals(LAST_NAME) || fieldName.equals(EMAIL)
		|| fieldName.equals(TITLE) || fieldName.equals(WEBSITE) || fieldName.equals(COMPANY)
		|| fieldName.equals(ADDRESS) || fieldName.equals(URL) || fieldName.equals(PHONE)
		|| fieldName.equals(NAME) || fieldName.equals(SKYPEPHONE))
	    type = FieldType.SYSTEM;

	// If field is null then new contact field is added to properties.
	if (field == null)
	{
	    contactField.type = type;
	    this.properties.add(contactField);
	}
	else
	{
	    contactField.type = type;
	    field.updateField(contactField);
	}
	return field;
    }

    /**
     * Adds {@link ContactField} to properties list.
     * 
     * @param contactField
     */
    public void addProperty(ContactField contactField)
    {
	addpropertyWithoutSaving(contactField);
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
	    if (field.name == null)
		continue;
	    if (field.name.equals(fieldName))
		fields.add(field);
	}
	return fields;
    }

    /**
     * Saves (new) or updates (existing) a contact and executes trigger,
     * notification and also adds to search document
     * 
     * @throws PlanRestrictedException
     */
    public void save(boolean... args)
    {
	// Stores current contact id in to a temporary variable, to check
	// whether contact is newly created or being edited.

	ContactSavePreprocessor preProcessor = new ContactSavePreprocessor(this);
	preProcessor.preProcess(args);

	Contact oldContact = preProcessor.getOldContact();

	dao.put(this);

	postSave(oldContact, args);

	if (oldContact != null && !isDocumentUpdateRequired(oldContact))
	    return;
	
	addToSearch();

    }

    public void postSave(Contact oldContact, boolean... args)
    {

	Long time = System.currentTimeMillis();

	if (type == Type.COMPANY && oldContact != null)
	{
	    CompanyUtil.checkAndUpdateCompanyName(oldContact, this);
	}

	// Execute trigger for contacts
	ContactTriggerUtil.executeTriggerToContact(oldContact, this);

	// Update Email Bounce status
	EmailBounceStatusUtil.updateEmailBounceStatus(oldContact, this);

	// Boolean value to check whether to avoid notification on each contact.
	boolean notification_condition = true;

	// Reads arguments from method. If it is not null and then reading first
	// parameter will judge whether to send notification or not
	if (args != null && (args.length > 0))
	    notification_condition = args[0];

	if (notification_condition)
	    // Execute notification for contacts
	    ContactNotificationPrefsUtil.executeNotificationToContact(oldContact, this);

	System.out.println("Time taken to process post save on contact : " + this.id + " time is : "
		+ (System.currentTimeMillis() - time));
    }

    public void update()
    {
	if (this.id == null || this.id == 0l)
	    return;

	dao.put(this);

	addToSearch();
    }

    private void addToSearch()
    {
	// Enables to build "Document" search on current entity
	AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

	// If contact is new then add it to document else edit document
	if (id == null)
	{
	    try
	    {
		search.add(this);
	    }
	    catch (Exception e)
	    {
		System.out.println("unable to update document " + this.getContactFieldValue(Contact.EMAIL));
	    }
	    return;
	}
	try
	{
	    search.edit(this);
	}
	catch (Exception e)
	{
	    System.out.println("unable to update document " + this.getContactFieldValue(Contact.EMAIL));
	}

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
	if (forceSearch
		|| contact.tags.size() != currentContactTags.size()
		|| contact.properties.size() != properties.size()
		|| contact.star_value != star_value
		|| (contact.lead_score != null ? !contact.lead_score.equals(lead_score) : false)
		|| contact.campaignStatus.size() != campaignStatus.size()
		|| contact.emailBounceStatus.size() != emailBounceStatus.size()
		|| (contact.contact_company_key != null ? !contact.contact_company_key.equals(contact_company_key)
			: false))

	    return true;

	// Checks if tags are changed
	for (String tag : contact.tags)
	{
	    if (!currentContactTags.contains(tag))
		return true;
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
		return true;
	}

	// Checks campaign status has any change
	for (CampaignStatus status : contact.campaignStatus)
	{
	    if (campaignStatus == null || status == null)
		continue;

	    if (!campaignStatus.contains(status))
		return true;
	}

	// Checks if owner changed. It should be considered as contact update
	// and update the document with updated time
	if (!contact.owner_key.equals(owner_key))
	    return true;

	return false;
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
	System.out.println("inside get contfield " + fieldName);
	// Iterates through all the properties and returns matching property
	for (ContactField field : properties)
	{
	    if (fieldName.equals(field.name))
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
    public void addTags(String... tags) throws WebApplicationException
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
	    {
		TagUtil.validateTag(tag);
		tagsWithTime.add(tagObject);
	    }
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

	    TagUtil.validateTag(tag.tag);

	    tagsWithTime.add(tag);
	}

	// Contact is not saved if tags length is same before and after adding
	// new tags
	if (oldTagsCount == tagsWithTime.size())
	    return;

	this.save();
    }

    public boolean addTag(Tag tag)
    {
	// Adds to list if there it is a new tag
	if (tagsWithTime.contains(tag))
	    return false;
	TagUtil.validateTag(tag.tag);
	tagsWithTime.add(tag);

	return true;
    }

    /**
     * Removed tags from tagsWithTime object
     * 
     * @param tags
     */
    public void removeTags(Tag[] tags, boolean... deleteTags)
    {
	Set<String> tagslist = removeTagsWithoutSaving(tags);

	this.save();

	boolean isUpdateRequired = true;
	if (deleteTags != null && deleteTags.length >= 1)
	{
	    isUpdateRequired = deleteTags[0];
	}

	if (isUpdateRequired)
	    // Delete tags from Tag class
	    TagUtil.deleteTags(tagslist);
    }

    public Set<String> removeTagsWithoutSaving(Tag[] tags)
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

	return tagslist;
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
    public void delete(boolean... args)
    {
	// Checks User access control over current entity to be saved.
	// UserAccessControlUtil.check(this.getClass().getSimpleName(), this,
	// CRUDOperation.DELETE, true);

	boolean execute_notification = true;

	if (args != null && args.length > 0)
	    execute_notification = args[0];

	// Execute notification when contact is deleted. Condition is to check
	// whether to send notification or not
	if (execute_notification)
	    ContactNotificationPrefsUtil.executeNotificationForDeleteContact(this);

	dao.delete(this);

	new AppengineSearch<Contact>(Contact.class).delete(id.toString());

	if (type == Type.COMPANY)
	{
	    ContactUtil.removeCompanyReferenceFromContacts(this);
	}

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

    public void deleteAsync()
    {
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

    @JsonIgnore
    public Key<DomainUser> getContactOwnerKey()
    {
	return owner_key;
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

    @JsonIgnore
    public void setLastContacted(Long lastContacted)
    {
	this.last_contacted = lastContacted;
    }

    @JsonIgnore
    public Long getLastContacted()
    {
	return last_contacted;
    }

    @JsonIgnore
    public void setLastEmailed(Long lastEmailed)
    {
	this.last_emailed = lastEmailed;

	setLastContacted(last_emailed);
    }

    @JsonIgnore
    public Long getLastEmailed()
    {
	return last_emailed;
    }

    @JsonIgnore
    public void setLastCalled(Long lastCalled)
    {
	this.last_called = lastCalled;

	setLastContacted(last_called);
    }

    @JsonIgnore
    public Long getLastCalled()
    {
	return last_called;
    }

    @JsonIgnore
    public void setLastCampaignEmailed(Long lastCampaignEmailed)
    {
	this.last_campaign_emaild = lastCampaignEmailed;

	setLastContacted(last_campaign_emaild);
    }

    @JsonIgnore
    public Long getLastCampaignEmailed()
    {
	return last_campaign_emaild;
    }

    /**
     * While saving a contact it contains domain user key as owner, but while
     * retrieving includes complete DomainUser object.
     * 
     * @return {@link DomainUser} object
     */
    @XmlElement(name = "owner")
    public DomainUserPartial getOwner()
    {
    	System.out.println("Owner call");
    	
	if (owner_key != null)
	{
		System.out.println("owner_key call");
		
	    // If user is deleted no user is found with key so set user to null
	    // and return null
		return DomainUserUtil.getPartialDomainUser(owner_key.getId());
	   /* try
	    {
	     return DomainUserUtil.getPartialDomainUser(owner_key.getId());
	    }
	    catch (Exception e)
	    {
	    System.err.println(e.getMessage());
		owner_key = null;
		return null;
	    } */
	}
	return null;
    }
    
    /**
     * While saving a contact it contains domain user key as owner, but while
     * retrieving includes complete DomainUser object.
     * 
     * @return {@link DomainUser} object
     */
    public DomainUser getContactOwner()
    {
    	System.out.println("getContactOwner call");
    	
	if (owner_key != null)
	{
	    
	    // If user is deleted no user is found with key so set user to null
	    // and return null
	    try
	    {
	    	
		// return dao.ofy().get(owner_key);
		DomainUser user = DomainUserUtil.getDomainUser(owner_key.getId());
		if (user != null)
		    user.getCalendarURL();

		return user;
	    
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
	    if (StringUtils.equals(field.name, EMAIL)
		    && StringUtils.equals((field.value).toLowerCase(), email.toLowerCase()))
		return true;
	}
	return false;
    }

    /**
     * To convert EmailId of contact to lower case
     */
    public void convertEmailToLower()
    {
	for (ContactField field : properties)
	{
	    if (StringUtils.equals(field.name, EMAIL) && field.value != null)
		field.value = (field.value).toLowerCase();

	}

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
    @SuppressWarnings({ "unused", "unchecked" })
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
	    System.out.println("type of contact is person");
	    if (this.properties.size() > 0)
	    {
		ContactField firstNameField = this.getContactFieldByName(Contact.FIRST_NAME);
		ContactField lastNameField = this.getContactFieldByName(Contact.LAST_NAME);
		this.first_name = firstNameField != null ? StringUtils.lowerCase(firstNameField.value) : "";
		this.last_name = lastNameField != null ? StringUtils.lowerCase(lastNameField.value) : "";
	    }
	    if (StringUtils.isNotEmpty(contact_company_id))
	    {
		System.out.println("Contact company id is not empty: " + contact_company_id);
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

		    System.out.println("Company key is " + companyKey);
		    if (companyKey != null)
		    {
			// found company by its name, so set it
			this.contact_company_key = companyKey;
			System.out.println("Company key isnt null ");
		    }
		    else
		    {
			System.out.println("Company key is null ");
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
	if (this.type == Type.COMPANY)
	{
	    if (this.properties.size() > 0)
	    {
		ContactField nameField = this.getContactFieldByName(Contact.NAME);
		this.name = nameField != null ? StringUtils.lowerCase(nameField.value) : "";
	    }
	    // Company name lower case field used for duplicate check.
	    ContactField nameLowerField = this.getContactFieldByName("name_lower");
	    if (nameLowerField == null)
	    {
		if (StringUtils.isNotEmpty(name))
		    this.properties.add(new ContactField("name_lower", name.toLowerCase(), null));
	    }

	}

	// Store Created and Last Updated Time Check for id even if created
	// time is 0(To check whether it is update request)
	if (created_time == 0L && id == null)
	{
	    created_time = System.currentTimeMillis() / 1000;
	}

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
	{
	    field.value = LinkedInUtil.changeImageUrl(field.value);
	    /*
	     * if (StringUtils.contains(field.value, "twimg0-") ||
	     * StringUtils.contains(field.value, "twimg.com"))
	     * properties.remove(field);
	     */
	}

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
	//If entity is Company type, set entity_type to company
	if (this.type == Contact.Type.COMPANY)
	{
		this.entity_type = "company_entity";
	}
    }

    /**
     * Updates any new tag w.r.t domain
     * 
     * @param oldContact
     *            - Contact entity before save
     * @param updatedContact
     *            - Current contact
     */
    private void updateTagsEntity(Contact oldContact, Contact updatedContact)
    {
	try
	{
	    // If tags are not empty, considering they are simple tags and adds
	    // them
	    // to tagsWithTime
	    if (!tags.isEmpty())
	    {
		for (String tag : tags)
		{

		    Tag tagObject = new Tag(tag);
		    if (!tagsWithTime.contains(tagObject) && oldContact != null
			    && oldContact.tagsWithTime.contains(tagObject))
		    {
			tagsWithTime.add(oldContact.tagsWithTime.get(oldContact.tagsWithTime.indexOf(tagObject)));
		    }
		    else if (!tagsWithTime.contains(tagObject))
		    {
			TagUtil.validateTag(tag);
			tagsWithTime.add(tagObject);
		    }
		}
	    }

	    List<Tag> newTags = new ArrayList<Tag>();
	    for (Tag tag : tagsWithTime)
	    {
		// Check if it is null, it can be null tag is created using
		// developers api
		if (tag.createdTime == null || tag.createdTime == 0L)
		{
		    tag.createdTime = System.currentTimeMillis();
		    newTags.add(tag);
		}
	    }

	    LinkedHashSet<String> oldTags = null;

	    if (oldContact != null)
		oldTags = oldContact.getContactTags();

	    tags = getContactTags();

	    if (tags.equals(oldTags))
		return;

	    System.out.println("Tag entity need to update...." + bulkActionTracker);

	    TagUtil.runUpdateDeferedTask(newTags, bulkActionTracker);
	}
	catch (WebApplicationException e)
	{
	    System.out.println("Exception in tags - " + e.getResponse().getEntity());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity(e.getResponse().getEntity().toString()).build());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in updateTagsEntity..." + e.getMessage());
	}
    }

    /**
     * Verifies BounceStatus in both old and new contact objects. To update
     * bounce statuses if not exists in updated contact
     * 
     * @param oldContact
     *            - oldContact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkBounceStatus(Contact oldContact, Contact updatedContact)
    {
	try
	{

	    // For New contact
	    if (oldContact == null || oldContact.emailBounceStatus == null)
		return;

	    // If no change return
	    if (updatedContact.emailBounceStatus != null
		    && oldContact.emailBounceStatus.size() == updatedContact.emailBounceStatus.size())
		return;

	    // Updated Bounce Status in new contact
	    if (updatedContact.emailBounceStatus == null || updatedContact.emailBounceStatus.size() == 0
		    || updatedContact.emailBounceStatus.size() < oldContact.emailBounceStatus.size())
		updatedContact.emailBounceStatus = oldContact.emailBounceStatus;

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while checking Bounce Status in Contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Verifies CampaignStatus in both old and new contact objects. To update
     * campaign statuses if not exists in updated contact
     * 
     * @param oldContact
     *            - oldContact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkCampaignStatus(Contact oldContact, Contact updatedContact)
    {
	try
	{

	    // For New contact
	    if (oldContact == null || oldContact.campaignStatus == null)
		return;

	    System.out.println("Old CampaignStatus: " + oldContact.campaignStatus + " New campaignStatus: "
		    + updatedContact.campaignStatus);

	    // If no change return
	    if (updatedContact.campaignStatus != null
		    && oldContact.campaignStatus.size() == updatedContact.campaignStatus.size())
		return;

	    // Updated Campaign Status in new contact
	    if (updatedContact.campaignStatus == null || updatedContact.campaignStatus.size() == 0
		    || updatedContact.campaignStatus.size() < oldContact.campaignStatus.size())
		updatedContact.campaignStatus = oldContact.campaignStatus;

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while checking CampaignStatus in Contact..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Verifies last contacted fields in both old and new objects. To update
     * contacted fields if not exists in updated contact
     * 
     * @param oldContact
     *            - old Contact from datastore
     * @param updatedContact
     *            - updated contact object ready to save
     */
    private void checkLastContactedFields(Contact oldContact, Contact updatedContact)
    {
	try
	{
	    if (oldContact == null)
		return;

	    if (updatedContact.getLastContacted() == 0L || updatedContact.getLastContacted() == null)
		updatedContact.last_contacted = oldContact.last_contacted;

	    if (updatedContact.getLastCampaignEmailed() == 0L || updatedContact.getLastCampaignEmailed() == null)
		updatedContact.last_campaign_emaild = oldContact.last_campaign_emaild;

	    if (updatedContact.getLastEmailed() == 0L || updatedContact.getLastEmailed() == null)
		updatedContact.last_emailed = oldContact.last_emailed;

	    if (updatedContact.getLastCalled() == 0L || updatedContact.getLastCalled() == null)
		updatedContact.last_called = oldContact.last_called;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while verifying last contacted fields..." + e.getMessage());
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