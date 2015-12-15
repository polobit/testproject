package com.agilecrm.contact.bulk;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactSavePreprocessor;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.google.appengine.api.search.Document.Builder;

public class ContactBulkSave
{
    private List<Trigger> newContactTriggers = null;

    // Enables to build "Document" search on current entity
    private AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);
    private Builder[] docs = new Builder[100];
    private List<Builder> builderObjects = new ArrayList<Builder>();
    private ContactDocument contactDocuments = new ContactDocument();

    Map<Contact, Contact> contactsMap = new HashMap<Contact, Contact>();

    Map<Long, Contact> savedContactsMap = new HashMap<Long, Contact>();

    Map<Contact, Contact> triggerEligibleContacts = new HashMap<Contact, Contact>();

    public void save(Contact oldContact, Contact newContact)
    {
	save(oldContact, newContact, false);
    }

    public void finalize()
    {
	save(null, null, true);
    }

    private void save(Contact oldContact, Contact newContact, boolean force)
    {
	// Merges contact data
	if (oldContact != null)
	    newContact = ContactUtil.mergeContactFeilds(newContact, oldContact);

	if (newContact != null)
	{
	    // If old contact is not there, then new contact is stored in old
	    // contact
	    oldContact = oldContact == null ? newContact : oldContact;

	    contactsMap.put(oldContact, newContact);
	}

	if (contactsMap.size() >= 50 || (force && !contactsMap.isEmpty()))
	{
	    persistData();
	}
    }

    private Boolean triggersConfigured = null;

    private boolean areTriggersConfigured()
    {
	if (triggersConfigured != null)
	    return triggersConfigured;

	int count = TriggerUtil.getCount();
	if (count > 0)
	    return triggersConfigured = true;

	return triggersConfigured = false;
    }

    Map<Trigger.Type, List<Trigger>> triggerMap = null;

    private void getContactTriggers()
    {
	if (triggerMap != null)
	    return;

	if (!areTriggersConfigured())
	    return;

	List<Trigger> triggers = TriggerUtil.getAllTriggers();
	triggerMap = new HashMap<Trigger.Type, List<Trigger>>();

	for (Trigger trigger : triggers)
	{
	    boolean addToMap = false;
	    if (trigger.type == Trigger.Type.CONTACT_IS_ADDED)
	    {
		addToMap = true;
	    }
	    else if (trigger.type == Trigger.Type.ADD_SCORE)
	    {
		addToMap = true;
	    }
	    else if (trigger.type == Trigger.Type.TAG_IS_ADDED)
	    {
		addToMap = true;
	    }
	    else
	    {
		continue;
	    }

	    updateMap(trigger.type, trigger);
	}
    }

    private void updateMap(Trigger.Type type, Trigger trigger)
    {

	if (triggerMap.containsKey(type))
	{
	    triggerMap.get(type).add(trigger);
	}
	else
	{
	    List<Trigger> triggersList = new ArrayList<Trigger>();
	    triggersList.add(trigger);
	    triggerMap.put(type, triggersList);
	}
    }

    private void persistData()
    {
	Long start = System.currentTimeMillis();
	System.out.println(contactsMap);
	// Saves contacts

	List<Contact> contacts = new ArrayList<Contact>(contactsMap.size());

	for (Contact oldContactFromMap : contactsMap.keySet())
	{
	    Contact newContact = contactsMap.get(oldContactFromMap);

	    ContactSavePreprocessor preP = new ContactSavePreprocessor(newContact);
	    preP.preProcess();

	    if (oldContactFromMap.id != null)
	    {
		ContactUtil.mergeContactFeilds(newContact, oldContactFromMap);
		savedContactsMap.put(newContact.id, preP.getOldContact());
	    }

	    contacts.add(newContact);

	}

	// Returns if there are no contacts
	if (contacts.isEmpty())
	    return;

	Contact.dao.putAll(contacts);

	for (Contact contact : contacts)
	{
	    builderObjects.add(contactDocuments.buildDocument(contact));

	    if (savedContactsMap.containsKey(contact.id))
	    {
		contact.postSave(savedContactsMap.get(contact.id), false);
	    }
	    else
		contact.postSave(null, false);
	}

	search.index.put(builderObjects.toArray(new Builder[builderObjects.size() - 1]));

	System.out.println("Time taken to create contact to save" + contacts.size() + " : "
		+ (System.currentTimeMillis() - start));

	builderObjects.clear();
	contacts.clear();
	savedContactsMap.clear();
    }

    private boolean isNull(List<Trigger> triggerList)
    {
	if (triggerList == null)
	{
	    return true;
	}

	return false;
    }

    private boolean hasNewContactTrigger()
    {
	getContactTriggers();

	if (isNull(newContactTriggers))
	{

	}

	return false;
    }

    private boolean hasTagsTrigger()
    {
	return false;
    }

    private boolean hasScroreTrigger()
    {
	return false;
    }
}

class ContactMapKey
{
    private Contact contact;

    private Long contactId = null;

    ContactMapKey(Contact contact)
    {
	this.contact = contact;

	if (contact.id != null)
	{
	    contactId = contact.id;
	}
    }

    public Contact getContact()
    {
	return contact;
    }

    public Long getContactId()
    {
	return contactId;
    }

    @Override
    public int hashCode()
    {
	final int prime = 31;
	int result = 1;
	result = prime * result + ((contactId == null) ? 0 : contactId.hashCode());
	return result;
    }

    @Override
    public boolean equals(Object obj)
    {
	if (this == obj)
	    return true;

	if (obj == null)
	    return false;

	if (getClass() != obj.getClass())
	    return false;

	ContactMapKey other = (ContactMapKey) obj;
	if (contactId == null)
	{
	    if (other.contactId != null)
		return false;
	}
	else if (!contactId.equals(other.contactId))
	    return false;
	return true;
    }

}
