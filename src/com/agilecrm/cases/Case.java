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

@XmlRootElement
public class Case {

	/*
	 * Id of entity
	 */
	public @Id
	Long id;

	/*
	 * Title and description of case
	 */
	@NotSaved(IfDefault.class)
	public String title = null;

	@NotSaved(IfDefault.class)
	public String description = null;

	/*
	 * owner_id, owner of this case
	 */
	@NotSaved
	public String owner_id;

	/*
	 * ownerKey from Datastore
	 */
	@NotSaved(IfDefault.class)
	private Key<DomainUser> ownerKey = null;

	/*
	 * List of related contacts, list of contact ids
	 */
	public @NotSaved
	List<String> related_contacts_id;

	/*
	 * Keys of related contacts
	 */
	@NotSaved(IfDefault.class)
	private List<Key<Contact>> related_contacts_key = new ArrayList<Key<Contact>>();

	/*
	 * Status Open or Close
	 */
	public String status = "Open";

	// dao
	public static ObjectifyGenericDao<Case> dao = new ObjectifyGenericDao<Case>(
			Case.class);

	public Case() {
	}

	/**
	 * Get Contact Entities of related contacts
	 * 
	 * @return List&lt;Contact&gt;
	 */
	@XmlElement
	public List<Contact> getContacts() {
		Objectify ofy = ObjectifyService.begin();
		List<Contact> contacts_list = new ArrayList<Contact>();
		contacts_list.addAll(ofy.get(this.related_contacts_key).values());
		return contacts_list;
	}

	/**
	 * Add Contact id
	 * 
	 * @param id
	 *            - contact id to add
	 */
	public void addContactIds(String id) {
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
	public DomainUser getOwner() throws Exception {
		if (ownerKey != null) {
			try {
				return DomainUserUtil.getDomainUser(ownerKey.getId());// Gets
																		// Domain
																		// User
																		// Object
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	/**
	 * Get pic of owner
	 * 
	 * @return url of the image
	 * @throws Exception
	 */
	@XmlElement
	public String getOwnerPic() throws Exception {
		AgileUser agileUser = null;
		UserPrefs userPrefs = null;

		try {
			// Get owner pic through agileuser prefs
			agileUser = AgileUser.getCurrentAgileUserFromDomainUser(ownerKey
					.getId());

			if (agileUser != null)
				userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

			if (userPrefs != null)
				return userPrefs.pic;
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "";
	}

	/**
	 * Fill up ownerKey and relatedContactsKey
	 */
	@PrePersist
	public void prePersist() {

		related_contacts_key = new ArrayList<Key<Contact>>();

		for (String contactId : related_contacts_id)
			related_contacts_key.add(new Key<Contact>(Contact.class, Long
					.parseLong(contactId)));

		ownerKey = new Key<DomainUser>(DomainUser.class,
				Long.parseLong(this.owner_id));
	}

	/**
	 * Post Load , fill related_contacts_id
	 */
	@javax.persistence.PostLoad
	public void postLoad() {
		related_contacts_id = new ArrayList<String>();

		for (Key<Contact> contact : related_contacts_key)
			related_contacts_id.add(String.valueOf(contact.getId()));
	}

	@Override
	public String toString() {
		String str = title + "," + description + "\n" + owner_id + "\n";
		for (String s : related_contacts_id)
			str += "\n\t" + s;
		str += "\n" + "," + status;

		return str;
	}

}
