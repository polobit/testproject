/*package com.agilecrm.contact.bulk;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactSavePreprocessor;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.exception.InvalidTagException;
import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.search.AppengineSearch;
import com.agilecrm.search.document.ContactDocument;
import com.agilecrm.user.access.exception.AccessDeniedException;
import com.agilecrm.util.CSVUtil;
import com.agilecrm.util.FailedContactBean;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.google.appengine.api.search.Document.Builder;

public class ContactBulkSave
{

    private List<Trigger> newContactTriggers = null;

    // Enables to build "Document" search on current entity
    private AppengineSearch<Contact> search = new AppengineSearch<Contact>(Contact.class);

    private ContactDocument contactDocuments = new ContactDocument();

    private static final int MAX_RETRIES = 3;

    Map<Contact, ContactRelatedData> contactsMapWithNotes = new HashMap<Contact, ContactRelatedData>();

    private CSVUtil csvUtil;

    private ContactBulkSave()
    {

    }

    public ContactBulkSave(CSVUtil csvUtil)
    {
	this();
	this.csvUtil = csvUtil;
    }

    
 * public void save(Contact oldContact, Contact newContact) {
 * save(oldContact, newContact, false); }
     
    public void finalize()
    {
	save(null, null, null, true);
    }

    public void save(Contact oldContact, Contact newContact, List<Note> notes)
    {
	save(oldContact, newContact, notes);
    }

    private void save(Contact oldContact, Contact newContact, List<Note> notes, boolean force)
    {

	if (newContact != null)
	{
	    // If old contact is not there, then new contact is stored in old
	    // contact
	    oldContact = oldContact == null ? newContact : oldContact;

	    ContactRelatedData cdata = new ContactRelatedData(newContact);
	    if (notes != null && !notes.isEmpty())
	    {
		cdata.setReleatedNotes(notes);
	    }
	    contactsMapWithNotes.put(oldContact, cdata);
	}

	if (contactsMapWithNotes.size() >= 50 || (force && !contactsMapWithNotes.isEmpty()))
	{
	    persistDataWithNotes();
	}
    }

 *//**
 * Processes through the list and saves data in datastore and text search.
 * After saving contact data, this function will also call note save
 * functionality.
 */
/*
private void persistDataWithNotes()
{
Long start = System.currentTimeMillis();
List<Contact> contacts = new ArrayList<Contact>(contactsMapWithNotes.size());
Map<Long, Contact> savedContactsMap = new HashMap<Long, Contact>();

// Iterates through lates set of contacts, merges old contact data and
// runs preprocessing
for (Contact oldContactFromMap : contactsMapWithNotes.keySet())
{
    // If new contact has a old data in datastore, it merges data from
    // old contact
    Contact newContact = contactsMapWithNotes.get(oldContactFromMap).getContact();
    if (oldContactFromMap.id != null)
    {
	// Merges old contact and new contact. Old contact data is
	// modified and returned
	newContact = ContactUtil.mergeCompanyFields(newContact, oldContactFromMap);
    }

    // Preprocess the data
    ContactSavePreprocessor preP = new ContactSavePreprocessor(newContact);
    preP.preProcess(false);

    // If current contact save is merge, it is persisted in a temporary
    // map so that those can be re-used while running post save
    // operations (running campaigns)
    if (oldContactFromMap.id != null)
	savedContactsMap.put(newContact.id, preP.getOldContact());

    // Contact to be saved is added into list
    contacts.add(newContact);
}

// Saves all contacts in list
pullAllContactsWithRetry(contacts);

// Runs post save save operations on all saved contacts
postSaveOperations(contacts, savedContactsMap);

try
{
    saveNotes(contactsMapWithNotes);
}
catch (Exception e)
{

}

// Clears data from list after saving process
contactsMapWithNotes.clear();

}

private List<FailedContactBean> failedBeans = new ArrayList<FailedContactBean>();

private ContactSavePreprocessor preProcessContacts(Contact newContact)
{
// Preprocess the data
ContactSavePreprocessor preP = new ContactSavePreprocessor(newContact);
try
{
    preP.preProcess(false);
    return preP;
}
catch (InvalidTagException e)
{

    System.out.println("Invalid tag exception raised while saving contact ");
    e.printStackTrace();
    failedBeans.add(new FailedContactBean(getDummyContact(newContact.properties, csvValues), e.getMessage()));
    throw (e);
}
catch (AccessDeniedException e)
{

    accessDeniedToUpdate++;
    System.out.println("ACL exception raised while saving contact ");
    e.printStackTrace();
    failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues), e.getMessage()));
    throw (e);

}
catch (Exception e)
{

    System.out.println("exception raised while saving contact ");
    e.printStackTrace();
    if (tempContact.id != null)
    {
	failedContacts.add(new FailedContactBean(getDummyContact(properties, csvValues),
		"Exception raised while saving contact"));
    }

    throw (e);
}
}

private List<Builder> buildDocuments(List<Contact> contacts)
{
List<Builder> builderObjects = new ArrayList<Builder>();


 * Builds contact document for each contact to save it in text search.
 
for (Contact contact : contacts)
{
    try
    {
	builderObjects.add(contactDocuments.buildDocument(contact));
    }
    catch (Exception e)
    {
	e.printStackTrace();
    }
}

return builderObjects;
}

private void saveNotes(Map<Contact, ContactRelatedData> map)
{
List<Note> bulkNotes = new ArrayList<Note>();
for (ContactRelatedData relatedData : map.values())
{
    if (relatedData.getContact().id == null)
	continue;

    if (relatedData.getReleatedNotes().size() > 0)
    {
	for (Note note : relatedData.getReleatedNotes())
	{
	    note.addRelatedContacts(String.valueOf(relatedData.getContact().id));
	    bulkNotes.add(note);
	}
    }
}

// If bulk nots are not empty, they are further processed to persist
if (!bulkNotes.isEmpty())
{
    List<Note> notesToPersist = new ArrayList<Note>();
    int addedNotes = 0;

    // Saves notes in sets of 100 to avoid datastore exception
    for (int i = 0; i < bulkNotes.size(); i++)
    {
	notesToPersist.add(bulkNotes.get(i));
	addedNotes++;
	if (addedNotes >= 100 || i == bulkNotes.size() - 1)
	{
	    // Saves notes
	    putAllNotes(notesToPersist);

	    // Resets list and counter
	    notesToPersist.clear();
	    addedNotes = 0;
	}
    }

}
}

private void postSaveOperations(List<Contact> contacts, Map<Long, Contact> savedContactsMap)
{
 *//**
 * Runs post save operations
 */
/*
 * for (Contact contact : contacts) { if
 * (savedContactsMap.containsKey(contact.id)) { try {
 * contact.postSave(savedContactsMap.get(contact.id), false); } catch (Exception
 * e) { e.printStackTrace(); } } else contact.postSave(null, false); } }
 * 
 * private void putAllNotes(List<Note> notes) { Note.dao.putAll(notes); }
 * 
 * private void pullAllContactsWithRetry(List<Contact> contacts) { int retry =
 * 0; while (retry < MAX_RETRIES) {
 * 
 * try { Contact.dao.putAll(contacts);
 * 
 * // Saves all text search documents in text search
 * putAllContactsInTextSearchWithRetry(buildDocuments(contacts));
 * 
 * return; } catch (Exception e) { retry++; e.printStackTrace(); } }
 * 
 * // If it is not able to save even after retrying we try to save each //
 * contact individually for (Contact contact : contacts) { try {
 * contact.save(false); } catch (Exception e) { new ExceptionWrapper(e,
 * contact.properties, new String[10]).getDummycontact(); }
 * 
 * }
 * 
 * }
 * 
 * private void putAllContactsInTextSearchWithRetry(List<Builder> builderList) {
 * int retry = 0; while (retry < MAX_RETRIES) { try {
 * search.index.put(builderList.toArray(new Builder[builderList.size() - 1]));
 * builderList.clear(); return; } catch (Exception e) { retry++;
 * e.printStackTrace(); } }
 * 
 * // Backup to save each text entity for (Builder builder : builderList) {
 * search.index.put(builder); }
 * 
 * }
 * 
 * 
 * private void persistData() { Long start = System.currentTimeMillis(); //
 * Saves contacts
 * 
 * List<Contact> contacts = new ArrayList<Contact>(contactsMap.size());
 * 
 * for (Contact oldContactFromMap : contactsMap.keySet()) { Contact newContact =
 * contactsMap.get(oldContactFromMap);
 * 
 * ContactSavePreprocessor preP = new ContactSavePreprocessor(newContact);
 * preP.preProcess();
 * 
 * if (oldContactFromMap.id != null) {
 * ContactUtil.mergeContactFeilds(newContact, oldContactFromMap);
 * savedContactsMap.put(newContact.id, preP.getOldContact()); }
 * 
 * contacts.add(newContact); }
 * 
 * // Returns if there are no contacts if (contacts.isEmpty()) return;
 * 
 * Contact.dao.putAll(contacts);
 * 
 * for (Contact contact : contacts) {
 * builderObjects.add(contactDocuments.buildDocument(contact));
 * 
 * if (savedContactsMap.containsKey(contact.id)) {
 * contact.postSave(savedContactsMap.get(contact.id), false); } else
 * contact.postSave(null, false); }
 * 
 * search.index.put(builderObjects.toArray(new Builder[builderObjects.size() -
 * 1]));
 * 
 * System.out.println("Time taken to create contact to save" + contacts.size() +
 * " : " + (System.currentTimeMillis() - start));
 * 
 * builderObjects.clear(); contacts.clear(); savedContactsMap.clear();
 * contactsMap.clear(); }
 * 
 * 
 * private boolean isNull(List<Trigger> triggerList) { if (triggerList == null)
 * { return true; }
 * 
 * return false; }
 * 
 * private Boolean triggersConfigured = null;
 * 
 * private boolean areTriggersConfigured() { if (triggersConfigured != null)
 * return triggersConfigured;
 * 
 * int count = TriggerUtil.getCount(); if (count > 0) return triggersConfigured
 * = true;
 * 
 * return triggersConfigured = false; }
 * 
 * Map<Trigger.Type, List<Trigger>> triggerMap = null;
 * 
 * private void getContactTriggers() { if (triggerMap != null) return;
 * 
 * if (!areTriggersConfigured()) return;
 * 
 * List<Trigger> triggers = TriggerUtil.getAllTriggers(); triggerMap = new
 * HashMap<Trigger.Type, List<Trigger>>();
 * 
 * for (Trigger trigger : triggers) { boolean addToMap = false; if (trigger.type
 * == Trigger.Type.CONTACT_IS_ADDED) { addToMap = true; } else if (trigger.type
 * == Trigger.Type.ADD_SCORE) { addToMap = true; } else if (trigger.type ==
 * Trigger.Type.TAG_IS_ADDED) { addToMap = true; } else { continue; }
 * 
 * updateMap(trigger.type, trigger); } }
 * 
 * private void updateMap(Trigger.Type type, Trigger trigger) {
 * 
 * if (triggerMap.containsKey(type)) { triggerMap.get(type).add(trigger); } else
 * { List<Trigger> triggersList = new ArrayList<Trigger>();
 * triggersList.add(trigger); triggerMap.put(type, triggersList); } }
 * 
 * private boolean hasNewContactTrigger() { getContactTriggers();
 * 
 * if (isNull(newContactTriggers)) {
 * 
 * }
 * 
 * return false; }
 * 
 * private boolean hasTagsTrigger() { return false; }
 * 
 * private boolean hasScroreTrigger() { return false; }
 * 
 * private static class ContactRelatedData { private Contact contact; private
 * List<Note> releatedNotes;
 * 
 * private ContactRelatedData(Contact contact) { this.contact = contact; }
 * 
 * public Contact getContact() { return contact; }
 * 
 * public List<Note> getReleatedNotes() { return releatedNotes; }
 * 
 * public void setReleatedNotes(List<Note> releatedNotes) { this.releatedNotes =
 * releatedNotes; }
 * 
 * } }
 * 
 * class ContactMapKey { private Contact contact;
 * 
 * private Long contactId = null;
 * 
 * ContactMapKey(Contact contact) { this.contact = contact;
 * 
 * if (contact.id != null) { contactId = contact.id; } }
 * 
 * public Contact getContact() { return contact; }
 * 
 * public Long getContactId() { return contactId; }
 * 
 * @Override public int hashCode() { final int prime = 31; int result = 1;
 * result = prime * result + ((contactId == null) ? 0 : contactId.hashCode());
 * return result; }
 * 
 * @Override public boolean equals(Object obj) { if (this == obj) return true;
 * 
 * if (obj == null) return false;
 * 
 * if (getClass() != obj.getClass()) return false;
 * 
 * ContactMapKey other = (ContactMapKey) obj; if (contactId == null) { if
 * (other.contactId != null) return false; } else if
 * (!contactId.equals(other.contactId)) return false; return true; }
 * 
 * }
 * 
 * class ExceptionWrapper { Exception e; List<ContactField> properties; String[]
 * csvValues;
 * 
 * ExceptionWrapper(Exception e, List<ContactField> properties, String[]
 * csvValues) { this.e = e; this.properties = properties; this.csvValues =
 * csvValues; }
 * 
 * final FailedContactBean buildFailedcontact();
 * 
 * { new FailedContactBean(getDummycontact(), getExceptionMessage()); }
 * 
 * private String getExceptionMessage() { if (e instanceof InvalidTagException
 * || e instanceof AccessDeniedException) { return e.getMessage(); }
 * 
 * return "exception raised while saving contact "; }
 * 
 * Contact getDummycontact() {
 * 
 * Contact dummyContact = new Contact();
 * 
 * for (int j = 0; j < csvValues.length; j++) {
 * 
 * ContactField temp = properties.get(j);
 * 
 * ContactField field = new ContactField(temp.name, csvValues[j], temp.subtype);
 * dummyContact.properties.add(field); } return dummyContact; } }
 * 
 * class WriteFailedContactsToCVS { private CSVWriter failedContactsWriter;
 * private GCSServiceAgile service;
 * 
 * public void write() {
 * 
 * }
 * 
 * private CSVWriter getCSVWriterForFailedContacts() throws IOException { if
 * (failedContactsWriter != null) return failedContactsWriter;
 * 
 * System.out.println("building failed contacts service"); return
 * failedContactsWriter = new CSVWriter(service.getOutputWriter()); } }
 */