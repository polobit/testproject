/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.sync.SyncClient;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>ContactSyncService</code> provide method for wrap Contacts from third
 * party to agile domain and send Notification of import status to domain user
 * third party client needs to implement these method
 * 
 * @author jitendra
 * 
 */
public abstract class ContactSyncService implements SyncService
{

    /** The Constant NOTIFICATION_TEMPLATE. */
    protected static final String NOTIFICATION_TEMPLATE = "contact_sync_notification_template";

    /** The contact wrapper. */
    protected ContactWrapper contactWrapper = null;

    /**
     * To check if it contacts limit is exceeded in current plan
     */
    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(true);

    /** The contact restriction. */
    DaoBillingRestriction contactRestriction = DaoBillingRestriction.getInstace(
	    DaoBillingRestriction.ClassEntities.Contact.toString(), restriction);

    /** The prefs. */
    protected ContactPrefs prefs;

    /** The total_synced_contact. */
    protected int total_synced_contact;

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.SyncService#createService(com.thirdparty
     * .google.ContactPrefs)
     */
    @Override
    public SyncService createService(ContactPrefs pref)
    {
	Preconditions.checkNotNull(pref, "Prefs can't be null");
	this.prefs = pref;
	return this;
    }

    /**
     * Checks if is limit exceeded.
     * 
     * @return true, if is limit exceeded
     */
    public boolean isLimitExceeded()
    {
	if (total_synced_contact >= MAX_SYNC_LIMIT)
	{
	    sendNotification(prefs.client.getNotificationEmailSubject());
	    return true;
	}

	return false;
    }

    // public List<Contact> retrieveContact();

    /** The sync status. */
    protected Map<ImportStatus, Integer> syncStatus;

    {
	syncStatus = new HashMap<ImportStatus, Integer>();
	for (ImportStatus status : ImportStatus.values())
	{
	    syncStatus.put(status, 0);
	}
    }

    /**
     * Wrap contact to agile schema and save.
     * 
     * @param object
     *            the object
     * @return the contact
     */
    public Contact wrapContactToAgileSchemaAndSave(Object object)
    {
	Contact contact = wrapContactToAgileSchema(object);

	if (contact == null)
	    return contact;

	++total_synced_contact;

	saveContact(contact);

	// Works as save callback to perform actions like creating notes/tasks
	// and relating to newly created contact
	contactWrapper.saveCallback();
	return contact;
    }

    /**
     * Wrap contact to agile schema.
     * 
     * @param object
     *            the object
     * @return the contact
     */
    private Contact wrapContactToAgileSchema(Object object)
    {
	if (contactWrapper == null)
	    try
	    {
		contactWrapper = getWrapperService().newInstance().getWrapper(object);
	    }
	    catch (InstantiationException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    catch (IllegalAccessException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	return contactWrapper.getWrapper(object).buildContact();
    }

    /**
     * send Email Notification status to domain user after import completed.this
     * method needs to be called from third party client
     * 
     * @param Map
     *            Map<ImportStatus,Integer> map
     * @param notificationSubject
     *            String value of subject
     * 
     * 
     */

    public void sendNotification(String notificationSubject)
    {
	DomainUser user = DomainUserUtil.getCurrentDomainUser();

	if (user != null)
	{
	    SendMail.sendMail(user.email, notificationSubject, NOTIFICATION_TEMPLATE, new Object[] { user,
		    buildNotificationStatus() });
	}
    }

    /**
     * Builds the notification status.
     * 
     * @return the map
     */
    private Map<ImportStatus, Integer> buildNotificationStatus()
    {
	Integer fail = syncStatus.get(ImportStatus.TOTAL_FAILED);
	Integer total = syncStatus.get(ImportStatus.TOTAL);
	Integer totalSaved = syncStatus.get(ImportStatus.SAVED_CONTACTS);
	for (Map.Entry<ImportStatus, Integer> entry : syncStatus.entrySet())
	{
	    if (entry.getKey() == ImportStatus.NEW_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.MERGED_CONTACTS)
	    {
		total += entry.getValue();
		totalSaved += entry.getValue();
	    }
	    else if (entry.getKey() == ImportStatus.LIMIT_REACHED)
	    {
		total += entry.getValue();
		fail += entry.getValue();
	    }

	}

	syncStatus.put(ImportStatus.TOTAL_FAILED, fail);
	syncStatus.put(ImportStatus.TOTAL, total);
	syncStatus.put(ImportStatus.SAVED_CONTACTS, totalSaved);

	return syncStatus;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.SyncService#saveContact(java.util.List)
     */
    @Override
    public void saveContact(List<Contact> contacts)
    {
	for (Contact contact : contacts)
	{
	    saveContact(contact);
	}

	updateLastSyncedInPrefs();
	// Sets total number of contacts imported/updated
	syncStatus.put(ImportStatus.TOTAL, syncStatus.get(ImportStatus.TOTAL) + contacts.size());

    }

    /**
     * Update last synced in prefs.
     */
    protected abstract void updateLastSyncedInPrefs();

    /**
     * Save contact.
     * 
     * @param contact
     *            the contact
     */
    private void saveContact(Contact contact)
    {
	if (ContactUtil.isDuplicateContact(contact))
	{
	    contact = ContactUtil.mergeContactFields(contact);
	    contact.save();
	    syncStatus.put(ImportStatus.MERGED_CONTACTS, syncStatus.get(ImportStatus.MERGED_CONTACTS) + 1);
	}
	else if (contactRestriction.can_create())
	{
	    addTagToContact(contact);
	    contact.save();
	    restriction.contacts_count++;
	    syncStatus.put(ImportStatus.NEW_CONTACTS, syncStatus.get(ImportStatus.NEW_CONTACTS) + 1);
	}
	else
	{
	    syncStatus.put(ImportStatus.LIMIT_REACHED, syncStatus.get(ImportStatus.LIMIT_REACHED) + 1);
	}

    }

    /**
     * Adds the tag to contact.
     * 
     * @param contact
     *            the contact
     */
    private void addTagToContact(Contact contact)
    {
	String tag;
	if (prefs.client == SyncClient.GOOGLE)
	    tag = "gmail contact".toLowerCase();
	else
	    tag = prefs.client.toString().toLowerCase() + " contact";

	contact.addTags(StringUtils.capitalize(tag));
    }
}
