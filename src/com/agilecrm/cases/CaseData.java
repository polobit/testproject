package com.agilecrm.cases;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
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

@XmlRootElement
public class CaseData
{
	// static{ ObjectifyService.register(CaseData.class); }

	public @Id
	Long id;

	public String title, description;

	public @NotSaved
	String owner_id;
	private Key<DomainUser> ownerKey;

	public @NotSaved
	List<String> related_contacts_id = new ArrayList<String>();
	private List<Key<Contact>> relatedContactsKey = new ArrayList<Key<Contact>>();

	//public Long close_date;

	public String status;

	public static ObjectifyGenericDao<CaseData> dao = new ObjectifyGenericDao<CaseData>(
			CaseData.class);

	@Override
	public String toString()
	{
		String str = title + "," + description + "\n" + owner_id + "\n";
		for (String s : related_contacts_id)
			str += "\n\t" + s;
		str += "\n" + "," + status;

		return str;
	}

	public CaseData()
	{
	}

	@XmlElement
	public List<Contact> getContacts()
	{
		Objectify ofy = ObjectifyService.begin();
		List<Contact> contacts_list = new ArrayList<Contact>();
		contacts_list.addAll(ofy.get(this.relatedContactsKey).values());
		return contacts_list;
	}

	public void addContactIds(String id)
	{
		if (related_contacts_id == null)
			related_contacts_id = new ArrayList<String>();

		related_contacts_id.add(id);
	}

	@XmlElement
	public List<String> getRelatedContactIds()
	{
		related_contacts_id = new ArrayList<String>();

		for (Key<Contact> i : relatedContactsKey)
			related_contacts_id.add(String.valueOf(i.getId()));

		return related_contacts_id;
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
				return DomainUserUtil.getDomainUser(ownerKey.getId());// Gets
																		// Domain
																		// User
																		// Object
			} catch (Exception e)
			{
				e.printStackTrace();
			}
		}
		return null;
	}

	@PrePersist
	public void prePersist()
	{
		for (String s : related_contacts_id)
			relatedContactsKey.add(new Key<Contact>(Contact.class, Long.parseLong(s)));
		ownerKey = new Key<DomainUser>(DomainUser.class,
				Long.parseLong(this.owner_id));
	}
}
