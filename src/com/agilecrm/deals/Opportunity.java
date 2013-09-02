package com.agilecrm.deals;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
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
@XmlRootElement
public class Opportunity extends Cursor
{
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
    @NotSaved(IfDefault.class)
    public Long close_date = 0L;

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
    }

    public void addContactIds(String id)
    {
	if (contact_ids == null)
	    contact_ids = new ArrayList<String>();

	contact_ids.add(id);
    }

    @XmlElement(name = "contact_ids")
    public List<String> getContact_ids()
    {
	contact_ids = new ArrayList<String>();

	for (Key<Contact> contactKey : related_contacts)
	    contact_ids.add(String.valueOf(contactKey.getId()));

	return contact_ids;
    }

    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id.
     */
    @XmlElement(name = "owner")
    public DomainUser getOwner() throws Exception
    {
	if (ownerKey != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(ownerKey.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Gets UserPrefs object with respect to agile user. In order to display
     * owner name of a deal in Deals table, UserPrefs are taken into account.
     * 
     * @return UserPrefs object with respect to agile user.
     * @throws Exception
     *             if unable to fetch UserPrefs.
     */
    @XmlElement(name = "Prefs")
    public UserPrefs getPrefs() throws Exception
    {
	if (agileUser != null)
	{
	    Objectify ofy = ObjectifyService.begin();
	    try
	    {
		// Gets User prefs in return to access owner name , pic
		// etc..details of a deal
		return ofy.query(UserPrefs.class).ancestor(agileUser).get();
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
	    agileuser = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey.getId());
	    if (agileuser != null)
		userprefs = UserPrefsUtil.getUserPrefs(agileuser);
	    if (userprefs != null)
		return userprefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return "";
    }

    /**
     * Saves opportuntiy in dao.
     */
    public void save()
    {
	if (contact_ids != null)
	{
	    for (String contact_id : this.contact_ids)
	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	    }

	    // Executes trigger when new deal is created with related
	    // contacts as trigger needs contact objects
	    if (this.id == null)
		DealTriggerUtil.executeTriggerForNewDeal(this);
	}

	Long id = this.id;

	dao.put(this);

	// Enables to build "Document" search on current entity
	AppengineSearch<Opportunity> search = new AppengineSearch<Opportunity>(Opportunity.class);

	// If contact is new then add it to document else edit document
	if (id == null)
	{
	    search.add(this);
	    return;
	}
	search.edit(this);

	// Executes notification for new deal, inorder to get id
	if (id == null)
	    DealNotificationPrefsUtil.executeNotificationForNewDeal(this);
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
	// Initializes created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	// If owner_id is null
	if (owner_id == null)
	{
	    UserInfo userInfo = SessionManager.get();
	    if (userInfo == null)
		return;

	    owner_id = SessionManager.get().getDomainId().toString();
	}

	// Saves domain user key
	ownerKey = new Key<DomainUser>(DomainUser.class, Long.parseLong(owner_id));
	System.out.println("OwnerKey" + ownerKey);

	AgileUser user = AgileUser.getCurrentAgileUser();

	if (user == null)
	    return;

	// Saves agile user key
	agileUser = new Key<AgileUser>(AgileUser.class, user.id);
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "id: " + id + " relatesto: " + contact_ids + " close date" + close_date + " name: " + name
		+ " description:" + description + " expectedValue: " + expected_value + " milestone: " + milestone
		+ " probability: " + probability + " Track: " + track + " Owner " + owner_id;
    }
}