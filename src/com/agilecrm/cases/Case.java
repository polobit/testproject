package com.agilecrm.cases;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Entity - Case <br/>
 * Stores details of a Case. <br/>
 * <code>status</code> is OPEN/CLOSE of enum <code>Status</code> and default is
 * OPEN.
 * 
 * @author Chandan
 */
@XmlRootElement
public class Case
{
    /**
     * Id of entity
     */
    @Id
    public Long id;

    /**
     * Title of the case
     */
    @NotSaved(IfDefault.class)
    public String title = null;

    /**
     * Description of the case
     */
    @NotSaved(IfDefault.class)
    public String description = null;

    /**
     * owner_id, owner of this case, not saved in datastore, instead owner_key
     * is saved. Between the two, data is transformed appropriately in
     * prePersist() and postLoad()
     */
    @NotSaved
    public String owner_id;

    /**
     * Creation time of the case.
     */
    public Long created_time = 0L;

    /**
     * Entity type for timeline
     */
    @NotSaved
    public String entity_type = "case";

    /**
     * ownerKey from Datastore, this is private & not passed in network.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> owner_key = null;

    /**
     * List of related contacts, list of contact ids, returned in network
     */
    @NotSaved
    List<String> related_contacts_id;

    /**
     * Keys of related contacts, private
     */
    @NotSaved(IfDefault.class)
    private List<Key<Contact>> related_contacts_key = new ArrayList<Key<Contact>>();

    /**
     * Status of case , OPEN or CLOSE. Can be extended later
     * 
     */
    public static enum Status
    {
	OPEN, CLOSE
    }

    /**
     * Status Open or Close, default=OPEN
     */
    @NotSaved(IfDefault.class)
    public Status status = Status.OPEN;

    // dao
    public static ObjectifyGenericDao<Case> dao = new ObjectifyGenericDao<Case>(Case.class);

    public Case()
    {
    }

    /**
     * Get Contact Entities of related contacts
     * 
     * @return List&lt;Contact&gt;
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	Objectify ofy = ObjectifyService.begin();
	List<Contact> contactsList = new ArrayList<Contact>();
	contactsList.addAll(ofy.get(this.related_contacts_key).values());
	return contactsList;
    }

    /**
     * Add Contact id
     * 
     * @param id
     *            - contact id to add
     */
    public void addContactToCase(String id)
    {
	if (related_contacts_id == null)
	    related_contacts_id = new ArrayList<String>();

	related_contacts_id.add(id);
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
	if (owner_key != null)
	{
	    try
	    {
		return DomainUserUtil.getDomainUser(owner_key.getId());
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * Get link of owner image
     * 
     * @return url of the image
     * @throws Exception
     */
    @XmlElement
    public String getOwnerPic() throws Exception
    {
	AgileUser agileUser = null;
	UserPrefs userPrefs = null;

	try
	{
	    // Get owner pic through agileuser prefs
	    agileUser = AgileUser.getCurrentAgileUserFromDomainUser(owner_key.getId());

	    if (agileUser != null)
		userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

	    if (userPrefs != null)
		return userPrefs.pic;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return "";
    }

    /**
     * Fill up ownerKey and relatedContactsKey
     */
    @PrePersist
    public void prePersist()
    {
	// initialize created time.
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	related_contacts_key = new ArrayList<Key<Contact>>();

	for (String contactId : related_contacts_id)
	    related_contacts_key.add(new Key<Contact>(Contact.class, Long.parseLong(contactId)));

	owner_key = new Key<DomainUser>(DomainUser.class, Long.parseLong(this.owner_id));
    }

    /**
     * Post Load , fill related_contacts_id
     */
    @javax.persistence.PostLoad
    public void postLoad()
    {
	related_contacts_id = new ArrayList<String>();

	for (Key<Contact> contact : related_contacts_key)
	    related_contacts_id.add(String.valueOf(contact.getId()));
    }

    @Override
    public String toString()
    {
	String str = title + "," + description + "\n" + owner_id + "\n";
	for (String s : related_contacts_id)
	    str += "\n\t" + s;
	str += "\n" + "," + status;

	return str;
    }
}