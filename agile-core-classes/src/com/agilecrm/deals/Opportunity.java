package com.agilecrm.deals;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.util.MilestoneUtil;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.notification.util.DealNotificationPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Opportunity</code> is the base class for Deals/Opportunities. Each
 * opportunity object consists of it's own id, Deal Name, related contacts,
 * expected value, probability, milestone, closed date and owner (who creates)
 * of a deal.
 * <p>
 * Opportunity can be related with contacts. The given expected-value and
 * probability are the measures of a deal. Milestones describes at what stage
 * does the deal present. Milestones are optional and can be given by domain
 * user under admin-settings in client-side.
 * </p>
 * <p>
 * Opportunity is provided with close-date which is estimated time to complete a
 * deal. Opportunity can be assigned to any one of the list of owners(Domain
 * Users).
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class Opportunity extends Cursor implements Serializable
{

    /* enum for color for the deal */
    public enum Color
    {
	VIOLET, INDIGO, BLUE, GREEN, YELLOW, ORANGE, RED, WHITE, BLACK, GREY;
    }

    public Color colorName;
    /**
     * Opportunity Id.
     */
    @Id
    public Long id;

    /**
     * Name of a Deal.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Contact ids of related contacts for a deal.
     */
    @NotSaved
    private List<String> contact_ids = new ArrayList<String>();

    /**
     * Related contact objects fetched using contact ids.
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    @NotSaved(IfDefault.class)
    @Embedded
    public List<CustomFieldData> custom_data = new ArrayList<CustomFieldData>();

    /**
     * Description of a deal.
     */
    @NotSaved(IfDefault.class)
    public String description = null;

    /**
     * Estimated value of a deal.
     */
    @NotSaved(IfDefault.class)
    public Double expected_value = null;

    /**
     * Milestone string.
     */
    @NotSaved(IfDefault.class)
    public String milestone = null;

    /**
     * Probability in order to get pipeline value.
     */
    public int probability = 0;

    /**
     * Closed date for a deal.
     */
    public Long close_date = null;

    /**
     * DomainUser Id who created Deal.
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;

    /**
     * Key object of agileUser in order to get userprefs of current user.
     */
    @NotSaved(IfDefault.class)
    private Key<AgileUser> agileUser = null;

    /**
     * Created time of a deal.
     */
    public Long created_time = 0L;

    /**
     * Created time of a deal.
     */
    public Long milestone_changed_time = 0L;

    /**
     * Track a deal.
     */
    @NotSaved(IfDefault.class)
    public String track = null;

    /**
     * Entity type.
     */
    @NotSaved
    public String entity_type = "deal";

    /**
     * Array of milestones converted from milestone string separated by comma.
     */
    public static String MILESTONES[] = {};

    /**
     * Notes id's of related notes for a deal.
     */
    @NotSaved
    private List<String> notes = new ArrayList<String>();

    /**
     * Note id's of related task for a deal.
     */
    @NotSaved
    private List<String> note_ids = new ArrayList<String>();

    /**
     * Related notes objects fetched using notes id's.
     */
    private List<Key<Note>> related_notes = new ArrayList<Key<Note>>();

    /**
     * note's description related to a task
     */
    @NotSaved
    public String note_description = null;

    @NotSaved
    public String note_subject = null;

    @NotSaved
    public Long note_created_time = 0L;

    /**
     * Related notes objects fetched using notes id's.
     */
    @NotSaved(IfDefault.class)
    private Key<Milestone> pipeline = null;

    /**
     * pipeline Id of the deal.
     */
    @NotSaved
    public Long pipeline_id = 0L;

    /**
     * To state whenther the deals is archived or not.
     */
    public boolean archived = false;

    /**
     * Won date for a deal.
     */
    public Long won_date = null;

    /**
     * Lost reason Id of the deal.
     */
    @NotSaved
    public Long lost_reason_id = 0L;

    /**
     * Key object of lost reason
     */
    @NotSaved(IfDefault.class)
    private Key<Category> lostReason = null;

    /**
     * Deal source Id of the deal.
     */
    @NotSaved
    public Long deal_source_id = 0L;

    /**
     * Key object of deal source
     */
    @NotSaved(IfDefault.class)
    private Key<Category> dealSource = null;
    
    /**
     * Total Deal value
     */
    @NotSaved
    public Double total_deal_value = 0d;

    /**
     * ObjectifyDao of Opportunity.
     */

    public static ObjectifyGenericDao<Opportunity> dao = new ObjectifyGenericDao<Opportunity>(Opportunity.class);

    /**
     * Default Constructor.
     */
    public Opportunity()
    {
    }

    /**
     * Constructs a new {@link Opportunity}.
     * 
     * @param name
     *            - Name of a Deal.
     * @param description
     *            - Description of a Deal.
     * @param expectedValue
     *            - Estimated value of a Deal.
     * @param milestone
     *            - Milestone of a deal.
     * @param probability
     *            - Probability of a deal.
     * @param track
     *            - Track.
     * @param ownerId
     *            - Owner id.
     */
    public Opportunity(String name, String description, Double expectedValue, String milestone, int probability,
	    String track, String ownerId)
    {
	this.name = name;
	this.description = description;
	this.expected_value = expectedValue;
	this.milestone = milestone;
	this.probability = probability;
	this.track = track;
	this.owner_id = ownerId;

    }

    public Opportunity(String name, String description, Double expectedValue, String milestone, int probability,
	    String track, String ownerId, String deal_color)
    {
	this.name = name;
	this.description = description;
	this.expected_value = expectedValue;
	this.milestone = milestone;
	this.probability = probability;
	this.track = track;
	this.owner_id = ownerId;
	this.colorName = Color.valueOf(deal_color);
    }

    public Opportunity(String name, String description, Double expectedValue, Long pipelineId, String milestone,
	    int probability, String track, String ownerId)
    {
	this.name = name;
	this.description = description;
	this.expected_value = expectedValue;
	this.pipeline_id = pipelineId;
	this.milestone = milestone;
	this.probability = probability;
	this.track = track;
	this.owner_id = ownerId;

    }

    /**
     * Gets contacts related with deals.
     * 
     * @return list of contact objects as xml element related with a deal.
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    	return null;
    }

    public void addContactIds(String id)
    {
	if (contact_ids == null)
	    contact_ids = new ArrayList<String>();

	contact_ids.add(id);
    }

    @JsonIgnore
    public List<Key<Contact>> getContactKeys()
    {
	return related_contacts;
    }

    @XmlElement(name = "contact_ids")
    public List<String> getContact_ids()
    {
	contact_ids = new ArrayList<String>();

	for (Key<Contact> contactKey : related_contacts)
	    contact_ids.add(String.valueOf(contactKey.getId()));

	return contact_ids;
    }

    public Long getPipeline_id()
    {
	if (pipeline != null)
	    return pipeline.getId();
	return 0L;
    }

    @XmlElement(name = "pipeline")
    public Milestone getPipeline() throws Exception
    {
	if (pipeline != null)
	{
	    try
	    {
		// Gets Domain User Object
		// return MilestoneUtil.getMilestone(pipeline.getId());
	    	return null;
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "owner")
    public DomainUserPartial getOwner() throws Exception
    {
	if (ownerKey != null)
	{
	    try
	    {
		// Gets Domain User Object
		   return DomainUserUtil.getPartialDomainUser(ownerKey.getId());
	    	
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Gets picture of owner who created deal. Owner picture is retrieved from
     * user prefs of domain user who created deal and is used to display owner
     * picture in deals list.
     * 
     * @return picture of owner.
     * @throws Exception
     *             when agileuser doesn't exist with respect to owner key.
     */
    @XmlElement
    public String getPic() throws Exception
    {
	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try
	{
	    // Get owner pic through agileuser prefs
	    /*agileuser = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey.getId());
	    if (agileuser != null)
		userprefs = UserPrefsUtil.getUserPrefs(agileuser);
	    if (userprefs != null)
		return userprefs.pic;*/
		return null;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return "";
    }

    /**
     * While saving an opportunity it contains list of notes keys, but while
     * retrieving includes complete note object.
     * 
     * @return List of note objects
     */
    @XmlElement
    public List<Note> getNotes()
    {
	// return Note.dao.fetchAllByKeys(this.related_notes);
    	return null;
    }

    public Long getLost_reason_id()
    {
	if (lostReason != null)
	    return lostReason.getId();
	return 0L;
    }

    public Long getDeal_source_id()
    {
	if (dealSource != null)
	    return dealSource.getId();
	return 0L;
    }

    /**
     * Sets owner_key to the Case. Annotated with @JsonIgnore to prevent auto
     * execution of this method (conflict with "PUT" request)
     * 
     * @param owner_key
     */
    @JsonIgnore
    public void setOpportunityOwner(Key<DomainUser> ownerKey)
    {
	this.ownerKey = ownerKey;
    }

    public void save()
    {
	save(true);
    }

    /**
     * Saves opportuntiy in dao.
     */
    public void save(boolean arg)
    {
	if (contact_ids != null)
	{
	    for (String contact_id : this.contact_ids)
	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	    }

	}

	Long id = this.id;

	// old opportunity (or deal) having id.
	Opportunity oldOpportunity = null;

	String wonMilestone = "Won";
	String lostMilestone = "Lost";
	try
	{
	    Milestone mile = MilestoneUtil.getMilestone(pipeline_id);
	    if (mile.won_milestone != null)
		wonMilestone = mile.won_milestone;
	    if (mile.lost_milestone != null)
		lostMilestone = mile.lost_milestone;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("-------------won milestone---------" + wonMilestone);
	System.out.println("-------------lost milestone---------" + lostMilestone);

	// cache old data to compare new and old in triggers
	if (id != null)
	    oldOpportunity = OpportunityUtil.getOpportunity(id);
	if (oldOpportunity == null)
	{
	    // If the deal is won, change the probability to 100.
	    if (this.milestone.equalsIgnoreCase(wonMilestone))
		this.probability = 100;

	    // If the deal is lost, change the probability to 0.
	    if (this.milestone.equalsIgnoreCase(lostMilestone))
		this.probability = 0;
	}
	if (oldOpportunity != null)
	{
	    if (this.created_time == 0)
		this.created_time = oldOpportunity.created_time;
	    if (this.won_date == null && oldOpportunity.won_date != null)
		this.won_date = oldOpportunity.won_date;
	}
	if (oldOpportunity != null && StringUtils.isNotEmpty(this.milestone)
		&& StringUtils.isNotEmpty(oldOpportunity.milestone))
	{
	    // For API fix. If the user didn't send the milestone_changed_time
	    // in the call, use the value in the old one.
	    if (this.milestone_changed_time == 0 && oldOpportunity.milestone_changed_time > 0)
		this.milestone_changed_time = oldOpportunity.milestone_changed_time;

	    if (!this.pipeline_id.equals(oldOpportunity.getPipeline_id())
		    || !this.milestone.equals(oldOpportunity.milestone))
		this.milestone_changed_time = System.currentTimeMillis() / 1000;

	    if (!this.milestone.equals(oldOpportunity.milestone) && this.milestone.equalsIgnoreCase(wonMilestone))
	    {
		this.won_date = System.currentTimeMillis() / 1000;
		this.probability = 100;
	    }

	    if (!this.milestone.equals(oldOpportunity.milestone) && this.milestone.equalsIgnoreCase(lostMilestone))
	    {
		this.probability = 0;
	    }
	    System.out.println("New Opportunity-----" + this);
	    // If old deal, new deal are same and lost reason is there,
	    // can update milestone changed time with old milestone changed time
	    if (this.pipeline_id.equals(oldOpportunity.getPipeline_id())
		    && this.milestone.equals(oldOpportunity.milestone)
		    && this.lost_reason_id != null
		    && ((oldOpportunity.lost_reason_id != null && oldOpportunity.lost_reason_id == 0L) || oldOpportunity.lost_reason_id == null))
		this.milestone_changed_time = oldOpportunity.milestone_changed_time;
	}
	else if (oldOpportunity == null && this.milestone.equalsIgnoreCase(wonMilestone))
	    this.won_date = System.currentTimeMillis() / 1000;
	dao.put(this);

	// Executes trigger
	DealTriggerUtil.executeTriggerToDeal(oldOpportunity, this);

	if (arg)
	{

	    // Enables to build "Document" search on current entity
	    AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);

	    // If contact is new then add it to document else edit document
	    if (id == null)
	    {
		search.add(this);

		// New Deal Notification
		DealNotificationPrefsUtil.executeNotificationForNewDeal(this);

		return;
	    }
	    search.edit(this);
	}
    }

    /**
     * Deletes opportunity from dao.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets created time, owner key and agile user. PrePersist is called each
     * time before object gets saved.
     */
    @PrePersist
    private void PrePersist()
    {

	if (colorName == null)
	    colorName = Color.GREY;

	// Initializes created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	// Set Deal Pipeline.
	if (pipeline_id != null && pipeline_id > 0)
	{
	    this.pipeline = new Key<Milestone>(Milestone.class, pipeline_id);
	}

	// If owner_id is null
	if (owner_id == null && ownerKey == null)
	{
	    UserInfo userInfo = SessionManager.get();
	    if (userInfo == null)
		return;

	    owner_id = SessionManager.get().getDomainId().toString();
	}

	// Saves domain user key
	if (owner_id != null)
	    ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));
	System.out.println("OwnerKey" + ownerKey);

	// Sets Deal lostReason.
	if (lost_reason_id != null && lost_reason_id > 0)
	{
	    this.lostReason = new Key<Category>(Category.class, lost_reason_id);
	}

	// Sets deal source.
	if (deal_source_id != null && deal_source_id > 0)
	{
	    this.dealSource = new Key<Category>(Category.class, deal_source_id);
	}

	// Session doesn't exist when adding deal from Campaigns.
	if (SessionManager.get() == null)
	    return;

	AgileUser user = AgileUser.getCurrentAgileUser();

	if (user == null)
	    return;

	// Saves agile user key
	agileUser = new Key<AgileUser>(AgileUser.class, user.id);

	// If new note is added to deal
	if (!StringUtils.isEmpty(this.note_description))
	{
	    if (!this.note_description.trim().isEmpty())
	    {
		// Create note
		Note note = null;
		// Create note
		if (this.note_created_time != 0)
		{
		    if (this.note_subject != null)
			note = new Note(this.note_subject, this.note_description, this.note_created_time);
		    else
			note = new Note(null, this.note_description, this.note_created_time);
		    // Save note
		    note.save();

		    if (this.id != null)
		    {
			ActivitySave.createNoteAddForDeal(note, this);
		    }
		}
		else
		{
		    if (this.note_subject != null)
			note = new Note(this.note_subject, this.note_description);
		    else
			note = new Note(null, this.note_description);
		    // Save note
		    note.save();

		    if (this.id != null)
		    {
			ActivitySave.createNoteAddForDeal(note, this);
		    }
		}
		// Add note to task
		this.related_notes.add(new Key<Note>(Note.class, note.id));
	    }

	    // Make temp note null
	    this.note_description = null;
	}
	else if (this.note_subject != null)
	{
	    if (!this.note_subject.trim().isEmpty())
	    {
		// Create note
		Note note = null;
		// Create note
		if (this.note_created_time != 0)
		{
		    if (this.note_subject != null)
			note = new Note(this.note_subject, null, this.note_created_time);
		}
		else
		{
		    if (this.note_subject != null)
			note = new Note(this.note_subject, null);
		}
		// Save note
		note.save();
		if (this.id != null)
		{
		    ActivitySave.createNoteAddForDeal(note, this);
		}

		// Add note to task
		this.related_notes.add(new Key<Note>(Note.class, note.id));
	    }
	}

	if (this.notes != null)
	{
	    // Create list of Note keys
	    for (String note_id : this.notes)
	    {
		this.related_notes.add(new Key<Note>(Note.class, Long.parseLong(note_id)));
	    }

	    this.notes = null;
	}

	/*
	 * if (milestone_changed_time == 0L) milestone_changed_time =
	 * System.currentTimeMillis() / 1000;
	 */

	// Setting note_ids from api calls
	setRelatedNotes();

    }

    @XmlElement(name = "note_ids")
    public List<String> getNote_ids()
    {
	note_ids = new ArrayList<String>();

	for (Key<Note> noteKey : related_notes)
	    note_ids.add(String.valueOf(noteKey.getId()));

	return note_ids;
    }

    /**
     * Set related notes to the Case. Annotated with @JsonIgnore to prevent auto
     * execution of this method (conflict with "PUT" request)
     * 
     * @param owner_key
     */
    @JsonIgnore
    public void setRelatedNotes()
    {
	Set<String> notesSet = null;
	if (this.notes != null && !this.notes.isEmpty())
	{
	    notesSet = new HashSet<String>(notes);

	}
	else if (this.note_ids != null && !this.note_ids.isEmpty())
	{
	    notesSet = new HashSet<String>(note_ids);
	}
	if (notesSet != null)
	{

	    // Create list of Note keys
	    for (String note_id : notesSet)
	    {
		this.related_notes.add(new Key<Note>(Note.class, Long.parseLong(note_id)));
	    }

	    this.notes = null;
	}

	/*
	 * if (milestone_changed_time == 0L) milestone_changed_time =
	 * System.currentTimeMillis() / 1000;
	 */

    }

    public void addCustomData(CustomFieldData field)
    {
	System.out.println("Custom filed received is = " + field);
	addCustomDataWithoutSaving(field);
	save();

    }

    public CustomFieldData addCustomDataWithoutSaving(CustomFieldData dealField)
    {
	CustomFieldData field = this.getContactFieldByName(dealField.name);
	String fieldName = field == null ? dealField.name : field.name;

	if (field == null)
	{
	    this.custom_data.add(dealField);
	}
	else
	{
	    field.updateField(dealField);
	}
	return field;

    }

    public CustomFieldData getContactFieldByName(String fieldName)
    {
	// Iterates through all the properties and returns matching property
	for (CustomFieldData field : custom_data)
	{
	    if (fieldName.equals(field.name))
		return field;
	}
	return null;
    }

    public void addContactIdsToDeal(List<String> contact_idsList)
    {
	List<String> al = new ArrayList<String>();
	for (String contact_id : contact_idsList)
	{

	    if (!this.getContact_ids().contains(contact_id))
	    {
		al.add(contact_id);
	    }
	}

	contact_ids = al;
	save();

    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {

	StringBuilder builder = new StringBuilder();
	builder.append("Opportunity [id=").append(id).append(", name=").append(name).append(", contact_ids=")
		.append(contact_ids).append(", related_contacts=").append(related_contacts).append(", custom_data=")
		.append(custom_data).append(", description=").append(description).append(", expected_value=")
		.append(expected_value).append(", milestone=").append(milestone).append(", probability=")
		.append(probability).append(", close_date=").append(close_date).append(", owner_id=").append(owner_id)
		.append(", ownerKey=").append(ownerKey).append(", agileUser=").append(agileUser)
		.append(", created_time=").append(created_time).append(", track=").append(track)
		.append(", entity_type=").append(entity_type).append(", notes=").append(notes)
		.append(", related_notes=").append(related_notes).append(", note_description=")
		.append(note_description).append(", pipeline=").append(pipeline).append(", pipeline_id=")
		.append(pipeline_id).append(", archived=").append(archived).append(", lost_reason_id=")
		.append(lost_reason_id).append(", deal_source_id=").append(deal_source_id).append("]");
	;
	return builder.toString();
    }

}