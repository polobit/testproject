package com.agilecrm.document;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * 
 * <code>Document</code> represents Google/Amazon document which is uploaded.
 * Each document object consists of it's own id, Name, extension, Network type, 
 * related contacts, related deals, related cases, uploaded time and owner (who uploads document)
 * <p>
 * Documents of type pdf,doc,docx,txt ,.. can be stored using google drive or amazon services.
 * Document can be related with contacts, cases, deals. 
 * </p>
 */

@XmlRootElement
public class Document
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
    public Long upload_time = 0L;

    /**
     * Extension of a Document.
     */
    @NotSaved(IfDefault.class)
    public String extension = null;

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
     * @param name -
     *             Name of Document which is uploaded.
     * @param extension - 
     * 		   Specifies type of document(.pdf,.doc,.docx,..)
     * @param network - 
     * 		   Specifies network type where document is actually stored.
     * @param url - 
     * 		   Document URL where it is stored.
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
     * Saves Document in dao.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Deletes Uploaded Document from dao.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets uploaded time, owner key, related to contacts, deals, cases.
     * PrePersist is called each time before object gets saved.
     */
    @PrePersist
    private void PrePersist()
    {
	// Initializes created Time
	if (upload_time == 0L)
	    upload_time = System.currentTimeMillis() / 1000;

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

}
