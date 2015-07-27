package com.agilecrm.document;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * <code>Document</code> represents Google/Amazon document which is uploaded.
 * Each document object consists of it's own id, Name, extension, Network type,
 * related contacts, related deals, related cases, uploaded time and owner (who
 * uploads document)
 * <p>
 * Documents of type pdf,doc,docx,txt ,.. can be stored using google drive or
 * amazon services. Document can be related with contacts, cases, deals.
 * </p>
 */

@XmlRootElement
@Cached
public class Document extends Cursor
{
    /**
     * Document Id.
     */
    @Id
    public Long id;

    /**
     * Name of a Document.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Uploaded time of a Document.
     */
    public Long uploaded_time = 0L;

    /**
     * Extension of a Document.
     */
    @NotSaved(IfDefault.class)
    public String extension = null;
    
    /**
     * Size  of  Document in bytes.
     * zero for old documents and GOOGLE docs.
     */
    @NotSaved(IfDefault.class)
    public Long size = 0L;

    /**
     * Network where document is stored.
     */
    public enum NetworkType
    {
	GOOGLE, S3
    };

    /**
     * Specifies network type of the document.
     */
    public NetworkType network_type;

    /**
     * URL of Document.
     */
    @NotSaved(IfDefault.class)
    public String url = null;

    /**
     * Entity type.
     */
    @NotSaved
    public String entity_type = "document";

    /**
     * Contact ids of related contacts for a document.
     */
    @NotSaved
    private List<String> contact_ids = new ArrayList<String>();

    /**
     * Related contact objects fetched using contact ids.
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Case ids of related cases for a document.
     */
    @NotSaved
    private List<String> case_ids = new ArrayList<String>();

    /**
     * Related case objects fetched using cases ids.
     */
    private List<Key<Case>> related_cases = new ArrayList<Key<Case>>();

    /**
     * Deal ids of related deals for a document.
     */
    @NotSaved
    private List<String> deal_ids = new ArrayList<String>();

    /**
     * Related deal objects fetched using deal ids.
     */
    private List<Key<Opportunity>> related_deals = new ArrayList<Key<Opportunity>>();

    /**
     * DomainUser Id who uploads Document.
     */
    @NotSaved
    public String owner_id = null;

    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;

    /**
     * ObjectifyDao of Document.
     */
    public static ObjectifyGenericDao<Document> dao = new ObjectifyGenericDao<Document>(Document.class);

    /**
     * While saving a document it contains list of contact keys, but while
     * retrieving includes complete contact object.
     * 
     * @return List of contact objects
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	return Contact.dao.fetchAllByKeys(this.related_contacts);
    }

    /**
     * While saving a document it contains list of case keys, but while
     * retrieving includes complete case object.
     * 
     * @return List of case objects
     */
    @XmlElement
    public List<Case> getCases()
    {
	return Case.dao.fetchAllByKeys(this.related_cases);
    }

    /**
     * While saving a document it contains list of deal keys, but while
     * retrieving includes complete deal object.
     * 
     * @return List of deal objects
     */
    @XmlElement
    public List<Opportunity> getDeals()
    {
	return Opportunity.dao.fetchAllByKeys(this.related_deals);
    }

    /**
     * Default Constructor.
     */
    public Document()
    {
    }

    /**
     * Constructs a new {@link Document}.
     * 
     * @param name
     *            - Name of Document which is uploaded.
     * @param extension
     *            - Specifies type of document(.pdf,.doc,.docx,..)
     * @param network
     *            - Specifies network type where document is actually stored.
     * @param url
     *            - Document URL where it is stored.
     * 
     */
    public Document(String name, String extension, NetworkType network, String url)
    {
	this.name = name;
	this.extension = extension;
	this.network_type = network;
	this.url = url;
    }

    /**
     * Gets contacts related with document.
     * 
     * @return list of contact objects as xml element related with a document.
     */
    @XmlElement(name = "contact_ids")
    public List<String> getContact_ids()
    {
	contact_ids = new ArrayList<String>();

	for (Key<Contact> contactKey : related_contacts)
	    contact_ids.add(String.valueOf(contactKey.getId()));

	return contact_ids;
    }

    /**
     * Gets cases related with document.
     * 
     * @return list of case objects as xml element related with a document.
     */
    @XmlElement(name = "case_ids")
    public List<String> getCase_ids()
    {
	case_ids = new ArrayList<String>();

	for (Key<Case> caseKey : related_cases)
	    case_ids.add(String.valueOf(caseKey.getId()));

	return case_ids;
    }

    /**
     * Gets deals related with document.
     * 
     * @return list of deal objects as xml element related with a document.
     */
    @XmlElement(name = "deal_ids")
    public List<String> getDeal_ids()
    {
	deal_ids = new ArrayList<String>();

	for (Key<Opportunity> dealKey : related_deals)
	    deal_ids.add(String.valueOf(dealKey.getId()));

	return deal_ids;
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
     * Gets picture of owner who created deal. Owner picture is retrieved from
     * user prefs of domain user who created deal and is used to display owner
     * picture in deals list.
     * 
     * @return picture of owner.
     * @throws Exception
     *             when agileuser doesn't exist with respect to owner key.
     */
    @XmlElement(name = "ownerPic")
    public String getOwnerPic() throws Exception
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
     * Saves Document in dao.
     */
    public void save()
    {
	dao.put(this);

	// Enables to build "Document" search on current entity
	AppengineSearch<Document> search = new AppengineSearch<Document>(Document.class);

	// If doc is new then add it to document else edit document
	if (id == null)
	{
	    search.add(this);
	    return;
	}
	search.edit(this);
    }

    /**
     * Deletes Uploaded Document from dao.
     */
    public void delete()
    {
	dao.delete(this);
	new AppengineSearch<Document>(Document.class).delete(id.toString());
    }

    /**
     * Sets uploaded time, owner key, related to contacts, deals, cases.
     * PrePersist is called each time before object gets saved.
     */
    @PrePersist
    private void PrePersist()
    {
	// Initializes created Time
	if (uploaded_time == 0L)
	    uploaded_time = System.currentTimeMillis() / 1000;

	if (contact_ids != null)
	{
	    for (String contact_id : this.contact_ids)
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	}
	if (case_ids != null)
	{
	    for (String case_id : this.case_ids)
		this.related_cases.add(new Key<Case>(Case.class, Long.parseLong(case_id)));
	}
	if (deal_ids != null)
	{
	    for (String deal_id : this.deal_ids)
		this.related_deals.add(new Key<Opportunity>(Opportunity.class, Long.parseLong(deal_id)));
	}

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

    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "id: " + id + " relatesto: " + contact_ids + " name: " + name + " Owner " + owner_id;
    }

}