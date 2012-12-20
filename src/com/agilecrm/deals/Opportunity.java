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
 * <code>Opportunity</code> is the base class for Deals/Opportunities.
 * 
 * @author Yeswanth
 * 
 */
@XmlRootElement
public class Opportunity
{

    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String name = null;

    @NotSaved(IfDefault.class)
    public List<String> contact_ids = null;

    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    @NotSaved(IfDefault.class)
    public String description = null;

    @NotSaved(IfDefault.class)
    public Long expected_value = null;

    @NotSaved(IfDefault.class)
    public String milestone = null;

    public int probability = 0;

    @NotSaved(IfDefault.class)
    public Long close_date = 0L;

    // Owner
    @NotSaved
    public String owner_id = null;

    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;

    @NotSaved(IfDefault.class)
    private Key<AgileUser> agileUser = null;

    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public String track = null;

    @NotSaved
    public String entity_type = "deal";

    // Possible Milestones
    public static String MILESTONES[] = {};

    // Dao
    public static ObjectifyGenericDao<Opportunity> dao = new ObjectifyGenericDao<Opportunity>(
	    Opportunity.class);


    Opportunity()
    {

    }

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
    @XmlElement
    public List<Contact> getContacts()
    {

	Objectify ofy = ObjectifyService.begin();
	List<Contact> contacts_list = new ArrayList<Contact>();
	contacts_list.addAll(ofy.get(this.related_contacts).values());
	return contacts_list;
    }

    // Get Users
    @XmlElement(name = "owner")
    public DomainUser getOwner() throws Exception
    {
	if (ownerKey != null)
	{
	    try
	    {
		// Get User prefs to return to access owner name , pic etc..
		// details
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
    @XmlElement(name = "Prefs")
    public UserPrefs getPrefs() throws Exception
    {
	if (agileUser != null)
	{
	    Objectify ofy = ObjectifyService.begin();
	    try
	    {
		// Get User prefs to return to access owner name , pic etc..
		// details

		return ofy.query(UserPrefs.class).ancestor(agileUser).get();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    // Get Pic
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
    public void save()
    {

	if (contact_ids != null)
	{
	    for (String contact_id : this.contact_ids)

	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long
			.parseLong(contact_id)));
	    }

	    if (this.id == null)
		DealTriggerUtil.executeTriggerForNewDeal(this);
	}

	// Executes notification for new deal
	if (this.id == null)
	    DealNotificationPrefsUtil.executeNotificationForNewDeal(this);

	this.contact_ids = null;

	dao.put(this);

    }

    // Delete Opportunity
    public void delete()
    {
	dao.delete(this);
    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	// Save agile user key
	ownerKey = new Key<DomainUser>(DomainUser.class,
		Long.parseLong(owner_id));
	System.out.println("OwnerKey" + ownerKey);

	agileUser = new Key<AgileUser>(AgileUser.class,
		AgileUser.getCurrentAgileUser().id);

    }

    // To String
    public String toString()
    {
	return "id: " + id + " relatesto: " + contact_ids + " close date"
		+ close_date + " name: " + name + " description:" + description
		+ " expectedValue: " + expected_value + " milestone: "
		+ milestone + " probability: " + probability + " Track: "
		+ track + " Owner " + owner_id;
    }
}