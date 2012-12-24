package com.agilecrm.deals;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DealNotificationPrefsUtil;
import com.agilecrm.workflows.triggers.util.DealTriggerUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Opportunity</code> is the base class for Deals/Opportunities.Each
 * opportunity object consists of it's own id, Deal Name, related contacts,
 * expected value, probability, milestone, closed date and owner (who creates)
 * of a deal.
 * <p>
 * Opportunity can be related with contacts.The given expected-value and
 * probability are the measures of a deal.Milestones describes at what stage
 * does the deal present.Milestones are optional and can be given by domain user
 * under admin-settings in client-side.
 * </p>
 * <p>
 * Opportunity is provided with close-date which is estimated time to complete a
 * deal.Opportunity can be assigned to any one of the list of owners(Domain
 * Users).
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class Opportunity
{

    // Key
    /**
     * Opportunity Id
     */
    @Id
    public Long id;

    /**
     * Name of a Deal
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Contact ids of related contacts for a deal
     */
    @NotSaved
    public List<String> contacts = null;

    /**
     * Related contact objects fetched using contact ids
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Description of a deal
     */
    @NotSaved(IfDefault.class)
    public String description = null;

    /**
     * Estimated value of a deal
     */
    @NotSaved(IfDefault.class)
    public Long expected_value = null;

    /**
     * Milestone string
     */
    @NotSaved(IfDefault.class)
    public String milestone = null;

    /**
     * Probability in order to get pipeline value
     */
    public int probability = 0;

    /**
     * Closed date for a deal
     */
    @NotSaved(IfDefault.class)
    public Long close_date = 0L;

    // Owner
    /**
     * DomainUser Id who created Deal
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Key object of DomainUser
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;

    /**
     * Key object of agileUser inorder to get userprefs of current user
     */
    @NotSaved(IfDefault.class)
    private Key<AgileUser> agileUser = null;

    /**
     * Created time of a deal
     */
    public Long created_time = 0L;

    /**
     * Track a deal
     */
    @NotSaved(IfDefault.class)
    public String track = null;

    /**
     * Entity type
     */
    @NotSaved
    public String entity_type = "deal";


    /**
     * Array of milestones converted from milestone string separated by comma.
     */
    public static String MILESTONES[] = {};

    /**
     * ObjectifyDao of Opportunity
     */
    public static ObjectifyGenericDao<Opportunity> dao = new ObjectifyGenericDao<Opportunity>(
	    Opportunity.class);


    /**
     * Default Constructor
     */
    Opportunity()
    {

    }

    /**
     * Constructs a new {@link Opportunity}
     * 
     * @param name
     *            - Name of a Deal
     * @param description
     *            - Description of a Deal
     * @param expectedValue
     *            - Estimated value of a Deal
     * @param milestone
     *            - Milestone of a deal
     * @param probability
     *            - Probability of a deal
     * @param track
     *            - Track
     * @param ownerId
     *            - Owner id
     */
    public Opportunity(String name, String description, Long expectedValue,
	    String milestone, int probability, String track, String ownerId)
    {

	this.name = name;
	this.description = description;
	this.expected_value = expectedValue;
	this.milestone = milestone;
	this.probability = probability;
	this.track = track;
	this.owner_id = ownerId;
    }

    // Contacts related with deals Author : Yaswanth 08-24-2012
    /**
     * Gets contacts related with deals
     * 
     * @return list of contact objects as xml element related with a deal
     */
    @XmlElement
    public List<Contact> getContacts()
    {

	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    }

    // Get Users
    /**
     * Gets domain user with respect to owner id if exists, otherwise null.
     * 
     * @return Domain user object.
     * @throws Exception
     *             when Domain User not exists with respect to id
     */
    @XmlElement(name = "owner")
    public DomainUser getOwner() throws Exception
    {
	if (ownerKey != null)
	{
	    try
	    {
		// Gets Domain User Object
		return DomainUser.getDomainUser(ownerKey.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    // Get Users
    /**
     * Gets UserPrefs object with respect to agile user.Inorder to display owner
     * name of a deal in Deals table,UserPrefs are taken into account.
     * 
     * @return UserPrefs object with respect to agile user
     * @throws Exception
     *             if unable to fetch UserPrefs
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
     * Gets picture of owner who created deal.Owner picture is retrieved from
     * user prefs of domain user who created deal and is used to display owner
     * picture in deals list.
     * 
     * @return picture of owner
     * @throws Exception
     *             when agileuser doesn't exist with respect to owner key
     */
    @XmlElement
    public String getPic() throws Exception
    {

	AgileUser agileuser = null;
	UserPrefs userprefs = null;

	try

	{
	    // Get owner pic through agileuser prefs
	    agileuser = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey
		    .getId());
	    if (agileuser != null)
		userprefs = UserPrefs.getUserPrefs(agileuser);
	    if (userprefs != null)
		return userprefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	}

	return " ";
    }


    // Save Opportunity
    /**
     * Saves opportuntiy in dao.
     */
    public void save()
    {

	if (contacts != null)
	{
	    for (String contact_id : this.contacts)

	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long
			.parseLong(contact_id)));
	    }

	    // Executes trigger when new deal is created with related
	    // contacts as trigger needs contact objects
	    if (this.id == null)
		DealTriggerUtil.executeTriggerForNewDeal(this);
	}

	// Executes notification for new deal
	if (this.id == null)
	    DealNotificationPrefsUtil.executeNotificationForNewDeal(this);


	// Save opportunity in dao
	dao.put(this);

    }

    // Delete Opportunity
    /**
     * Deletes opportunity from dao
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets created time, owner key and agile user.PrePersist is called each
     * time before object gets saved
     */
    @PrePersist
    private void PrePersist()
    {
	// Initializes created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	// Saves domain user key
	ownerKey = new Key<DomainUser>(DomainUser.class,
		Long.parseLong(owner_id));
	System.out.println("OwnerKey" + ownerKey);

	// Saves agile user key
	agileUser = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "id: " + id + " relatesto: " + contacts + " close date"
		+ close_date + " name: " + name + " description:" + description
		+ " expectedValue: " + expected_value + " milestone: "
		+ milestone + " probability: " + probability + " Track: "
		+ track + " Owner " + owner_id;
    }
}